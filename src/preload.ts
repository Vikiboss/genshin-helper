import { contextBridge, ipcRenderer } from "electron";

import { IPC_EVENTS, EXPOSED_API_FROM_ELECTRON } from "./constants";

import type { GachaData, AppInfo } from "./typings";

contextBridge.exposeInMainWorld(EXPOSED_API_FROM_ELECTRON, {
  closeApp: () => {
    ipcRenderer.send(IPC_EVENTS.closeApp);
  },
  minimizeApp: () => {
    ipcRenderer.send(IPC_EVENTS.minimizeApp);
  },
  hideApp: () => {
    ipcRenderer.send(IPC_EVENTS.hideApp);
  },
  loginViaMihoyoBBS: () => {
    ipcRenderer.send(IPC_EVENTS.loginViaMihoyoBBS);
  },
  setStoreKey: (key: string, value: any) => {
    ipcRenderer.send(IPC_EVENTS.setStoreKey, key, value);
  },
  clearCookie: (domain?: string) => {
    ipcRenderer.send(IPC_EVENTS.clearCookie, domain);
  },

  getAppInfo: (): Promise<AppInfo> => {
    return ipcRenderer.invoke(IPC_EVENTS.getAppInfo);
  },
  getStoreKey: (key: string): Promise<void> => {
    return ipcRenderer.invoke(IPC_EVENTS.getStoreKey, key);
  },
  getGachaUrl: (): Promise<string> => {
    return ipcRenderer.invoke(IPC_EVENTS.getGachaUrl);
  },
  getGachaListByUrl: (url: string): Promise<GachaData> => {
    return ipcRenderer.invoke(IPC_EVENTS.getGachaListByUrl, url);
  },
  getUserInfoByCookie: (cookie?: string) => {
    return ipcRenderer.invoke(IPC_EVENTS.getUserInfoByCookie, cookie);
  }
});