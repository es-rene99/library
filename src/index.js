const LIB_STORAGE = 'libraryStorage';
const STORAGE_TYPE = 'localStorage';
const MAIN_LIBRARY_NAME = 'main__library';
const mainLibraryTarget = document.querySelector(`.${MAIN_LIBRARY_NAME}`);
let libraryStorage = [];

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

const libraryHandler = {
  addBookToLibrary(bookObj, libraryParam) {
    libraryParam.push(bookObj);
    libraryStorage = libraryParam;
    this.setLibraryStorage();
  },
  showBooksInLibraryByName() {
    return libraryStorage.map((book) => book.title);
  },
  removeBookFromLibrary(index, libraryParam) {
    libraryParam.splice(index, 1);
    libraryStorage = libraryParam;
    this.setLibraryStorage();
  },
  setLibraryStorage() {
    if (storageAvailable(STORAGE_TYPE)) {
      localStorage.setItem(LIB_STORAGE, JSON.stringify(libraryStorage));
    } else {
      console.log('Storage not available');
    }
  },
  initLibraryStorage() {
    if (storageAvailable(STORAGE_TYPE)) {
      if (!localStorage.getItem(LIB_STORAGE)) {
        this.setLibraryStorage();
      } else {
        console.log(localStorage.library);
        libraryStorage = JSON.parse(localStorage.getItem(LIB_STORAGE));
      }
    } else {
      console.log('Storage not available');
    }
  },
  isLibraryEmpty: () => libraryStorage.length === 0,
};

function Book(title, author, pagesNumber, readStatus) {
  this.title = title;
  this.author = author;
  this.pagesNumber = pagesNumber;
  this.readStatus = readStatus;
  libraryHandler.addBookToLibrary(this, libraryStorage);
}

Book.prototype = {
  info: function info() { return `Title: ${this.title}, Author: ${this.author}, Pages Number: ${this.pagesNumber}, Is Already Read?: ${this.readStatus} `; },
  toggleReadStatus: function toggleReadStatus() { this.readStatus = !this.readStatus; },
};

const uiHandler = {
  populateContent() {
    if (libraryHandler.isLibraryEmpty()) {
      const libraryEmptyMsg = document.createElement('p');
      libraryEmptyMsg.textContent = 'Library is empty';
      mainLibraryTarget.appendChild(libraryEmptyMsg);
    }
    libraryStorage.forEach((book, index) => {
      const bookArticle = document.createElement('article');
      bookArticle.setAttribute('data-book-index', index);
      const bookArticleH1 = document.createElement('h1');
      bookArticleH1.innerText = book.title;
      bookArticle.appendChild(bookArticleH1);
      mainLibraryTarget.appendChild(bookArticle);
    });
  },
};

// TODO left here, working as expected but needs refactor

// * TEST UI population of contents
const favBook = new Book('Leer y Escribir', 'Alberto Masferrer1', '+50', true);
const favBook2 = new Book('Minimum Vital', 'Alberto Masferrer2', '+11', true);
const favBook3 = new Book('Dinero Maldito', 'Alberto Masferrer3', '+10', true);
const favBook4 = new Book('Verdad', 'Alberto Masferrer4', '+1', true);
localStorage.clear();

const mainApp = {
  init() {
    libraryHandler.initLibraryStorage();
    uiHandler.populateContent();
  },
};

mainApp.init();

// console.log(library.showBooksInLibraryByName());
// console.log(localStorage[LIB_STORAGE]);
// const favBook5 = new Book('Verdad2', 'Alberto Masferrer4', '+1', true);
// console.log(localStorage[LIB_STORAGE]);
// localStorage.clear();
// console.log(localStorage[LIB_STORAGE]);
