import React, {useRef} from "react";
import useSticky from "../../tools/use-sticky";

interface StickyComponentProps {
    fixedStartHeight: number,
    zIndex?: number,
}

const StickyComponent: React.FC<StickyComponentProps> = (props) => {
    const {
        style,
        isFixed
    } = useSticky(props.fixedStartHeight);
    const childrenRef = useRef(document.createElement('div'));

    return (
        <>
            { isFixed &&
            <div style={{visibility: 'hidden'}}>
                { props.children }
            </div> }
            <div style={{...style, zIndex: props.zIndex ? props.zIndex : 'auto'}} ref={childrenRef}>
                { props.children }
            </div>
        </>
    )
};

export default StickyComponent;