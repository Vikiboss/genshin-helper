import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, shell } from "electron";

const AppInfo = {
  name: app.getName(),
  version: app.getVersion()
};

import { mainWin, store } from ".";
import { isDev } from "./createMainWindow";
import { defaultData } from "./initStore";
import clearCookie from "../utils/clearCookie";
import getGachaUrl from "../utils/getGachaUrl";
import verifyCookie from "../utils/verifyCookie";
import getGachaListByUrl from "../services/getGachaListByUrl";
import updateStoreGachaList from "../utils/updateStoreGachaList";
import {
  IPC_EVENTS,
  APP_USER_AGENT_MOBILE,
  APP_USER_AGENT_DESKTOP,
  LINK_MIHOYO_BBS_LOGIN,
  SCRIPT_REFINE_BBS,
  WINDOW_BACKGROUND_COLOR
} from "../constants";

const bindIPC = (win: BrowserWindow) => {
  ipcMain.on(IPC_EVENTS.closeApp, () => app.exit(0));
  ipcMain.on(IPC_EVENTS.minimizeApp, () => win.minimize());
  ipcMain.on(IPC_EVENTS.hideApp, () => win.hide());
  ipcMain.on(IPC_EVENTS.openLink, (_, url: string) => shell.openExternal(url));
  ipcMain.on(IPC_EVENTS.setStoreKey, (_, key: string, value: any) => store.set(key, value));
  ipcMain.on(IPC_EVENTS.clearCookie, (_, domain?: string) => clearCookie(domain));

  ipcMain.on(IPC_EVENTS.loginViaMihoyoBBS, async () => {
    const bbsWin = new BrowserWindow({
      width: 400,
      height: 700,
      show: false,
      modal: true,
      parent: mainWin,
      resizable: false,
      maximizable: false,
      alwaysOnTop: true,
      fullscreenable: false,
      autoHideMenuBar: true,
      backgroundColor: WINDOW_BACKGROUND_COLOR
    });
    if (!isDev) bbsWin.removeMenu();
    bbsWin.once("ready-to-show", () => bbsWin.show());

    const dom = bbsWin.webContents;
    dom.on("did-finish-load", () => {
      try {
        dom.executeJavaScript(SCRIPT_REFINE_BBS);
      } catch (e) {
        console.log(e);
      }
    });
    dom.setWindowOpenHandler(() => ({ action: "deny" }));
    dom.setUserAgent(APP_USER_AGENT_MOBILE);
    dom.loadURL(LINK_MIHOYO_BBS_LOGIN);

    bbsWin.on("close", async () => {
      const cookies = dom.session.cookies;
      const { valid, cookie, info } = await verifyCookie(cookies);
      const user = valid
        ? {
            uid: info.game_uid,
            nickname: info.nickname,
            level: info.level,
            isOfficial: info.is_official,
            regionName: info.region_name,
            cookie: cookie
          }
        : defaultData.user;
      store.set("user", user);
      mainWin.focus();
    });
  });

  ipcMain.on(
    IPC_EVENTS.openWindow,
    async (_, url: string, options: BrowserWindowConstructorOptions = {}, UA?: string) => {
      const newWin = new BrowserWindow({
        width: 1680,
        height: 900,
        show: false,
        autoHideMenuBar: true,
        backgroundColor: WINDOW_BACKGROUND_COLOR,
        ...options
      });
      if (!isDev) newWin.removeMenu();
      newWin.once("ready-to-show", () => newWin.show());
      const dom = newWin.webContents;

      dom.setWindowOpenHandler((details) => {
        dom.loadURL(details.url);
        return { action: "deny" };
      });
      dom.on("did-finish-load", () => {
        try {
          dom.executeJavaScript(SCRIPT_REFINE_BBS);
        } catch (e) {
          console.log(e);
        }
      });
      dom.setUserAgent(UA || APP_USER_AGENT_DESKTOP);
      dom.loadURL(url);
    }
  );

  ipcMain.handle(IPC_EVENTS.getAppInfo, () => AppInfo);
  ipcMain.handle(IPC_EVENTS.getStoreKey, (_, key: string) => store.get(key));
  ipcMain.handle(IPC_EVENTS.getGachaUrl, async () => await getGachaUrl());
  ipcMain.handle(IPC_EVENTS.getGachaListByUrl, async (_, url: string) => {
    const data = await getGachaListByUrl(url);
    updateStoreGachaList(data);
    return data;
  });
};

export default bindIPC;
