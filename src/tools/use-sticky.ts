import {useState, CSSProperties, useEffect, RefObject} from "react";
import useDebounce from "./use-debounce";


enum Style {
    FIXED = 'FIXED',
    RELATIVE = 'RELATIVE'
}

const getStyle = (styleName: Style) => {
    const style = {
        FIXED: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%"
        } as CSSProperties,
        RELATIVE: {
            position: "relative",
            width: "100%"
        } as CSSProperties,
    };

    return {...style[styleName]};
};

// set sticky when scroll passed ref element's bottom
function useSticky(refObject: RefObject<HTMLElement>) {
    const [style, setStyle] = useState(Style.RELATIVE);
    const shouldBeExecuted = useDebounce(10);

    function scrollHandler() {
        const scrolled = window.scrollY;
        if (scrolled === 0 && style !== Style.RELATIVE) {
            // don't debounce when fast scrolling to top
            setStyle(Style.RELATIVE);
            return;
        }

        if (!refObject.current) return;
        const fixedStartHeight = refObject.current.offsetTop + refObject.current.offsetHeight;

        if (!shouldBeExecuted()) return;
        if (scrolled >= fixedStartHeight && style !== Style.FIXED) {
            setStyle(Style.FIXED);
        } else if (scrolled < fixedStartHeight && style !== Style.RELATIVE) {
            setStyle(Style.RELATIVE);
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);

        return () => {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, [style, refObject]);

    return {
        style: getStyle(style),
        isFixed: style === Style.FIXED
    };
}

export default useSticky;