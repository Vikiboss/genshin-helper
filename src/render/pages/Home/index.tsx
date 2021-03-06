import { NavigateOptions, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { AiOutlineUserSwitch, AiOutlineUserAdd } from "react-icons/ai";
import { BiNotepad, BiInfoCircle } from "react-icons/Bi";
import { FaRegMap, FaRegCompass } from "react-icons/fa";
import { HiOutlineChartPie, HiCubeTransparent } from "react-icons/hi";
import { IoMdRefresh } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountBox } from "react-icons/md";
import { MdOutlineNoteAlt } from "react-icons/md";
import { RiCalendarCheckFill } from "react-icons/ri";

import { LINK_GENSHIN_MAP } from "../../../constants";
import Button from "../../components/Button";
import nativeApi from "../../utils/nativeApi";
import useAuth from "../../hooks/useAuth";
import useNotice from "../../hooks/useNotice";
import UserCard from "./UserCard";

import type { DailyNotesData } from "../../../services/getDailyNotes";
import type { SignInfo } from "../../../services/getBBSSignInfo";
import type { GameRole } from "../../../typings";

import styles from "./index.less";
import Loading from "../../components/Loading";

const Home: React.FC = () => {
  const auth = useAuth();
  const notice = useNotice();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [heart, setHeart] = useState<NodeJS.Timer>(null);
  const [user, setUser] = useState<GameRole | null>(null);
  const [sign, setSign] = useState<SignInfo | null>(null);
  const [note, setNotesData] = useState<DailyNotesData | null>(null);
  const [hitokoto, setHitokoto] = useState<string>("loading...");

  useEffect(() => {
    (async () => {
      updateInfo(false);
      const hitokoto = await nativeApi.getHitokoto();
      setHitokoto(hitokoto);
      setHeart(setInterval(() => updateInfo(false), 60000));
    })();
    return () => {
      clearInterval(heart);
      setHeart(null);
    };
  }, []);

  const safelyNavigate = (path: string, options?: NavigateOptions) => {
    clearInterval(heart);
    setHeart(null);
    navigate(path, options);
  };

  const updateInfo = async (isUserTrriger: boolean = true) => {
    if (!auth.isLogin) return;

    if (loading && isUserTrriger) {
      return notice.warning({ message: "?????????????????????????????????????????????????????????", autoHide: false });
    }

    setLoading(true);

    if (isUserTrriger) {
      clearInterval(heart);
      setHeart(null);
      notice.info({ message: "???????????????????????????????????????...", autoHide: false });
      setHeart(setInterval(() => updateInfo(false), 60000));
    }

    try {
      const [user, note, sign] = await Promise.all([
        nativeApi.getGameRoleInfo(),
        nativeApi.getDailyNotes(),
        nativeApi.getBBSSignInfo()
      ]);

      if (!user?.game_uid || !note?.max_resin || !sign.today) {
        const currentUser = await nativeApi.getCurrentUser();
        auth.logout(currentUser.uid);
        return navigate("/login", { state: { isExpired: true } });
      }

      if (isUserTrriger) notice.success({ message: "????????????????????????" });

      setUser(user);
      setNotesData(note);
      setSign(sign);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      const isOffline = e?.message?.includes("getaddrinfo");
      const msg = isOffline ? "??????????????????????????????????????? T_T" : "???????????????????????????????????? T_T";
      notice.faild({ message: msg });
    }
  };

  const handlePageSwitch = (path: string) => {
    const noAuth =
      !auth.isLogin && !(path === "/gacha" || path === "/strategy" || path === "/daily");
    if (noAuth) return notice.warning({ message: "??????????????????????????????????????????" });
    const monthNotOpen = path === "/month" && user.level < 10;
    if (monthNotOpen) return notice.warning({ message: "?????????????????????????????????????????????10??????" });
    safelyNavigate(path);
  };

  const handleWindowOpen = (link: string) => {
    notice.success({ message: "??????????????????...", duration: 1000 });
    nativeApi.openWindow(link);
  };

  const handleAvatarClick = async () => {
    const hitokoto = await nativeApi.getHitokoto();
    const error = hitokoto.includes("?????????");
    notice[error ? "warning" : "info"]({ message: hitokoto });
  };

  const btns = [
    {
      name: "????????????",
      Icon: HiOutlineChartPie,
      handler: () => handlePageSwitch("/gacha")
    },
    {
      name: "????????????",
      Icon: BiNotepad,
      handler: () => handlePageSwitch("/daily")
    },
    {
      name: "????????????",
      Icon: FaRegCompass,
      handler: () => handlePageSwitch("/strategy")
      // handler: () => handleWindowOpen(LINK_BBS_YS_OBC)
    },
    {
      name: "???????????????",
      Icon: FaRegMap,
      handler: () => handleWindowOpen(LINK_GENSHIN_MAP)
    },
    {
      name: "???????????????",
      Icon: RiCalendarCheckFill,
      handler: () => handlePageSwitch("/sign")
    },
    {
      name: "????????????",
      Icon: MdOutlineNoteAlt,
      handler: () => handlePageSwitch("/note")
    },
    {
      name: "????????????",
      Icon: MdOutlineAccountBox,
      handler: () => handlePageSwitch("/role")
    },
    {
      name: "????????????",
      Icon: HiCubeTransparent,
      handler: () => handlePageSwitch("/statistic")
    }
  ];

  const handleCopy = (str: string, msg: string) => {
    nativeApi.writeClipboardText(str);
    notice.success({ message: msg });
  };

  // const isHomeDataLoaded = false;
  const isHomeDataLoaded = !loading && note && user && sign;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.user}>
          {auth.isLogin ? (
            isHomeDataLoaded ? (
              <UserCard
                sign={sign}
                user={user}
                note={note}
                notice={notice}
                handleAvatarClick={handleAvatarClick}
                handleCopy={handleCopy}
              />
            ) : (
              <Loading className={styles.loading} />
            )
          ) : (
            <div className={styles.noLoginContainer}>
              <div className={styles.noLoginText}>
                <span>????????????????????????????</span>
                <span>???????????? ??????????????? ????????????????????????????????????</span>
              </div>
              <Button
                text='????????????'
                size='middle'
                type='confirm'
                onClick={() => safelyNavigate("/login")}
              />
            </div>
          )}
          <div className={styles.topGreeting} onClick={handleCopy.bind(null, hitokoto, "????????????")}>
            {hitokoto}
          </div>
          <div className={styles.topBtns}>
            {auth.isLogin && (
              <>
                <div className={styles.topBtn} onClick={() => updateInfo()}>
                  <IoMdRefresh size={20} className={loading ? styles.loading : ""} />
                  <span>{loading ? "????????????" : "????????????"}</span>
                </div>
                |
              </>
            )}
            <div
              className={styles.topBtn}
              onClick={() => safelyNavigate("/login", { state: { changeAccount: auth.isLogin } })}
            >
              {auth.isLogin ? (
                <>
                  <AiOutlineUserSwitch size={20} />
                  <span>????????????</span>
                </>
              ) : (
                <>
                  <AiOutlineUserAdd size={20} />
                  <span>???????????????</span>
                </>
              )}
            </div>
            |
            <div className={styles.topBtn} onClick={() => safelyNavigate("/setting")}>
              <IoSettingsOutline size={20} />
              <span>??????</span>
            </div>
            |
            <div className={styles.topBtn} onClick={() => safelyNavigate("/about")}>
              <BiInfoCircle size={20} />
              <span>??????</span>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.btnList}>
            <div className={styles.titleZone}>
              <div className={styles.title}>
                <span>???????????????</span>
              </div>
            </div>
            {btns.length &&
              btns.map(({ name, handler, Icon }) => (
                <div className={styles.btn} onClick={handler} key={name}>
                  <Icon size={42} />
                  <span className={styles.btnText}>{name}</span>
                </div>
              ))}
          </div>
          <div className={styles.footer} onClick={() => safelyNavigate("/about")}>
            ?????????????????? ?????? MIT ??????????????????????????????
            ?????????????????????????????????????????????????????????????????????????????? ???????????? ?????????
          </div>
        </div>
      </div>
      {notice.holder}
    </>
  );
};

export default Home;
