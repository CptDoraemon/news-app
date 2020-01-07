import {RefObject, useEffect, useState} from "react";

export enum UseSwipeableDirections {
    NULL= 'NULL',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

const DEBOUNCER = 10;

function useSwipeable(ref: RefObject<HTMLInputElement>, threshholdPx: number) {
    const [x1, setX1] = useState(0);
    const [y1, setY1] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
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
        if (Math.abs(currentX - x1) > Math.abs(currentY - y1)) {
            setIsSwiping(true);
        }
        if (isSwiping) {
            if (e.cancelable) e.preventDefault();
            setDragDistance(e.changedTouches[0].clientX - x1);
        }
        setTouchMoveLastTriggered(now);
    }

    function touchEndHandler(e: TouchEvent) {
        const currentX = e.changedTouches[0].clientX;
        const currentY = e.changedTouches[0].clientY;
        if (Math.abs(currentX - x1) > Math.abs(currentY - y1) && Math.abs(currentX - x1) > threshholdPx) {
            setDirection(currentX > x1 ? UseSwipeableDirections.RIGHT : UseSwipeableDirections.LEFT);
        }
        setDragDistance(0);
        setIsSwiping(false);
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
    }, [y1, touchMoveLastTriggered, isSwiping]);

    useEffect(() => {
        const currentElement = ref.current;
        if (!currentElement) return;
        currentElement.addEventListener('touchend', touchEndHandler);

        return () => {
            currentElement.removeEventListener('touchend', touchEndHandler);
        }
    }, [y1]);

    return {
        direction,
        dragDistance,
        resetSwipeStatus
    }
}

export default useSwipeable