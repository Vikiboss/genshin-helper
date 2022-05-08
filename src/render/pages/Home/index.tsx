import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import useAlert from "../../hooks/useAlert";
import useAuth from "../../hooks/useAuth";
import nativeApi from "../../utils/nativeApi";
import icon from "../../../assets/icon.png";

import styles from "./index.less";

const Home: React.FC = () => {
  const [nickname, setNickname] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [sign, setSign] = useState<string>("");
  const [avatar, setAvatar] = useState<string>(icon);
  const { success, holder } = useAlert();
  const { isLogin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      console.log(isLogin);
      if (isLogin) {
        const user = await nativeApi.getUserInfoByCookie();
        console.log(user);
        if (!user?.uid) return;
        setNickname(user.nickname);
        setUid(user.uid);
        setSign(user.introduce);
        setAvatar(user.avatar_url);
      }
    })();
  }, [isLogin]);

  const handleLoginClick = () => {
    if (isLogin) {
      logout();
      success({ message: "您已成功退出登录" });
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.user}>
          {isLogin ? (
            <>
              <img src={avatar} alt='avatar' className={styles.avatar} />
              <div className={styles.userInfo}>
                <div>
                  昵称：<div className={styles.nickname}>{nickname || "获取中..."}</div>
                </div>
                <div>
                  签名：<div className={styles.sign}>{sign || "这个人有点懒"}</div>
                </div>
                <div>
                  BID：<div className={styles.uid}>{uid || "获取中..."}</div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noLoginContainer}>
              <div className={styles.noLoginText}>
                欢迎你，冒险者。👋
                <br />
                登录 「米游社」 账号以使用全部功能。
              </div>
              <Button text='登录米游社' size='middle' type='confirm' onClick={handleLoginClick} />
            </div>
          )}
        </div>
        <div className={styles.content}>
          <Button text='抽卡分析' noIcon onClick={() => navigate("/gacha")} />
          <Button text='设置' noIcon onClick={() => navigate("/setting")} />
        </div>
      </div>
      {holder}
    </>
  );
};

export default Home;
