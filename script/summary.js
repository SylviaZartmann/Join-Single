/**
 * Initializes the user session when the page is loaded.
 * This function first retrieves the username stored in local storage under the key 'username'.
 * Once the username is retrieved, it calls the 'greetUser' function with this username as an argument.
 */
function init() {
  showHeaderTemplate().then(() => {
    CurrentlyActiveWebpage('summary.html', 'navSummary');
    let username = localStorage.getItem("username");
    greetUser(username);
    updateTaskNumbers();
    actualDate();
    date();
  });
}

/**
 * Displays a greeting to the user.
 * This function changes the innerHTML of the HTML element with the ID 'greet-user' to the provided name.
 * This results in a visible greeting on the webpage that includes the user's name.
 */
function greetUser(name) {
  document.getElementById("greet-user").innerHTML = name;
}

/**
 * gets and displays the amount of tasks of 4 different categories
 */
function updateTaskNumbers() {
  document.getElementById("tasks-in-board").innerHTML = todos.length;
  const situations = ["todo", "progress", "awaiting", "done"];
  for (const situation of situations) {
    const count = todos.filter((t) => t["situation"] === situation).length;
    const element = document.getElementById(`${situation}-count`);
    if (element) {
      element.innerHTML = count;
    }
  }
  getUrgentTasks();
}

function getUrgentTasks() {
  let urgents = [];
  let urgencies = document.getElementById('urgentTasks');
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].priority === "urgent") {
      urgents.push(todos[i].priority)
    }
  }
  urgencies.innerHTML = urgents.length;
}

/**
 * defines at what time which greeting is displayed
 */
let today = new Date();
let curHr = today.getHours();

if (curHr < 4) {
  greeting = "Get some sleep!";
} else if (curHr < 12) {
  greeting = "Good Morning";
} else if (curHr < 13) {
  greeting = "LUNCH BREAK!!!";
} else if (curHr < 18) {
  greeting = "Good Afternoon";
} else {
  greeting = "Good Evening";
}


/**
 * displays previously defined greetings
 */
function date() {
  let today = document.getElementById("greeting");
  today.innerHTML = greeting;
}

function actualDate() {
  let todayDate = document.getElementById("todays-date");
  let options = { month: "long", day: "numeric", year: "numeric" };
  let allDates = gettingAllAvailableDates();
  let closestDate = checkDistancesOfDates(allDates);
  todayDate.innerHTML = closestDate.toLocaleDateString("en-EN", options);
}

function gettingAllAvailableDates() {
  let allDates = [];
  for (let i = 0; i < todos.length; i++) {
    allDates.push(new Date(todos[i].deadline));
    return allDates;
  }
}

/**
 * checks all dates in all tasks we got previously and compares with current Date
 * to get the smallest distance between both, so we can set it up on summary
 */
function checkDistancesOfDates(allDates) {
  let today = new Date();
  let smallestDistance = Infinity;
  for (let i = 0; i < allDates.length; i++) {
    let date = allDates[i];
    let distance = Math.abs(today - date);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestDate = date;
      return closestDate;
    }
  }
}
