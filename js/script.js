const toggle = document.querySelector('input[type="checkbox"]');


toggle.addEventListener('change', () => {
  const theme = toggle.checked ? 'dark' : 'light';
  console.log(theme);
  document.body.setAttribute('data-theme', theme);
});