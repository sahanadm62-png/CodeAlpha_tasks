# 🔗 CodeAlpha URL Shortener

A simple and user-friendly URL Shortener built using **Node.js, Express.js, MongoDB, HTML, CSS, and JavaScript**.

Convert long URLs into short, shareable links in seconds!

## ✨ Features

- 🔗 Shorten long URLs into unique short links.
- ⚡ Fast URL redirection to the original website.
- ✅ Validate URLs before shortening.
- 📋 Copy shortened URLs to share easily.
- 💾 Store URL information in MongoDB.
- 📱 Responsive and user-friendly frontend.

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Dependencies:** Mongoose, dotenv, CORS

## 📂 Project Structure

```text
CodeAlpha_URL_Shortener/
├── models/
│   └── Url.js
├── routes/
│   └── urlRoutes.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/sahanadm62-png/CodeAlpha_URL_Shortener.git
```

### 2. Open the project folder

```bash
cd CodeAlpha_URL_Shortener
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace the placeholder with your own MongoDB connection string. Never commit your `.env` file or share database credentials publicly.

### 5. Start the application

For development:

```bash
npm run dev
```

Or run:

```bash
npm start
```

### 6. Open the website

Visit [http://localhost:5000](http://localhost:5000) in your browser.

## 🚀 How It Works

1. Enter a long URL in the input field.
2. Click **Shorten URL**.
3. The backend generates a unique short code and stores the URL information in MongoDB.
4. Copy and share the shortened link.
5. Opening the short link redirects to the original URL.

## 🧪 API Endpoint

**Shorten a URL**

- **Method:** `POST`
- **Endpoint:** `/shorten`
- **Content-Type:** `application/json`

Example request:

```json
{
  "originalUrl": "https://www.google.com"
}
```

The response includes the original URL, shortened URL, and generated short code.

## 🎯 Project Objective

This project was developed as part of the **CodeAlpha Backend Development Internship** to practice REST API development, URL validation, database integration, and URL redirection using Node.js and Express.js.

## 👩‍💻 Author

**Sahana D M**

GitHub: [@sahanadm62-png](https://github.com/sahanadm62-png)

---

⭐ If you find this project useful, feel free to explore the repository!
