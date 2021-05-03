function Book(title, author, pagesNumber, isAlreadyRead) {
  this.title = title;
  this.author = author;
  this.pagesNumber = pagesNumber;
  this.isAlreadyRead = isAlreadyRead;
  this.info = () => `Title: ${title}, Author: ${author}, Pages Number: ${pagesNumber}, Is Already Read?: ${isAlreadyRead} `;
}

const favBook = new Book('Leer y Escribir', 'Alberto Masferrer', '+50', true);
console.log(favBook.info());
