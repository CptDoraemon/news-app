import React, {useEffect, useState} from "react";

export default function useLazyLoad(ref: React.RefObject<HTMLInputElement>): boolean {
    const [isVisible, setIsVisible] = useState(false);
    let scrollHandlerLastCalledAt = Date.now() - 1000;

    function checkIsVisible() {
        if (!ref.current) return;
        const calledAt = Date.now();
        if (calledAt - scrollHandlerLastCalledAt < 20) {
            return
        } else {
            scrollHandlerLastCalledAt = calledAt
        }

        const rect = ref.current.getBoundingClientRect();
        const isBefore = rect.top + rect.height < 0;
        const isAfter = rect.top > window.innerHeight;
        if (!isBefore && !isAfter) setIsVisible(true);
    }

    useEffect(() => {
        if (isVisible) return;
        checkIsVisible();
        document.addEventListener('scroll', checkIsVisible);
        return () => {
            document.removeEventListener('scroll', checkIsVisible);
        }
    }, [isVisible]);

    return isVisible;
}