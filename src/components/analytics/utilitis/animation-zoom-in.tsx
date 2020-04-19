import React, {useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: '100%'
    },
    placeholdersWrapper: {
        position: 'relative'
    },
    sectionOuterWrapper: {
        position: 'fixed',
        width: '100%',
        top: 0,
        left: 0
    },
    sectionInnerWrapper: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0
    },
    sectionOne: {
        zIndex: 2
    },
    sectionTwo: {
        zIndex: 1
    }
}));

interface Size {
    width: number,
    height: number
}

interface AnimationZoomInProps {
    sectionOne: () => React.ReactElement,
    sectionTwo: () => React.ReactElement,
}

const AnimationZoomIn: React.FC<AnimationZoomInProps> = ({sectionOne, sectionTwo}) => {
    const classes = useStyles();
    const rootRef = useRef<HTMLDivElement>(null);
    const sectionOneRef = useRef<HTMLDivElement>(null);
    const sectionTwoRef = useRef<HTMLDivElement>(null);
    const sectionOnePlaceholderRef = useRef<HTMLDivElement>(null);
    const sectionOneAnimationPlaceholderRef = useRef<HTMLDivElement>(null);
    const sectionTwoPlaceholderRef = useRef<HTMLDivElement>(null);

    const [sectionOneSize, setSectionOneSize] = useState({width: 0, height: 0});
    const [sectionTwoSize, setSectionTwoSize] = useState({width: 0, height: 0});

    const [BGOpacity, setBGOpacity] = useState(1);
    // const [sectionOneTop, setSectionOneTop] = useState(0);
    const [sectionTwoTop, setSectionTwoTop] = useState(0);
    const [sectionOneScale, setSectionOneScale] = useState(1);

    const scrollHandler = () => {
        if (!sectionOnePlaceholderRef.current || !sectionOneAnimationPlaceholderRef.current || !sectionTwoPlaceholderRef.current) return;
        const innerHeight = window.innerHeight;

        const sectionOneAnimationPlaceholderRect = sectionOneAnimationPlaceholderRef.current.getBoundingClientRect();
        const sectionTwoPlaceholderRect = sectionTwoPlaceholderRef.current.getBoundingClientRect();

        if (sectionOneAnimationPlaceholderRect.top <= innerHeight && sectionOneAnimationPlaceholderRect.bottom >=0) {
            const scrolled = (sectionOneAnimationPlaceholderRect.top - (-innerHeight)) / (innerHeight + sectionOneAnimationPlaceholderRect.height);
            console.log(scrolled);
            if (scrolled < 1) {
                setSectionOneScale(20 * (1 - scrolled) + 1)
                setBGOpacity(scrolled)
            }
        }

        if (sectionTwoPlaceholderRect.top + 0.5 * sectionTwoPlaceholderRect.height < 0.5 * innerHeight) {
            setSectionTwoTop(sectionTwoPlaceholderRect.top)
        }
    };

    console.log(BGOpacity);

    useEffect(() => {
        // set placeholder sizes
        if (!rootRef.current || !sectionOneRef.current || !sectionTwoRef.current) return;
        setSectionOneSize({
            width: rootRef.current.getBoundingClientRect().width,
            height: sectionOneRef.current.getBoundingClientRect().height,
        });
        setSectionTwoSize({
            width: rootRef.current.getBoundingClientRect().width,
            height: sectionTwoRef.current.getBoundingClientRect().height,
        });
    }, []);

    useEffect(() => {
        // set section tops according to placeholder positions
        if (sectionOneSize.width === 0 || sectionTwoSize.width === 0) return;
        // if (!sectionOnePlaceholderRef.current || sectionTwoSize.width === 0) return;
        //
        // setSectionOneTop(sectionOnePlaceholderRef.current.getBoundingClientRect().top)
        // setSectionTwoTop(sectionOnePlaceholderRef.current.getBoundingClientRect().top)

    }, [sectionOneSize, sectionTwoRef]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return () => {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, []);


    return (
        <div className={classes.root} ref={rootRef}>

            <div className={`${classes.sectionOuterWrapper} ${classes.sectionOne}`}>
                <div
                    className={classes.sectionInnerWrapper}
                    ref={sectionOneRef}
                    style={{
                        transform: `scale(${sectionOneScale})`,
                        color: `rgba(255,255,255,${BGOpacity})`,
                        backgroundColor: '#000',
                        backgroundClip: 'text'
                    }}
                >
                    { sectionOne() }
                </div>
            </div>
            <div className={`${classes.sectionOuterWrapper} ${classes.sectionTwo}`}>
                <div className={classes.sectionInnerWrapper} ref={sectionTwoRef} style={{top: `${sectionTwoTop}px`}}>
                    { sectionTwo() }
                </div>
            </div>

            <div className={classes.placeholdersWrapper}>
                <div ref={sectionOnePlaceholderRef} style={{width: `${sectionOneSize.width}px`, height: `${sectionOneSize.height}px`}}>

                </div>
                <div ref={sectionOneAnimationPlaceholderRef} style={{width: `${sectionOneSize.width}px`, height: `${sectionOneSize.height}px`}}>

                </div>
                <div ref={sectionTwoPlaceholderRef} style={{width: `${sectionTwoSize.width}px`, height: `${sectionTwoSize.height}px`}}>

                </div>
            </div>
        </div>
    )
};

export default AnimationZoomIn