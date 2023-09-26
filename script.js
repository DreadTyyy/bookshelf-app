const books = [];
let foundBook = [];
const BOOK_EVENT = "book-event";
const SAVED_BOOK = "saved-book";
const STORAGE_KEY = "MY_BOOKSHELF";
const search = document.getElementById("search");

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("add-book");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    submitForm.reset();
  });
  if (isStorageExist) {
    loadDataFromStorage();
  }
});
search.addEventListener("keyup", () => {
  foundBook = [];
  const lowSearch = search.value.toLowerCase();
  if (!search.value == "") {
    for (const book of books) {
      lowBook = book.titleBook.toLowerCase();
      if (lowBook.match(lowSearch) && !foundBook.includes(book)) {
        foundBook.push(book);
      }
    }
  }
  document.dispatchEvent(new Event(BOOK_EVENT));
});
const addBook = () => {
  const titleBook = document.getElementById("title-book").value;
  const authorBook = document.getElementById("author-book").value;
  const yearBook = document.getElementById("year-book").value;

  const id = generatedID();
  const newBook = generateBook(id, titleBook, authorBook, yearBook, false);

  books.push(newBook);
  document.dispatchEvent(new Event(BOOK_EVENT));
  savedBook();
  alert("Buku berhasil ditambahkan!");
};

const generatedID = () => {
  return +new Date();
};
const generateBook = (id, titleBook, authorBook, year, isCompleted) => {
  return {
    id,
    titleBook,
    authorBook,
    yearBook: parseInt(year),
    isCompleted,
  };
};

document.addEventListener("book-event", () => {
  const onGoing = document.getElementById("ongoing");
  onGoing.innerHTML = "";

  const completedRead = document.getElementById("completed");
  completedRead.innerHTML = "";

  let booksToDisplay = [];
  if (foundBook.length > 0) {
    booksToDisplay = foundBook;
  } else if (!search.value == "") {
    missingBook();
  } else {
    booksToDisplay = books;
  }

  for (const book of booksToDisplay) {
    const elementBook = makeNewBook(book);
    onGoing.append(elementBook);

    if (book.isCompleted) {
      completedRead.append(elementBook);
    } else {
      onGoing.append(elementBook);
    }
  }
});

const missingBook = () => {
  const onGoing = document.getElementById("ongoing");
  const missing = document.createElement("p");
  missing.classList.add("missing");
  missing.innerText = "Tidak ada judul buku yang sesuai.";

  onGoing.append(missing);
};

const makeNewBook = (book) => {
  const content = document.createElement("div");
  const iconBook = document.createElement("div");
  iconBook.innerHTML =
    '<i class="fa-solid fa-rocket" style="color: #ffffff;"></i>';
  content.classList.add("content");
  iconBook.classList.add("icon");
  content.append(iconBook);

  const myBook = document.createElement("div");
  myBook.classList.add("book");
  const title = document.createElement("h6");
  title.classList.add("title");
  title.innerText = book.titleBook;

  const author = document.createElement("p");
  author.classList.add("author");
  author.innerText = `Author: ${book.authorBook}`;
  const tahun = document.createElement("p");
  tahun.classList.add("tahun");
  tahun.innerText = `Tahun: ${book.yearBook}`;
  myBook.append(title, author, tahun);

  content.append(myBook);
  content.setAttribute("id", `id-${book.id}`);

  if (book.isCompleted) {
    const edit = document.createElement("div");
    edit.classList.add("edit");

    const check = document.createElement("div");
    check.classList.add("check");
    check.innerHTML = "<i class='fa-solid fa-check'></i>";
    check.addEventListener("click", () => {
      unCheckListBook(book.id);
    });

    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>";
    deleteBtn.addEventListener("click", () => {
      deleteListBook(book.id);
    });

    edit.append(check, deleteBtn);
    content.append(edit);
  } else {
    const edit = document.createElement("div");
    edit.classList.add("edit");

    const check = document.createElement("div");
    check.classList.add("check");
    check.addEventListener("click", () => {
      checkListBook(book.id);
    });

    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>";
    deleteBtn.addEventListener("click", () => {
      deleteListBook(book.id);
    });
    edit.append(check, deleteBtn);
    content.append(edit);
  }

  return content;
};
const checkListBook = (id) => {
  const itemBook = findBook(id);

  if (itemBook === null) return;

  itemBook.isCompleted = true;
  document.dispatchEvent(new Event(BOOK_EVENT));
  savedBook();
  alert("Buku telah selesai dibaca!");
};
const unCheckListBook = (id) => {
  const itemBook = findBook(id);

  if (itemBook === null) return;
  itemBook.isCompleted = false;
  document.dispatchEvent(new Event(BOOK_EVENT));
  savedBook();
};
const deleteListBook = (id) => {
  const itemBook = findIndexOfBook(id);

  if (itemBook === -1) return;
  books.splice(itemBook, 1);
  document.dispatchEvent(new Event(BOOK_EVENT));
  savedBook();
  alert("Buku berhasil dihapus!");
};
const findBook = (id) => {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
};
const findIndexOfBook = (id) => {
  let i = 0;
  for (const book of books) {
    if (book.id === id) {
      return i;
    }
    i++;
  }
  return -1;
};

const savedBook = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_BOOK));
  }
};
document.addEventListener(SAVED_BOOK, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});
const isStorageExist = () => {
  if (Storage === undefined) {
    alert("Browser anda tidak mendukung penyimpanan data!");
    return false;
  }
  return true;
};
const loadDataFromStorage = () => {
  const serealizedData = localStorage.getItem(STORAGE_KEY);
  const datas = JSON.parse(serealizedData);

  if (datas !== null) {
    for (const data of datas) {
      books.push(data);
    }
  }
  document.dispatchEvent(new Event(BOOK_EVENT));
};
