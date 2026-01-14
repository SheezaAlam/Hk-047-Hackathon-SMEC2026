# Smart Shopping Cart System

## Project Overview

The Smart Shopping Cart System is a web-based application that allows users to browse products from an e-commerce API and manage a shopping cart. Users can add products to the cart, remove items, update quantities, and retain cart data during their session.

The project demonstrates API integration, session-based cart persistence, and server-side logic for managing shopping cart operations.

---

## Core Features

* Display list of products using an e-commerce API
* Add products to the shopping cart
* Remove products from the cart
* Update product quantity
* Persistent cart using session storage
* Real-time cart total calculation

---

## Technologies Used

* Backend: Python (Flask)
* Frontend: HTML, CSS
* API Integration: FakeStoreAPI
* Data Persistence: Flask Session
* HTTP Requests: Python Requests library

---

## API Used

* FakeStoreAPI
  URL: [https://fakestoreapi.com/products](https://fakestoreapi.com/products)

The API provides product data such as product name, price, and ID, which are used to build the shopping cart functionality.

---

## Project Structure

```
smart_cart/
│
├── app.py
├── templates/
│   ├── index.html
│   └── cart.html
└── static/
    └── style.css
```

---

## How the System Works

1. Products are fetched from the e-commerce API and displayed on the homepage.
2. Users can add products to the shopping cart.
3. The cart is stored in the server-side session.
4. Users can update item quantities or remove items from the cart.
5. Cart data persists across pages during the session.
6. The total cart price is calculated and displayed dynamically.

---

## Installation and Setup

1. Install required Python packages:

```bash
pip install flask requests
```

2. Run the application:

```bash
python app.py
```

3. Open a browser and navigate to:

```
http://127.0.0.1:5000
```

---

## Usage Instructions

* Browse the product list on the homepage.
* Click "Add to Cart" to add a product.
* Open the cart page to view selected items.
* Update quantities or remove items as needed.
* View the total price of all cart items.

---

## Cart Persistence

* Cart data is stored using Flask session.
* Data remains available until the browser session ends.
* No database is required for persistence in this implementation.

---

## Evaluation Criteria Covered

* Product listing using e-commerce API
* Add and remove cart items
* Quantity update functionality
* Persistent cart storage
* Clean and functional web interface

---

## Possible Enhancements

* Database-based cart persistence (SQLite or MySQL)
* User authentication
* Product search and filtering
* Order checkout and payment integration
* Deployment on cloud platform

---

## Conclusion

This Smart Shopping Cart System effectively demonstrates the use of APIs, session-based persistence, and full shopping cart functionality in a web application. The project is suitable for academic tasks, competitions, and beginner-level full-stack development demonstrations.

---
