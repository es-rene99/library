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

const favBook = new Book('Leer y Escribir', 'Alberto Masferrer', '+50', true);

// * Tests

console.log(myLibrary);
console.log(myLibrary[0].info());
