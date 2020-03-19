import React, {RefObject, useRef} from "react";
import useSticky from "../../tools/use-sticky";

interface StickyComponentProps {
    anchorRef: RefObject<HTMLDivElement>,
    zIndex?: number,
}

const StickyComponent: React.FC<StickyComponentProps> = (props) => {
    const {
        style,
        isFixed
    } = useSticky(props.anchorRef);

    const elementRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {
                isFixed && elementRef.current &&
                <div style={{
                    width: `${elementRef.current.offsetWidth}px`,
                    height: `${elementRef.current.offsetHeight}px`
                }}>
                </div>
            }
            <div style={{...style, zIndex: props.zIndex ? props.zIndex : 'auto'}} ref={elementRef}>
                { props.children }
            </div>
        </>
    )
};

export default StickyComponent;