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
    overflow: 'hidden',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    willChange: 'transform',
    // backgroundColor: 'rgba(255,0,0,0.5)'
  },
  children: {
    width: '100%',
    position: 'absolute',
    minHeight: 800,
    willChange: 'transform'
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
  const [isFrozen, setIsFrozen] = useState(false);

  const scrollHandler = () => {
    if (!fixedWrapperRef.current || !placeholderRef.current || !childrenRef.current) return;

    const isBefore = window.scrollY + window.innerHeight < target.start;
    const isAfter = window.scrollY > target.end;
    if (!isBefore && !isAfter) {
      // const percentage = (window.scrollY - target.start + window.innerHeight) / (target.end - target.start + window.innerHeight); // window.scrollY subtract isBefore and isAfter
      // childrenRef.current.style.transform = `translateY(${-(0.5 - percentage) * (window.innerHeight - 110)}px)`;
      const offset = placeholderRef.current.getBoundingClientRect().top;
      childrenRef.current.style.top = `${offset}px`;
      fixedWrapperRef.current.style.top = `${offset}px`;
      if (isFrozen) {
        setIsFrozen(false);
      }
    } else if (isBefore) {
      if (!isFrozen) return;
      fixedWrapperRef.current.style.top = `${window.scrollY + placeholderRef.current.getBoundingClientRect().top}px`;
      setIsFrozen(true);
    } else if (isAfter) {
      if (!isFrozen) return;
      fixedWrapperRef.current.style.top = `${window.scrollY + placeholderRef.current.getBoundingClientRect().bottom}px`;
      setIsFrozen(true);
    }
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
  }, [target, isFrozen]);

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
          {children}
        </div>
      </div>
      <div className={classes.placeholder} ref={placeholderRef}
           style={{width: dimension.width, height: dimension.height}}>

      </div>
    </div>
  )

};

export default AnimationFixed
