const myLibrary = [];

function addBookToLibrary(bookObj) {
  myLibrary.push(bookObj);
}

function Book(title, author, pagesNumber, isAlreadyRead) {
  this.title = title;
  this.author = author;
  this.pagesNumber = pagesNumber;
  this.isAlreadyRead = isAlreadyRead;
  addBookToLibrary(this);
}

Book.prototype.info = function info() { return `Title: ${this.title}, Author: ${this.author}, Pages Number: ${this.pagesNumber}, Is Already Read?: ${this.isAlreadyRead} `; };

// * Tests requirement 3

const favBook = new Book('Leer y Escribir', 'Alberto Masferrer1', '+50', true);
const favBook2 = new Book('Minimum Vital', 'Alberto Masferrer2', '+11', true);
const favBook3 = new Book('Dinero Maldito', 'Alberto Masferrer3', '+10', true);
const favBook4 = new Book('Verdad', 'Alberto Masferrer4', '+1', true);

function showBooksInLibraryByName() {
  return myLibrary.map((book) => book.title);
}

console.log(showBooksInLibraryByName());
