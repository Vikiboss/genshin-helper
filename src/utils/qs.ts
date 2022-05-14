// 对象拼接成字符串
const qs = (obj: Object, encode: boolean = false) => {
  let res = "";
  for (const [k, v] of Object.entries(obj)) res += `${k}=${encode ? encodeURIComponent(v) : v}&`;
  return res.slice(0, res.length - 1);
};

export default qs;
