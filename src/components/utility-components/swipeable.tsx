import React, {useEffect, useRef} from "react";
import useSwipeable, {UseSwipeableDirections} from "../../tools/use-swipeable";
import {connect} from "react-redux";
import {setNextCategory, setPreviousCategory} from "../../redux/actions/category";

interface SwipeableProps {
    goPrevious: () => void,
    goNext: () => void,
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
            props.goPrevious()
        } else if (direction === UseSwipeableDirections.LEFT) {
            props.goNext()
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
        goPrevious: () => dispatch(setPreviousCategory()),
        goNext: () => dispatch(setNextCategory())
    }
}

const SwipeableContainer = connect(
    null,
    mapDispatchToProps
)(Swipeable);

export default SwipeableContainer