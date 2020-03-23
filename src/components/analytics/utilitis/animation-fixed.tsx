import React, {CSSProperties, useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(0,255,0,0.5)'
    },
    fixedWrapper: {
        position: 'relative',
        top: 0,
        zIndex: 1,
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(255,0,0,0.5)'
    },
    children: {
        width: '100%',
        position: 'absolute',
        zIndex: 1,
        minHeight: 800
    },
    childrenSize: {
        width: '100%'
    },
    placeholder: {
        position: 'relative',
    },
}));

interface AnimationFixedProps {

}

const AnimationFixed: React.FC<AnimationFixedProps> = ({children}) => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const fixedWrapperRef = useRef<HTMLDivElement>(null);

    const [dimension, setDimension] = useState({
        isSet: false,
        width: '0',
        height: '0',
        left: '0'
    });
    const [target, setTarget] = useState({
        isSet: false,
        start: 0,
        end: 0
    });

    const scrollHandler = () => {
        if (!fixedWrapperRef.current || !placeholderRef.current || !childrenRef.current) return;

        // const isBefore = window.scrollY + window.innerHeight < target.start;
        // const isAfter = window.scrollY > target.end;
        childrenRef.current.style.transform = `translateY(${placeholderRef.current.getBoundingClientRect().top*0.5}px)`;
        fixedWrapperRef.current.style.transform = `translateY(${placeholderRef.current.getBoundingClientRect().top}px)`
        // if (!isBefore && !isAfter) {
        //     // const percentage = (window.scrollY - target.start + window.innerHeight) / (target.end - target.start + window.innerHeight); // window.scrollY subtract isBefore and isAfter
        //     // childrenRef.current.style.transform = `translateY(${-(0.5 - percentage) * (window.innerHeight - 110)}px)`;
        //     childrenRef.current.style.transform = `translateY(${-placeholderRef.current.getBoundingClientRect().top}px)`;
        //     fixedWrapperRef.current.style.transform = `translateY(${placeholderRef.current.getBoundingClientRect().top}px)`
        // } else if (isBefore) {
        //     if (fixedWrapperRef.current.style.display === 'hidden') return;
        //     fixedWrapperRef.current.style.display = `hidden`
        // } else if (isAfter) {
        //     if (fixedWrapperRef.current.style.display === 'hidden') return;
        //     fixedWrapperRef.current.style.display = `hidden`
        // }
    };

    useEffect(() => {
        // use the children dimension to set placeholder's dimension
        if (!childrenRef.current || dimension.isSet) return;
        setDimension({
            isSet: true,
            width: `${childrenRef.current.getBoundingClientRect().width}px`,
            height: `${childrenRef.current.getBoundingClientRect().height}px`,
            left: `${childrenRef.current.getBoundingClientRect().left}px`
        });
        scrollHandler();
    }, [dimension]);

    useEffect(() => {
        // wait until dimension is set
        // use placeholder's position to set scrolling targets
        if (!placeholderRef.current || !dimension.isSet || target.isSet) return;
        const rect = placeholderRef.current.getBoundingClientRect();
        setTarget({
            isSet: true,
            start: window.scrollY + rect.top,
            end: window.scrollY + rect.top + rect.height
        });
    }, [dimension, target]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return () => document.removeEventListener('scroll', scrollHandler);
    }, [target]);

    const fixedWrapperStyle: CSSProperties = {
        left: dimension.left,
        height: dimension.height,
        width: dimension.width,
        position: 'fixed',
    };

    return (
        <div className={classes.root} ref={containerRef}>
            <div className={classes.fixedWrapper} ref={fixedWrapperRef} style={dimension.isSet ? fixedWrapperStyle : {}}>
                <div className={classes.children} ref={childrenRef}>
                    { children }
                </div>
            </div>
            <div className={classes.placeholder} ref={placeholderRef} style={{width: dimension.width, height: dimension.height}}>

            </div>
        </div>
    )

};

export default AnimationFixed