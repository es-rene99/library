function mainApp() {
  const LIB_STORAGE = 'libraryStorage';
  const STORAGE_TYPE = 'localStorage';
  const MAIN_LIBRARY_NAME = 'main__library';
  const mainLibraryTarget = document.querySelector(`.${MAIN_LIBRARY_NAME}`);
  let libraryStorage = [];
  const BOOK_FIELDS = ['title', 'author', 'pages', 'finished'];
  const CAPITALIZE_CLASS = 'title-capitalize';

  const commonFunctions = {
    toKebabCase(word) {
      return word.replace(/\s+/g, '-').toLowerCase();
    },

  };

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

  function Book(title, author, pages, finished) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.finished = finished;
  }

  Book.prototype = {
    toggleFinished: function toggleFinished() {
      this.finished = (this.finished === 'Yes') ? 'No' : 'Yes';
    },
  };

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
          libraryStorage = JSON.parse(localStorage.getItem(LIB_STORAGE));
          libraryStorage.forEach((book) => {
            Object.setPrototypeOf(book, Book.prototype);
          });
        }
      } else {
        console.log('Storage not available');
      }
    },
    updateBookLibrary(book, index, libraryParam) {
      libraryStorage = libraryParam.map((bookParam, indexParam) => {
        if (indexParam === index) {
          return book;
        }
        return bookParam;
      });
      this.setLibraryStorage();
    },
    isLibraryEmpty: () => libraryStorage.length === 0,
  };

  const uiHandler = {
    isformGeneratedAlready: false,
    addAriaLabel(element, ariaLabel) {
      element.setAttribute('aria-label', ariaLabel);
    },
    populateContent() {
      if (libraryHandler.isLibraryEmpty()) {
        const libraryEmptyMsg = document.createElement('p');
        libraryEmptyMsg.classList.add('main__library-header');
        libraryEmptyMsg.textContent = 'Library is empty';
        mainLibraryTarget.appendChild(libraryEmptyMsg);
      }
      function createBookDetails(book) {
        const bookDetails = document.createElement('div');
        bookDetails.classList.add('library__book-details-container');
        const bookEntries = Object.entries(book);
        const bookDetailContainer = document.createElement('ul');
        bookDetailContainer.classList.add('library__book-detail-list');
        for (let i = 0; i < bookEntries.length; i++) {
          const [key, value] = bookEntries[i];
          if (key !== 'title') {
            bookDetailContainer.innerHTML += `<li class="library__book-detail-item"><div class="${CAPITALIZE_CLASS}">${key}:</div> <div class="${CAPITALIZE_CLASS}">${value}</div></li>`;
          }
        }
        bookDetails.appendChild(bookDetailContainer);
        return bookDetails;
      }

      libraryStorage.forEach((book, index) => {
        // Common things that every book element should have
        const bookContainer = document.createElement('form');
        bookContainer.setAttribute('data-book-index', index);
        bookContainer.setAttribute('class', 'library__book');

        // Title
        const bookTitle = document.createElement('h1');
        bookTitle.innerText = book.title;

        // bookInfoContainer
        const bookDetails = createBookDetails(book);

        function createBookControlBtn(buttonType, bookIndex) {
          const bookButton = document.createElement('button');
          bookButton.setAttribute('type', 'submit');
          const buttonTypeAttrName = commonFunctions.toKebabCase(buttonType);
          bookButton.setAttribute('id', `book-${buttonTypeAttrName}-btn-${bookIndex}`);
          bookButton.setAttribute('class', `book-${buttonTypeAttrName}-btn`);
          bookButton.classList.add('book-btn');
          const bookButtonIcon = document.createElement('i');
          uiHandler.addAriaLabel(bookButton, buttonType);

          if (buttonType === 'Remove') {
            bookButtonIcon.classList.add('las', 'la-trash');
          } else if (buttonType === 'Toggle Finished Status') {
            bookButtonIcon.classList.add('las', 'la-sync-alt');
          }

          bookButton.appendChild(bookButtonIcon);
          // bookButton.innerText = buttonType;
          bookButton.onclick = () => {
            if (buttonType === 'Remove') {
              libraryHandler.removeBookFromLibrary(index, libraryStorage);
            } else if (buttonType === 'Toggle Finished Status') {
              book.toggleFinished();
              libraryHandler.updateBookLibrary(book, index, libraryStorage);
            }

            window.location.reload();
          };
          return bookButton;
        }

        function createBookControlButtons() {
          const btnTypes = ['Remove', 'Toggle Finished Status'];
          const controlButtons = btnTypes.map((btnType) => createBookControlBtn(btnType, index));
          controlButtons.forEach((controlButton) => {
            bookContainer.appendChild(controlButton);
          });
        }

        // TODO I could do an object that contains bookContainerParts and add these 3

        bookContainer.appendChild(bookTitle);
        bookContainer.appendChild(bookDetails);
        createBookControlButtons(bookContainer);
        mainLibraryTarget.appendChild(bookContainer);
      });
    },
    generateAddBookFormFields() {
      const newBookForm = document.querySelector('.new-book-form');
      const newBookFormFieldSet = document.createElement('fieldset');
      const newBookFormHeader = document.createElement('legend');
      const newBookFormFieldsContainer = document.createElement('div');
      function getFLabel(field) {
        return `f${field}`;
      }
      // TODO would like to do a reusable loop
      // https://stackoverflow.com/questions/12135249/define-a-loop-as-a-function-to-reuse
      newBookFormHeader.classList.add('new-book-form__fieldset');
      newBookFormHeader.classList.add('new-book-form__legend');
      newBookFormFieldsContainer.classList.add('new-book-form__fields-container');
      newBookFormHeader.textContent = 'Add New Book';
      newBookFormFieldSet.appendChild(newBookFormHeader);

      // TODO would like to have dynamic fields for constructors
      BOOK_FIELDS.forEach((field) => {
        const bookFieldDiv = document.createElement('div');
        const bookFieldLabel = document.createElement('label');
        const bookFieldInput = document.createElement('input');
        const fLabel = getFLabel(field);

        bookFieldDiv.classList.add(`${fLabel}-container`, 'new-book-form__field-container');
        bookFieldLabel.setAttribute('for', fLabel);
        bookFieldLabel.setAttribute('class', CAPITALIZE_CLASS);
        bookFieldLabel.textContent = `${field}:`;
        // TODO need to do them vertical
        bookFieldInput.setAttribute('name', fLabel);
        let inputType;
        if (field === 'pages') {
          inputType = 'number';
        } else if (field === 'finished') {
          inputType = 'checkbox';
        } else {
          inputType = 'text';
        }
        bookFieldInput.setAttribute('type', inputType);
        bookFieldInput.setAttribute('id', fLabel);
        bookFieldDiv.appendChild(bookFieldLabel);
        bookFieldDiv.appendChild(bookFieldInput);
        newBookFormFieldsContainer.appendChild(bookFieldDiv);
      });
      newBookFormFieldSet.appendChild(newBookFormFieldsContainer);
      newBookForm.appendChild(newBookFormFieldSet);
      newBookForm.insertAdjacentHTML('beforeend', '<a href="./index.html" id="new-book-form__submit" class="new-book-form__submit">Submit</a>');
      const newBookFormSubmitAnchor = document.querySelector('#new-book-form__submit');
      newBookFormSubmitAnchor.onclick = () => {
        const newBookParams = BOOK_FIELDS.map((field) => {
          const fLabel = getFLabel(field);
          if (field === 'finished') {
            if (document.getElementById(fLabel).checked) {
              return 'Yes';
            }
            return 'No';
          }
          return document.getElementById(fLabel).value;
        });
        const newBook = new Book(
          newBookParams[0], newBookParams[1], newBookParams[2], newBookParams[3],
        );
        libraryHandler.addBookToLibrary(newBook, libraryStorage);
      };
      uiHandler.isformGeneratedAlready = true;
    },
    activateEventListeners() {
      const btn = document.getElementById('open-add-book-form__btn');
      const creditsBtn = document.querySelector('.credits__btn');
      const creditsHidden = document.querySelector('.credits__msg--hidden');
      btn.onclick = () => {
        if (!uiHandler.isformGeneratedAlready) {
          this.generateAddBookFormFields();
        }
      };
      creditsBtn.onclick = () => {
        creditsHidden.classList.toggle('credits__msg--hidden');
        creditsBtn.classList.toggle('credits__btn--rotate-arow');
      };
    },
  };

  return {
    init() {
      libraryHandler.initLibraryStorage();
      uiHandler.populateContent();
      uiHandler.activateEventListeners();
    },
  };
}

mainApp().init();
