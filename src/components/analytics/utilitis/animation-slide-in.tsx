import React, {useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const easeInQuad = (t: number) => t*t;

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        zIndex: 1,
        width: '100%'
    },
    children: {
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: 0,
        willChange: 'transform',
        width: '100%'
    },
    placeholder: {
        position: 'relative',
        zIndex: -2
    },
}));

interface AnimationSlideInProps {

}

const AnimationSlideIn: React.FC<AnimationSlideInProps> = ({children}) => {
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
        xMax: 0,
        x: 0,
        y: 0
    });

    const scrollHandler = () => {
        const scrolled = window.scrollY + window.innerHeight;
        if (scrolled >= target.start && scrolled <= target.end) {
            const percentage = (scrolled - target.start) / (target.end - target.start);
            setTranslate((prevTranslate) => ({
                ...prevTranslate,
                x: prevTranslate.xMax * easeInQuad(1 - percentage)
            }))
        } else if (scrolled < target.start) {
            if (translate.x !== translate.xMax) {
                setTranslate((prevTranslate) => ({
                    ...prevTranslate,
                    x: prevTranslate.xMax
                }))
            }
        } else if (scrolled > target.end) {
            if (translate.x !== 0) {
                setTranslate((prevTranslate) => ({
                    ...prevTranslate,
                    x: 0
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
        const el = containerRef.current;
        setTarget({
            start: el.offsetTop,
            end: el.offsetTop + el.offsetHeight
        });
        const xMax = -(el.getBoundingClientRect().left + el.getBoundingClientRect().width);
        setTranslate({
            xMax,
            x: xMax,
            y: 0
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

export default AnimationSlideIn