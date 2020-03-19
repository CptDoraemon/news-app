import React, {useRef} from "react";
import CountUp from 'react-countup';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Fade from "@material-ui/core/Fade";
import useLazyLoad from "../../../tools/use-lazy-load";


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            margin: theme.spacing(2),
        }
    }
}));

interface SectionWrapperProps {

}

const SectionWrapper: React.FC<SectionWrapperProps> = ({children}) => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(containerRef);

    return (
        <Fade in={isVisible} timeout={2000}>
            <div className={classes.root} ref={containerRef}>
                { children }
            </div>
        </Fade>
    )
};

export default SectionWrapper