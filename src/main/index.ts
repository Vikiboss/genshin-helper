import { app, BrowserWindow, ipcMain } from "electron";

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const isDev = !app.isPackaged;
let win: BrowserWindow;

if (require("electron-squirrel-startup")) app.quit();

const winOptions = {
  width: 970,
  height: 600,
  // frame: false,
  webPreferences: {
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
  }
};

const createWindow = () => {
  win = new BrowserWindow(winOptions);
  win.setMenuBarVisibility(false);
  if (isDev) win.webContents.openDevTools({ mode: "detach" });
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

const isWinner = app.requestSingleInstanceLock();

if (isWinner) {
  app.on("second-instance", () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });

  app.on("ready", createWindow);

  app.on("window-all-closed", () => {
    const isNotAppleDevice = process.platform !== "darwin";
    if (isNotAppleDevice) app.quit();
  });

  app.on("activate", () => {
    const noWindowExist = BrowserWindow.getAllWindows().length === 0;
    if (noWindowExist) createWindow();
  });

  ipcMain.handle("get-app-info", () => ({
    name: app.getName(),
    version: app.getVersion()
  }));
} else {
  app.quit();
}
