/**
 * initializes the Board page
 */
function initBoard() {
  showHeaderTemplate().then(() => {
    CurrentlyActiveWebpage('board.html', 'navBoard');
    displayTasksInBoard();
    document.getElementById('filterInput').addEventListener('keyup', filterTasks);
  });
}

/**
 * initializes the add task template with the new situation (todo, progress, awaiting, done)
 */
function initTemplateAddTask(situation) {
  addMoveOverlay('add-task-overlay', 'addTask', 'bodyBoard');
  showAddTaskTemplate().then(() => {
    theSituationIs(situation);
    addAvailableCategories();
    assignToOptions();
    changeFunctionsOnTemplateButtons();
    setMinDate();
  });
}


/**
 * displayes all tasks from localstorage in board
 */
function displayTasksInBoard() {
  cleanWorkBoardspaces();
  for (let i = 0; i < todos.length; i++) {
    isSituationSituation (i);
    displayTasksCategories(i);
    displayProgressbar(i);
    displayTasksTeammates(i);
  }
}

/** tiding up by emptying the board */
function cleanWorkBoardspaces() {
  emptyInnerHTML('todo');
  emptyInnerHTML('progress');
  emptyInnerHTML('awaiting');
  emptyInnerHTML('done');
}

/**
 * sorting array elements by their work status (situation) and generating afterwards specific HTML Code
 * @param {*} i - the arrays index
 */
function isSituationSituation (i) {
  if (todos[i].situation === 'todo') {
    generateTodoHTML(i);
  } else if (todos[i].situation === 'progress') {
    generateTodoHTML(i);
  } else if (todos[i].situation === 'awaiting') {
    generateTodoHTML(i);
  } else if (todos[i].situation === 'done') {
    generateTodoHTML(i);
  }
}

/** 
 * generates the html of tasks in board
*/
function generateTodoHTML(i) {
  document.getElementById(todos[i].situation).innerHTML += `
      <div id="task${i}" draggable="true" ondragstart="startdragging(${i})" onclick="displayTaskBoardDetail(${i})" class="BoardTask">
          <div class="TasksCategories" id="taskCategories${i}"></div>
          <div class="BoardText">
            <h4>${todos[i].title}</h4>
            <p>${todos[i].description}</p>
          </div>
          <div id="progressbar${i}" class="progressbar-container"></div>
          <div class="prio-container">
              <div id="Boardteammates${i}" class="Boardteammates"></div>
              <div id="Board-Task${i}"></div>
          </div>
      </div>`;
}

/**
 * displaying the selected categories for each task from array
 * @param {*} i - the  specific index of the task
 */
function displayTasksCategories(i) {
  emptyInnerHTML('taskCategories' + i);
  for (let j = 0; j < todos[i].category.length; j++) {
    document.getElementById('taskCategories' + i).innerHTML += `
      <div class="BoardCategory" style=background-color:${categories[todos[i].category[j]].color}>
        <p>${categories[todos[i].category[j]].name}</p>
      </div>`;
  }
}

/**
 * generates the html of the progressbar
 * @param {*} i - index of specific task
 */
function displayProgressbar(i) {
  if (todos[i].subtasks && todos[i].subtasks.length > 0) {
    emptyInnerHTML('progressbar' + i);
    document.getElementById('progressbar' + i).innerHTML += `
      <div class="progressbar">
        <div class="progressbar-progress" id="progressbar-progress${i}"></div>
      </div>
      <p id="progressbarTask"${i}>${todos[i].checkedSubtasks.length}/${todos[i].subtasks.length} Done</p>`;
    styleProgressbar(i);
    modifyPriorityIconInTask(i);
  }
}

/**
 * styling the progressbar by checked subtasks and individualizes the percentage of its width
 * @param {*} i - index of specific task
 */
function styleProgressbar(i) {
  let progresswidth = progressbarProgress(i);
  document.getElementById(`progressbar-progress` + i).style.width = progresswidth + '%';
}


/**
 * counts checked checkmarks for subtasks from array 
 * and calculates the percentage of them based on all subtasks
 * @param {*} i - index of task in array
 * @returns perCentage is % of div Container Color for Progressbar - the height to be exact
 */
function progressbarProgress(i) {
  let checkedSubtasks = todos[i].checkedSubtasks.length;
  let maxCheckboxes = todos[i].subtasks.length;
  let perCentage = (checkedSubtasks / maxCheckboxes) * 100;
  if (perCentage > 0) {
    return perCentage;
  } else {
    return 0;
  }
}

/**
 * displayes the correct image of urgency from array of this specific task
 * @param {*} i - index of specific task
 */
function modifyPriorityIconInTask(i) {
  emptyInnerHTML('Board-Task' + i);
  if (todos[i].priority === 'urgent') {
    whichImageUrgency(i, 'urgent', `<img src="img/urgent.icon2.png" alt="" />`);
  } else if (todos[i].priority === 'medium') {
    whichImageUrgency(i, 'medium', `<img src="img/urgent-icon3.png" alt="" />`);
  } else if (todos[i].priority === 'low') {
    whichImageUrgency(i, 'low', `<img src="img/urgent-icon4.png" alt="" />`);
  }
}

//...
function whichImageUrgency(i, priority, picture) {
  setBackgroundColorProgressbar(i, priority);
  document.getElementById('Board-Task' + i).innerHTML = picture;
}

/** giving the progressbar the color of the specific priority */
function setBackgroundColorProgressbar(i, urgency) {
  document.getElementById(`progressbar-progress` + i).classList.add(urgency);
}

/**
 * displayes the selectes teammates from the task
 * @param {*} i - index of specific task
 */
function displayTasksTeammates(i) {
  emptyInnerHTML('Boardteammates' + i);
  for (let k = 0; k < todos[i].teammates.length; k++) {
    document.getElementById('Boardteammates' + i).innerHTML += `
    <div title="${contacts[todos[i].teammates[k]].firstName} ${contacts[todos[i].teammates[k]].lastName}" class="BoardTaskTeammates" style=background-color:${contacts[todos[i].teammates[k]].color
      }>
      ${contacts[todos[i].teammates[k]].initials}
    </div>`;
  }
}

/**
 * generating the html of the tasks in detail after clicking on the task
 * @param {*} i - index of specific task
 */
function displayTaskBoardDetail(i) {
  openOverlay('taskDetail');
  document.getElementById('bodyBoard').classList.add('dontScoll');
  emptyInnerHTML('BoardDetail');
  document.getElementById('BoardDetail').innerHTML = `
      <div class="closingCross" onclick="closeTemplateBoardDetails()">+</div>
      <div id="BoardDetailCategory${i}" class="BoardDetailCategory"></div>
        <h1>${todos[i].title}</h1>
        <p style="font-size: 20px;">${todos[i].description}</p>
        <div class="BoardDetailDate">
          <p style="font-weight:700; font-size:21px"><b>Due date:</b></p>
          <p style="font-size:20px;">${todos[i].deadline}</p>
        </div>
        <div id="BoardDetailPrio${i}" class="BoardDetailPrio"></div>
        <div class="BoardTaskTeamTrash">
          <div class="BoardDetailTeamMates">
            <p style="font-weight:700; font-size:21px"><b>Assigned To: </b></p>
            <div class="BoardDetailTeam" id="BoardDetailTeam${i}"></div>
          </div>
          <div class="BoardDetailTrashEdit">
            <div onclick="deleteTask(${i})" class="BoardDetailTrash">
              <img src="img/deletetrashcan.png" alt="">
            </div>
            <div onclick="displayEditTask(${i})" class="BoardDetailEdit">
              <img src="img/pencil-icon-edit.png" alt="">
            </div>
          </div>
        </div> 
    </div>`;
  displayCategoriesBoardDetail(i);
  displayPriorityBoardDetail(i);
  displayTeamBoardDetail(i);
}

/**
 * generates html of the categories the seltected task contains
 * @param {*} i - index of specific task
 */
function displayCategoriesBoardDetail(i) {
  emptyInnerHTML('BoardDetailCategory' + i);
  for (let j = 0; j < todos[i].category.length; j++) {
    document.getElementById('BoardDetailCategory' + i).innerHTML += `
        <p style=background-color:${categories[todos[i].category[j]].color}>${categories[todos[i].category[j]].name}</p>`;
  }
}

/**
 * generates html of the teammates the seltected task contains
 * @param {*} i - index of specific task
 */
function displayTeamBoardDetail(i) {
  emptyInnerHTML('BoardDetailTeam' + i);
  for (let k = 0; k < todos[i].teammates.length; k++) {
    document.getElementById('BoardDetailTeam' + i).innerHTML += `
     <div class="BoardDetailTeamTask-help">
       <div class="BoardDetailTeamTask" style=background-color:${contacts[todos[i].teammates[k]].color}>
         ${contacts[todos[i].teammates[k]].initials}</div>
       <div>${contacts[todos[i].teammates[k]].firstName} ${contacts[todos[i].teammates[k]].lastName}</div>
     </div>`;
  }
}

/**
 * generates html of the prioritys the seltected task contains
 * @param {*} i - index of specific task
 */
function displayPriorityBoardDetail(i) {
  emptyInnerHTML('BoardDetailPrio' + i);
  if (todos[i].priority === 'urgent') {
    whichPriorityHTMLBoardDetail(i, 'urgent', 'Urgent', `<img src="img/urgent.icon2.png" alt=""/>`);
  } else if (todos[i].priority === 'medium') {
    whichPriorityHTMLBoardDetail(i, 'medium', 'Medium', '<img src="img/urgent-icon3.png" alt=""/>')
  } else if (todos[i].priority === 'low') {
    whichPriorityHTMLBoardDetail(i, 'low', 'Low', '<img src="img/urgent-icon4.png" alt=""/>')
  } else {
    whichPriorityHTMLBoardDetail(i, '', 'unset', '');
  }
}


function whichPriorityHTMLBoardDetail(i, urgency, Urgency, picture) {
  document.getElementById('BoardDetailPrio' + i).innerHTML = `
  <p><b>Priority: </b></p>
  <div class="BoardDetailPrioTask ${urgency}">
    ${Urgency}
    ${picture}
  </div>
  `;
}

/**
 * deleting a task and removing it from array and loacalstorage
 * @param {*} i - index of specific task
 */
function deleteTask(i) {
  todos.splice(i, 1);
  saveInLocalStorage('todos', todos);
  closeOverlay('taskDetail');
  displayTasksInBoard();
}

//...
function closeTemplateBoardDetails() {
  closeOverlay('taskDetail');
  document.getElementById('bodyBoard').classList.remove('dontScoll');
}


/** DRAG & DROP */

/**
 * defining wich task is dragged
 */
let currentlyDraggedElement;
function startdragging(id) {
  currentlyDraggedElement = id;
}

/**
 * checks the container where to drop and gives it a border
 */
function allowDrop(ev, task) {
  ev.preventDefault();
  document.getElementById('dragdrop_' + task).classList.add('border');
}

/**
 * removes the class border, when dragging over another container
 * @param {*} task - todo, progress, awaiting, done
 */
function endDrap(task) {
  document.getElementById('dragdrop_' + task).classList.remove('border');
}

/**
 * removes border, when dragging is over
 */
function endDrop() {
  const situations = ['todo', 'progress', 'awaiting', 'done'];
  for (const situation of situations) {
    const elements = document.querySelectorAll('#dragdrop_' + situation);
    elements.forEach((element) => {
      element.classList.remove('border');
    });
  }
}

/**
 * giving the dragged element a new situation after dropping it
 * @param {*} situation - todo, progress, awaiting, done
 */
function changePos(situation) {
  todos[currentlyDraggedElement]['situation'] = situation;
  saveInLocalStorage('todos', todos);
  displayTasksInBoard();
}


/** SEARCH TASKS */

/**
 * search the tasks by filter the titles and its letters and elements
 */
function filterTasks() {
  let filterValue = document.getElementById('filterInput').value.toUpperCase();
  for (let i = 0; i < todos.length; i++) {
    let taskElement = document.getElementById('task' + [i]);
    if (todos[i].title.toUpperCase().includes(filterValue)) {
      taskElement.style.display = '';
    } else {
      taskElement.style.display = 'none';
    }
  }
}

