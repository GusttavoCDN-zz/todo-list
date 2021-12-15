const taskText = document.getElementById('texto-tarefa');
const addTaskButton = document.getElementById('criar-tarefa');
const taskList = document.getElementById('lista-tarefas');
const clearButton = document.getElementById('apaga-tudo');
const removeCompletedTasksButton = document.getElementById('remover-finalizados');
const saveTasksButton = document.getElementById('salvar-tarefas');
const removeSelectedTasksButton = document.getElementById('remover-selecionado');
const upButton = document.getElementById('mover-cima');
const downButton = document.getElementById('mover-baixo');

function highlightTask(event) {
  const task = event.target;
  const tasks = taskList.querySelectorAll('.task');

  tasks.forEach((taskElement) => {
    taskElement.classList.remove('highlighted');
  });

  task.classList.add('highlighted');
}

function completeTask(event) {
  const task = event.target;
  task.classList.toggle('completed');

  if (task.classList.contains('completed')) {
    const span = document.createElement('span');
    span.innerText = 'done';
    span.classList.add('material-icons');

    task.appendChild(span);
  }

  if (!task.classList.contains('completed')) {
    const span = task.querySelector('span');
    span.remove();
  }
}

function addTask() {
  if (taskText.value === '') return;

  const task = document.createElement('li');
  task.innerText = taskText.value;
  task.classList.add('task');
  task.addEventListener('click', highlightTask);
  taskList.addEventListener('dblclick', completeTask);
  taskList.appendChild(task);
  taskText.value = '';
}

function testKeyDown(event) {
  if (event.key !== 'Enter') return;
  if (taskText.value === '') return;
  addTask();
}

function clearList() {
  const task = document.querySelector('.task');
  if (task === null) return;

  task.parentNode.innerHTML = '';
}

function removeCompletedTasks() {
  const completedTasks = document.querySelectorAll('.completed');

  completedTasks.forEach((task) => {
    task.remove();
  });
}

// Manipulação do WebStorage para salvar itens da lista de tarefas

function saveTasks() {
  const listElements = Array.from(taskList.children);
  const actuaList = [];
  listElements.forEach((item) => {
    actuaList.push({
      text: item.innerText.endsWith('done') ? item.innerText.slice(0, -4) : item.innerText,
      classes: item.classList,
    });
  });

  localStorage.setItem('tasks', JSON.stringify(actuaList));
}

function addTasksFromStorage(list) {
  list.forEach((listItem) => {
    const task = document.createElement('li');
    task.innerText = listItem.text;

    for (let i = 0; i < 3; i += 1) {
      if (listItem.classes[i] !== undefined && listItem.classes[i] !== 'highlighted') {
        task.classList.add(listItem.classes[i]);
      }
    }

    task.addEventListener('click', highlightTask);
    taskList.addEventListener('dblclick', completeTask);
    taskList.appendChild(task);
  });
}

function addCompleteSymbol() {
  const completedTasks = document.querySelectorAll('.completed');
  completedTasks.forEach((task) => {
    const span = document.createElement('span');
    span.innerText = '';
    span.innerText = 'done';
    span.classList.add('material-icons');

    task.appendChild(span);
  });
}

function initialRender() {
  if (localStorage.getItem('tasks') === null) {
    localStorage.setItem('tasks', JSON.stringify([]));
  } else {
    const oldTaskList = JSON.parse(localStorage.getItem('tasks'));
    addTasksFromStorage(oldTaskList);
    addCompleteSymbol();
  }
}

function removeSelectedTasks() {
  const selectedTask = document.querySelector('.highlighted');
  selectedTask.remove();
}

function moveTaskUp() {
  const selectedTask = document.querySelector('.highlighted');
  if (selectedTask === null) return;

  const previousTask = selectedTask.previousElementSibling;
  if (previousTask === null) return;

  taskList.insertBefore(selectedTask, previousTask);
}

function moveTaskDown() {
  const selectedTask = document.getElementsByClassName('highlighted')[0];
  if (selectedTask === undefined) return;

  const nextTask = selectedTask.nextElementSibling;
  if (nextTask === null) return;

  taskList.insertBefore(nextTask, selectedTask);
}

addTaskButton.addEventListener('click', addTask);
taskText.addEventListener('keydown', testKeyDown);
clearButton.addEventListener('click', clearList);
removeCompletedTasksButton.addEventListener('click', removeCompletedTasks);
saveTasksButton.addEventListener('click', saveTasks);
removeSelectedTasksButton.addEventListener('click', removeSelectedTasks);
upButton.addEventListener('click', moveTaskUp);
downButton.addEventListener('click', moveTaskDown);

window.addEventListener('load', initialRender);

