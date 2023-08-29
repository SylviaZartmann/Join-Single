/** LEGAL NOTICE */

function initLegalNotice() {
  showHeaderTemplate().then(() => {
    CurrentlyActiveWebpage('legal-notice.html', 'navLegalNotice');
  });
}

async function showHeaderTemplate() {
  const antwoord = await fetch('templates/header.html');
  const headertemplate = await antwoord.text();
  document.getElementById('header-template').innerHTML = headertemplate;
}


/** WEBPAGES IN GENERAL */

function emptyInnerHTML(whichID) {
  document.getElementById(whichID).innerHTML = '';
}


function saveInLocalStorage(whatToSave, whereToSave) {
  localStorage.setItem(whatToSave, JSON.stringify(whereToSave));
}


function toggleLogoutBtn(event) {
  event.stopPropagation();
  let button = document.getElementById('logout-btn');
  button.classList.toggle('d-none');
}


function hideLogoutBtn() {
  document.getElementById('logout-btn').classList.add('d-none');
}


function closeOverlay(whichContainer) {
  document.getElementById(whichContainer).style.display = 'none';
}


function openOverlay(whichContainer) {
  document.getElementById(whichContainer).style.display = 'flex';
}


function toggleVisibility(whichContainer) {
  let Container = document.getElementById(whichContainer);
  if (Container.style.display === 'none') {
    Container.style.display = 'flex';
  } else {
    Container.style.display = 'none';
  }
}


function whichWindow() {
  let currentPage = window.location.pathname.split('/').pop();
  if (currentPage !== 'contacts.html' && currentPage !== 'add-task.html') {
    displayTasksInBoard();
  }
  if (currentPage !== 'add-task.html') {
    removeMoveOverlayTaskAdded('add-task-overlay', 'addTask');
  }
  if (currentPage === 'add-task.html') {
    addMoveSite();
  }
}


function CurrentlyActiveWebpage(webpage, id) {
  let currentPage = window.location.pathname.split('/').pop();
  if (currentPage === webpage) {
    document.getElementById(id).classList.add('active-webpage');
  } else if (currentPage !== webpage) {
    document.getElementsByName('active-webpage').classList.remove('active-webpage');
  }
}


function clearInputs() {
  undownTheDropdown();
  let inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === 'text' || inputs[i].type === 'email' || inputs[i].type === 'number' || inputs[i].type === 'calender') {
      inputs[i].value = '';
    } else if (inputs[i].type === 'color') {
      inputs[i].value = randomColorGeneration();
    } else if (inputs[i].type === 'checkbox') {
      inputs[i].checked = false;
      displaySelectedCategories();
      displaySelectedTeammates();
    }
  }
}


function clearSubmit() {
  let submitInputsList = document.querySelectorAll('.submitInputs');
  submitInputsList.forEach(function (input) {
    input.classList.add('d-none');
  });
  removeMoveOverlay('overlayADDContactContainer', 'overlayAdd', 'contactContainer');
}


function clearTextarea() {
  document.getElementById('description-input').value = '';
}


function clearInputCategories() {
  document.getElementById('add-new-category').value = '';
  document.getElementById('submitCategoryInput').classList.add('d-none');
}


function clearInputSubtasks() {
  document.getElementById('add-subtask').value = '';
}

/**
 * In Overlay Add Task we close and open die Dropdowns of Contacts and Categories
 * just to make it look pretty, when opening again, aner for generating purposes
 */
function undownTheDropdown() {
  let dropDowns = ['available-categories', 'category-new-input-submit', 'assign-to'];
  dropDowns.forEach((element) => {
    let avaDropDown = document.getElementById(element);
    if (avaDropDown) closeOverlay(element);
  });
}


function downTheDropdown() {
  let dropDowns = ['available-categories', 'category-new-input-submit', 'assign-to'];
  dropDowns.forEach((element) => {
    let avaDropDown = document.getElementById(element);
    if (avaDropDown) openOverlay(element);
  });
}


function addMoveOverlay(id, background, boardID) {
  document.getElementById(id).classList.remove('close-overlay-animation');
  document.getElementById(id).classList.add('move-overlay-animation');
  document.getElementById(boardID).classList.add('dontScoll');
  openOverlay(background);
  openOverlay(id);
}


function removeMoveOverlay(id, background, boardID) {
  document.getElementById(id).classList.remove('move-overlay-animation');
  document.getElementById(id).classList.add('close-overlay-animation');
  setTimeout(() => {
    document.getElementById(boardID).classList.remove('dontScoll');
    closeOverlay(id);
    closeOverlay(background);
  }, 450);
}


function changeButtonEditTask(i) {
  openOverlay('closeXtemplate');
  document.getElementById('headerAddTask').innerHTML = 'Edit Task';
  let createButton = document.getElementById('createTask');
  let subtaskButton = document.getElementById('checkmarkSubtasks');
  let clearCancelButton = document.getElementById('clearCancelButton');
  if (createButton.hasAttribute('onclick')) {
    createButton.setAttribute('onclick', `updateTaskData(${i})`);
    createButton.innerHTML = `Save Task <img class="plus-done" src="img/done.png" alt="" />`;
    subtaskButton.setAttribute('onclick', `getAndPushNewSubtasksFromInput(${i})`);
    clearCancelButton.innerHTML = 'Cancel';
    clearCancelButton.setAttribute('onclick', `closeTemplateAddTask()`);
  }
  whatToDoWithCategoryButton(i)
  undownTheDropdown();
}


function whatToDoWithCategoryButton(i) {
  let categoryButton = document.getElementById('checkmarkCategory');
  if (categoryButton == true) {
    categoryButton.setAttribute('onclick', `getNewCategoryFromInputShowOldInput(${i})`);
  } else {
    downTheDropdown();
    categoryButton.setAttribute('onclick', `getNewCategoryFromInputShowOldInput(${i})`);
  }
}


function rechangeButtonAddTask() {
  closeOverlay('closeXtemplate');
  document.getElementById('headerAddTask').innerHTML = 'Add Task';
  let addButton = document.getElementById('createTask');
  let subtaskButton = document.getElementById('checkmarkSubtasks');
  let clearCancelButton = document.getElementById('clearCancelButton');
  if (addButton.hasAttribute('onclick')) {
    addButton.setAttribute('onclick', 'createTask()');
    addButton.innerHTML = `Create Task <img class="plus-done" src="img/done.png" alt="" />`;
    subtaskButton.setAttribute('onclick', `getSubtasksFromInput()`);
    clearCancelButton.innerHTML = 'Clear';
    clearCancelButton.setAttribute('onclick', `clearAddTask()`);
  }
  rechangeWhatHappenedToCategoryButton();
  toggleVisibility('category-new-input-submit');
}


function rechangeWhatHappenedToCategoryButton() {
  let categoryButton = document.getElementById('checkmarkCategory');
  if (categoryButton == true) {
    categoryButton.setAttribute('onclick', `saveNewCategory()`);
  } else {
    toggleVisibility('category-new-input-submit');
    categoryButton.setAttribute('onclick', `saveNewCategory()`);
  }
}


function changeFunctionsOnTemplateButtons() {
  openOverlay('closeXtemplate');
  let clearCancelButton = document.getElementById('clearCancelButton');
  if (clearCancelButton.hasAttribute('onclick')) {
    clearCancelButton.setAttribute('onclick', `closeTemplateAddTask()`);
    clearCancelButton.innerHTML = 'Cancel';
  }
}


function formValidation(whichInput, whichSubmitText) {
  let input = document.getElementById(whichInput).value;
  if (input.length >= 3) {
    document.getElementById(whichSubmitText).classList.add('d-none');
    return input;
  } else {
    document.getElementById(whichSubmitText).classList.remove('d-none');
    return input;
  }
}