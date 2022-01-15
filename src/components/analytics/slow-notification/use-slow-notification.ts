import {useState} from "react";

const localStorageKey = 'analytics-slow-notification-showed';
const aDayInMs = 1000 * 60 * 60 * 24;

const useSlowNotification = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const rawLastShowedTimestamp = parseInt(localStorage.getItem(localStorageKey) || '0');
    const lastShowedTimestamp = isNaN(rawLastShowedTimestamp) ? 0 : rawLastShowedTimestamp;
    return Date.now() - lastShowedTimestamp > aDayInMs
  });

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(localStorageKey, `${Date.now()}`);
  }

  return {
    isOpen,
    handleClose
  }
};

export default useSlowNotification
