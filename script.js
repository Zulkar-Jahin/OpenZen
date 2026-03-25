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
                playSound();
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
    playSound();
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
function showSection(sectionName, title, navItem){

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



updateDisplay();