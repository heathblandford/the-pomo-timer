const {
  app,
  BrowserWindow,
  Tray,
  ipcMain,
  Notification,
  Menu,
  globalShortcut
} = require("electron");
const path = require("path");

let tray = null;
let mainWin;
let newTimerWin;
// let settingsWin;

if (require("electron-squirrel-startup")) return;

app.on("ready", () => {
  const trayIcon = path.join(__dirname, "/tomato.png");
  const globalShowWindow = globalShortcut.register(
    "CommandOrControl + Alt + p",
    () => {
      mainWin.isVisible() ? mainWin.hide() : mainWin.show();
    }
  );

  if (!globalShowWindow) {
    console.log("registration failed");
  }

  // if running on windows, set the app model id to the program running
  // commented line used during development
  if (process.platform === "win32") {
    // app.setAppUserModelId("com.thepomotimer.app");
    app.setAppUserModelId(process.execPath);
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWin = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, "\\tomato256x256.png")
  });
  mainWin.loadURL(`file://${__dirname}/index.html`);

  // uncomment if you want to open dev tools
  // mainWin.webContents.openDevTools();

  //prevent closing window when X is hit
  mainWin.on("close", e => {
    if (!app.isQuiting) {
      e.preventDefault();
      mainWin.hide();
    }

    return false;
  });

  //tray menu actions
  tray = new Tray(trayIcon);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Click to Toggle the Window");

  tray.on("click", e => {
    e.preventDefault();
    mainWin.isVisible() ? mainWin.hide() : mainWin.show();
  });
});

const contextMenu = Menu.buildFromTemplate([
  {
    label: "Reset",
    click() {
      sendReset(mainWin);
    }
  },
  {
    label: "Start",
    click() {
      sendStart(mainWin);
    }
  },
  {
    label: "Quit",
    click() {
      app.isQuitting = true;
      app.exit();
    }
  }
]);

//send reset timer from tray
function sendReset(window) {
  window.webContents.send("timer:reset", "world");
}

//send start timer from tray
function sendStart(window) {
  window.webContents.send("timer:start", "hi");
}

//custom timer window
function customTimer() {
  newTimerWin = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 400,
    height: 400,
    icon: path.join(__dirname, "./tomato256x256.png")
  });

  // uncomment if you want to open dev tools
  //   newTimerWin.webContents.openDevTools();

  newTimerWin.loadURL(`file://${__dirname}/customTimer.html`);

  newTimerWin.setMenu(null);
}

//recieve customer timer from customTimer.html and send back to countdownTimer.js
//probably a better way to do this
ipcMain.on("new_timer", (e, timer) => {
  mainWin.webContents.send("new_new_timer", timer);
});

//close the custom timer window when user click ok
ipcMain.on("timer:set", e => {
  newTimerWin.close();
});

//when the timerDone signal recieved, activate notification
ipcMain.on("timer:done", (e, timerDone) => {
  let timerDoneNotification = new Notification({
    title: "The Pomodoro Timer",
    body: "Your 25 minutes is up! Take a 5 minute break. "
  });

  // if the timer is done send the notification
  if (timerDone) {
    timerDoneNotification.show();
  }

  timerDoneNotification.onclick = () => {
    console.log("notification clicked");
  };
});

const template = [
  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        role: "togglefullscreen"
      }
    ]
  },
  {
    role: "window",
    submenu: [
      {
        role: "minimize"
      },
      {
        role: "close"
      },
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+Q",
        click() {
          app.isQuitting = true;
          app.exit();
        }
      }
    ]
  },
  // {
  //   label: "Settings",
  //   accelerator: "CmdOrCtrl+,",
  //   click() {
  //     if (settingsWin == null) {
  //       settingsWindow();
  //     }
  //   }
  // },
  {
    label: "Custom Timer",
    click() {
      customTimer();
    }
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click() {
          require("electron").shell.openExternal(
            "https://github.com/heathblandford/the-pomo-timer"
          );
        }
      }
    ]
  }
];

if (process.platform === "darwin") {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        role: "about"
      },
      {
        type: "separator"
      },
      {
        role: "services",
        submenu: []
      },
      {
        type: "separator"
      },
      {
        role: "hide"
      },
      {
        role: "hideothers"
      },
      {
        role: "unhide"
      },
      {
        type: "separator"
      },
      {
        role: "quit"
      }
    ]
  });
  // Edit menu.
  template[1].submenu.push(
    {
      type: "separator"
    },
    {
      label: "Speech",
      submenu: [
        {
          role: "startspeaking"
        },
        {
          role: "stopspeaking"
        }
      ]
    }
  );
  // Window menu.
  template[3].submenu = [
    {
      label: "Close",
      accelerator: "CmdOrCtrl+W",
      role: "close"
    },
    {
      label: "Minimize",
      accelerator: "CmdOrCtrl+M",
      role: "minimize"
    },
    {
      label: "Zoom",
      role: "zoom"
    },
    {
      type: "separator"
    },
    {
      label: "Bring All to Front",
      role: "front"
    }
  ];
}
