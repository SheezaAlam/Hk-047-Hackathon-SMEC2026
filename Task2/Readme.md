# Product Price Comparison System

## Project Overview

The Product Price Comparison System is a web-based application that compares the prices of a searched product across multiple e-commerce platforms and displays the best available price along with the store name.
The system is designed to help users make informed purchasing decisions by identifying the lowest price from different sources.

This project fulfills the requirement of using APIs from three different e-commerce platforms and presenting a unified comparison result on a single webpage.

---

## Core Features

* Search for a product by keyword
* Fetch prices from three different e-commerce APIs
* Display product price along with store name
* Automatically determine and highlight the best (lowest) price
* Single-page web application
* Simple and user-friendly interface

---

## Technologies Used

* Backend: Python (Flask)
* Frontend: HTML, CSS
* API Integration: REST APIs
* HTTP Requests: Python Requests library

---

## APIs Used

The application integrates data from three different public e-commerce APIs:

1. FakeStoreAPI
2. DummyJSON
3. Platzi Fake Store API

For presentation purposes, these APIs are displayed as:

* ShopEasy
* BuyNow
* MegaMart

---

## Project Structure

```
price_comparison/
│
├── app.py
├── templates/
│   └── index.html
└── static/
    └── style.css
```

---

## How It Works

1. The user enters a product name in the search bar.
2. The backend sends requests to three different APIs.
3. Prices and product details are extracted from API responses.
4. The system compares all retrieved prices.
5. The lowest price is identified as the best price.
6. Results are displayed on the webpage with store names.

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

3. Open a browser and visit:

```
http://127.0.0.1:5000
```

---

## Usage Instructions

* Enter a simple keyword such as:

  * phone
  * shirt
  * bag
  * watch
* Click the search button.
* View the price comparison table and best price result.

---

## Evaluation Criteria Covered

* Use of multiple APIs
* Real-time price comparison
* Clear display of price and store name
* Identification of best price
* Clean and functional user interface

---

## Future Enhancements

* Add real-world commercial APIs
* Include product images
* Add currency conversion
* Implement sorting and filtering options
* Deploy the application online

---

## Conclusion

This project demonstrates effective API integration, backend processing, and frontend presentation to solve a real-world problem of price comparison. It is suitable for academic evaluation, competitions, and beginner-level full-stack development demonstrations.

