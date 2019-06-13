const { ipcRenderer } = require("electron");
let countdown;
const timerDisplay = document.getElementById("timerDisplay");
const startButton = document.querySelector(".start");
let timerDone = false;
let timerLength = 25; // default, in minutes

// let newTimerLength = timerDisplay.innerHTML;

ipcRenderer.on('new_new_timer', (e, yeetTimer) => {
  if(yeetTimer >= 1){
    timerDisplay.innerText = `${yeetTimer}:00`;
  } else if (yeetTimer <1 && yeetTimer >=0.17){
    timerDisplay.innerText = `00:${Math.floor(yeetTimer * 60)}`;
  } else if (yeetTimer < 0.17){
    timerDisplay.innerText = `00:0${Math.floor(yeetTimer * 60)}`;
  }
    timerLength = yeetTimer;
})

function timer(seconds) {
  // clear timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      timerDone = true;
      ipcRenderer.send("timer:done", timerDone);
      return;
    }

    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;
  timerDisplay.innerText = display;
}

function startTimer() {
  const seconds = timerLength * 60; //takes timer length in minutes and makes it seconds
  timer(seconds);
}

function reset() {
  clearInterval(countdown);
  timerDisplay.innerText = "25:00";
  timerDone = false;
  timerLength = 25;
}

startButton.addEventListener("click", startTimer);

ipcRenderer.on("timer:reset", () => {
  reset();
});

ipcRenderer.on("timer:start", () => {
  startTimer();
});
