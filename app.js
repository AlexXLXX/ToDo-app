"use strict";
const btnAdd = document.getElementById("btnAdd");
const inputTask = document.getElementById("input");
const taskList = document.getElementById("list");
const quantityTasks = document.getElementById("quantity");
const dataElement = document.getElementById("data");
const timeElement = document.getElementById("time");
const btnDeleteAll = document.getElementById("deleteAll");
const btnDeleteAllComplite = document.getElementById("deleteAllComplite");
const btnAllTasksCompleted = document.getElementById("btnAllTasksCompleted");
const filterTasks = document.getElementById("tabs");
const paginationNavigation = document.querySelector(".paginationNavigation");
const btnPaginationBack = document.getElementById("btnPaginationBack");
const btnPaginationAhead = document.getElementById("btnPaginationAhead");

btnAdd.addEventListener("click", addTask);
inputTask.addEventListener("keyup", addTaskOnEnter);
taskList.addEventListener("click", deleteTask);
taskList.addEventListener("click", deleteTask1);
taskList.addEventListener("click", doneTask);
btnDeleteAll.addEventListener("click", deleteAllTasks);
btnDeleteAllComplite.addEventListener("click", deleteComplitedTasks);
btnAllTasksCompleted.addEventListener("click", makeAllTasksCompleted);
inputTask.addEventListener("keyup", addTaskOnEnter);
filterTasks.addEventListener("change", getFilteredTasks);

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

tasks.forEach(function (task) {
  const cssClass = task.complite
    ? "conteiner_list_title conteiner_list_title--done"
    : "conteiner_list_title";

  const taskTemplateHTML = `
  <li id="${task.id}" class="conteiner_list_li">
  <input type="checkbox" ${task.complite ? "checked" : ""} id="${
    task.id + 1
  }" class="conteiner_list_checkbox"/>
  <label for="${task.id + 1}"></label>
  <span class = "${cssClass}" id="taskText">${task.text}</span>
  <button type="button" id="btnDelete" data-action="delete"></button>
  <button class = "hidden" type="button" id="btnDelete1" data-action="delete1"></button>
  </li>
  `;

  taskList.insertAdjacentHTML("beforeend", taskTemplateHTML);
});

const listElement = document.querySelectorAll(".conteiner_list_li");
const items = Array.from(listElement);
const itemsPerPage = 5;
let currentPage = 0;

document.addEventListener("DOMContentLoaded", showPage(currentPage));

function showPage(page) {
  let totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  paginationNavigation.children[1].textContent =
    currentPage + 1 + " / " + totalPages;
  items.forEach((item, index) => {
    item.classList.toggle(
      "hiddenPagination",
      index < startIndex || index >= endIndex
    );
  });
  if (tasks.length <= 5) {
    paginationNavigation.classList.add("hidden");
  }
}

paginationNavigation.addEventListener("click", createPageButtons);
function createPageButtons(event) {
  let totalPages = Math.ceil(items.length / itemsPerPage);
  if (event.target.dataset.action === "ahead") {
    if (currentPage >= totalPages - 1) return;
    currentPage++;
    paginationNavigation.children[1].textContent =
      currentPage + 1 + " / " + totalPages;

    showPage(currentPage);
  }
  if (event.target.dataset.action === "back") {
    if (currentPage <= 0) return;
    currentPage--;
    paginationNavigation.children[1].textContent =
      currentPage + 1 + " / " + totalPages;
    showPage(currentPage);
  }
}

checkEmptyList();
checkQuantityTasks();
dateTime();

function addTask(event) {
  inputTask.value = escapeHtml(inputTask.value);
  if (inputTask.value === "") return;
  if (inputTask.value.trim().length === 0) {
    alert("Задача не может быть пустой");
    inputTask.value = "";
    return;
  }

  const newTask = {
    id: Date.now(),
    text: inputTask.value,
    complite: false,
  };

  tasks.push(newTask);

  const cssClass = newTask.complite
    ? "conteiner_list_title conteiner_list_title--done"
    : "conteiner_list_title";

  const taskTemplateHTML = `
  <li id="${newTask.id}" class="conteiner_list_li">
  <input type="checkbox" ${newTask.complite ? "checked" : ""} id="${
    newTask.id + 1
  }" class="conteiner_list_checkbox"/>
  <label for="${newTask.id + 1}"></label>
  <span class = "${cssClass}" id="taskText">${newTask.text}</span>
  <button type="button" id="btnDelete" data-action="delete"></button>
  <button class = "hidden" type="button" id="btnDelete1" data-action="delete1"></button>
  
  </li>
  `;

  taskList.insertAdjacentHTML("beforeend", taskTemplateHTML);
  items.push(taskList.lastElementChild);

  filterTasks.value = "all";
  if (filterTasks.value === "all") {
    const listElement = document.querySelectorAll(".conteiner_list_li");
    for (let i = 0; i < listElement.length; i++) {
      listElement[i].classList.remove("hidden");
      if (
        filterTasks.value === "uncompleted" ||
        filterTasks.value === "completed"
      ) {
        listElement[i].children[3].classList.add("hidden");
        listElement[i].children[4].classList.remove("hidden");
      } else {
        listElement[i].children[4].classList.add("hidden");
        listElement[i].children[3].classList.remove("hidden");
      }
    }
  }

  let totalPages = Math.ceil(items.length / itemsPerPage);
  showPage((currentPage = totalPages - 1));
  inputTask.value = "";
  inputTask.focus();
  checkEmptyList();
  checkQuantityTasks();
  saveToLocalStorage();
}

function addTaskOnEnter(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    addTask();
  }
}

function deleteTask(event) {
  if (event.target.dataset.action === "delete") {
    const parentNode = event.target.closest(".conteiner_list_li");

    const id = Number(parentNode.id);

    const index = tasks.findIndex(function (task) {
      if (task.id === id) {
        return true;
      }
    });

    tasks.splice(index, 1);
    items.splice(index, 1);
    parentNode.remove();

    let totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage > totalPages - 1) {
      showPage((currentPage = totalPages - 1));
    } else {
      showPage(currentPage);
    }
    checkEmptyList();
  }

  checkQuantityTasks();
  saveToLocalStorage();
}

function deleteTask1(event) {
  if (event.target.dataset.action === "delete1") {
    const parentNode = event.target.closest(".conteiner_list_li");

    const id = Number(parentNode.id);

    const index = tasks.findIndex(function (task) {
      if (task.id === id) {
        return true;
      }
    });

    tasks.splice(index, 1);
    items.splice(index, 1);
    parentNode.remove();
  }

  checkQuantityTasks();
  saveToLocalStorage();
}

function doneTask(event) {
  if (event.target.type !== "checkbox") return;
  const parentNode = event.target.closest(".conteiner_list_li");
  const checkbox = parentNode.querySelector(".conteiner_list_checkbox");
  const taskTitle = parentNode.querySelector(".conteiner_list_title");

  if (checkbox.checked) {
    taskTitle.classList.add("conteiner_list_title--done");
  } else {
    taskTitle.classList.remove("conteiner_list_title--done");
  }

  const id = Number(parentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });

  for (let i = 0; i < tasks.length; i++) {
    if (taskList.children[i].firstElementChild.checked) {
      tasks[i].complite = true;
    } else {
      tasks[i].complite = false;
    }

    if (tasks[i].complite) {
      taskList.children[i].children[2].classList.add(
        "conteiner_list_title--done"
      );
    } else {
      taskList.children[i].children[2].classList.remove(
        "conteiner_list_title--done"
      );
    }
  }
  saveToLocalStorage();
}

function checkEmptyList() {
  const taskListDiv = document.querySelector(".conteiner_list");
  if (tasks.length === 0) {
    const emptyListHTML = `
    <span class="conteiner_emptyList" id="emptyList">
    Список задач пуст
    </span>`;
    taskListDiv.insertAdjacentHTML("afterbegin", emptyListHTML);
    paginationNavigation.classList.add("hidden");
  } else if (tasks.length > 5) {
    paginationNavigation.classList.remove("hidden");
  }
  if (tasks.length > 0) {
    const emptyList = document.querySelector("#emptyList");
    emptyList ? emptyList.remove() : null;
  }
}

function checkQuantityTasks() {
  quantityTasks.textContent = "Количество задач: " + tasks.length;
}

function dateTime() {
  const dateNow = new Date();
  dataElement.textContent = "Дата: " + dateNow.toLocaleDateString();
  timeElement.textContent =
    "Время: " +
    dateNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  setInterval(() => {
    dateTime();
  }, 5000);
}

function deleteAllTasks() {
  if (tasks.length === 0) return;
  for (let i = taskList.children.length - 1; i >= 0; i--) {
    taskList.children[i].remove();
  }

  tasks.splice(0, tasks.length);
  items.splice(0, items.length);
  filterTasks.value = "all";
  checkEmptyList();
  checkQuantityTasks();
  showPage((currentPage = 0));
  saveToLocalStorage();
}

function deleteComplitedTasks() {
  if (tasks.length === 0) return;

  for (let i = taskList.children.length - 1; i >= 0; i--) {
    if (taskList.children[i].firstElementChild.checked === true) {
      taskList.children[i].remove();
      items.splice(i, 1);
    }
  }

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].complite === true) {
      tasks.splice(i, 1);
      i--;
    }
  }

  filterTasks.value = "all";
  checkEmptyList();
  checkQuantityTasks();
  let totalPages = Math.ceil(items.length / itemsPerPage);
  if (currentPage > totalPages - 1) {
    showPage((currentPage = totalPages - 1));
  } else {
    showPage(currentPage);
  }
  saveToLocalStorage();
  return tasks;
}

function makeAllTasksCompleted() {
  let currentValue = tasks.every((task) => task.complite);
  tasks = tasks.map((task) => ({
    ...task,
    complite: !currentValue,
  }));

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].complite) {
      taskList.children[i].firstElementChild.checked = true;
    } else {
      taskList.children[i].firstElementChild.checked = false;
    }

    if (tasks[i].complite) {
      taskList.children[i].children[2].classList.add(
        "conteiner_list_title--done"
      );
    } else {
      taskList.children[i].children[2].classList.remove(
        "conteiner_list_title--done"
      );
    }
  }

  if (filterTasks.value === "uncompleted") {
    const listElement = document.querySelectorAll(".conteiner_list_li");
    for (let i = 0; i < listElement.length; i++) {
      if (!listElement[i].children[0].checked) {
        listElement[i].classList.remove("hidden");
      } else {
        listElement[i].classList.add("hidden");
      }
    }
  }

  if (filterTasks.value === "completed") {
    const listElement = document.querySelectorAll(".conteiner_list_li");
    for (let i = 0; i < listElement.length; i++) {
      if (listElement[i].children[0].checked) {
        listElement[i].classList.remove("hidden");
      } else {
        listElement[i].classList.add("hidden");
      }
    }
  }

  saveToLocalStorage();
  return tasks;
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getFilteredTasks(event) {
  const listElement = document.querySelectorAll(".conteiner_list_li");
  for (let i = 0; i < listElement.length; i++) {
    if (
      event.target.value === "uncompleted" ||
      event.target.value === "completed"
    ) {
      listElement[i].children[3].classList.add("hidden");
      listElement[i].children[4].classList.remove("hidden");
    } else {
      listElement[i].children[4].classList.add("hidden");
      listElement[i].children[3].classList.remove("hidden");
    }

    switch (event.target.value) {
      case "all":
        btnDeleteAllComplite.removeAttribute('disabled', '')

        listElement[i].classList.remove("hidden");
        showPage((currentPage = 0));
        paginationNavigation.classList.remove("hidden");
        if (tasks.length <= 5) {
          paginationNavigation.classList.add("hidden");
        }

        listElement[i].children[0].addEventListener("change", function () {
          if (!listElement[i].children[0].checked) {
            listElement[i].classList.remove("hidden");
          } else {
            listElement[i].classList.remove("hidden");
          }
        });

        break;

      case "completed":
        btnDeleteAllComplite.removeAttribute('disabled', '')

        if (tasks[i].complite) {
          listElement[i].classList.remove("hidden");
        } else if (!tasks[i].complite) {
          listElement[i].classList.add("hidden");
        }
        items.forEach((item) => {
          item.classList.remove("hiddenPagination");
        });
        paginationNavigation.classList.add("hidden");

        listElement[i].children[0].addEventListener("change", function () {
          if (listElement[i].children[0].checked) {
            listElement[i].classList.remove("hidden");
          } else {
            listElement[i].classList.add("hidden");
          }
        });

        break;

      case "uncompleted":
        btnDeleteAllComplite.setAttribute('disabled', '')

        if (!tasks[i].complite) {
          listElement[i].classList.remove("hidden");
        } else {
          listElement[i].classList.add("hidden");
        }
        items.forEach((item) => {
          item.classList.remove("hiddenPagination");
        });
        paginationNavigation.classList.add("hidden");

        listElement[i].children[0].addEventListener("change", function () {
          if (!listElement[i].children[0].checked) {
            listElement[i].classList.remove("hidden");
          } else {
            listElement[i].classList.add("hidden");
          }
        });

        break;
    }
  }
}

taskList.addEventListener("dblclick", editTaskText);
function editTaskText(event) {
  const task = event.target;
  const parentNode = event.target.closest(".conteiner_list_li");
  const taskArr = tasks.find((e) => e.id === Number(parentNode.id));

  if (task.tagName === "SPAN") {
    const input = document.createElement("input");
    input.className = "newInput";
    task.replaceWith(input);
    input.focus();
    input.value = task.textContent;

    function save() {
      input.replaceWith(task);
      task.textContent = input.value;
      taskArr.text = task.textContent;
      saveToLocalStorage();
      return;
    }

    input.addEventListener("blur", function () {
      if (input.value === "" || input.value.trim().length === 0) {
        alert("Задача не может быть пустой");
        input.replaceWith(task);
        return;
      }
      save();
    });

    input.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        input.blur();
      } else if (e.keyCode == 27) {
        input.value = task.textContent;
        input.blur();
        return;
      }
    });
  }
}

taskList.addEventListener("touchstart", doubleTouch);

let expired;
let doubleTouch = function (e) {
  if (e.touches.length === 1) {
    if (!expired) {
      expired = e.timeStamp + 400;
    } else if (e.timeStamp <= expired) {
      e.preventDefault();
      editTaskText();
      expired = null;
    } else {
      expired = e.timeStamp + 400;
    }
  }
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#x60;");
}
