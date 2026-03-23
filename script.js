console.log("script is running.");

let timeLeft = 25*60;
let timeRunning = false;
let timerId = null; // for interval reference


// update display in focus-time circle 
function updateDisplay(){
    const min = Math.floor(timeLeft/60);
    const sec = timeLeft%60 ;
    console.log(String(min).padStart(2, "0") + ":" + String(sec).padStart(2,"0"));
    document.querySelector(".timer-display").textContent = String(min).padStart(2, "0") + ":" + String(sec).padStart(2,"0"); // show in 25:00 format on screen.
}

// start and pause function 
function startPause(){
    if(timeRunning){ // when pause button clicked
        clearInterval(timerId);
        timeRunning = false;
        document.querySelector(".btn-primary").textContent = "Start";
    } 
    else{ // when start button clicked
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if(timeLeft<=0){
                clearInterval(timerId);
                timeRunning = false;
                document.querySelector(".btn-primary").textContent = "Start";
            }            
        }, 1000);

        timeRunning = true;
        document.querySelector(".btn-primary").textContent = "Pause";
    }
}


// reset function 
function reset(){
    clearInterval(timerId);
    timeRunning = false;
    timeLeft = 25 * 60;
    document.querySelector(".btn-primary").textContent = "Start";

    updateDisplay();
}


updateDisplay();