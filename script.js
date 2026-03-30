let tasks = []; //store all task in this array

// store kanban tasks from each column 
let kanbanTasks = {
    todo : [],
    progress : [],
    review : [],
    done: []
};

const circumference = 2 * Math.PI * 100; // r=100

let totalTime = 25 * 60;
let timeLeft = 25 * 60;
let timeRunning = false;
let timerId = null; // for interval reference


// toggle function 
function toggleTheme() {
    document.body.classList.toggle("light-mode");
}

// update display in focus-time circle 
function updateDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;

    document.querySelector(".timer-display").textContent = String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0"); // show in 25:00 format on screen.

    // circle progress update 
    const remainingTimeRatio = timeLeft / totalTime; /* this portion is to hide form 100% circular line */
    const offset = circumference * (1 - remainingTimeRatio); /* shows only remaining time in circular line */

    document.querySelector(".ring-progress").style.strokeDashoffset = offset;
}

// start and pause function 
function startPause() {
    // case handel : already 00:00
    if (timeLeft <= 0) {
        reset();
        return;
    }

    if (timeRunning) { // when pause button clicked
        clearInterval(timerId);
        timeRunning = false;
        document.querySelector("#btn-start").textContent = "Start";
        document.querySelector("#timer-label").textContent = "paused";
    }
    else { // when start button clicked
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) { //time's up
                clearInterval(timerId);
                timeRunning = false;
                document.querySelector("#btn-start").textContent = "Start";
                document.querySelector("#timer-label").textContent = "time's up!";
                playSound();
            }
        }, 1000);

        timeRunning = true;
        document.querySelector("#btn-start").textContent = "Pause";
        document.querySelector("#timer-label").textContent = "focusing..."
    }
}

// reset function 
function reset() {
    clearInterval(timerId);
    timeRunning = false;
    timeLeft = totalTime;
    document.querySelector("#btn-start").textContent = "Start";
    document.querySelector("#timer-label").textContent = "focus time";

    updateDisplay();
}

// skip function 
function skip() {
    clearInterval(timerId);
    timeRunning = false;
    timeLeft = 0;
    document.querySelector("#btn-start").textContent = "Start";
    document.querySelector("#timer-label").textContent = "session skipped!";
    updateDisplay();
    playSound();
}


// preset buttons
function setPreset(minutes, btn) {
    totalTime = minutes * 60;

    clearInterval(timerId);
    timeLeft = minutes * 60;
    timeRunning = false;
    document.querySelector("#btn-start").textContent = "Start";
    updateDisplay();


    // remove all active-preset and make only this button active
    document.querySelectorAll(".preset-btn").forEach(e => {
        e.classList.remove("active-preset");
    });
    btn.classList.add("active-preset");
}


// Claude AI
// sound play for session end 
function playSound() {
    // initialize browser sound engine
    const audio = new AudioContext();

    // create sound source with a fixed frequency
    const beep = audio.createOscillator();

    // create volume controller
    const volume = audio.createGain();

    // connect source → volume → speaker
    beep.connect(volume);
    volume.connect(audio.destination);

    // set pitch of the beep
    beep.frequency.value = 580;

    // fade out over 1.5 seconds
    volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 1.5);

    // play and stop after 1.5 seconds
    beep.start();
    beep.stop(audio.currentTime + 2.5);
}


//show sections on click
function showSection(sectionName, title, navItem) {

    // update header title 
    document.querySelector(".page-title").textContent = `${title}`;


    // hide all other sections 
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });
    // show the selected section
    document.querySelector(`#section-${sectionName}`).classList.add("active");


    // update active navItem
    document.querySelectorAll(".nav-links li").forEach(li => {
        li.classList.remove("active");
    });
    // active the selected navItem 
    navItem.classList.add("active");
}


// show all the task in browser 
function showTask() {
    let todolist = document.querySelector("#todo-list");

    // if tasks array is empty 
    if (tasks.length == 0) {
        todolist.innerHTML = `<p class="todo-emptylist">No task added yet...</p>`;
        return;
    }

    // joined all task items from `tasks` array
    todolist.innerHTML = tasks.map(task =>
        `<div class="task-item  ${task.done ? "done" : "" }  " id="task-${task.id}"  onclick="toggleTask(${task.id})">
        <span class="task-name">${task.name}</span>
        <button class="btn-delete-task" onclick="deleteTask(${task.id})">Delete</button>
        </div>`).join('');
}


// delete a task from list 
function deleteTask(taskId) {
    tasks = tasks.filter(value => value.id != taskId);
    showTask();
    saveTaskLocalStorage(); // save to localstorage
}

// add task to To-do section
function addTask() {
    const input = document.querySelector(".todo-input");
    const taskName = input.value.trim();

    // invalid input
    if (taskName == "") {
        return;
    }

    // create a new task object 
    const newTask = {
        id: Date.now(), //currentstamp time -> unique id
        name: taskName,
        done: false
    };

    tasks.push(newTask);
    input.value = "";
    showTask();
    saveTaskLocalStorage(); // save to localstorage
}


// alter active/inactive tasks 
function toggleTask(taskId){
    for(let i=0; i<tasks.length; i++)
    {
        if(taskId == tasks[i].id)
        {
            tasks[i].done = !tasks[i].done;
        }
    }
    showTask();
    saveTaskLocalStorage(); // save to localstorage
}


// save data to localstorage
function saveTaskLocalStorage(){
    localStorage.setItem("openzen-tasks", JSON.stringify(tasks) );
}

// load data from localstorage
function loadTaskLocalStorage() {
    const savedTasks = localStorage.getItem("openzen-tasks");
    // for first time it is null
    if(savedTasks != null){
        tasks = JSON.parse(savedTasks); 
        showTask();
    }
}


// sava kanban tasks data to localstorage
function saveKanbanLocalStorage(){
    localStorage.setItem("openzen-kanban-tasks", JSON.stringify(kanbanTasks));
}

// load kanban data from localstorage
function loadKanbanLocalStorage(){
    const savedKanban = localStorage.getItem("openzen-kanban-tasks");
    // for first time it will be null 
    if(savedKanban != null){
        kanbanTasks = JSON.parse(savedKanban);
        showKanbanTask("todo");
        showKanbanTask("progress");
        showKanbanTask("review");
        showKanbanTask("done");
    }
}


// show kanban tasks list
function showKanbanTask(columnId){
    const tasksDiv = document.querySelector(`#kanban-${columnId}`);

    tasksDiv.innerHTML = kanbanTasks[columnId].map(task => `<div class="kanban-task-card">${task.name}</div>`).join("");
}


// add task to Kanban column
function addKanbanTask(columnId){
    const tasksDiv = document.querySelector(`#kanban-${columnId}`);

    // create a input box 
    const input = document.createElement("input");
    input.type = "text";
    input.className = "kanban-input";
    input.placeholder = "Task name..."
    tasksDiv.appendChild(input);
    // move cursor auutomatically to inpt box 
    input.focus();

    // if Enter pressed - save the task 
    input.addEventListener("keydown", function(e){
        
        if(e.key === "Enter"){
            const taskName = input.value.trim();
            
            // if the new task is empty - ignore 
            if(taskName !== ""){
                kanbanTasks[columnId].push({
                    id : Date.now(), //unique time for all
                    name : taskName
                });
                showKanbanTask(columnId);
                saveKanbanLocalStorage(); // save to local storage, after adding newtask
            }

            // remove after adding to list
            input.remove();
        }

        // on Escape - cancel 
        if(e.key == "Escape"){
            input.remove();
        }
    });
}



updateDisplay();


// add to task list on Enter key pressed
document.querySelector(".todo-input").addEventListener("keydown", function(elem){
    if(elem.key === "Enter")
    {
        addTask();
    }
});



// for every reload of page. (Tasks are saved to loacl storage)
loadTaskLocalStorage(); 
loadKanbanLocalStorage(); 