export default function getPublishTime(date: Date): string {
  const timePast = Date.now() - date.getTime();
  if (timePast < 0) {
    return 'now'
  }
  const minutes = Math.floor(timePast / (60 * 1000));
  if (minutes <= 59) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  }
  const hours = Math.floor(timePast / (60 * 60 * 1000));
  if (hours <= 23) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  const days = Math.floor(timePast / (24 * 60 * 60 * 1000));
  if (days <= 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  const months = Math.floor(timePast / (30 * 24 * 60 * 60 * 1000));
  if (months <= 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
  const years = Math.floor(timePast / (365 * 24 * 60 * 60 * 1000));
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}
