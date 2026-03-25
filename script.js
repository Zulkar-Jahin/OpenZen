const circumference = 2 * Math.PI *  100; // r=100

let totalTime = 25*60;
let timeLeft = 25*60;
let timeRunning = false;
let timerId = null; // for interval reference


// update display in focus-time circle 
function updateDisplay(){
    const min = Math.floor(timeLeft/60);
    const sec = timeLeft%60;
    
    document.querySelector(".timer-display").textContent = String(min).padStart(2, "0") + ":" + String(sec).padStart(2,"0"); // show in 25:00 format on screen.

    // circle progress update 
    const remainingTimeRatio = timeLeft/totalTime; /* this portion is to hide form 100% circular line */
    const offset = circumference * (1-remainingTimeRatio); /* shows only remaining time in circular line */
    
    document.querySelector(".ring-progress").style.strokeDashoffset = offset;
}

// start and pause function 
function startPause(){
    // case handel : already 00:00
    if(timeLeft<=0) 
    {
        reset();
        return;
    }

    
    if(timeRunning){ // when pause button clicked
        clearInterval(timerId);
        timeRunning = false;
        document.querySelector("#btn-start").textContent = "Start";
    } 
    else{ // when start button clicked
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if(timeLeft<=0){
                clearInterval(timerId);
                timeRunning = false;
                document.querySelector("#btn-start").textContent = "Start";
            }            
        }, 1000);

        timeRunning = true;
        document.querySelector("#btn-start").textContent = "Pause";
    }
}

// reset function 
function reset(){
    clearInterval(timerId);
    timeRunning = false;
    timeLeft = totalTime;
    document.querySelector("#btn-start").textContent = "Start";

    updateDisplay();
}

// skip function 
function skip(){
    clearInterval(timerId);
    timeRunning = false;
    timeLeft = 0;
    document.querySelector("#btn-start").textContent = "Start";
    updateDisplay();
}


// preset buttons
function setPreset(minutes, btn){
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

updateDisplay();