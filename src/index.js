const library = {
  libraryStorage: [],
  addBookToLibrary(bookObj) {
    this.libraryStorage.push(bookObj);
  },
  showBooksInLibraryByName() {
    return this.libraryStorage.map((book) => book.title);
  },
  removeBookFromLibrary(index) {
    this.libraryStorage.splice(index, 1);
  },
};

function Book(title, author, pagesNumber, readStatus) {
  this.title = title;
  this.author = author;
  this.pagesNumber = pagesNumber;
  this.readStatus = readStatus;
  library.addBookToLibrary(this);
}

Book.prototype = {
  info: function info() { return `Title: ${this.title}, Author: ${this.author}, Pages Number: ${this.pagesNumber}, Is Already Read?: ${this.readStatus} `; },
  toggleReadStatus: function toggleReadStatus() { this.readStatus = !this.readStatus; },
};

// * Test refactor of library obj to join funs

const favBook = new Book('Leer y Escribir', 'Alberto Masferrer1', '+50', true);
const favBook2 = new Book('Minimum Vital', 'Alberto Masferrer2', '+11', true);
const favBook3 = new Book('Dinero Maldito', 'Alberto Masferrer3', '+10', true);
const favBook4 = new Book('Verdad', 'Alberto Masferrer4', '+1', true);
console.log(library.showBooksInLibraryByName());
