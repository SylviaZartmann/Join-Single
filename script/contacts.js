/** CONTACTS NEW*/

loadContacts();

function initContacts() {
  showHeaderTemplate().then(() => {
    CurrentlyActiveWebpage('contacts.html', 'navContacts');
    generateAlphabeticStructure();
  });
}


function generateAlphabeticStructure() {
  emptyInnerHTML('sortContactListing');
  for (let i = 0; i < characters.length; i++) {
    let firstCharacter = characters[i];
    let structure = [];
    createAlphabeticStructure(structure, firstCharacter);
    isThereAStructure(i, structure, firstCharacter);
  }
}

/**
 * generating the asphabetical structure of contacts with letter header on each 
 * available first letter
 * contacts get deleted, and instead of deleting them completely theey stay behind 
 * and get overseen while generating with "continue" otherwise structure in tasks will get
 * destroied
 * @param {*} structure - HTML Code to put at exakt letter
 * @param {*} firstCharacter - letter of contacts to add in correct order
 */
function createAlphabeticStructure(structure, firstCharacter) {
  for (let j = 0; j < contacts.length; j++) {
    if (contacts[j].firstName === 'deleted') {
      continue;
    } else if (contacts[j].lastName.charAt(0) === firstCharacter) {
      let structureHTML = HTMLStructureToPush(j);
      structure.push(structureHTML);
    }
  }
}


function HTMLStructureToPush(j) {
  let structureHTML = `
  <div onclick="generateContactDetails(${j})" class="initialsSectionLeft">
    <div class="initialsLeft" style="background-color: ${contacts[j].color}">${contacts[j].initials}</div>
    <div class="contactNameLeft">
      <div class="text-overflow">${contacts[j].firstName} ${contacts[j].lastName}</div>
      <div class="taskForNameLeft">${contacts[j].email}</div>
    </div>
  </div>        
  `;
  return structureHTML;
}

/**
 * only if structure array has elements the letter category should be shown
 * @param {*} i - index of characters (letters) to be sorted after
 * @param {*} structure - array of the HTML structure which should be displayed after
 * @param {*} firstCharacter - first character of the lastname of contacts
 */
function isThereAStructure(i, structure, firstCharacter) {
  if (structure.length > 0) {
    document.getElementById('sortContactListing').innerHTML += `
        <div class="alphaGroup">
          <h2 class="letter">${firstCharacter}</h2>
          <div class="line"></div>
        </div>
        <div class="alphabet" id="alphabet${i}"></div>
        `;
    for (let k = 0; k < structure.length; k++) document.getElementById('alphabet' + i).innerHTML += structure[k];
  }
}

/**
 * generating contactdetails depending on windowwidth (responsiveness)
 * @param {*} j - index of specific contact
 */
function generateContactDetails(j) {
  if (window.innerWidth <= 820) {
    openOverlay('overlayContactDetails');
    emptyInnerHTML('responsiveContactDetails');
    generateHTMLInDefaultWindow(j, 'responsiveContactDetails');
  } else {
    emptyInnerHTML('initialsSectionRight');
    generateHTMLInDefaultWindow(j, 'initialsSectionRight');
  }
}

/**
 * generating the html of the contacts in detail
 * @param {*} j  - index of specific contact
 * @param {*} window  - depending on windowwidth the different containers to be generated in
 */
function generateHTMLInDefaultWindow(j, window) {
  document.getElementById(window).innerHTML = `
  <div class="initialsSection">
    <span class="initials" style="background-color: ${contacts[j].color}">${contacts[j].initials}</span>
    <div class="contactName">
      <h2>${contacts[j].firstName} ${contacts[j].lastName}</h2>
      <p onclick="initTemplateAddTask('todo')" class="taskForName">+ Add Task</p></a>
    </div>
  </div>
  <div class="contactInfoBoxSmallWindow">
    <div class="contactInformation">
      <p class="contactGeneral">Contact Information</p>
      <div onclick="generateInnerHTMLEditOverlay(${j})" class="contactEdit">
        <img class="editPencil" src="img/pencil-icon-edit.png">
        <p>Edit Contact</p>
      </div>
    </div>
      <p><b>Email</b></p><a href="mailto:${contacts[j].email}">${contacts[j].email}</a>
      <p><b>Phone</b></p><a href="tel:${contacts[j].phone}">${contacts[j].phone}</a>
  </div>
  `;
}


function createNewContact() {
  let name = document.getElementById('names').value;
  let email = document.getElementById('email').value;
  let phone = document.getElementById('phone').value;
  let color = randomColorGeneration();
  pushIntoArray(name, email, phone, color);
  addMoveOverlay('overlayADDContactContainer', 'overlayAdd', 'contactContainer');
}

/**
 * generates a random color for contacts circle background
 * @returns the generated color
 */
function randomColorGeneration() {
  const letters = 'ABCDEF1234567890';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}


function gettingFirstLetterOfNames(firstName, lastName) {
  let initials = firstName.charAt(0) + lastName.charAt(0);
  return initials;
}


function pushIntoArray(name, email, phone, color) {
  let isValid = validateContactInputs(name, email, phone);
  if (isValid) {
    let newContact = defineParticlesOfArray(name, email, phone, color);
    contacts.push(newContact);
    saveInLocalStorage('contacts', contacts);
    clearInputs();
    removeMoveOverlayContactAdded('overlayADDContactContainer', 'overlayAdd', 'contactContainer');
    generateAlphabeticStructure();
  }
}


function defineParticlesOfArray(name, email, phone, color) {
  let input = name.trim();
    let words = input.split(' ');
    let firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    let lastName = words[1].charAt(0).toUpperCase() + words[1].slice(1);
    let newContact = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      color: color,
      initials: gettingFirstLetterOfNames(firstName, lastName),  
    };
    return newContact;
}


function validateContactInputs(name, email, phone) {
  let isValidNames = checkNameInputValidation(name, 'errorName');
  let isValidEmail = checkMailInputValidation(email, 'errorMail');
  let isValidPhone = checkPhoneInputValidation(phone, 'errorPhone');
  return isValidNames && isValidEmail && isValidPhone;
}

/**
 * removes the overlay of contact container when added or edited
 * @param {*} id - specific index of contact
 * @param {*} background - which overlay is shown
 */
function removeMoveOverlayContactAdded(id, background) {
  document.getElementById(id).classList.remove('move-overlay-animation');
  document.getElementById(id).classList.add('close-overlay-animation');

  setTimeout(function () {
    closeOverlay(id);
    closeOverlay(background);
    document.getElementById('ContactCreatedPopup').classList.remove('d-none');
    document.getElementById('ContactCreatedPopup').classList.add('move-contactButton');
    CSSTimeoutsTransitionsAddRemoveButton();
    CSSTimeoutsTransitionsAddRemoveAnotherButton();
    CSSTimeoutsClosePopUp();
  }, 500);
}


function CSSTimeoutsTransitionsAddRemoveButton() {
  setTimeout(() => {
      document.getElementById('ContactCreatedPopup').classList.add('close-contactButton');
      document.getElementById('ContactCreatedPopup').classList.remove('move-contactButton');
    }, 1900);
}


function CSSTimeoutsTransitionsAddRemoveAnotherButton() {
  setTimeout(() => {
    document.getElementById('ContactCreatedPopup').classList.remove('close-contactButton');
  }, 4000);
}


function CSSTimeoutsClosePopUp() {
  setTimeout(() => {
    document.getElementById('ContactCreatedPopup').classList.add('d-none');
  }, 2400);
}


/** CONTACTS EDIT*/

function generateInnerHTMLEditOverlay(j) {
  addMoveOverlay('overlayEditContactContainer', 'overlayEdit', 'contactContainer');
  emptyInnerHTML('editInputs');
  document.getElementById('editInputs').innerHTML = `
    <div class="initialsSectionOverlay">
      <span class="initialsoverlay" style="background-color: ${contacts[j].color}">${contacts[j].initials}</span>
      <div class="editInputs">
        <p class="editInputsP" onclick="removeMoveOverlay('overlayEditContactContainer', 'overlayEdit', 'contactContainer')">+</p>
        <div class="formContacts">
          <input class="inputs" type="text" id="names${j}" placeholder="Name" pattern="[\w\s]+\s[\w\s]+"                        
            style="background-image: url('./img/user.png')" value="${contacts[j].firstName} ${contacts[j].lastName}">
          <span class="submitInputs submitContacts d-none" id="errorName${j}">Please insert first- AND lastname.</span>
          <input class="inputs" type="email" placeholder="e-mail" id="email${j}"
            style="background-image: url('./img/mail-icon.png')" value="${contacts[j].email}">
          <span class="submitInputs submitContacts d-none" id="errorMail${j}">Please insert a valid e-Mail address containing "@".</span>
          <input class="inputs" type="tel" placeholder="Number" id="phone${j}"
            style="background-image: url('./img/phone-icon.png')" value="${contacts[j].phone}">
          <span class="submitInputs submitContacts d-none" id="errorPhone${j}">Please insert a phone number.</span>
          <div class="createContainer">
            <button onclick="deleteContactData(${j})" class="button02">
              <p>Delete</p>
            </button>
            <button onclick="updateContactData(${j})" type="submit" class="button01" style="padding: 18px 60px 18px 60px">
              <p>Save</p>
            </button>
          </div> 
        </div>
      </div>
    </div>
  `;
}

/**
 * deleting from array and replace it with deleted contact, coz otherwise contacts in tasks could be generated wrong
 * @param {*} i - index of specific contact
 */
function deleteContactData(i) {
  contacts.splice(i, 1);
  contacts.splice(i, 0, { firstName: 'deleted', lastName: 'contact', email: 'deleted@contact', phone: '0123456789', color: '#bebebe', initials: 'DC' });
  generateAlphabeticStructure();
  saveInLocalStorage('contacts', contacts);
  closeOverlay('overlayContactDetails');
  removeMoveOverlay('overlayEditContactContainer', 'overlayEdit', 'contactContainer');
  generateContactDetails(i);
}


function updateContactData(i) {
  const nameInput = document.getElementById('names' + i).value;
  const emailInput = document.getElementById('email' + i).value;
  const numberInput = document.getElementById('phone' + i).value;
  pushUpdatedContactData(i, nameInput, emailInput, numberInput);
}


function pushUpdatedContactData(i, nameInput, emailInput, numberInput) {
  let isValid = validateEditContactInputs(i, nameInput, emailInput, numberInput);
  if (isValid) {
    let input = nameInput.trim();
    let fullName = input.split(' ');
    let firstName = fullName[0];
    let lastName = fullName[1];
    defineToPushUpdatedContactData(i, firstName, lastName, emailInput, numberInput);
  }
}


function defineToPushUpdatedContactData(i, firstName, lastName, emailInput, numberInput) {
  if (contacts[i]) {
    contacts[i].firstName = firstName;
    contacts[i].lastName = lastName;
    contacts[i].email = emailInput;
    contacts[i].phone = numberInput;
    contacts[i].initials = gettingFirstLetterOfNames(firstName, lastName);
    generateAlphabeticStructure();
    generateContactDetails(i);
    saveInLocalStorage('contacts', contacts);
    clearInputs();
    removeMoveOverlay('overlayEditContactContainer', 'overlayEdit', "contactContainer");
  }
}


function validateEditContactInputs(i, nameInput, emailInput, numberInput) {
  let isValidNames = checkNameInputValidation(nameInput, 'errorName' + i);
  let isValidEmail = checkMailInputValidation(emailInput, 'errorMail' + i);
  let isValidPhone = checkPhoneInputValidation(numberInput, 'errorPhone' + i);
  return isValidNames && isValidEmail && isValidPhone;
}


function checkNameInputValidation(inputValue, errorText) {
  let errorName = document.getElementById(errorText);
  let nameInput = inputValue.trim();
  let names = nameInput.split(' ');
  if (names.length !== 2) {
    errorName.classList.remove('d-none');
    return false;
  } else {
    errorName.classList.add('d-none');
    return true;
  }
}


function checkMailInputValidation(inputValue, errorText) {
  let errorName = document.getElementById(errorText);
  if (!inputValue.includes('@')) {
    errorName.classList.remove('d-none');
    return false;
  } else {
    errorName.classList.add('d-none');
    return true;
  }
}


function checkPhoneInputValidation (inputValue, errorText) {
  let errorName = document.getElementById(errorText);
  let numbersOnly = /^[0-9]+$/;
    if (!inputValue.match(numbersOnly)) {
      errorName.classList.remove('d-none');
      return false;
    } else {
      errorName.classList.add('d-none');
      return true;
    }
}


function loadContacts() {
  let contactsAsText = localStorage.getItem('contacts');
  if (contactsAsText) contacts = JSON.parse(contactsAsText);
}
