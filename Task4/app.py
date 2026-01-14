from flask import Flask, render_template, request, redirect, url_for, session
import requests

app = Flask(__name__)
app.secret_key = "smart_cart_secret"

API_URL = "https://fakestoreapi.com/products"

@app.route("/")
def index():
    products = requests.get(API_URL).json()
    return render_template("index.html", products=products)

@app.route("/add/<int:product_id>")
def add_to_cart(product_id):
    cart = session.get("cart", {})

    if str(product_id) in cart:
        cart[str(product_id)]["quantity"] += 1
    else:
        product = requests.get(f"{API_URL}/{product_id}").json()
        cart[str(product_id)] = {
            "title": product["title"],
            "price": product["price"],
            "quantity": 1
        }

    session["cart"] = cart
    return redirect(url_for("index"))

@app.route("/cart")
def cart():
    cart = session.get("cart", {})
    total = sum(item["price"] * item["quantity"] for item in cart.values())
    return render_template("cart.html", cart=cart, total=total)

@app.route("/update/<int:product_id>", methods=["POST"])
def update_quantity(product_id):
    cart = session.get("cart", {})
    quantity = int(request.form["quantity"])

    if quantity > 0:
        cart[str(product_id)]["quantity"] = quantity
    else:
        cart.pop(str(product_id))

    session["cart"] = cart
    return redirect(url_for("cart"))

@app.route("/remove/<int:product_id>")
def remove_item(product_id):
    cart = session.get("cart", {})
    cart.pop(str(product_id), None)
    session["cart"] = cart
    return redirect(url_for("cart"))

if __name__ == "__main__":
    app.run(debug=True)
