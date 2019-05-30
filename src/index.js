const { app, BrowserWindow, Tray, ipcMain, Notification } = require("electron");
const path = require("path");

let tray = null;
let mainWin;
// let cycles = 0;


if (require('electron-squirrel-startup')) return;

app.on("ready", () => {
  const trayIcon = path.join(__dirname, "/tomato.png");

  if (process.platform === 'win32') {
    app.setAppUserModelId("com.thepomotimer.app");
    // app.setAppUserModelId(process.execPath);
  }

  mainWin = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, "\\tomato256x256.png")
  });
  mainWin.loadURL(`file://${__dirname}/index.html`);

  tray = new Tray(trayIcon);
  tray.setToolTip("Click to Open");

  tray.on("click", e => {
    e.preventDefault();
    mainWin.isVisible() ? mainWin.hide() : mainWin.show();
  });
});


ipcMain.on("timer:done", (e, timerDone) => {
  //if timer done = true send notification
  let n = new Notification({
    title: "The Pomodoro Timer",
    body: "Your 25 minutes is up! Take a 5 minute break. "
  });

  if (timerDone) {
    n.show();
  }
});
