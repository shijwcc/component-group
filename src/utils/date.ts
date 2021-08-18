export const FormatKeyMapping = {
  'M+': date => date.getMonth() + 1, // 月份
  'd+': date => date.getDate(), // 日
  'h+': date => date.getHours(), // 小时
  'm+': date => date.getMinutes(), // 分
  's+': date => date.getSeconds(), // 秒
  'q+': date => Math.floor((date.getMonth() + 3) / 3), // 季度
  S: date => date.getMilliseconds(), // 毫秒
};

export const formateDate = (fmt: string, date: Date) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const key in FormatKeyMapping) {
    if (new RegExp('(' + key + ')').test(fmt)) {
      const func = FormatKeyMapping[key];
      const value = func ? func(date) : '';
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? value : ('00' + value).substr(('' + value).length));
    }
  }
  return fmt;
};

export const getMoment = () => {
  return (window as any).moment;
};

const millisecondMinute = 1000 * 60;
const millisecondHour = millisecondMinute * 60;
export const getValue = (value: number | string, format: string, timezone?: number) => {
  const isTimestamp = typeof value === 'string' ? /^\d+$/.test(value) : value && value > 100000;
  const intValue = parseInt(`${value}`.padEnd(13, '0'), 10);
  const date = new Date(intValue);
  if (typeof timezone === 'number') {
    date.setTime(date.getTime() + date.getTimezoneOffset() * millisecondMinute + timezone * millisecondHour);
  }
  return format && isTimestamp ? formateDate(format, date) : value;
};
