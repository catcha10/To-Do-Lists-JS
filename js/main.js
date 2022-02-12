//selector
const categoryList = document.querySelector('[data-category-list]');
const categoryForm = document.querySelector('[data-form-category]');
const categoryInput = document.querySelector('[data-category-input]');
const deleteLists = document.querySelector('[data-delete-list]');

const taskTaskDisplayContainer = document.querySelector('[data-tasks-display-container]');
const tasksListTitle = document.querySelector('[data-tasks-title]');
const tasksListCount = document.querySelector('[data-tasks-count]');
const tasksContainer = document.querySelector('[data-tasks]');

const taskTemplate = document.getElementById('task-template');
const addTaskForm = document.querySelector('[data-new-task-form]');
const addTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleted = document.querySelector('[data-clear-completed]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_ID_KEY = 'task.selectedId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedId = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_KEY) || null;

addTaskForm.addEventListener('submit', e => {
  e.preventDefault();

  const newTaskName = addTaskInput.value;

  if ( newTaskName == null || newTaskName === '') return;

  const newTask = createTask(newTaskName);
  addTaskInput.value = null;

  const selectedLists = lists.find( list => list.id === selectedId );
  selectedLists.tasks.push(newTask);
  saveRender();
});

categoryForm.addEventListener('submit', e => {
  e.preventDefault();

  const newCategoryName = categoryInput.value;

  if ( newCategoryName == null || newCategoryName === '' )
    return;

  const newList = createList(newCategoryName);
  categoryInput.value = null;
  lists.push(newList);
  saveRender();
});

clearCompleted.addEventListener('click' , e => {
  const selectedList = lists.find( list => list.id === selectedId );
  selectedList.tasks = selectedList.tasks.filter( task => !task.complete );
  saveRender();
});

deleteLists.addEventListener('click', e => {
  lists = lists.filter(item => item.id !== selectedId);
  selectedId = null;
  saveRender();
});

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find( list => list.id === selectedId );
    const selectedTask = selectedList.tasks.find( task => task.id === e.target.id );
    selectedTask.complete = e.target.checked;
    save();
    getTaskCount(selectedList);
  }
});

categoryList.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedId = e.target.dataset.listId;
    saveRender();
  }
});

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_KEY, selectedId);
}

function render() {
  clearElement(categoryList);
  renderCategory();

  taskTaskDisplayContainer.style.display = (selectedId == null) ? 'none' : '';

  if (selectedId != null) {
    const selectedLists = lists.find(item => item.id === selectedId);
    tasksListTitle.innerText = selectedLists.name;
    getTaskCount(selectedLists);
    clearElement(tasksContainer);
    renderTasks(selectedLists);
  }
}

function getTaskCount(selectedLists) {
  const countIncompleteTasks = selectedLists.tasks.filter( task => !task.complete ).length;
  const remainingStr = countIncompleteTasks <= 1 ? 'task' : 'tasks';
  tasksListCount.innerText = `${countIncompleteTasks} ${remainingStr} remaining`;
}

function renderTasks(selectedLists) {
  selectedLists.tasks.forEach( task => {
    const taskElement = document.importNode(taskTemplate.content, true); // set true only will render nested elements.
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function createList(newElement) {
  return { id: Date.now().toString(), name: newElement, tasks: [] };
}

function createTask(newTaskName) {
  return { id: Date.now().toString(), name: newTaskName, complete: false };
}

function renderCategory() {
  lists.forEach(list => {
    const li = document.createElement('li');
    li.classList.add("list-name");
    li.innerText = list.name;
    li.dataset.listId = list.id;
    if (selectedId != null && selectedId === list.id)
      li.classList.add('active-list');
    categoryList.appendChild(li);
  });
}

function saveRender() {
  save();
  render();
}

function clearElement(elements) {
  while (elements.firstChild) {
    elements.removeChild(elements.firstChild);
  }
}

render();

