const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDateStringFromISOString = (ISOString: string) => {
  const date = new Date(ISOString);
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()} - ${hour}:${minute}`
};

export default function getDateStringFromMs(ms: number) {
  const date = new Date(ms);
  return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`
}

export {getDateStringFromISOString, getDateStringFromMs}
