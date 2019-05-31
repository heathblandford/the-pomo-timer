const {
  app,
  BrowserWindow,
  Tray,
  ipcMain,
  Notification,
  Menu
} = require("electron");
const path = require("path");

let tray = null;
let mainWin;
let settingsWin;

if (require("electron-squirrel-startup")) return;

app.on("ready", () => {
  const trayIcon = path.join(__dirname, "/tomato.png");

  if (process.platform === "win32") {
    app.setAppUserModelId("com.thepomotimer.app");
    // app.setAppUserModelId(process.execPath);
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
        label: 'Reset',
        click(mainWin) {
            mainWin.reload();
        }
    }
])

function settingsWindow() {
  settingsWin = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 400,
    height: 400,
    icon: path.join(__dirname, "./tomato256x256.png")
  });
  settingsWin.loadURL(`file://${__dirname}/settings.html`);

  settingsWin.setMenu(null)
}

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
      }
    ]
  },
  {
    label: "Settings",
    accelerator: "CmdOrCtrl+,",
    click() {
      settingsWindow();
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
