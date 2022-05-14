import { DailyNotesData } from "./typings.d";
export const APP_NAME = "原神助手";
export const EXPOSED_API_FROM_ELECTRON = "nativeApi";
export const WINDOW_BACKGROUND_COLOR = "#f9f6f2";
export const APP_USER_AGENT_MOBILE = "Mozilla/5.0 Mobile/15E148 GenshinHelper/1.0.0";
export const APP_USER_AGENT_DESKTOP = "Mozilla/5.0 GenshinHelper/1.0.0";
export const APP_USER_AGENT_BBS = "Mozilla/5.0 miHoYoBBS/2.27.1";
export const GAME_NAME_ZH_CN = "原神";
export const GAME_NAME_EN = "Genshin Impact";
export const ANNUCEMENT =
  "本软件使用 MIT 协议开源，部分内容来源于米游社，仅供学习交流使用。数据可能存在延迟，请以游戏内数据为准。";
export const WELCOME_TIP = "欢迎你，旅行者。👋";
export const LOGIN_TIP = "建议登录 「米游社」 账号以获得最佳使用体验。";

export const LOGIN_GUIDES = [
  "① 点击 「登录米游社」 按钮打开登录窗口",
  "② 在登录窗口中登录 「米游社」 账号",
  "③ 完成登录后关闭登录窗口",
  "④ 点击 「刷新状态」 按钮完成登录"
];

export const DOMAIN_MIHOYO = "mihoyo.com";

export const LINK_BBS_REFERER = "https://webstatic.mihoyo.com";
export const LINK_GITHUB_REPO = "https://github.com/vikiboss/genshin-helper";
export const LINK_MIHOYO_BBS_LOGIN = "https://m.bbs.mihoyo.com/ys/#/login";
export const LINK_GENSHIN_MAP = `${LINK_BBS_REFERER}/ys/app/interactive-map`;
export const LINK_BBS_YS_OBC = "https://bbs.mihoyo.com/ys/obc/";

export const API_BBS_BASE = "https://api-takumi.mihoyo.com/binding/api";
export const API_RECORD_BASE = "https://api-takumi-record.mihoyo.com/game_record/app";
export const API_HK4E_BASE = "https://hk4e-api.mihoyo.com";
export const API_GACHA_BASE = `${API_HK4E_BASE}/event/gacha_info/api`;

export const MAIN_WINDOW_WIDTH = 970;
export const MAIN_WINDOW_HEIGHT = 600;

export const MENU: Record<string, string> = {
  alwaysOnTop: "置顶显示",
  open: "打开助手",
  openDevTools: "DevTools",
  quit: "退出"
};

export const GACHA_TYPES: Record<string, string> = {
  "301": "角色活动祈愿",
  "302": "武器活动祈愿",
  "200": "常驻祈愿",
  "100": "新手祈愿"
};

export const IPC_EVENTS: Record<string, string> = {
  clearCookie: "CLEAR_COOKIE",
  closeApp: "CLOSE_APP",
  openLink: "OPEN_LINK",
  openWindow: "OPEN_WINDOW",
  getAppInfo: "GET_APP_INFO",
  getGachaUrl: "GET_GACHA_URL",
  getStoreKey: "GET_STORE_KEY",
  getGachaListByUrl: "GET_GACHA_LIST_BY_URL",
  getDailyNotes: "GET_DAILY_NOTES",
  refreshUserInfo: "REFRESH_USER_INFO",
  hideApp: "HIDE_APP",
  loginViaMihoyoBBS: "LOGIN_VIA_MIHOYO_BBS",
  minimizeApp: "MONIMIZE_APP",
  setStoreKey: "SET_STORE_KEY"
};

export const defaultNotes: DailyNotesData = {
  current_resin: 160,
  max_resin: 160,
  resin_recovery_time: "0",
  finished_task_num: 0,
  total_task_num: 4,
  is_extra_task_reward_received: false,
  remain_resin_discount_num: 3,
  resin_discount_num_limit: 3,
  current_expedition_num: 0,
  max_expedition_num: 5,
  expeditions: [],
  current_home_coin: 900,
  max_home_coin: 900,
  home_coin_recovery_time: "0",
  transformer: {
    obtained: false,
    recovery_time: { Day: 0, Hour: 0, Minute: 0, Second: 0, reached: true }
  }
};

export const SCRIPT_REFINE_BBS = `
var items = ["mhy-bbs-app-header", "mhy-button", "header-bar", "bbs-qr"];
for (const item of items) {
  const els = document.getElementsByClassName(item);
  if (els.length) Array.from(els).forEach((e) => (e.style.display = "none"));
}
`;
