const myLibrary = [];

function addBookToLibrary(bookObj) {
  myLibrary.push(bookObj);
}

function Book(title, author, pagesNumber, readStatus) {
  this.title = title;
  this.author = author;
  this.pagesNumber = pagesNumber;
  this.readStatus = readStatus;
  addBookToLibrary(this);
}

Book.prototype = {
  info: function info() { return `Title: ${this.title}, Author: ${this.author}, Pages Number: ${this.pagesNumber}, Is Already Read?: ${this.readStatus} `; },
  toggleReadStatus: function toggleReadStatus() { this.readStatus = !this.readStatus; },

};

function showBooksInLibraryByName() {
  return myLibrary.map((book) => book.title);
}

function removeBookFromLibrary(index) {
  myLibrary.splice(index, 1);
}

// * Tests requirement 6 change read status

const favBook = new Book('Leer y Escribir', 'Alberto Masferrer1', '+50', true);
const favBook2 = new Book('Minimum Vital', 'Alberto Masferrer2', '+11', true);
const favBook3 = new Book('Dinero Maldito', 'Alberto Masferrer3', '+10', true);
const favBook4 = new Book('Verdad', 'Alberto Masferrer4', '+1', true);

console.log(favBook.info());
console.log(favBook.toggleReadStatus());
console.log(favBook.info());
