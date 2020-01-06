import {RefObject, useEffect, useState} from "react";

export enum UseSwipeableDirections {
    NULL= 'NULL',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

const DEBOUNCER = 20;

function useSwipeable(ref: RefObject<HTMLInputElement>, threshholdPx: number) {
    const [x1, setX1] = useState(0);
    const [y1, setY1] = useState(0);
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
            setDragDistance(e.changedTouches[0].clientX - x1)
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
    }

    function resetSwipeStatus() {
        setDirection(UseSwipeableDirections.NULL);
    }

    useEffect(() => {
        const currentElement = ref.current;
        if (!currentElement) return;
        currentElement.addEventListener('touchstart', touchStartHandler);
        currentElement.addEventListener('touchend', touchEndHandler);
        currentElement.addEventListener('touchmove', touchMoveHandler);

        return () => {
            currentElement.removeEventListener('touchstart', touchStartHandler);
            currentElement.removeEventListener('touchend', touchEndHandler);
            currentElement.removeEventListener('touchmove', touchMoveHandler);
        }
    });

    return {
        direction,
        dragDistance,
        resetSwipeStatus
    }
}

export default useSwipeable