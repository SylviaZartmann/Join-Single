const STORAGE_TOKEN = 'ARYFIGWZGARDPQX4MMS91O4YD4Y4QSN3XY4QNDEK';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * An asynchronous function that sends a POST request to a predefined URL (STORAGE_URL)
 * with a payload that includes a key, a value, and a token (STORAGE_TOKEN).
 * The payload is converted into a stringified JSON object before being sent.
 * Once the server responds, the response is parsed back into JSON format and returned.
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then((res) => res.json());
}


/**
 * This asynchronous function sends a GET request to a predefined URL (STORAGE_URL),
 * with a query string that includes a key and a token (STORAGE_TOKEN).
 * The server's response is then parsed into JSON format.
 * If the server's response contains a 'data' property, the value of 'data.value' is returned.
 * If the 'data' property is not present, an error is thrown indicating that no data could be found for the provided key.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key: "${key}".`;
    });
}


/**
 * This JavaScript code snippet captures a message parameter ('msg') from the URL's query string
 * and displays it in an HTML element with the id 'msg-box'. If there's an animation applied to this element,
 * the element will be hidden after the animation ends. It's important to note that if the 'msg' parameter doesn't exist in the URL,
 * no action will be taken.
 */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
let msg_box = document.getElementById('msg-box');

if (msg) {
  msg_box.innerHTML = msg;
  msg_box.addEventListener('animationend', function () {
    this.style.display = 'none';
  });
} else {
  msg_box.style.display = 'none';
}


/**
 * This function is called upon application startup.
 * - getUsers() retrieves the list of users from the backend.
 * - checkEmailInLocalStorage() verifies if there's an email saved in local storage ("Remember me" feature) and sets up the UI accordingly.
 * - deleteAnimations() remove any initial loading animations to reveal the main UI.
 */
function init() {
  clearInputs();
  getUsers();
  checkEmailInLocalStorage();
  deleteAnimations();
}


let users = [
  {
    name: 'Guest',
    email: 'guest@web.de',
    password: 'guest123',
  },
];


/**
 * This asynchronous function retrieves the 'users' data item using the getItem() function.
 * Once it receives the data (as a Promise), it attempts to parse it from a JSON string into a JavaScript object.
 * The result is then stored in the global 'users' variable.
 * Note: This function assumes that getItem('users') will return a valid JSON string, and will throw a SyntaxError if it does not.
 */
async function getUsers() {
  users = JSON.parse(await getItem('users'));
}


/**
 * Handles the login process for a user.
 * This function first prevents the default form submission event from occurring using 'event.preventDefault()'.
 * The function then calls 'saveEmailInLocalStorage()', to save the user's entered email into local storage for future use.
 * After retrieving the values of the 'email' and 'password' input fields, it calls 'ifUserGoLogin()' function
 * with the 'email' and 'password' as parameters to handle the login process.
 */
function loginUser(event) {
  event.preventDefault();
  saveEmailInLocalStorage();

  let email = document.getElementById('log-in-email');
  let password = document.getElementById('log-in-password');
  ifUserGoLogin(email, password);
}


/**
 * Checks if the entered email and password match any user and handles the login process accordingly.
 * The function first searches the users for a user that matches both the entered email and password.
 * If such a user is found, the page is redirected to 'summary.html'.
 * and the username of the user is saved into local storage.
 * If no matching user is found, an error message is displayed.
 */
function ifUserGoLogin(email, password) {
  let user = users.find((u) => u.email === email.value && u.password === password.value);
  if (user) {
    window.location.href = 'summary.html';
    localStorage.setItem('username', user.name);
  } else {
    document.getElementById('user-not-found').classList.remove('d-none');
  }
}


/**
 * Provides a method for logging in a user as a guest.
 * This function fills the 'email' and 'password' input fields with the predefined values of 'guest@web.de' and 'guest123'.
 * After filling in these values, it redirects the page to 'summary.html'.
 * Lastly, it saves the string 'Guest' into local storage under the key 'username', presumably to identify the user as a guest throughout their session.
 */
function loginGuest() {
  document.getElementById('log-in-email').value = 'guest@web.de';
  document.getElementById('log-in-password').value = 'guest123';

  window.location.href = 'summary.html';
  localStorage.setItem('username', 'Guest');
}


/**
 * This function handles the email in the local storage of the browser.
 * It first retrieves the email entered by the user and the current checked state of a checkbox ("Remember me" feature).
 * If the checkbox is checked, the function saves the entered email in local storage with the key 'email'. This will allow the email to persist across browser sessions.
 * If the checkbox is not checked, the function removes any previously saved 'email' item from local storage. This ensures that no email is remembered when the "Remember me" feature is not used.
 */
function saveEmailInLocalStorage() {
  let password = document.getElementById('log-in-password').value;
  let email = document.getElementById('log-in-email').value;
  let checkbox = document.getElementById('login-checkbox').checked;

  if (checkbox) {
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
  } else {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
  }
}


/**
 * This function checks if there is a saved email in the browser's local storage.
 * If a saved email is found, it sets the value of the 'log-in-email' input field to the saved email
 * and checks the 'login-checkbox' checkbox, indicating that the "Remember me" feature is active.
 * This allows the user's email to be automatically filled in when the page loads, if they have previously opted to be remembered.
 */
function checkEmailInLocalStorage() {
  let savedEmail = localStorage.getItem('email');
  let savedPassword = localStorage.getItem('password');

  if (savedEmail) {
    document.getElementById('log-in-password').value = savedPassword;
    document.getElementById('log-in-email').value = savedEmail;
    document.getElementById('login-checkbox').checked = true;
  }
}


/**
 * This asynchronous function handles the process of adding a new user to the 'users' list.
 * It retrieves the name, email, and password entered by the user from the respective input fields.
 * It then creates a new user object with the entered values and pushes it to the 'users' list.
 * After adding the user, it clears the input fields using the clearInputs() function.
 * It then navigates the user to 'login.html' with a query parameter 'msg' to display a success message, indicating that the registration has been successful.
 * Finally, it uses the setItem() function (presumably an asynchronous function to store data) to update the 'users' data item in the backend by converting the 'users' list into a JSON string.
 */
async function addUser() {
  let name = document.getElementById('sign-up-name');
  let email = document.getElementById('sign-up-email');
  let password = document.getElementById('sign-up-password');
  users.push({ name: name.value, email: email.value, password: password.value });

  clearInputs();

  window.location.href = 'login.html?msg=Your registration has been successful. Welcome to our app!';
  await setItem('users', JSON.stringify(users));
}


/**
 * This function removes a CSS class from the element with the id 'login-sign-up-container'
 * after a delay of 3000 milliseconds
 * The CSS class removed is 'login-header-container-sign-up'.
 */
function deleteAnimations() {
  setTimeout(() => {
    document.getElementById('login-sign-up-container').classList.remove('login-header-container-sign-up');
  }, 3000);
}


/**
 * This function switches the view between different containers on the page.
 * It's invoked when the 'Sign up' button or 'Forgot my password' is clicked.
 * The 'd-none' class is added to hide an element and removed to show an element.
 */
function switchContainer(id1, id2, id3) {
  document.getElementById(id1).classList.add('d-none');
  document.getElementById(id2).classList.remove('d-none');
  document.getElementById(id3).classList.add('d-none');
}


/**
 * This function switches the view back to the login container from either the sign-up container or the password recovery container.
 * The 'd-none' class is removed to display an element and added to hide an element.
 */
function backToLoginContainer(id1, id2, id3) {
  document.getElementById(id1).classList.remove('d-none');
  document.getElementById(id2).classList.add('d-none');
  document.getElementById(id3).classList.remove('d-none');
}


/**
 * This function clears the values of the provided input fields.
 * It takes the 'name', 'email', and 'password' input fields as parameters and sets their values to an empty string, effectively clearing the user-entered data.
 */
function clearInputs() {
  let inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    if (
      inputs[i].type === "text" ||
      inputs[i].type === "email" ||
      inputs[i].type === "number"
    ) {
      inputs[i].value = "";
    } else if (inputs[i].type === "checkbox") {
      inputs[i].checked = false;
    }
  }
}


function hideLogoutBtn() {
  document.getElementById('logout-btn').classList.add('d-none');
}
