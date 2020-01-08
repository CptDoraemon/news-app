import {RefObject, useEffect, useState} from "react";

export enum UseSwipeableDirections {
    NULL= 'NULL',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

enum UserAction {
    NULL = 'NULL',
    SWIPE = 'SWIPE',
    SCROLL = 'SCROLL'
}

const DEBOUNCER = 10;

function useSwipeable(ref: RefObject<HTMLInputElement>, threshholdPx: number) {
    const [x1, setX1] = useState(0);
    const [y1, setY1] = useState(0);
    const [userAction, setUserAction] = useState(UserAction.NULL);
    const [direction, setDirection] = useState(UseSwipeableDirections.NULL);
    const [dragDistance, setDragDistance] = useState(0);
    const [touchMoveLastTriggered, setTouchMoveLastTriggered] = useState(Date.now());

    function touchStartHandler(e: TouchEvent) {
        setX1(e.changedTouches[0].clientX);
        setY1(e.changedTouches[0].clientY)
    }

    function touchMoveHandler(e: TouchEvent) {
        const now = Date.now();
        if (now - touchMoveLastTriggered < DEBOUNCER) return;
        const currentX = e.changedTouches[0].clientX;
        const currentY = e.changedTouches[0].clientY;

        if (userAction === 'SWIPE') {
            if (e.cancelable) e.preventDefault();
            setDragDistance(e.changedTouches[0].clientX - x1);
        } else if (userAction === 'NULL' && Math.abs(currentX - x1) > Math.abs(currentY - y1)) {
            setUserAction(UserAction.SWIPE)
        } else if (userAction === 'NULL' && Math.abs(currentX - x1) <= Math.abs(currentY - y1)) {
            setUserAction(UserAction.SCROLL)
        }

        setTouchMoveLastTriggered(now);
    }

    function touchEndHandler(e: TouchEvent) {
        const currentX = e.changedTouches[0].clientX;
        const currentY = e.changedTouches[0].clientY;
        if (
            Math.abs(currentX - x1) > Math.abs(currentY - y1) &&
            Math.abs(currentX - x1) > threshholdPx &&
            userAction === UserAction.SWIPE
        ) {
            setDirection(currentX > x1 ? UseSwipeableDirections.RIGHT : UseSwipeableDirections.LEFT);
        }
        setDragDistance(0);
        setUserAction(UserAction.NULL)
    }

    function resetSwipeStatus() {
        setDirection(UseSwipeableDirections.NULL);
    }

    useEffect(() => {
        const currentElement = ref.current;
        if (!currentElement) return;
        currentElement.addEventListener('touchstart', touchStartHandler);

        return () => {
            currentElement.removeEventListener('touchstart', touchStartHandler);
        }
    }, []);

    useEffect(() => {
        const currentElement = ref.current;
        if (!currentElement) return;
        currentElement.addEventListener('touchmove', touchMoveHandler);

        return () => {
            currentElement.removeEventListener('touchmove', touchMoveHandler);
        }
    }, [y1, touchMoveLastTriggered, userAction]);

    useEffect(() => {
        const currentElement = ref.current;
        if (!currentElement) return;
        currentElement.addEventListener('touchend', touchEndHandler);

        return () => {
            currentElement.removeEventListener('touchend', touchEndHandler);
        }
    }, [y1, userAction]);

    return {
        direction,
        dragDistance,
        resetSwipeStatus
    }
}

export default useSwipeable