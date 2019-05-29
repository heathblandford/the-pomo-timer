const { ipcRenderer } = require("electron");
let countdown;
const timerDisplay = document.getElementById("timerDisplay");
const startButton = document.querySelector(".start");
let timerDone = false;
let timerLength = .05; // in minutes

// const { ipcRenderer } = require("electron");

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
}

startButton.addEventListener("click", startTimer);
