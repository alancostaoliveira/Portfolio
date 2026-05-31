const toggleTheme = document.getElementById('toggleTheme');
const rootHtml = document.documentElement;
const toggleThemeIcon = toggleTheme?.querySelector('i');
const accordionHeaders = document.querySelectorAll('.accordion__header');
const menuLinks = document.querySelectorAll(
  '.header__nav .menu__link, .nav--mobile .menu__link',
);

function syncThemeIcon() {
  if (!toggleThemeIcon) {
    return;
  }

  const currentTheme = rootHtml.getAttribute('data-theme');
  toggleThemeIcon.className =
    currentTheme === 'dark' ? 'bi bi-moon-stars' : 'bi bi-sun';
}

function changeTheme() {
  const currentTheme = rootHtml.getAttribute('data-theme');

  currentTheme === 'dark'
    ? rootHtml.setAttribute('data-theme', 'light')
    : rootHtml.setAttribute('data-theme', 'dark');

  syncThemeIcon();
}

if (toggleTheme) {
  toggleTheme.addEventListener('click', changeTheme);
}

syncThemeIcon();

accordionHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const accordionItem = header.parentElement;
    const accordionActive = accordionItem.classList.contains('active');

    accordionActive
      ? accordionItem.classList.remove('active')
      : accordionItem.classList.add('active');
  });
});

menuLinks.forEach((item) => {
  item.addEventListener('click', () => {
    menuLinks.forEach((i) => i.classList.remove('active'));
    item.classList.add('active');
  });
});
