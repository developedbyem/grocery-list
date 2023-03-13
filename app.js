// ****** SELECT ITEMS **********
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");

const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");

const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
list.addEventListener("click", changeItem);
window.addEventListener("DOMContentLoaded", setupItems);
// ****** FUNCTIONS **********
function createElement(id, value) {
  return `<article class="grocery-item" data-id="${id}">
  <p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>
</article>`;
}
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
// add items-------------------------------------
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && editFlag === false) {
    list.innerHTML += createElement(id, value);
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
    displayAlert("item added to the list", "success");
  } else if (value && editFlag === true) {
    editElement.textContent = value;
    editLocalStorage(editID, value);
    setBackToDefault();
    displayAlert("value changed", "success");
  } else {
    displayAlert("please enter value", "danger");
  }
}
// change item-------------------------------------
function changeItem(e) {
  const element = e.target;
  const targetElement = element.parentElement.parentElement.parentElement;
  const id = targetElement.dataset.id;
  // delete item
  if (element.classList.contains("fa-trash")) {
    list.removeChild(targetElement);
    setBackToDefault();
    removeFromLocalStorage(id);
  }
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }

  // edit item
  if (element.classList.contains("fa-edit")) {
    editElement = element.parentElement.parentElement.previousElementSibling;
    grocery.value = editElement.textContent;
    grocery.select();
    editFlag = true;
    editID = targetElement.dataset.id;
    submitBtn.textContent = "edit";
  }
}

// clear items-------------------------------------
function clearItems() {
  const item = document.querySelectorAll(".grocery-item");
  item.forEach((i) => {
    list.removeChild(i);
  });
 
  setBackToDefault();
  // clear from localStorage
  localStorage.removeItem("list");
  if (list.children.length === 0) {
    container.style.visibility="hidden"
  }
}
// set back to default-------------------------------------
function setBackToDefault() {
  grocery.value = "";
  form.reset();
  grocery.focus();
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
let items;
// add to localStorage
function addToLocalStorage(id, value) {
  items = getLocalStorage();
  const grocery = {
    id,
    value,
  };
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
// remove from localStorage
function removeFromLocalStorage(i) {
  items = getLocalStorage();
  items = items.filter((item) => {
    return !(item.id === i);
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// editLocalStorage
function editLocalStorage(i, value) {
  // id = editId
  items = getLocalStorage();
  items.forEach((item) => {
    if (item.id === i) {
      item.value = value;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// ****** SETUP ITEMS **********

// getItemsFromLocalStorage
function setupItems() {
  items = getLocalStorage();
  for (const item of items) {
    list.innerHTML += createElement(item.id, item.value);
    container.style.visibility = "visible";
  }
}
