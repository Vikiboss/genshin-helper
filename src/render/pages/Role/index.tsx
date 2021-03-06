import { FaHeart } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import React, { Fragment, useEffect, useState } from "react";

import { ElementTypes } from "../../../constants";
import Button from "../../components/Button";
import CircleButton from "../../components/CircleButton";
import Loading from "../../components/Loading";
import nativeApi from "../../utils/nativeApi";
import RoleCard from "../../components/RoleCard";
import Select from "../../components/Select";
import useNotice from "../../hooks/useNotice";
import withAuth from "../../auth/withAuth";

import lock from "../../../assets/lock.png";

import star1 from "../../../assets/star1.png";
import star2 from "../../../assets/star2.png";
import star3 from "../../../assets/star3.png";
import star4 from "../../../assets/star4.png";
import star5 from "../../../assets/star5.png";

import Pyro from "../../../assets/pyro.png";
import Hydro from "../../../assets/hydro.png";
import Anemo from "../../../assets/anemo.png";
import Electro from "../../../assets/electro.png";
import Geo from "../../../assets/geo.png";
import Cryo from "../../../assets/cryo.png";
import Dendro from "../../../assets/dendro.png";

import type { PublicRole } from "../../../services/getPublicRoleList";
import type { Reliquarie, Role as RoleInfo } from "../../../services/getOwnedRoleList";

import styles from "./index.less";
import WeaponCard from "../../components/WeaponCard";
import ItemCard from "../../components/ItemCard";

type RenderRoleInfo = RoleInfo & PublicRole;
type TabType = "weapon" | "reliquary" | "constellation" | "profile";
type ReliquaryEffect = { name: string; effects: { num: number; effect: string }[] };

const StarImgs: string[] = [star1, star2, star3, star4, star5];
const ElementImgs: Record<string, string> = { Pyro, Hydro, Anemo, Electro, Geo, Cryo, Dendro };
const tabs: TabType[] = ["weapon", "reliquary", "constellation", "profile"];
const TabMap: Record<TabType, string> = {
  weapon: "??????",
  reliquary: "?????????",
  constellation: "??????",
  profile: "??????"
};

const getStarImage = (rarity: number) => StarImgs[(rarity > 5 ? 5 : rarity) - 1];

// ???????????????????????????????????????????????????????????????
const getFullRoleInfo = (roles: RoleInfo[], publickRoles: PublicRole[]): RenderRoleInfo[] => {
  const res = [];
  for (const role of roles) {
    if (role.name === "?????????") {
      res.push({
        ...role,
        name: role.image.includes("Girl") ? "??????????????" : "??????????????",
        introduction: "?????????????????????????????????????????????????????????????????????????????????????????????",
        startTime: "2020-09-28 00:00:00",
        line: "",
        CVs: [
          {
            name: role.image.includes("Girl") ? "??????" : "??????",
            type: "???",
            vos: []
          },
          {
            name: role.image.includes("Girl") ? "?????????" : "?????????",
            type: "???",
            vos: []
          }
        ]
      });
      continue;
    }
    for (const publickRole of publickRoles) {
      if (role.name === publickRole.name) {
        res.push({ ...role, ...publickRole });
      }
    }
  }
  return res;
};

// ?????????????????????????????????
const getReliquaryEffects = (reliquaries: Reliquarie[]): ReliquaryEffect[] => {
  const effects: ReliquaryEffect[] = [];
  // ?????????????????????????????????
  for (const e of reliquaries) {
    const isExist = effects.map((e) => e.name).includes(e.set.name);
    // ??????????????????????????????????????????
    if (isExist) continue;
    // ?????????????????????????????????????????????????????????
    const effectName = e.set.name;
    // ????????????????????????????????????????????????????????? 2???4
    const effectNums = e.set.affixes.map((e) => e.activation_number);
    // ??????????????????????????????????????????
    const setNum = reliquaries.filter((e) => e.set.name === effectName).length;
    // ??????????????????????????????????????? { num: number, effect: string }
    const _effects = [];
    // ??????????????????????????????????????????????????????????????????????????????
    for (const num of effectNums) {
      // ??????????????????????????????????????????????????????????????????????????????
      if (setNum >= num) {
        const affiex = e.set.affixes.filter((e) => e.activation_number === num)[0];
        _effects.push({ num: affiex.activation_number, effect: affiex.effect });
      }
    }
    // ???????????????????????????????????????????????????????????????????????????????????????????????????
    if (_effects.length > 0) effects.push({ name: e.set.name, effects: _effects });
  }
  // ?????????????????????
  return effects;
};

const ElementOptions = [
  {
    value: "all",
    label: "????????????"
  },
  {
    value: "Pyro",
    label: "?????????"
  },
  {
    value: "Electro",
    label: "?????????"
  },
  {
    value: "Geo",
    label: "?????????"
  },
  {
    value: "Cryo",
    label: "?????????"
  },
  {
    value: "Anemo",
    label: "?????????"
  },
  {
    value: "Hydro",
    label: "?????????"
  },
  {
    value: "Dendro",
    label: "?????????"
  }
];

const WeaponOptions = [
  {
    value: 0,
    label: "????????????"
  },
  {
    value: 1,
    label: "?????????"
  },
  {
    value: 11,
    label: "?????????"
  },
  {
    value: 12,
    label: "???"
  },
  {
    value: 13,
    label: "????????????"
  },
  {
    value: 10,
    label: "??????"
  }
];
const Role: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const [filters, setFilters] = useState<[string, number]>(["all", 0]);
  const [index, setIndex] = useState<number>(0);
  const [constellIndex, setConstellIndex] = useState<number>(0);
  const [infoTab, setInfoTab] = useState<TabType>("weapon");
  const [isRoleChanging, setIsRoleChanging] = useState<boolean>(true);
  const [mode, setMode] = useState<"detail" | "list">("list");
  const [publicRoles, setPublicRolos] = useState<PublicRole[]>([]);
  const [roles, setRoles] = useState<RoleInfo[]>([]);

  useEffect(() => {
    (async () => await updateInfo())();
  }, []);

  const updateInfo = async (): Promise<void> => {
    try {
      // ??????????????????????????????????????????????????????????????????????????????????????????
      const pbRoles = await nativeApi.getPublicRoleList();
      if (!pbRoles.length) return updateInfo();
      setPublicRolos(pbRoles);

      // ???????????????????????????
      const roles = await nativeApi.getOwnedRoleList();
      // ??????????????????????????????????????????????????????????????????????????????????????????????????????
      roles.sort((p, n) => {
        return (
          n.level - p.level ||
          n.rarity - p.rarity ||
          n.actived_constellation_num - p.actived_constellation_num ||
          n.weapon.rarity - p.weapon.rarity ||
          n.weapon.level - p.weapon.level
        );
      });
      if (roles.length) setRoles(roles);
      // if (roles.length) setRoles([...roles, ...roles]);
    } catch (e) {
      const isOffline = e?.message?.includes("getaddrinfo");
      const msg = isOffline ? "??????????????????????????????????????? T_T" : "???????????????????????????????????? T_T";
      notice.faild({ message: msg });
    }
  };

  const _roles = getFullRoleInfo(roles, publicRoles).filter((e) => {
    const isElementOK = filters[0] === "all" || e.element === filters[0];
    const isWeaponOK = filters[1] === 0 || e.weapon.type === filters[1];
    return isElementOK && isWeaponOK;
  });
  const isDetail = mode === "detail" && _roles.length > 0;
  const currentRole = _roles[index];
  const reliquaryEffects = isDetail ? getReliquaryEffects(_roles[index].reliquaries) : [];

  const toggleMode = () => setMode(isDetail ? "list" : "detail");

  const handleArrowClick = (direction: "left" | "right") => {
    const isLeft = direction === "left";
    const i = (index + (isLeft ? -1 : 1) + _roles.length) % _roles.length;
    setIndex(i);
    setIsRoleChanging(false);
    setTimeout(() => setIsRoleChanging(true), 0);
  };

  return (
    <>
      <div
        className={cn(
          styles.container,
          isDetail ? styles[currentRole.element.toLowerCase()] : "",
          isDetail && isRoleChanging ? styles.bgAni : ""
        )}
      >
        <div className={styles.topZone}>
          {!isDetail && roles.length > 0 && (
            <>
              <span className={cn(styles.title)}>????????????</span>
              <div className={styles.selects}>
                <Select
                  name='elementFilter'
                  value={filters[0]}
                  onChange={(e) => {
                    setFilters([e.target.value, filters[1]]);
                    setIsRoleChanging(false);
                    setTimeout(() => {
                      setIsRoleChanging(true);
                    }, 0);
                  }}
                  options={ElementOptions}
                />
                <Select
                  name='weaponFilter'
                  value={filters[1]}
                  onChange={(e) => {
                    setFilters([filters[0], Number(e.target.value)]);
                    setIsRoleChanging(false);
                    setTimeout(() => {
                      setIsRoleChanging(true);
                    }, 0);
                  }}
                  options={WeaponOptions}
                />
              </div>
            </>
          )}
          {isDetail && (
            <Button
              className={cn(styles.allRoleBtn, styles.allRoleBtnAni)}
              text='????????????'
              theme='light'
              onClick={toggleMode}
            />
          )}
        </div>
        {roles.length > 0 ? (
          <>
            {!isDetail && (
              <div className={cn(styles.roleTable, isRoleChanging ? styles.roleTableAni : "")}>
                {_roles.map((e, i) => (
                  <RoleCard
                    key={e.id}
                    style={{ margin: "4px" }}
                    role={e}
                    onClick={() => {
                      setIndex(i);
                      setMode("detail");
                    }}
                  />
                ))}
                {roles.length > 0 && _roles.length === 0 && (
                  <div className={styles.empty}>??????????????????</div>
                )}
              </div>
            )}
            {/* ????????????????????? */}
            {isDetail && (
              <div className={styles.roleDetail}>
                <div className={styles.detailContent}>
                  <div className={styles.roleInfo}>
                    <div className={cn(styles.titleZone, isRoleChanging ? styles.titleAni : "")}>
                      <div className={cn(styles.name)}>{currentRole.name}</div>
                      <img src={getStarImage(currentRole.rarity)} alt='star' />
                      <div className={styles.roleAttr}>
                        <span>Lv. {currentRole.level}</span>
                        <span>{ElementTypes[currentRole.element]}</span>
                        {!currentRole.name.includes("?????????") && (
                          <>
                            {/* <span>?????????{D(currentRole.startTime).format("M???D???")}</span> */}
                            <FaHeart size={16} />
                            <span>{currentRole.fetter}</span>
                          </>
                        )}
                        {currentRole.actived_constellation_num > 0 && (
                          <span>
                            {currentRole.actived_constellation_num}???
                            {currentRole.actived_constellation_num >= 6 ? " ????????????" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={cn(styles.tabContainer, isRoleChanging ? styles.contentAni : "")}
                    >
                      <div className={styles.tab}>
                        {tabs.map((e) => (
                          <div
                            className={e === infoTab ? styles.tabActive : ""}
                            key={e}
                            onClick={() => setInfoTab(e)}
                          >
                            {TabMap[e]}
                          </div>
                        ))}
                      </div>
                      {/* ????????????????????? Tab */}
                      <div className={styles.tabContent}>
                        {/* ???????????? Tab */}
                        {infoTab === "weapon" && (
                          <div className={styles.weapon}>
                            <WeaponCard weapon={currentRole.weapon} />
                            <div>
                              <span>
                                {currentRole.weapon.name} / {currentRole.weapon.type_name}
                              </span>
                              <span>{currentRole.weapon.desc}</span>
                              <span>
                                Lv.{currentRole.weapon.level}
                                {currentRole.weapon.promote_level >= 1
                                  ? ` / ??????${currentRole.weapon.promote_level}???`
                                  : ""}
                                {currentRole.weapon.affix_level > 1
                                  ? ` / ??????${currentRole.weapon.affix_level}???`
                                  : ""}
                              </span>
                            </div>
                          </div>
                        )}
                        {/* ??????????????? Tab */}
                        {infoTab === "reliquary" && (
                          <div className={styles.reliquary}>
                            <div>
                              {currentRole.reliquaries.length ? (
                                <>
                                  {currentRole.reliquaries.map((e) => (
                                    <ItemCard key={e.pos} item={e} />
                                  ))}
                                </>
                              ) : (
                                <div>????????????????????????</div>
                              )}
                            </div>
                            <div>
                              {reliquaryEffects.length
                                ? reliquaryEffects.map((e) => (
                                    <Fragment key={e.name}>
                                      <span>{e.name}</span>
                                      <div>
                                        {e.effects.map((e) => (
                                          <span key={e.num}>
                                            ??{e.num}?????????{e.effect}
                                          </span>
                                        ))}
                                      </div>
                                    </Fragment>
                                  ))
                                : currentRole.reliquaries.length > 0 && (
                                    <div>?????????????????????????????????</div>
                                  )}
                            </div>
                          </div>
                        )}
                        {/* ???????????? Tab */}
                        {infoTab === "constellation" && (
                          <div className={styles.constellation}>
                            <div>
                              {currentRole.constellations.map((e, i) => {
                                return (
                                  <img
                                    className={constellIndex === i ? styles.constelllActive : ""}
                                    key={e.name + i}
                                    src={e.is_actived ? e.icon : lock}
                                    alt={"??????" + e.pos}
                                    onClick={() => setConstellIndex(i)}
                                  />
                                );
                              })}
                            </div>
                            <div>
                              <span>
                                {currentRole.constellations[constellIndex].name}
                                {currentRole.constellations[constellIndex].is_actived
                                  ? ""
                                  : " ???????????????"}
                              </span>
                              <span>??????????????{constellIndex + 1}???</span>
                              <div>
                                {currentRole.constellations[constellIndex].effect
                                  .replace(/<(.*?)>/g, "")
                                  .split("\\n")
                                  .map((e) => (
                                    <div key={e}>{e}</div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {/* ???????????? Tab */}
                        {infoTab === "profile" && (
                          <div className={styles.profile}>
                            <span className={styles.introduction}>{currentRole.introduction}</span>
                            <span className={styles.CV}>
                              CV???{currentRole.CVs.map((e) => e.name + `(${e.type})`).join("???")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cn(styles.mask, isRoleChanging ? styles.imgAni : "")} />
                <img
                  className={cn(styles.img, isRoleChanging ? styles.imgAni : "")}
                  src={currentRole.image}
                  alt={currentRole.name}
                />
                <div className={cn(styles.extInfo, isRoleChanging ? styles.imgAni : "")}>
                  {currentRole.line && <img src={currentRole.line} alt='' />}
                </div>
              </div>
            )}
          </>
        ) : (
          <Loading className={styles.loading} />
        )}

        {!isDetail && (
          <CircleButton
            Icon={TiArrowBack}
            size='middle'
            className={styles.backBtn}
            onClick={() => navigate("/")}
          />
        )}

        {isDetail && (
          <>
            <img
              className={cn(styles.bgElement, isRoleChanging ? styles.elementAni : "")}
              src={ElementImgs[currentRole.element]}
              alt='element'
            />
            <div className={styles.arrowLeft} onClick={handleArrowClick.bind(null, "left")} />
            <div className={styles.arrowRight} onClick={handleArrowClick.bind(null, "right")} />
          </>
        )}
      </div>
      {notice.holder}
    </>
  );
};

export default withAuth(Role);
