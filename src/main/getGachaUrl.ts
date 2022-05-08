import fs from "fs";
import path from "path";
import { app } from "electron";
import { GAME_NAME_ZH_CN, GAME_NAME_EN } from "../constants";
import { isFileExist } from "../utils/readFileSystem";

const getGachaUrl = async () => {
  const lang = app.getLocale();
  const isChinese = lang === "zh-CN";
  const localeName = isChinese ? GAME_NAME_ZH_CN : GAME_NAME_EN;
  const possibleName = isChinese ? GAME_NAME_EN : GAME_NAME_ZH_CN;
  const userPath = app.getPath("home");
  const filename = "output_log.txt";

  const getLogPath = (isLocale: boolean = true) => {
    return path.join(
      userPath,
      "AppData/LocalLow/miHoYo",
      isLocale ? localeName : possibleName,
      filename
    );
  };

  const isLocaleEdition = isFileExist(getLogPath(true));
  const isOtherEdition = isFileExist(getLogPath(false));

  if (!isLocaleEdition && !isOtherEdition) return "";

  try {
    const logPath = getLogPath(isLocaleEdition);
    const logContent = await fs.promises.readFile(logPath, { encoding: "utf-8" });
    const urlReg = /^OnGetWebViewPageFinish:(https?:\/\/.+\?.+?(#.+)?)$/gm;
    const url = urlReg.exec(logContent)[1];
    console.log(url);
    return url;
  } catch (e) {
    console.log(e);
    return "";
  }
};

export default getGachaUrl;