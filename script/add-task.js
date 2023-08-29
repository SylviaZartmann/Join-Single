function initAddTask(situation) {
  showHeaderTemplate().then(() => {
    CurrentlyActiveWebpage('add-task.html', 'navAddTask');
    showAddTaskTemplate().then(() => {
      theSituationIs(situation);
      clearLocalStorage();
      addAvailableCategories();
      assignToOptions();
      setMinDate();
    });
  });
}


async function showAddTaskTemplate() {
  const response = await fetch('templates/add-task.html');
  const template = await response.text();
  document.getElementById('add-task-template').innerHTML = template;
}


function addAvailableCategories() {
  emptyInnerHTML('available-categories');
  for (let i = 0; i < categories.length; i++) {
    document.getElementById('available-categories').innerHTML += `
    <lable class="input-options-contacts">
      <div class="accept-new-category">
      <div class="circle" style="background-color: ${categories[i].color}"></div>
      ${categories[i].name}
      </div>
      <input class="input-cate" onclick="displaySelectedCategories()" type="checkbox" id="category${i}" value="${i}">
      <span class="checkmark"></span>
    </lable>
    `;
  }
}


function saveNewCategory() {
  let color = document.getElementById('color-select').value;
  let category = formValidation('add-new-category', 'submitCategoryInput');
  if (category.length >= 3) {
    let newCategory = {
      name: category,
      color: color,
    };
    categories.push(newCategory);
    saveInLocalStorage('categories', categories);
    document.getElementById('add-new-category').value = '';
    addAvailableCategories();
    displaySelectedCategories();
  }
}


function assignToOptions() {
  emptyInnerHTML('assign-to');
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById('assign-to').innerHTML += `
    <lable class="input-options-contacts">
      ${contacts[i].firstName} ${contacts[i].lastName}
      <input class="input-teamMates" onclick="displaySelectedTeammates()" type="checkbox" value="${i}">
      <span class="checkmark"></span>
    </lable>
    `;
  }
}


let priorities = [];
function setAndTogglePriorities(priority, not1, not2) {
  let prioContainer = document.getElementById(priority);
  let notPrioContainer1 = document.getElementById(not1);
  let notPrioContainer2 = document.getElementById(not2);
  if (prioContainer.classList.contains(priority)) {
    prioContainer.classList.remove(priority);
    priorities = priorities.filter((item) => item !== priority);
  } else {
    prioContainer.classList.add(priority);
    notPrioContainer1.classList.remove(not1);
    notPrioContainer2.classList.remove(not2);
    priorities = [priority];
  }
}


function unsetPriorityOfTask() {
  document.getElementById('urgent').classList.remove('urgent');
  document.getElementById('medium').classList.remove('medium');
  document.getElementById('low').classList.remove('low');
}


function createTask() {
  downTheDropdown();
  let situation = currentSituation[0];
  let title = formValidation('title-input', 'submitTitleInput');
  let description = document.getElementById('description-input').value;
  let category = getCheckedCheckboxes('input-cate');
  let teammates = getCheckedCheckboxes('input-teamMates');
  let dueDate = formValidation('date-input', 'submitDateInput');
  let priority = priorities[0];
  let subtasks = JSON.parse(localStorage.getItem('subtasks'));
  let checkedSubtasks = getCheckedCheckboxes('input-subtask');
  undownTheDropdown();
  isValidInputCreateTask(situation, title, description, category, teammates, dueDate, priority, subtasks, checkedSubtasks);
}


function isValidInputCreateTask(situation, title, description, category, teammates, dueDate, priority, subtasks, checkedSubtasks) {
  if (title.length >= 3 && dueDate.length >= 3) {
    whatAndWhereToPushCreateTask(situation, title, description, category, teammates, dueDate, priority, subtasks, checkedSubtasks);
    saveInLocalStorage('todos', todos);
    localStorage.removeItem('priorities');
    currentSituation = [];
    whichWindow();
  }
}


function whatAndWhereToPushCreateTask(situation, title, description, category, teammates, dueDate, priority, subtasks, checkedSubtasks) {
  let newTask = {
    situation: situation,
    title: title,
    description: description,
    category: category,
    teammates: teammates,
    deadline: dueDate,
    priority: priority,
    subtasks: subtasks,
    checkedSubtasks: checkedSubtasks,
  };
  todos.push(newTask);
}


let currentSituation = [];
function theSituationIs(situation) {
  currentSituation.push(situation);
}


function getCheckedCheckboxes(whichInput) {
  let checkedCheckboxes = [];
  let checkedBoxes = document.querySelectorAll(`input.${whichInput}:checked`);
  checkedBoxes.forEach((checkbox) => {
    checkedCheckboxes.push(checkbox.value);
  });
  return checkedCheckboxes;
}


function displaySelectedCategories() {
  let checkedCategoryCheckboxes = getCheckedCheckboxes('input-cate');
  emptyInnerHTML('selected-categories');
  for (let i = 0; i < checkedCategoryCheckboxes.length; i++) {
    document.getElementById('selected-categories').innerHTML += `
      <div class="circle" style="background-color: ${categories[checkedCategoryCheckboxes[i]].color}"></div>
    `;
  }
}


function displaySelectedTeammates() {
  let checkedTeamCheckboxes = getCheckedCheckboxes('input-teamMates');
  emptyInnerHTML('selected-teammates');
  for (let i = 0; i < checkedTeamCheckboxes.length; i++) {
    document.getElementById('selected-teammates').innerHTML += `
      <div class="circle" style="background-color: ${contacts[checkedTeamCheckboxes[i]].color}">
        <span>${contacts[checkedTeamCheckboxes[i]].initials}</span>
      </div>
    `;
  }
}

/**
 * for calendar input for dueDate in Task, only the upcoming dates should be available
 */
function setMinDate() {
  let dateInput = document.getElementById('date-input');
  let today = new Date();
  let formattedToday = today.toISOString().split('T')[0];
  dateInput.min = formattedToday;
}


function getSubtasksFromInput() {
  let subtasks = loadStoredSubtasks();
  let subtask = formValidation('add-subtask', 'submitSubtaskInput');
  if (subtask.length >= 3) {
    let newSubtask = subtask;
    subtasks.push(newSubtask);
    saveInLocalStorage('subtasks', subtasks);
    clearInputSubtasks();
    displaySubtasks();
  }
}


function loadStoredSubtasks() {
  let storedSubtasks = JSON.parse(localStorage.getItem('subtasks'));
  if (storedSubtasks) {
    return storedSubtasks;
  } else {
    return [];
  }
}


function clearLocalStorage() {
  localStorage.removeItem('subtasks');
  localStorage.removeItem('NewSubtasksFromEdit');
  clearInputs();
  displaySelectedCategories();
  displaySelectedTeammates();
  displaySubtasks();
}


function displaySubtasks() {
  let subtasks = loadStoredSubtasks();
  emptyInnerHTML('subtask');
  for (let i = 0; i < subtasks.length; i++) {
    document.getElementById('subtask').innerHTML += `
    <div class="subtask">
      <input class="input-subtask" type="checkbox" id="subtask${i}" value="${i}">${subtasks[i]}
      <span class="checkmark"></span>
    </div>
    `;
  }
}


function closeTemplateAddTask() {
  clearLocalStorage();
  clearTextarea();
  unsetPriorityOfTask();
  rechangeButtonAddTask();
  removeMoveOverlay('add-task-overlay', 'addTask', 'bodyBoard');
}


function removeMoveOverlayTaskAdded(id, background) {
  document.getElementById(id).classList.remove('move-overlay-animation');
  document.getElementById('TaskAddedPopup').classList.remove('d-none');
  document.getElementById('TaskAddedPopup').classList.add('move-task-up');
  setTimeout(function () {
    document.getElementById(id).classList.add('close-overlay-animation');
    setTimeout(() => {
      closeOverlay(id);
      closeOverlay(background);
    }, 450);
  }, 2000);
}


function addMoveSite() {
  document.getElementById('TaskAddedPopup').classList.remove('d-none');
  document.getElementById('TaskAddedPopup').classList.add('move-task-up');
  setTimeout(function () {
    window.location.href = 'board.html';
  }, 1400);
}


/** EDIT TASK*/

function displayEditTask(i) {
  closeOverlay('taskDetail');
  addMoveOverlay('add-task-overlay', 'addTask', 'bodyBoard');
  showAddTaskTemplate().then(() => {
    addAvailableCategories();
    assignToOptions();
    fillAddTaskTemplate(i);
    changeButtonEditTask(i);
    localStorage.removeItem('NewSubtasksFromEdit');
  });
}


function fillAddTaskTemplate(i) {
  document.getElementById('title-input').value = todos[i].title;
  document.getElementById('description-input').value = todos[i].description;
  showCheckedCheckboxesEditTask(i, 'category', 'input-cate');
  showCheckedCheckboxesEditTask(i, 'teammates', 'input-teamMates');
  document.getElementById('date-input').value = todos[i].deadline;
  displayCorrectPriority(i);
  displaySubtasksEditTask(i);
  showCheckedCheckboxesEditTask(i, 'checkedSubtasks', 'input-subtask');
}


function showCheckedCheckboxesEditTask(i, arrayElement, checkboxesClass) {
  let checkedValues = todos[i][arrayElement];
  let checkboxes = document.querySelectorAll(`input.${checkboxesClass}`);
  checkboxes.forEach((checkbox) => {
    if (checkedValues.includes(checkbox.value)) {
      checkbox.checked = true;
    }
  });
}


function updateTaskData(i) {
  downTheDropdown();
  let title = formValidation('title-input', 'submitTitleInput');
  let description = document.getElementById('description-input').value;
  let category = getCheckedCheckboxes('input-cate');
  let teammates = getCheckedCheckboxes('input-teamMates');
  let dueDate = formValidation('date-input', 'submitDateInput');
  let priority = priorities[0];
  let subtasks = pushNewSubtasksIntoSubtasksArray(i);
  let checkedSubtasks = getCheckedCheckboxes('input-subtask');
  isValidInputUpdateTask(i, title, description, category, teammates, dueDate, priority, subtasks, checkedSubtasks)
  undownTheDropdown();
}


function isValidInputUpdateTask(i, title, description, category, teammates, dueDate, priority, subtasks, checkedSubtasks) {
  if (title.length >= 3 && dueDate.length >= 3) {
    whichIsWhereToPushTask(i, title, description, category, teammates, dueDate, priority, subtasks, checkedSubtasks);
    saveInLocalStorage('todos', todos);
    localStorage.removeItem('NewSubtasksFromEdit');
    priorities = [];
    NewSubtasksFromEdit = [];
    displayTasksInBoard();
    removeMoveOverlay('add-task-overlay', 'addTask', 'bodyBoard');
  }
}


function whichIsWhereToPushTask(i, title, description, category, teammates, dueDate, priority, subtasks, checkedSubtasks) {
  if (todos[i]) {
    todos[i].title = title;
    todos[i].description = description;
    todos[i].category = category;
    todos[i].teammates = teammates;
    todos[i].deadline = dueDate;
    todos[i].priority = priority;
    todos[i].subtasks = subtasks;
    todos[i].checkedSubtasks = checkedSubtasks;
  }
}


function displayCorrectPriority(i) {
  if (todos[i].priority === 'urgent') {
    checkForCorrectPriority('urgent', 'medium', 'low');
  } else if (todos[i].priority === 'medium') {
    checkForCorrectPriority('medium', 'low', 'urgent');
  } else if (todos[i].priority === 'low') {
    checkForCorrectPriority('low', 'medium', 'urgent');
  }
}


function checkForCorrectPriority(priority, not1, not2) {
  document.getElementById(priority).classList.add(priority);
  document.getElementById(not1).classList.remove(not1);
  document.getElementById(not2).classList.remove(not2);
  priorities = [priority];
}


function displaySubtasksEditTask(i) {
  if (todos[i].subtasks) {
    emptyInnerHTML('subtask');
    isThereSubtasksInEditTask(i);
  } else {
    displayNewSubtasksEditTask(i);
  }
}


function isThereSubtasksInEditTask(i) {
  for (let g = 0; g < todos[i].subtasks.length; g++) {
    document.getElementById('subtask').innerHTML += `
      <div class="subtask">
        <input class="input-subtask" type="checkbox" id="subtask${g}" value="${g}">${todos[i].subtasks[g]}
        <span class="checkmark"></span>
      </div>
    `;
  }
}


function displayNewSubtasksEditTask(i) {
  let length = todos[i].subtasks ? todos[i].subtasks.length : 0;
  emptyInnerHTML('newSubtask');
  for (let g = length; g < length + NewSubtasksFromEdit.length; g++) {
    document.getElementById('newSubtask').innerHTML += `
      <div class="subtask">
        <input class="input-subtask" type="checkbox" id="subtask${g}" value="${g}">${NewSubtasksFromEdit[g - length]}
        <span class="checkmark"></span>
      </div>
    `;
  }
}


let NewSubtasksFromEdit = [];
function getAndPushNewSubtasksFromInput(i) {
  let subtaskInput = formValidation('add-subtask', 'submitSubtaskInput');
  if (subtaskInput.length >= 3) {
    let newSubtask = subtaskInput;
    NewSubtasksFromEdit.push(newSubtask);
    saveInLocalStorage('NewSubtasksFromEdit', NewSubtasksFromEdit);
    clearInputSubtasks();
    displayNewSubtasksEditTask(i);
  }
  showCheckedCheckboxesEditTask(i, 'checkedSubtasks', 'input-subtask');
}


function pushNewSubtasksIntoSubtasksArray(i) {
  let NewSubtasksFromEdit = JSON.parse(localStorage.getItem('NewSubtasksFromEdit'));
  if (NewSubtasksFromEdit && NewSubtasksFromEdit.length > 0) {
    todos[i].subtasks = todos[i].subtasks ? [...todos[i].subtasks, ...NewSubtasksFromEdit] : [...NewSubtasksFromEdit];
    localStorage.removeItem('NewSubtasksFromEdit');
  }
  return todos[i].subtasks;
}


function getNewCategoryFromInputShowOldInput(i) {
  saveNewCategory();
  showCheckedCheckboxesEditTask(i, 'category', 'input-cate');
}


function clearAddTask() {
  clearLocalStorage();
  unsetPriorityOfTask();
  clearTextarea();
  clearInputs();
}


