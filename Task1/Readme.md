# Air Pollution Checker

A simple one-page web application that allows users to check current air quality and pollutant concentrations for any location (e.g. Karachi, Pakistan) using the **OpenWeatherMap Air Pollution API**.

The app displays:
- Air Quality Index (AQI) level (1–5)
- Qualitative description (Good, Fair, Moderate, Poor, Very Poor)
- Concentrations of main pollutants in µg/m³: SO₂, NO₂, PM₁₀, PM₂.₅, O₃, CO
- Reference table showing the classification thresholds used

## Features

- User enters city name (recommended format: `City, Country Code` e.g. `Karachi, PK`)
- Geocoding to convert location name → latitude/longitude
- Real-time air pollution data fetch
- Clean, responsive single-page interface with colored AQI feedback
- Built with **Flask** (Python) + **HTML/CSS** + minimal JavaScript
- No frontend framework required

Example result screen:
- Location: Karachi, PK
- Air Quality: Moderate (Index: 3)
- Pollutant values displayed in a list
- Reference classification table at the bottom

## Technologies Used

- **Backend**: Python + Flask
- **Frontend**: HTML5, CSS3 (with simple responsive styling)
- **API**: OpenWeatherMap
  - Geocoding API (`/geo/1.0/direct`)
  - Air Pollution API (`/data/2.5/air_pollution`)
- **HTTP Client**: `requests` library

## Prerequisites

- Python 3.8+
- API Key from [OpenWeatherMap](https://openweathermap.org/api) (free tier is sufficient)

Create virtual environment (recommended)Bashpython -m venv venv
source venv/bin/activate    # Linux/macOS
venv\Scripts\activate       # Windows
Install dependenciesBashpip install flask requests
Add your API keyOpen app.py and replace:PythonAPI_KEY = 'YOUR_API_KEY_HERE'with your actual OpenWeatherMap API key.
Run the applicationBashpython app.pyOpen your browser and go to:
http://127.0.0.1:5000/

## Usage

Enter a location (best results with city + country code):
Karachi, PK
Lahore, Pakistan
London, UK
New York, US

Click Check Now
View:
Current air quality level and index
Pollutant concentrations (μg/m³)
Reference table with category thresholds

Note: New API keys may take 10–120 minutes (sometimes up to a few hours) to become active after registration.
## Project Structure
task1/
├── app.py                  # Flask backend + API logic
├── templates/
│   └── index.html          # Main HTML page with form & results
└── README.md

## Known Limitations

Relies on OpenWeatherMap model data (not official government stations)
Free API has rate limits (~60 calls/min, 1,000/day)
Accuracy depends on how well the location is geocoded
No historical data or forecast (current hour only)

