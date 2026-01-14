from flask import Flask, render_template, request
import requests

app = Flask(__name__)


API_KEY = '3c44f8c697b49f09469ecde97f715ed4'   

# AQI mapping
AQI_MAP = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor'
}

# Pre-formatted ranges (as strings)
POLLUTANTS = {
    'SO2':   ["[0; 20)", "[20; 80)", "[80; 250)", "[250; 350)", "≥350"],
    'NO2':   ["[0; 40)", "[40; 70)", "[70; 150)", "[150; 200)", "≥200"],
    'PM10':  ["[0; 20)", "[20; 50)", "[50; 100)", "[100; 200)", "≥200"],
    'PM2_5': ["[0; 10)", "[10; 25)", "[25; 50)", "[50; 75)", "≥75"],
    'O3':    ["[0; 60)", "[60; 100)", "[100; 140)", "[140; 180)", "≥180"],
    'CO':    ["[0; 4400)", "[4400; 9400)", "[9400; 12400)", "[12400; 15400)", "≥15400"]
}

@app.route('/', methods=['GET', 'POST'])
def index():
    result = None
    error = None

    if request.method == 'POST':
        location = request.form.get('location', '').strip()
        if not location:
            error = 'Please enter a location (e.g., Karachi, PK).'
        else:
            print(f"\n=== DEBUG: User entered → '{location}' ===")

            # Step 1: Geocoding
            geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={location}&limit=1&appid={API_KEY}"
            try:
                geo_resp = requests.get(geo_url, timeout=10)
                print(f"Geocoding → status: {geo_resp.status_code}")
                print(f"Geocoding response (first part): {geo_resp.text[:400]}...")

                if geo_resp.status_code == 401:
                    error = '401 Unauthorized → Invalid or inactive API key. Check formatting & activation (may take up to 2 hours).'
                elif geo_resp.status_code != 200:
                    error = f'Geocoding failed (HTTP {geo_resp.status_code}).'
                else:
                    geo_data = geo_resp.json()
                    if not geo_data:
                        error = f"No match for '{location}'. Try: 'Karachi, PK', 'Karachi, Pakistan' or 'Lahore, PK'"
                    else:
                        lat = geo_data[0]['lat']
                        lon = geo_data[0]['lon']
                        city_name = geo_data[0].get('name', location)
                        country = geo_data[0].get('country', '')
                        print(f" → Resolved: {city_name}, {country}  (lat={lat}, lon={lon})")

                        # Step 2: Air Pollution
                        pollution_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
                        pollution_resp = requests.get(pollution_url, timeout=10)
                        print(f"Pollution → status: {pollution_resp.status_code}")
                        print(f"Pollution response (first part): {pollution_resp.text[:400]}...")

                        if pollution_resp.status_code == 401:
                            error = '401 Unauthorized on pollution endpoint → same key issue.'
                        elif pollution_resp.status_code != 200:
                            error = f'Pollution API failed (HTTP {pollution_resp.status_code}).'
                        else:
                            data = pollution_resp.json()
                            if 'list' not in data or not data['list']:
                                error = 'No recent air pollution data for this spot (try again later).'
                            else:
                                pollution = data['list'][0]
                                aqi = pollution['main']['aqi']
                                comp = pollution['components']

                                result = {
                                    'location': f"{city_name}, {country}",
                                    'aqi': aqi,
                                    'quality': AQI_MAP.get(aqi, 'Unknown'),
                                    'concentrations': {
                                        'SO2':   comp.get('so2',   'N/A'),
                                        'NO2':   comp.get('no2',   'N/A'),
                                        'PM10':  comp.get('pm10',  'N/A'),
                                        'PM2_5': comp.get('pm2_5', 'N/A'),
                                        'O3':    comp.get('o3',    'N/A'),
                                        'CO':    comp.get('co',    'N/A'),
                                    }
                                }
            except Exception as e:
                error = f'Request failed: {str(e)} (check internet / firewall)'

    return render_template('index.html',
                           result=result,
                           error=error,
                           aqi_map=AQI_MAP,
                           pollutants=POLLUTANTS)

if __name__ == '__main__':

    app.run(debug=True)
