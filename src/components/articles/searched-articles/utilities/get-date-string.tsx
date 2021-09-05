export default function getDateString(num: number) {
  const date = new Date(num);
  return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`
}
