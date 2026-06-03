Here are the top 10 HTTP status codes you will use 99% of the time during development. They are broken down by category so they are easy to remember.

---

## The "Everything is Good" Codes (2xx)

### 1. `200 OK`

* **What it means:** Success! The request worked perfectly, and the server is returning exactly what you asked for (like a webpage, an image, or JSON data).
* **When to use it:** For successful `GET`, `PUT`, or `PATCH` requests.

### 2. `201 Created`

* **What it means:** Success! The request worked, and a brand-new resource was successfully created in your database.
* **When to use it:** Always use this as the response for a successful `POST` request (like creating a new user or a new blog post).

---

## The "Go Somewhere Else" Codes (3xx)

### 3. `304 Not Modified`

* **What it means:** The files you are asking for haven't changed since the last time you downloaded them.
* **When to use it:** Used automatically for browser caching. The server tells the browser, "Just use the copy you already downloaded, it's still fresh," saving bandwidth.

---

## The "You Messed Up" Codes (4xx - Client Errors)

### 4. `400 Bad Request`

* **What it means:** The server can't understand what you want because your request is malformed or missing data.
* **When to use it:** When a frontend form is missing a required field, or sends invalid data (like text instead of a number) to your API.

### 5. `401 Unauthorized`

* **What it means:** The server doesn't know who you are. You need to log in first.
* **When to use it:** When a user tries to access a protected page or API route without a valid Auth token or session cookie.

### 6. `403 Forbidden`

* **What it means:** The server knows exactly who you are, but you **do not have permission** to look at this.
* **When to use it:** When a regular user tries to access an Admin-only dashboard. (They are logged in, but blocked).

### 7. `404 Not Found`

* **What it means:** The ultimate classic. The server cannot find the specific URL or resource you requested.
* **When to use it:** When someone types a wrong URL, or tries to fetch a user ID from the database that doesn't exist.

---

## The "The Server Messed Up" Codes (5xx - Server Errors)

### 8. `500 Internal Server Error`

* **What it means:** The backend code crashed. Something went wrong on the server side, and it didn't handle the error cleanly.
* **When to use it:** Avoid returning this on purpose! This usually pops up automatically when your Node/Prisma backend throws an unhandled exception or encounters a code bug.

### 9. `502 Bad Gateway`

* **What it means:** One server on the internet received an invalid response from another server.
* **When to use it:** You see this a lot in deployment. It usually means your web server (like Nginx) is online, but your actual backend application (like your Node.js app) crashed or isn't running.

### 10. `503 Service Unavailable`

* **What it means:** The server is overloaded, down for scheduled maintenance, or temporarily unable to handle the traffic.
* **When to use it:** When your app is temporarily pausing traffic to update the database, or when the server is melting under too many requests.
