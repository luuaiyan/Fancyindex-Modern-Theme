const savedTheme = localStorage.getItem('theme');

const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
  document.documentElement.setAttribute('data-theme', 'light');
}