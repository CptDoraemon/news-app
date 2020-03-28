import React, {useEffect, useRef} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import WorldMapD3 from "../../d3-charts/world-map-d3";
import useTheme from "@material-ui/core/styles/useTheme";

const id = 'topic-covid19-map';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // paddingBottom: '200px',
        // position: 'relative',
        // [theme.breakpoints.down('sm')]: {
        //     paddingBottom: '250px',
        // }
    }
}));

interface TopicCovid19MapProps {

}

const TopicCovid19Map: React.FC<TopicCovid19MapProps> = () => {
    const classes = useStyles();
    const theme = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const height = window.innerHeight - 240;

    useEffect(() => {
        import('./data/topic-covid19-data').then((dataFile) => {
            if (!containerRef.current) return;
            const map = new WorldMapD3(id, containerRef.current.getBoundingClientRect().width, containerRef.current.getBoundingClientRect().height, theme.palette.secondary.main, dataFile.default);
            map.main();
        });
    }, []);

    return (
        <div className={classes.root} ref={containerRef} style={{height: `${height}px`}}>
            <div id={id}> </div>
        </div>
    )
};

export default TopicCovid19Map