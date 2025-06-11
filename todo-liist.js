const checkImg = 'check.png';
const lightIcon = 'sun.png';
const darkIcon = document.getElementById('icon');


const loadFromStorage = JSON.parse(localStorage.getItem('saveTodo'));

let todo = loadFromStorage || [];

const inputElement = document.getElementById('input');
const container = document.getElementById('container-todo');

renderTodo()
saveToStorage()

function saveToStorage() {
  localStorage.setItem('saveTodo', JSON.stringify(todo))

}

function updateProgress(){
  const completed = document.getElementById('sum-completed');
  const sumArray = document.getElementById('sum-array');
  const circle = document.getElementById('progress-circle')

  const completedTask = todo.filter((checked) => checked.completed).length;

  const allTodo = todo.length;

  completed.textContent = completedTask;
  sumArray.textContent = allTodo;

  let offset = 472;

  const average = Math.round(100 / allTodo * completedTask);

  let score = Math.round((average * offset) / 100);

  let range = Math.round(offset - score + 25);
  

  setInterval(() => {
    if(offset === range || offset <= 0){
      clearInterval()
    }else{
      offset-= 1;
      circle.style.strokeDashoffset = offset;
      if(completedTask === 0){
        circle.style.strokeDashoffset = 472;
      }
    }
  }, 3)

  
}

updateProgress();


function updateTheme(){

  if(localStorage.getItem('theme') === 'true'){
      document.body.classList.add('dark-theme');
      darkIcon.src = lightIcon;
      saveToStorage();

    }else{
      darkIcon.src = "moon_icon.png"; 
      document.body.classList.remove('dark-theme');
    }



  darkIcon.onclick = () => {

    document.body.classList.toggle('dark-theme');

    let isDarkMode = document.body.classList.contains('dark-theme')
    
    if(isDarkMode){
      localStorage.setItem('theme', 'true');
      isDarkMode = true;
      darkIcon.src = lightIcon;
      saveToStorage();
    }else{
      localStorage.setItem('theme', 'false');
      isDarkMode = false;
      darkIcon.src = "moon_icon.png";
      saveToStorage();
    }
  }

};

updateTheme();


function renderTodo(){
  let render = '';
  todo.forEach((value, idx) => {

  const todoId = 'todo-' + idx;

   render += `
   <label for="${todoId}">
   <div id="grid">
   <div id="render-text" ><input class="checkbox" type="checkbox" id="${todoId}" ${value.completed ? 'checked' : ''}>
   <label class="check" for="${todoId}">
      <img src="${checkImg}" width="13" height="13">
   </label>
   <div class="todo-text" >
    ${value.text}
   </div>
   <button class="delete" onclick="removeTodo(${idx})">
    x
   </button>
   </div>
   </div>
   </label>
   `;

  })
  container.innerHTML = render;
  
  todo.forEach((value, idx) => {
    const todoId = 'todo-' + idx;
    const checkboxElement = document.getElementById(todoId);
    checkboxElement.addEventListener('change', () => {
      todo[idx].completed = checkboxElement.checked;
      saveToStorage();
      renderTodo();
    });
  });
  updateProgress()
}



function addTodoKey(event){
  if(event.key === "Enter"){
    addTodo()
  }
}

function addTodo() {

  let todos = inputElement.value.trim();
  if(!todos){
   Swal.fire({
    text:'Task cannot be empty',
    icon:'error',
    confirmButtonColor: 'rgb(0, 126, 71)',
    customClass:{popup: 'custom-swal-background'}
  })
   return
  }
  const todoObject = { text: todos, completed: false, darkTheme: true};
  todo.push(todoObject);
  renderTodo()
  saveToStorage();
  inputElement.value = '';
}

function removeTodo(idx) {
  todo.splice(idx, 1);
  saveToStorage();
  renderTodo()

}