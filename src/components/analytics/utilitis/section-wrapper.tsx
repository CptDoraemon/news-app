import React, {useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));

interface SectionWrapperProps {

}

const SectionWrapper: React.FC<SectionWrapperProps> = ({children}) => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    // const isVisible = useLazyLoad(containerRef, 0.8);
    const [fullHeight, setFullHeight] = useState(window.innerHeight - 100);

    return (
        <div className={classes.root} ref={containerRef} style={{minHeight: `${fullHeight}px`}}>
            { children }
        </div>
    )
};

export default SectionWrapper
