function toggleMenu() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('expanded');
}

function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = event.currentTarget;
  dropdown.classList.toggle('active');

  document.querySelectorAll('.dropdown').forEach(el => {
    if (el !== dropdown) el.classList.remove('active');
  });
}

document.body.addEventListener('click', () => {
  document.querySelectorAll('.dropdown').forEach(el => el.classList.remove('active'));
});