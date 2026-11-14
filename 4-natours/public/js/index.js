import '@babel/polyfill';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';

const loginForm = document.querySelector('.form--login');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

const mapElement = document.getElementById('map');

if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

const logoutButton = document.querySelector('.nav__el--logout');

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
