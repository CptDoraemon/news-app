import React, {useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const easeInQuad = (t: number) => t * t;

export enum AnimationSlideInDirection {
  left = 'left',
  right = 'right'
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
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
  direction: AnimationSlideInDirection
}

const AnimationSlideIn: React.FC<AnimationSlideInProps> = ({children, direction}) => {
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
    const isBefore = window.scrollY + window.innerHeight < target.start;
    const isAfter = window.scrollY + window.innerHeight * 0.5 > target.end; // center of the element aligns center of the viewport
    if (!isBefore && !isAfter) {
      const percentage = (window.scrollY - target.start + window.innerHeight) / (target.end - target.start + 0.5 * window.innerHeight); // window.scrollY subtract isBefore and isAfter
      setTranslate((prevTranslate) => ({
        ...prevTranslate,
        x: prevTranslate.xMax * easeInQuad(1 - percentage)
      }))
    } else if (isBefore) {
      if (translate.x !== translate.xMax) {
        setTranslate((prevTranslate) => ({
          ...prevTranslate,
          x: prevTranslate.xMax
        }))
      }
    } else if (isAfter) {
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
    const rect = containerRef.current.getBoundingClientRect();
    setTarget({
      start: window.scrollY + rect.top,
      end: window.scrollY + rect.top + rect.height * 0.5
    });
    const xMax = direction === AnimationSlideInDirection.left ? -(rect.left + rect.width) : rect.right + rect.width;
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
      <div className={classes.children} ref={childrenRef}
           style={{transform: `translate(${translate.x}px, ${translate.y}px)`}}>
        {children}
      </div>
      <div className={classes.placeholder} ref={placeholderRef} style={{...dimension}}>

      </div>
    </div>
  )
};

export default AnimationSlideIn
