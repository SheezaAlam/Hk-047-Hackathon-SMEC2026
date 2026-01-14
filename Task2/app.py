from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    products = []
    best_price = None

    if request.method == "POST":
        query = request.form["product"]

        # Store 1 – ShopEasy
        r1 = requests.get("https://fakestoreapi.com/products").json()
        for p in r1:
            if query.lower() in p["title"].lower():
                products.append({
                    "name": p["title"],
                    "price": p["price"],
                    "site": "ShopEasy"
                })

        # Store 2 – BuyNow
        r2 = requests.get(f"https://dummyjson.com/products/search?q={query}").json()
        for p in r2["products"]:
            products.append({
                "name": p["title"],
                "price": p["price"],
                "site": "BuyNow"
            })

        # Store 3 – MegaMart
        r3 = requests.get("https://api.escuelajs.co/api/v1/products").json()
        for p in r3:
            if query.lower() in p["title"].lower():
                products.append({
                    "name": p["title"],
                    "price": p["price"],
                    "site": "MegaMart"
                })

        if products:
            best_price = min(products, key=lambda x: x["price"])

    return render_template("index.html", products=products, best_price=best_price)

if __name__ == "__main__":
    app.run(debug=True)
