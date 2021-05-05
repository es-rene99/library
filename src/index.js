const LIB_STORAGE = 'libraryStorage';
const STORAGE_TYPE = 'localStorage';

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22
      // Firefox
      || e.code === 1014
      // test name field too, because code might not be present
      // everything except Firefox
      || e.name === 'QuotaExceededError'
      // Firefox
      || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      // acknowledge QuotaExceededError only if there's something already stored
      && (storage && storage.length !== 0);
  }
}

const library = {
  [LIB_STORAGE]: [],
  addBookToLibrary(bookObj, libraryParam) {
    libraryParam.push(bookObj);
    this.libraryStorage = libraryParam;
    this.setLibraryStorage();
  },
  showBooksInLibraryByName() {
    return this.libraryStorage.map((book) => book.title);
  },
  removeBookFromLibrary(index, libraryParam) {
    libraryParam.splice(index, 1);
    this.libraryStorage = libraryParam;
    this.setLibraryStorage();
  },
  isLibraryStorageAvailable: storageAvailable(STORAGE_TYPE),
  setLibraryStorage() {
    if (this.isLibraryStorageAvailable) {
      localStorage.setItem(LIB_STORAGE, JSON.stringify(this.libraryStorage));
    } else {
      console.log('Storage not available');
    }
  },
  initLibraryStorage() {
    if (this.isLibraryStorageAvailable) {
      if (!localStorage.getItem(LIB_STORAGE)) {
        this.setLibraryStorage();
      } else {
        console.log(localStorage.library);
        this.libraryStorage = JSON.parse(localStorage.getItem(LIB_STORAGE));
      }
    } else {
      console.log('Storage not available');
    }
  },
};

function Book(title, author, pagesNumber, readStatus) {
  this.title = title;
  this.author = author;
  this.pagesNumber = pagesNumber;
  this.readStatus = readStatus;
  library.addBookToLibrary(this, library[LIB_STORAGE]);
}

Book.prototype = {
  info: function info() { return `Title: ${this.title}, Author: ${this.author}, Pages Number: ${this.pagesNumber}, Is Already Read?: ${this.readStatus} `; },
  toggleReadStatus: function toggleReadStatus() { this.readStatus = !this.readStatus; },
};

library.initLibraryStorage();

// * TEST local storage

const favBook = new Book('Leer y Escribir', 'Alberto Masferrer1', '+50', true);
const favBook2 = new Book('Minimum Vital', 'Alberto Masferrer2', '+11', true);
const favBook3 = new Book('Dinero Maldito', 'Alberto Masferrer3', '+10', true);
const favBook4 = new Book('Verdad', 'Alberto Masferrer4', '+1', true);
console.log(library.showBooksInLibraryByName());
console.log(localStorage[LIB_STORAGE]);
const favBook5 = new Book('Verdad2', 'Alberto Masferrer4', '+1', true);
console.log(localStorage[LIB_STORAGE]);
localStorage.clear();
console.log(localStorage[LIB_STORAGE]);
