// dark mode switcher

const themeButton = document.querySelector(".header__toggle")
const themeCurrent = localStorage.getItem("theme")

if (themeCurrent == "dark") {
  document.body.classList.add("dark")
}

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark")
  let theme = ""

  if (document.body.classList.contains("dark")) {
    theme = "dark"
  }

  localStorage.setItem("theme", theme);
})

// to-do app

const todoInputForm = document.querySelector(".todo__new-form"),
      todoInput = document.querySelector(".todo__new-input"),
      taskRemoveBtn = document.querySelector(".todo__item-delete"),
      todoItemsContainer = document.querySelector(".todo__items-wrapper"),
      allBtn = document.querySelector(".button-all"),
      filterBtns = document.querySelectorAll(".filter-button"),
      activeBtn = document.querySelector(".button-active"),
      completedBtn = document.querySelector(".button-completed"),
      todoCountNumber = document.querySelector(".items__count-number"),
      clearCompletedBtn = document.querySelector(".button-clear")

const fromLocalStorage = JSON.parse(localStorage.getItem("todoData"));

let data = fromLocalStorage || [];
let dragSrcEl;


function showTodoCount() {
  const todoCount = localStorage.getItem("todoCountNumber");

  if (todoCount <= 1) {
    todoCountNumber.textContent = `${todoCount} item`;
  } else {
    todoCountNumber.textContent = `${todoCount} items`;
  }
}

function generateTaskMarkup(id, desc, isCompleted = "false") {
  return `
    <div class="todo__item ${isCompleted === "true" ? "todo__item-checked" : ""}"
      draggable="true" id="${id}"
      data-complete="${isCompleted}">
      <input
        type="checkbox"
        name="complete"
        class="todo__item-checkbox"
        ${isCompleted === "true" ? "checked" : ""}
      />
      <div class="todo__text">
        ${desc}
      </div>
      <button class="todo__item-delete" aria-label="Delete todo item"></button>
    </div>
  `;
}

(function () {
  if (data.length === 0) return;

  todoItemsContainer.innerHTML = "";

  data.forEach((task) => {
    const markup = generateTaskMarkup(task.id, task.desc, task.isCompleted);
    todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  });

  showTodoCount();
})();

function storeTodo() {
  localStorage.setItem("todoData", JSON.stringify(data));
  const todoCountNumber = data.filter((task) => task.isCompleted === "false").length;
  localStorage.setItem("todoCountNumber", todoCountNumber);
}

function dragStartHandler(e) {
  let sourceItem = e.target.closest(".todo__item");
  const theme = localStorage.getItem("theme");
  sourceItem.style.background = theme == "dark" ? "hsl(237, 14%, 26%)" : "hsl(236, 33%, 92%)";

  e.dataTransfer.setData("itemId", sourceItem.id);
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", sourceItem.innerHTML);

  dragSrcEl = sourceItem;
}

function dragOverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  let targetItem = e.target.closest(".todo__item");
  const theme = localStorage.getItem("theme");
  targetItem.style.background = theme == "dark" ? "hsl(237, 14%, 26%)" : "hsl(236, 33%, 92%)";

  return false;
}

function dragLeaveHandler(e) {
  let targetItem = e.target.closest(".todo__item");
  if (targetItem === dragSrcEl) return;

  targetItem.style.background = "";
}

function dropHandler(e) {
  let targetItem = e.target.closest(".todo__item");
  let id = e.dataTransfer.getData("itemId");
  let sourceItem = document.getElementById(id);

  if (dragSrcEl.innerHTML !== targetItem.innerHTML) {
    const srcAttributes = [...sourceItem.attributes].map((attr) => ({
      name: attr.name,
      value: attr.value,
    }));

    const targetAttributes = [...targetItem.attributes].map((attr) => ({
      name: attr.name,
      value: attr.value,
    }));

    const srcTargetIndices = [];

    data.filter((task, index) => {
      if (task.id === Number(targetItem.id) || task.id === Number(dragSrcEl.id)) {
        srcTargetIndices.push(index);
        return true;
      }
    });

    // Swapping todo in data array
    [data[srcTargetIndices[0]], data[srcTargetIndices[1]]] = [
      data[srcTargetIndices[1]],
      data[srcTargetIndices[0]],
    ];

    dragSrcEl.innerHTML = targetItem.innerHTML;
    targetItem.innerHTML = e.dataTransfer.getData("text/html");

    // Swap the attributes of todo
    targetAttributes.forEach((attr) =>
      sourceItem.setAttribute(attr.name, attr.value)
    );
    srcAttributes.forEach((attr) =>
      targetItem.setAttribute(attr.name, attr.value)
    );
  }
  targetItem.style.background = "";
  sourceItem.style.background = "";

  storeTodo();
}

function dragEndHandler(e) {
  document
    .querySelectorAll(".todo__item")
    .forEach((todoItem) => (todoItem.style.background = ""));
}

const dragDropHandlers = [
  dragStartHandler,
  dragOverHandler,
  dragLeaveHandler,
  dropHandler,
  dragEndHandler,
];

["dragstart", "dragover", "dragleave", "drop"].forEach((event, ind) => {
  todoItemsContainer.addEventListener(event, dragDropHandlers[ind]);
});

todoInputForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = {
    id: new Date().getTime(),
    desc: todoInput.value,
    isCompleted: "false",
  };

  if (task.desc === "") return;

  const markup = generateTaskMarkup(task.id, task.desc);

  data.push(task);

  if (todoItemsContainer.firstElementChild?.className === "message")
    todoItemsContainer.innerHTML = "";

  todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  todoInput.value = "";

  storeTodo();
  showTodoCount();
});

completedBtn.addEventListener("click", (e) => {
  let completedTasks = data.filter((task) => {
    return task.isCompleted === "true";
  });

  filterBtns.forEach((button) => {
    button.classList.remove("filter-button__active");
  });

  e.target.classList.add("filter-button__active");

  todoItemsContainer.innerHTML = "";

  if (completedTasks.length === 0) {
    todoItemsContainer.innerHTML = `<div class="todo__item todo__item-empty">Todo list is empty!</div>`;
  }

  completedTasks.forEach((task) => {
    const markup = generateTaskMarkup(task.id, task.desc, task.isCompleted);
    todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
});

activeBtn.addEventListener("click", (e) => {
  let incompletedTasks = data.filter((task) => {
    return task.isCompleted === "false";
  });

  filterBtns.forEach((btn) => {
    btn.classList.remove("filter-button__active");
  });

  e.target.classList.add("filter-button__active");

  todoItemsContainer.innerHTML = "";

  if (incompletedTasks.length === 0) {
    todoItemsContainer.innerHTML = `<div class="todo__item todo__item-empty">Todo list is empty!</div>`;
  }

  incompletedTasks.forEach((task) => {
    const markup = generateTaskMarkup(task.id, task.desc, task.isCompleted);
    todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
});

allBtn.addEventListener("click", (e) => {
  filterBtns.forEach((btn) => {
    btn.classList.remove("filter-button__active");
  });

  e.target.classList.add("filter-button__active");

  todoItemsContainer.innerHTML = "";

  if (data.length === 0) {
    todoItemsContainer.innerHTML = `<div class="todo__item todo__item-empty">Todo list is empty!</div>`;
  }

  data.forEach((task) => {
    const markup = generateTaskMarkup(task.id, task.desc, task.isCompleted);
    todoItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
});

clearCompletedBtn.addEventListener("click", () => {
  const completedTasks = data.filter((task) => task.isCompleted === "true");

  completedTasks.forEach((completedTask) => {
    todoItemsContainer.removeChild(
      document.getElementById(completedTask.id)
    );
  });

  if (!todoItemsContainer.children.length)
    todoItemsContainer.innerHTML = `<div class="todo__item todo__item-empty">Todo list is empty!</div>`;

  data = data.filter((task) => task.isCompleted === "false");

  storeTodo();
});

todoItemsContainer.addEventListener("click", (e) => {
  const checkBox = "todo__item-checkbox";
  const taskDelBtn = "todo__item-delete";

  let clickedEl =
    e.target.closest(`.${checkBox}`) || e.target.closest(`.${taskDelBtn}`);

  if (!clickedEl) return;

  const taskClicked = clickedEl.closest(".todo__item");

  if (clickedEl.classList.contains(checkBox)) {
    if (!clickedEl.hasAttribute("checked")) {
      taskClicked.classList.add("todo__item-checked");
      taskClicked.dataset.complete = "true";
      clickedEl.setAttribute("checked", "");

      data = data.map((task) => {
        if (task.id === Number(taskClicked.id)) {
          return {
            id: task.id,
            desc: task.desc,
            isCompleted: "true",
          };
        } else return task;
      });
    } else {
      taskClicked.classList.remove("todo__item-checked");
      taskClicked.dataset.complete = "false";
      clickedEl.removeAttribute("checked");

      data = data.map((task) => {
        if (task.id === Number(taskClicked.id)) {
          return {
            id: task.id,
            desc: task.desc,
            isCompleted: "false",
          };
        } else return task;
      });
    }
  } else {
    taskClicked.parentElement.removeChild(taskClicked);

    if (!todoItemsContainer.children.length)
      todoItemsContainer.innerHTML = `<li class="message">Tasks list is empty!</li>`;

    data = data.filter((task) => task.id !== Number(taskClicked.id));
  }

  storeTodo();
  showTodoCount();
});
