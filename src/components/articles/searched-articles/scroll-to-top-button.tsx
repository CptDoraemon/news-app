import React, {useEffect, useState} from "react";
import {IconButton} from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";

const useActivateByScrollY = () => {
    const [isActive, setIsActive] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > window.innerHeight && !isActive) {
            setIsActive(true);
        } else if (window.scrollY < window.innerHeight && isActive) {
            setIsActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        }
    }, [isActive]);

    return isActive
};

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: '50px',
        right: '50px',
        backgroundColor: theme.palette.secondary.main,
        color: '#FFF',
        transition: theme.transitions.create('background-color opacity'),
        transform: 'rotate(-90deg)',
        '&:hover': {
            backgroundColor: theme.palette.secondary.light,
        },
        [theme.breakpoints.down('md')]: {
            bottom: '15px',
            right: '15px',
        }
    }
}));

interface ScrollToTopButtonProps {

}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = () => {

    const classes = useStyles();

    const isActive = useActivateByScrollY();

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <Fade in={isActive}>
            <Tooltip title="Scroll to Top" className={classes.root}>
                <IconButton aria-label="Scroll to Top" onClick={scrollToTop}>
                    <PlayArrowIcon />
                </IconButton>
            </Tooltip>
        </Fade>
    )
};

export default ScrollToTopButton