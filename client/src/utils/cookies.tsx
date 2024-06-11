import Cookies from "js-cookie";

export function setCookie(name: string, value: string, minutes: number) {
  const date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000)); // Convert minutes to milliseconds
  Cookies.set(name, value, { expires: date });
}


export function getCookie(name: string) {
  return Cookies.get(name);
}