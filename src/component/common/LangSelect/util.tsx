export const getCookie = (name: string) => {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  return arr && arr[2] ? unescape(arr[2]) : null;
};
export function setCookie(key, value, time = 30) {
  const exp = new Date();
  exp.setTime(exp.getTime() + time * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${value};expires=${exp.toUTCString()};path=/`;
}
