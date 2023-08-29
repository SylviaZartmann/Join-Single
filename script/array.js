let todos = JSON.parse(localStorage.getItem('todos')) || [
  {
    situation: "todo",
    title: "World revolution",
    description: "Change the system, coz system sucks",
    category:  ['0', '1', '2', '3', '4'],
    teammates: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    deadline: "2023-10-23",
    priority: "urgent",
    subtasks: ['Deutschland', 'Island', 'Europa', 'Russland', 'China', 'Amerika'],
    checkedSubtasks: ['1']
  },
  {
    situation: "progress",
    title: "Design Marketing Concepts",
    description: "slow advertisement is better than no advertisement",
    category:  ['1'],
    teammates: ['1', '9'],
    deadline: "2023-09-26",
    priority: "low",
    subtasks: ['stakeholder', 'Need', 'Do', 'Timeline'],
    checkedSubtasks: ['0', '1']
  },
  {
    situation: "awaiting",
    title: "Less is More",
    description: "Get rid of everything you dont need to succeed",
    category:  ['1', '2', '3'],
    teammates: ['5', '6', '8'],
    deadline: "2023-11-15",
    priority: "medium",
    subtasks: ['Livingroom', 'Bedroom', 'Bathroom', 'Kitchen'],
    checkedSubtasks: ['0', '1', '2', '3']
  },
  {
    situation: "done",
    title: "Get the idea",
    description: "we wanna change something, coz something goes wrong. Im not something.",
    category:  ['0', '4'],
    teammates: ['7'],
    deadline: "2024-01-10",
    priority: "low",
    subtasks: ['think', 'act'],
    checkedSubtasks: ['0', '1']
  },
];

let contacts = [
  {
    firstName: "Albert",
    lastName: "Einstein",
    email: "1stein@web.de",
    phone: "55564564575",
    color: "#DF3A01",
    initials: "AE"
  },
  {
    firstName: "Hannelore",
    lastName: "Koschmidda",
    email: "hannekosch@web.de",
    phone: "55518578453",
    color: "#D7DF01",
    initials: "HK"
  },
  {
    firstName: "Sascha",
    lastName: "Tichy",
    email: "tichy@web.de",
    phone: "555123456457",
    color: "#8A0808",
    initials: "ST"
  },
  {
    firstName: "Sylvia",
    lastName: "Zartmann",
    email: "zartmann@web.de",
    phone: "5553464567456",
    color: "#FE2E64",
    initials: "SZ"
  },
  {
    firstName: "Walter",
    lastName: "Rathenau",
    email: "w.rathe@nau.de",
    phone: "55534547456",
    color: "#664C5F",
    initials: "WR"
  },
  {
    firstName: "Rosa",
    lastName: "Luxemburg",
    email: "Luxemburg@web.de",
    phone: "55534547456",
    color: "#BBAADD",
    initials: "RL"
  },
  {
    firstName: "Elisabeth-Maggie",
    lastName: "Phillips",
    email: "emf@web.de",
    phone: "5553457234",
    color: "#0B4590",
    initials: "EP"
  },
  {
    firstName: "Henry",
    lastName: "George",
    email: "georgists@web.de",
    phone: "55523462342",
    color: "#0B4CFF",
    initials: "HG"
  },
  {
    firstName: "Karl",
    lastName: "Marx",
    email: "marxkarl@web.de",
    phone: "555345723464",
    color: "#0BBB5F",
    initials: "KM"
  },
  {
    firstName: "Isaac",
    lastName: "Newton",
    email: "in@web.de",
    phone: "55590823473",
    color: "#0BAAAA",
    initials: "IN"
  },
];

let characters = ['A', 'Ä', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ü', 'V', 'W', 'X', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let categories = JSON.parse(localStorage.getItem('categories')) || [
  {
    name: "Design",
    color: "#FF7900"
  },
  {
    name: "Sales",
    color: "#FC71FF"
  },
  {
    name: "Backoffice",
    color: "#20D7C0"
  },
  {
    name: "Marketing",
    color: "#0038FF"
  },
  {
    name: "Other",
    color: "#c4a508",
  }
];