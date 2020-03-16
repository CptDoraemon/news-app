export default function getDateString(num: number) {
    const date = new Date(num);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}