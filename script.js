// dark mode switcher

const toggleThemeButton = document.querySelector(".header__toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme == "dark") {
  document.body.classList.add("dark");
}

toggleThemeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  let theme = "";

  if (document.body.classList.contains("dark")) {
    theme = "dark";
  }

  localStorage.setItem("theme", theme);
});

// to-do app

const todoItem = Array.from(document.querySelector(".todo__items-wrapper").children);

for (let elem of todoItem) {
  elem.addEventListener("click", todoItemActive);
}

function todoItemActive() {
  this.classList.toggle("todo__item-checked");
  console.log("###### New Array:", todoItem); // !! TEST
}

console.log("###### First Array:", todoItem); // !! TEST
