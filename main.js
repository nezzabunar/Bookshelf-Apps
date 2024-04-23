const books = [];
const RENDER_EVENT = 'render-book';

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data!== null){
        for (const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })

    const SubmitSearch = document.getElementById('searchBook');
    SubmitSearch.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    })

    if(isStorageExist()){
        loadDataFromStorage();
    }
})

document.addEventListener(SAVED_EVENT, function () {
    alert(`Data Tersimpan!`);
  });

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (bookItem.isCompleted) {
            completeBookshelfList.append(bookElement);
        }else {
            incompleteBookshelfList.append(bookElement);
        }
    }
})

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerHTML = bookObject.title;

    const textPenulis = document.createElement('p');
    textPenulis.innerHTML = bookObject.author;

    const textTerbit = document.createElement('p');
    textTerbit.innerHTML = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('action');
    textContainer.append(textTitle);

    const container = document.createElement('article');
    container.classList.add('book_item');

    container.append(textTitle, textPenulis, textTerbit);
    container.setAttribute('id', `book-${bookObject.id}`);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    
    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText ='Belum Selesai dibaca';
    
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        })
    
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText ='Hapus buku';
    
        deleteButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        })
    
        buttonContainer.append(undoButton, deleteButton);
        container.append(buttonContainer);

        
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText ='Selesai dibaca';
    
        checkButton.addEventListener('click', function () {
            addBookCompleted(bookObject.id);
        })
    
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText ='Hapus buku';
    
        deleteButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        })
    
        buttonContainer.append(checkButton, deleteButton);
        container.append(buttonContainer);
    }

    return container;

}

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const checkbox = document.getElementById('inputBookIsComplete').checked;

    const generetedID = genereteId();
    const bookObject = generetebookObject(generetedID, bookTitle, bookAuthor, bookYear, checkbox);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT))

    saveData();

}

function searchBook() {
    const inputBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const books = document.querySelectorAll('h3');
    for (book of books ) {
        if(book.innerText.toLowerCase().includes(inputBookTitle)){
          book.parentElement.style.display = 'block';
        }else if (book.innerText.toLowerCase() !== inputBookTitle){
          book.parentElement.style.display = 'none';
        }else {
          book.parentElement.style.display = 'block';
        }
    }
}

function genereteId() {
    return +new Date();
}

function generetebookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function addBookCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();

}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();

}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData(); 

}

function findBookIndex(bookId){
    for (const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

