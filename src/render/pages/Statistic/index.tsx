import React, { useEffect, useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import CircleButton from "../../components/CircleButton";
import GameStatsTab from "./GameStatsTab";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import nativeApi from "../../utils/nativeApi";
import RolesTab from "./RolesTab";
import SelectButton from "../../components/SelectButton";
import SpiralAbyssTab from "./SpiralAbyssTab";
import styles from "./index.less";
import useNotice from "../../hooks/useNotice";
import withAuth from "../../auth/withAuth";

import type { GameRoleCardData } from "../../../services/getGameRoleCard";
import type { Role as RoleInfo } from "../../../services/getOwnedRoleList";
import type { SpiralAbyssData } from "../../../services/getSpiralAbyss";

export type TypeState = "statistic" | "roles" | "abyss";
export type GameRoleCardState = GameRoleCardData & { uid: string };
export type SpiralAbyssState = SpiralAbyssData & { uid: string; role: GameRoleCardData["role"] };
export type RolesState = {
  list: RoleInfo[];
  uid: string;
  role: GameRoleCardData["role"];
};

const Statistic: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  const [uid, setUid] = useState<string>("");
  const [isSelf, setIsSelf] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const [type, setType] = useState<TypeState>("statistic");
  // const [type, setType] = useState<TypeState>("roles");

  const [rolesDate, setRolesData] = useState<RolesState>();
  const [gameStatsData, setGameStatsData] = useState<GameRoleCardState>();
  const [spiralAbyssData, setSpiralAbyssData] = useState<SpiralAbyssState>();

  useEffect(() => {
    (async () => await updateInfo())();
  }, []);

  const updateInfo = async (uid?: string) => {
    try {
      const user = await nativeApi.getCurrentUser();
      uid = uid || user.uid;
      const [card, roles, abyss] = await Promise.all([
        nativeApi.getGameRoleCard(uid),
        nativeApi.getOwnedRoleList(uid),
        nativeApi.getSpiralAbyss(uid)
      ]);
      const isOK = card?.role?.nickname && roles[0]?.id && abyss?.schedule_id;
     
      if (!isOK) return false;
     
      setIsSelf(uid === "" || uid === user.uid);
      setLoading(false);
      setGameStatsData({ ...card, uid });
      setRolesData({ list: roles, uid, role: card.role });
      setSpiralAbyssData({ ...abyss, uid, role: card.role });
      
      console.log(card, roles, abyss);
      return true;
    } catch (e) {
      console.log(e);
      
      const isOffline = e?.message?.includes("getaddrinfo");
      const msg = isOffline ? "??????????????????????????????????????? T_T" : "???????????????????????????????????? T_T";
      
      notice.faild({ message: msg });
    }
  };

  const handleQuery = async () => {
    if (!uid) {
      const text = (await nativeApi.readClipboardText()).replace(/\s/g, "").trim();
      if (text) {
        if (text.match(/^[1-9][0-9]{7,9}$/)) {
          setUid(text.trim());
        } else {
          notice.warning({ message: "???????????????????????????????????? UID" });
        }
      } else {
        notice.warning({ message: "?????????????????????" });
      }
    } else {
      if (uid.match(/^[1-9][0-9]{7,9}$/)) {
        setLoading(true);
        notice.info({ message: "????????????????????????...", autoHide: false });
        const isOK = await updateInfo(uid);
        if (!isOK) {
          notice.faild({ message: "?????? UID ??????????????????????????????????????????????????????" });
        } else {
          notice.success({ message: "??????????????????" });
        }
        setLoading(false);
      } else {
        notice.warning({ message: "????????? UID ??????????????????" });
      }
    }
  };

  const items: { label: string; value: TypeState }[] = [
    { label: "????????????", value: "statistic" },
    { label: "????????????", value: "roles" },
    { label: "????????????", value: "abyss" }
  ];

  const handleMyStatistic = async () => {
    setIsSelf(true);
    setLoading(true);
    await updateInfo();
    setLoading(false);
  };

  return (
    <>
      <div className={styles.container}>
        {gameStatsData && spiralAbyssData ? (
          <>
            <div className={styles.top}>
              {!isSelf && (
                <Button className={styles.btn} text='??????????????????' onClick={handleMyStatistic} />
              )}
              <SelectButton items={items} value={type} changeItem={setType} />
              <div className={styles.inputArea}>
                <Input
                  value={uid}
                  onChange={(e) => setUid(e.target.value.slice(0, 11))}
                  autoFocus
                  type='number'
                  min={0}
                  max={9999999999}
                  placeholder='?????? UID '
                />
                <Button text={uid === "" ? "??????" : "??????"} onClick={handleQuery} />
              </div>
            </div>
            {!loading && (
              <div className={styles.content}>
                {type === "statistic" && <GameStatsTab data={gameStatsData} />}
                {type === "roles" && <RolesTab data={rolesDate} />}
                {type === "abyss" && <SpiralAbyssTab data={spiralAbyssData} />}
              </div>
            )}
          </>
        ) : (
          <Loading />
        )}
        <CircleButton
          Icon={TiArrowBack}
          size='middle'
          className={styles.backBtn}
          onClick={() => navigate("/")}
        />
      </div>
      {notice.holder}
    </>
  );
};

export default withAuth(Statistic);
