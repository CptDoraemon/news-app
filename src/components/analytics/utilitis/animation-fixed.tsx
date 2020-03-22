import React, {useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        overflow: 'hidden'
    },
    children: {
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: 0,
        willChange: 'transform',
        width: '100%',
    },
    placeholder: {
        position: 'relative',
        zIndex: -2,
    },
}));

interface AnimationFixedProps {

}

const AnimationFixed: React.FC<AnimationFixedProps> = ({children}) => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);

    const [dimension, setDimension] = useState({
        width: `0px`,
        height: `0px`
    });
    const [target, setTarget] = useState({
        start: 0,
        end: 0
    });
    const [translate, setTranslate] = useState({
        yMax: 0,
        x: 0,
        y: 0
    });

    const scrollHandler = () => {
        const isBefore = window.scrollY + window.innerHeight < target.start;
        const isAfter = window.scrollY > target.end;
        if (!isBefore && !isAfter) {
            const percentage = (window.scrollY - target.start + window.innerHeight) / (target.end - target.start + window.innerHeight); // window.scrollY subtract isBefore and isAfter
            console.log(percentage);
            setTranslate((prevTranslate) => ({
                ...prevTranslate,
                y: -(0.5 - percentage) * (window.innerHeight - 110)
                // y: 0
            }))
        } else if (isBefore) {
            if (translate.x !== translate.yMax) {
                setTranslate((prevTranslate) => ({
                    ...prevTranslate,
                    y: prevTranslate.yMax
                }))
            }
        } else if (isAfter) {
            if (translate.x !== 0) {
                setTranslate((prevTranslate) => ({
                    ...prevTranslate,
                    y: 0
                }))
            }
        }
    };

    useEffect(() => {
        if (!childrenRef.current || !placeholderRef.current || dimension.width !== '0px') return;
        setDimension({
            width: `${childrenRef.current.getBoundingClientRect().width}px`,
            height: `${childrenRef.current.getBoundingClientRect().height}px`
        });
    }, [dimension]);

    useEffect(() => {
        if (!containerRef.current || dimension.width === '0px' || target.start !== 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        setTarget({
            start: window.scrollY + rect.top,
            end: window.scrollY + rect.top + rect.height
        });
        const yMax = rect.height;
        setTranslate({
            yMax,
            x: 0,
            y: yMax
        })
    }, [dimension, target, translate]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return () => document.removeEventListener('scroll', scrollHandler);
    }, [target, translate]);



    return (
        <div className={classes.root} ref={containerRef}>
            <div className={classes.children} ref={childrenRef} style={{transform: `translate(${translate.x}px, ${translate.y}px)`}}>
                { children }
            </div>
            <div className={classes.placeholder} ref={placeholderRef} style={{...dimension}}>

            </div>
        </div>
    )
};

export default AnimationFixed