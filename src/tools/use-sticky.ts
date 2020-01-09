import {useState, CSSProperties, useEffect} from "react";
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

function useSticky(fixedStartHeight: number) {
    const [style, setStyle] = useState(Style.RELATIVE);
    const [isFixed, setIsFixed] = useState(false);
    const shouldBeExecuted = useDebounce(10);

    function scrollHandler() {
        if (!shouldBeExecuted()) return;
        const scrolled = window.scrollY;
        if (scrolled >= fixedStartHeight && style !== Style.FIXED) {
            setStyle(Style.FIXED);
            setIsFixed(true);
        } else if (scrolled < fixedStartHeight && style !== Style.RELATIVE) {
            setStyle(Style.RELATIVE);
            setIsFixed(false);
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);

        return () => {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, [style]);

    return {
        style: getStyle(style),
        isFixed
    };
}

export default useSticky;