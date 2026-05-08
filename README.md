# BOSC Community Library

A web-based library management system for the BOSC Community Library, built with Node.js, HTML, CSS, JavaScript, and optional PHP backend connector support.

## Features

- Add books and members
- Borrow and return books
- View lists of books and members
- Librarian authentication and session handling
- Optional PHP connector sample in `public/php/api_proxy.php`
- Backend persistence with SQLite

## Getting Started

### Prerequisites
- Node.js and npm installed
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/Damdji123/BOSC-Community-Library.git
   ```
2. Navigate to the project directory:
   ```
   cd BOSC-Community-Library
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm start
   ```
5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Features
- Librarian registration and login
- Forgot password and reset flow
- SQLite database with tables for librarians, books, members, and password resets
- Book borrowing and returning with live backend persistence
- Professional multi-page web interface
- Admin book/member management pages
- Optional PHP sample connector for backend integration

## Project Structure

- `index.html`: Main HTML file
- `css/styles.css`: Stylesheet
- `js/script.js`: JavaScript logic
- `.github/`: GitHub templates and workflows
- `CODE_OF_CONDUCT.md`: Community behavior standards
- `CONTRIBUTING.md`: Contribution guidelines

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.