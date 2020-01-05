import React, {useEffect, useState} from "react";

export default function useLazyLoad(ref: React.RefObject<HTMLInputElement>) {
    const [isVisible, setIsVisible] = useState(false);
    let scrollHandlerLastCalledAt = Date.now() - 1000;

    function checkIsVisible() {
        const calledAt = Date.now();
        if (calledAt - scrollHandlerLastCalledAt < 20) {
            return
        } else {
            scrollHandlerLastCalledAt = calledAt
        }
        if (!ref.current) return;

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
    });

    return isVisible
}