import React from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

import CircleButton from "../../components/CircleButton";
import nativeApi from "../../utils/nativeApi";

import abyss from "../../../assets/icon-abyss.png";
import activity from "../../../assets/icon-activity.png";
import animal from "../../../assets/icon-animal.png";
import boss from "../../../assets/icon-boss.png";
import element from "../../../assets/icon-element.png";
import food from "../../../assets/icon-food.png";
import material from "../../../assets/icon-material.png";
import mystery from "../../../assets/icon-mystery.png";
import newer from "../../../assets/icon-newer.png";
import PV from "../../../assets/icon-PV.png";
import reliquary from "../../../assets/icon-reliquary.png";
import role from "../../../assets/icon-role.png";
import strategy from "../../../assets/icon-strategy.png";
import task from "../../../assets/icon-task.png";
import team from "../../../assets/icon-team.png";
import version from "../../../assets/icon-version.png";
import weapon from "../../../assets/icon-weapon.png";
import wiki from "../../../assets/icon-wiki.png";

const LINK_BBS_ABYSS = "https://bbs.mihoyo.com/ys/strategy/channel/map/37/46";
const LINK_BBS_ACTIVITY = "https://bbs.mihoyo.com/ys/strategy/channel/map/37/48";
const LINK_BBS_ANIMAL = "https://bbs.mihoyo.com/ys/obc/channel/map/189/49";
const LINK_BBS_BOSS = "https://bbs.mihoyo.com/ys/strategy/channel/map/37/43";
const LINK_BBS_ELEMENT = "https://bbs.mihoyo.com/ys/strategy/channel/map/37/41";
const LINK_BBS_FOOD = "https://bbs.mihoyo.com/ys/obc/channel/map/189/21";
const LINK_BBS_MATERIAL = "https://bbs.mihoyo.com/ys/obc/channel/map/189/13";
const LINK_BBS_MYSTERY = "https://bbs.mihoyo.com/ys/obc/channel/map/189/54";
const LINK_BBS_NEWER = "https://bbs.mihoyo.com/ys/strategy/channel/map/37/38";
const LINK_BBS_OBC = "https://bbs.mihoyo.com/ys/obc";
const LINK_BBS_PV = "https://bbs.mihoyo.com/ys/obc/channel/map/80";
const LINK_BBS_RELIQUARY = "https://bbs.mihoyo.com/ys/obc/channel/map/189/218";
const LINK_BBS_ROLE = "https://bbs.mihoyo.com/ys/strategy/channel/map/37/39";
const LINK_BBS_STRATEGY = "https://bbs.mihoyo.com/ys/strategy";
const LINK_BBS_TASK = "https://bbs.mihoyo.com/ys/strategy/channel/map/45/231";
const LINK_BBS_TEAM = "https://bbs.mihoyo.com/ys/strategy/channel/map/37/40";
const LINK_BBS_VERSION = "https://bbs.mihoyo.com/ys/strategy/channel/map/37/233";
const LINK_BBS_WEAPON = "https://bbs.mihoyo.com/ys/obc/channel/map/189/5";

import styles from "./index.less";
import useNotice from "../../hooks/useNotice";

const btns = [
  {
    name: "?????????-??????",
    icon: strategy,
    link: LINK_BBS_STRATEGY
  },
  {
    name: "?????????-??????",
    icon: wiki,
    link: LINK_BBS_OBC
  },
  {
    name: "????????????",
    icon: task,
    link: LINK_BBS_TASK
  },
  {
    name: "????????????",
    icon: activity,
    link: LINK_BBS_ACTIVITY
  },
  {
    name: "????????????",
    icon: version,
    link: LINK_BBS_VERSION
  },
  {
    name: "????????????",
    icon: role,
    link: LINK_BBS_ROLE
  },
  {
    name: "????????????",
    icon: weapon,
    link: LINK_BBS_WEAPON
  },
  {
    name: "???????????????",
    icon: reliquary,
    link: LINK_BBS_RELIQUARY
  },
  {
    name: "????????????",
    icon: team,
    link: LINK_BBS_TEAM
  },
  {
    name: "????????????",
    icon: newer,
    link: LINK_BBS_NEWER
  },
  {
    name: "????????????",
    icon: material,
    link: LINK_BBS_MATERIAL
  },
  {
    name: "????????????",
    icon: animal,
    link: LINK_BBS_ANIMAL
  },
  {
    name: "??????BOSS",
    icon: boss,
    link: LINK_BBS_BOSS
  },
  {
    name: "????????????",
    icon: element,
    link: LINK_BBS_ELEMENT
  },
  {
    name: "????????????",
    icon: food,
    link: LINK_BBS_FOOD
  },
  {
    name: "????????????",
    icon: mystery,
    link: LINK_BBS_MYSTERY
  },
  {
    name: "????????????",
    icon: abyss,
    link: LINK_BBS_ABYSS
  },
  {
    name: "PV??????",
    icon: PV,
    link: LINK_BBS_PV
  }
];

const Setting: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  const handleWindowOpen = (link: string) => {
    notice.success({ message: "??????????????????...", duration: 1000 });
    nativeApi.openWindow(link);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>????????????</div>
        <div className={styles.btns}>
          {btns.map((e) => (
            <div className={styles.btn} key={e.name} onClick={handleWindowOpen.bind(null, e.link)}>
              <img src={e.icon} alt={e.name} />
              <span>{e.name}</span>
            </div>
          ))}
        </div>
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

export default Setting;
