import {RefObject, useEffect, useState} from "react";

export enum UseSwipeableDirections {
    NULL= 'NULL',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

function useSwipeable(ref: RefObject<HTMLInputElement>, threshholdPx: number) {
    const [x1, setX1] = useState(0);
    const [x2, setX2] = useState(0);
    const [y1, setY1] = useState(0);
    const [y2, setY2] = useState(0);
    const [direction, setDirection] = useState(UseSwipeableDirections.NULL);
    const [dragDistance, setDragDistance] = useState(0);

    function touchStartHandler(e: TouchEvent) {
        setX1(e.changedTouches[0].clientX);
        setY1(e.changedTouches[0].clientY)
    }

    function touchMoveHandler(e: TouchEvent) {
        console.log(e.changedTouches[0].clientX - x1);
        setDragDistance(e.changedTouches[0].clientX - x1)
    }

    function touchEndHandler(e: TouchEvent) {
        setX2(e.changedTouches[0].clientX);
        setY2(e.changedTouches[0].clientY);
        setDragDistance(0);
    }

    function resetSwipeStatus() {
        setDirection(UseSwipeableDirections.NULL)
    }

    useEffect(() => {
        if (Math.abs(x2 - x1) > Math.abs(y2 - y1) && Math.abs(x2 - x1) > threshholdPx) {
            console.log(x2 > x1 ? UseSwipeableDirections.RIGHT : UseSwipeableDirections.LEFT);
            setDirection(x2 > x1 ? UseSwipeableDirections.RIGHT : UseSwipeableDirections.LEFT);
        }
    }, [x2]);

    useEffect(() => {
        const currentElement = ref.current;
        if (!currentElement) return;
        currentElement.addEventListener('touchstart', touchStartHandler);
        currentElement.addEventListener('touchend', touchEndHandler);

        return () => {
            currentElement.removeEventListener('touchstart', touchStartHandler);
            currentElement.removeEventListener('touchend', touchEndHandler);
        }
    }, [ref]);

    useEffect(() => {
        const currentElement = ref.current;
        if (!currentElement) return;
        currentElement.addEventListener('touchmove', touchMoveHandler);

        return () => {
            currentElement.removeEventListener('touchmove', touchMoveHandler);
        }
    }, [ref, x1]);

    return {
        direction,
        dragDistance,
        resetSwipeStatus
    }
}

export default useSwipeable