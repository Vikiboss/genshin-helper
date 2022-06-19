import cn from "classnames";
import React, { MouseEventHandler } from "react";

import avatar from "../../../assets/icon.png";
import prestigeIcon from "../../../assets/prestige.png";
import { SignInfo } from "../../../services/getBBSSignInfo";
import { DailyNotesData } from "../../../services/getDailyNotes";
import { GameRole } from "../../../typings";
import { Notice } from "../../hooks/useNotice";

import bbsIcon from "../../../assets/bbs.png";
import discountIcon from "../../../assets/discount.png";
import homeIcon from "../../../assets/home.png";
import resinIcon from "../../../assets/resin.png";
import taskIcon from "../../../assets/task.png";
import transformerIcon from "../../../assets/transformer.png";

import styles from "./index.less";

interface UserCardProp {
  handleAvatarClick: () => void;
  handleCopy: (str: string, msg: string) => void;
  note: DailyNotesData;
  notice: Notice;
  sign: SignInfo;
  user: GameRole;
}

const formatTime = (seconds: number) => {
  if (seconds <= 60) return `${seconds} 秒 `;
  if (seconds <= 3600) return `${Math.ceil(seconds / 60)} 分钟 `;
  if (seconds <= 86400) {
    const hour = `${Math.floor(seconds / 3600)} 小时 `;
    const minute = Math.ceil((seconds % 3600) / 60);
    return hour + (minute ? minute + " 分钟 " : "");
  }
  const day = `${Math.floor(seconds / 86400)} 天 `;
  const hour = Math.ceil((seconds % 86400) / 3600);
  const timeStr = day + (hour ? hour + " 小时 " : "");
  return timeStr.trim();
};

const UserCard: React.FC<UserCardProp> = (props) => {
  const { notice, user, sign, note, handleCopy, handleAvatarClick } = props;

  const infos = [
    {
      key: "nickname",
      name: "昵称",
      content: user.nickname
    },
    {
      key: "level",
      name: "等级",
      content: `Lv.${user.level} `
    },
    {
      key: "region",
      name: "区服",
      content: `${user.region_name} （${user.is_official ? "官服" : "渠道服"}）`
    },
    {
      key: "uid",
      name: "UID",
      content: user.game_uid
    }
  ];

  // 处理原粹数值数据
  const isResinOk = note?.current_resin === note?.max_resin;
  const resinStatus = `${note?.current_resin}/${note?.max_resin}`;
  const resinTime = Number(note?.resin_recovery_time) || 0;
  const resinTitle = isResinOk ? "树脂恢复完毕" : `树脂全部恢复预计需要 ${formatTime(resinTime)}`;

  // 处理洞天宝钱数据
  const isHomeOk = note?.max_home_coin !== 0;
  const isFull = note?.current_home_coin === note?.max_home_coin;
  const homeStatus = isHomeOk ? `${note?.current_home_coin}/${note?.max_home_coin}` : "暂未开启";
  const homeTime = Number(note?.home_coin_recovery_time) || 0;
  const homeTitle = isHomeOk
    ? isFull
      ? "洞天宝钱已存满"
      : `存满预计需要 ${formatTime(homeTime)}`
    : "尘歌壶功能未开启";

  // 处理每日委托数据
  const hasReceivedTask = note?.total_task_num !== 0;
  const taskRate = `${note?.finished_task_num}/${note?.total_task_num}`;
  const taskStatus = hasReceivedTask ? taskRate : "尚未接取";
  const isTaskDone = note?.finished_task_num === note?.total_task_num;
  const doneText = isTaskDone ? "已完成" : "未完成";
  const hasReceivedReward = note?.is_extra_task_reward_received;
  const extraText = hasReceivedReward ? "已领取" : "未领取";
  const taskTitle = `每日委托任务${doneText}，额外奖励${extraText}`;

  // 处理周本数据
  const { remain_resin_discount_num: remain, resin_discount_num_limit: limit } = note;
  const discountStatus = `${remain}/${limit}`;
  const isDiscountDone = remain === 0;
  const discountText = isDiscountDone ? "已达上限" : `还剩 ${remain} 次`;
  const discountTitle = "本周树脂消耗减半次数" + discountText;

  // 处理参量质变仪数据
  const hasTransformer = note?.transformer?.obtained;
  const _ = note?.transformer?.recovery_time;
  const transformerTime = _.Day * 86400 + _.Hour * 3600 + _.Minute * 60 + _.Second;
  const isTransformerReady = transformerTime === 0;
  const transformerStatus = hasTransformer
    ? isTransformerReady
      ? "已就绪"
      : `冷却中`
    : "暂未获得";
  const transformerTitle = `距下次可用还剩 ${formatTime(transformerTime)}`;

  // 处理签到数据
  const signStatus = `${sign.is_sign ? "已签到" : "未签到"}`;
  const signTitle = `本月累计签到 ${sign.total_sign_day} 天，错过 ${sign.sign_cnt_missed} 天`;

  const notes = [
    {
      detail: `原粹树脂 ${resinStatus}`,
      title: resinTitle,
      icon: resinIcon,
      name: "resin"
    },
    {
      detail: `洞天宝钱 ${homeStatus}`,
      title: homeTitle,
      icon: homeIcon,
      name: "home"
    },
    {
      detail: `每日委托任务 ${taskStatus}`,
      icon: taskIcon,
      title: taskTitle,
      name: "task"
    },
    {
      detail: `值得铭记的强敌 ${discountStatus}`,
      icon: discountIcon,
      title: discountTitle,
      name: "discount"
    },
    {
      detail: `参量质变仪 ${transformerStatus}`,
      icon: transformerIcon,
      title: transformerTitle,
      name: "transformer"
    },
    {
      detail: `米游社签到 ${signStatus}`,
      icon: bbsIcon,
      title: signTitle,
      name: "sign"
    }
  ];

  const dispatchs = (note?.expeditions || []).map((e) => {
    const done = e.status === "Finished";
    const doneText = "探索派遣任务已完成，等待领取";
    const pendingText = `探险中，距离探险结束还剩 ${formatTime(Number(e.remained_time))}`;
    const title = done ? doneText : pendingText;
    const avatar = e.avatar_side_icon;
    return { done, avatar, title };
  });

  const doneNum = dispatchs.filter((e) => e.done).length;
  const dispatchDetail = `探索派遣 ${doneNum}/${dispatchs.length}`;
  const dispatcTitleText = `${dispatchDetail}，共派遣 ${dispatchs.length} 个角色，${doneNum} 个已完成`;
  const dispatcTitle = dispatchs.length > 0 ? dispatcTitleText : "暂未派遣任何角色";

  return (
    <>
      <div className={styles.userCard}>
        <div className={styles.avatar} onClick={handleAvatarClick}>
          <img src={avatar} alt='avatar' className={styles.avatarImage} />
        </div>
        <div className={styles.userInfo}>
          {infos.length &&
            infos.map((e) => (
              <div
                className={styles.infoItem}
                key={e.key}
                title={e.key === "uid" ? "点击复制 UID 到剪切板" : e.content}
              >
                <span>{e.name}：</span>
                <div
                  className={styles[e.key]}
                  onClick={
                    e.key === "uid"
                      ? handleCopy.bind(null, e.content, "已将 UID 复制到剪切板")
                      : null
                  }
                >
                  {e.content}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.noteCard}>
        {notes.length &&
          notes.map((e) => (
            <div
              className={styles.noteItem}
              key={e.name}
              title={e.title}
              onClick={() => notice.info({ message: e.title })}
            >
              <img src={e.icon} className={cn(styles.noteIcon, styles[e.name])} />
              <div className={styles.noteDetail}>{e.detail}</div>
            </div>
          ))}
        <div
          className={styles.noteItem}
          title={dispatcTitle}
          onClick={() => notice.info({ message: dispatcTitle })}
        >
          <div className={styles.noteDetail}>
            <img src={prestigeIcon} className={cn(styles.noteIcon)} />
            {dispatchDetail}
          </div>
        </div>
        <div className={styles.noteItem}>
          <div className={styles.noteDetail}>
            {dispatchs.map((e) => (
              <div
                className={cn(styles.dispatchBorder, e.done ? styles.done : "")}
                title={e.title}
                key={e.avatar}
                onClick={() => notice[e.done ? "success" : "warning"]({ message: e.title })}
              >
                <img src={e.avatar} alt='角色' className={styles.dispatchAvatar} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;