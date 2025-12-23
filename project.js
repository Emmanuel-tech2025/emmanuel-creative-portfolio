// Toggle mobile menu
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  navLinks.classList.remove("hide")
});

  document.getElementById("main").addEventListener("click", ()=> {
    navLinks.classList.add("hide");
    navLinks.classList.remove("show")
  });

  navLinks.addEventListener("click", ()=> {
    navLinks.classList.add("hide");
    navLinks.classList.remove("show");
  })
