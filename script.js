// dark mode switcher

const switcherButton = document.querySelector(".header__toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme == "dark") {
  document.body.classList.add("dark");
}

switcherButton.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  let theme = "light";

  if (document.body.classList.contains("dark")) {
    theme = "dark";
  }

  localStorage.setItem("theme", theme);
});

// to-do app

