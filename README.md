# BookComb

BookComb is the easiest way to find information about millions of books. Comb through book suggestions with our descriptions and ratings. Then share your best book finds with others with the virtual bookshelf. (https://bookcomb.com/)

## Description

BookComb is a web application built using MongoDB, Express, React, and Node.js (MERN). The application allows users to search for books and create a bookshelf that you can share with friends. The bookshelf feature is similar to a generic link in bio, but for books.

## Getting Started
- [MongoDB](https://www.mongodb.com/)
- [Node](https://nodejs.org/en/download/) v20.9.0
- [npm](https://nodejs.org/en/download/package-manager/) v10.8.2

### Installing

* Node dependencies
```
cd client
npm install
```
```
cd server
npm install
```

### Executing program

* Ensure .env variables are set correctly. Here are two examples for the frontend and backend .env.
* Frontend:
```
VITE_API_URL= http://backend.com:1234
VITE_SITE_NAME= BookComb
VITE_SITE_URL = https://bookcomb.com
```
* Backend:
```
PORT = BACKEND_PORT
JWT_SECRET_KEY = JWT_SECRET_KEY
TOKEN_HEADER_KEY = TOKEN_HEADER_KEY
EXPRESS_SECRET_KEY = EXPRESS_SECRET_KEY
SESSION_SECRET = EXPRESS_SESSION_SECRET_KEY
GOOGLE_BOOKS_API_KEY = GOOGLE_API_KEY_BOOKS
MONGODB_API_URL = MONGODB_ATLAST_API_QUERY_STRING
FRONTEND_URL = https://frontend.com:1234
EMAIL_USER = email@domain.com
EMAIL_PASS = EMAIL_PASSWORD
EMAIL_PORT = 465
EMAIL_HOST = mail.domain.com
```

* Frontend Client:
```
cd client
vite
```
* Build Tailwind Frontend CSS Changes ([Info](https://tailwindcss.com/docs/installation)):
```
cd client
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```
* Backend:
```
cd server
node index.js
```

## Author

[Owen Jennings](https://otj.rocks/)

## Version History

* 1.0
    * Initial Release

## License

This project is licensed under the MIT License. See the LICENSE markdown file.

## Acknowledgments

*   Book Information, Reviews, and Covers: [Open Library API](https://openlibrary.org/dev/docs/api/covers)
*   Book Search: [Google Books API](https://developers.google.com/books/docs/overview)
*   Book Styling: [https://github.com/petargyurov/virtual-bookshelf](https://github.com/petargyurov/virtual-bookshelf)
*   Bookshelf Styling: [https://codepen.io/tlauffs/pen/mdzzQZX](https://codepen.io/tlauffs/pen/mdzzQZX)
*   Bookshelf Image: [https://pngimg.com/image/107080](https://pngimg.com/image/107080)
