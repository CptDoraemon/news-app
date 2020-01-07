import React, {useEffect, useRef} from "react";
import useSwipeable, {UseSwipeableDirections} from "../../tools/use-swipeable";
import {connect} from "react-redux";
import {setNextCategory, setPreviousCategory} from "../../redux/actions/category";

interface SwipeableProps {
    setPreviousCategory: () => void,
    setNextCategory: () => void,
}

const Swipeable: React.FC<SwipeableProps> = (props) => {
    const containerRef = useRef(null);
    const {
        direction,
        dragDistance,
        resetSwipeStatus
    } = useSwipeable(containerRef, 50);

    useEffect(() => {
        if (direction === UseSwipeableDirections.RIGHT) {
            props.setPreviousCategory()
        } else if (direction === UseSwipeableDirections.LEFT) {
            props.setNextCategory()
        }
        return () => {
            resetSwipeStatus();
        }
    }, [direction]);

    return (
        <div
            style={{
                width: '100%',
                transform: `translateX(${dragDistance}px)`,
                // it affects snackbar fixed behavior
                // left: `${dragDistance}px`,
                // position: 'relative'
            }}
            ref={containerRef}
        >
            { props.children }
        </div>
    )
};

function mapDispatchToProps(dispatch: any) {
    return {
        setPreviousCategory: () => dispatch(setPreviousCategory()),
        setNextCategory: () => dispatch(setNextCategory())
    }
}

const SwipeableContainer = connect(
    null,
    mapDispatchToProps
)(Swipeable);

export default SwipeableContainer