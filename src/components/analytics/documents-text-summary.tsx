import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useCountUp} from "react-countup";
import {bigNumber, content} from "./styles/analytics-styles";

const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const month = 1000 * 60 * 60 * 24 * 30;

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    section: {
        margin: theme.spacing(5, 0),
        [theme.breakpoints.down('sm')]: {
            margin: theme.spacing(2, 0)
        }
    },
    title: {
        ...content(theme)
    },
    number: {
        ...bigNumber(theme)
    }
}));

interface DocumentsTextSummaryProps {
    totalDocuments: number,
    earliestDocumentDate: number,
    latestDocumentDate: number
}

const DocumentsTextSummary = React.forwardRef<HTMLDivElement, DocumentsTextSummaryProps>(({totalDocuments, earliestDocumentDate, latestDocumentDate}, forwardedRef) => {

    const classes = useStyles();
    const [fullHeight, setFullHeight] = useState(window.innerHeight - 100);
    const total = useCountUp({start: totalDocuments*0.9, end: totalDocuments, duration: 5});
    const earliest = useCountUp({start: earliestDocumentDate*0.9, end: earliestDocumentDate, duration: 5});
    const latest = useCountUp({start: latestDocumentDate*0.9, end: latestDocumentDate, duration: 5});

    const title = (value: string) => (
        <h2 className={classes.title}>{value}</h2>
    );
    const date = (number: number) => {
        const dateObj = new Date(number);
        return (
            <p className={classes.number}>{dateObj.getUTCDate()} {monthStrings[dateObj.getUTCMonth()]}, {dateObj.getUTCFullYear()}</p>
        )
    };

    return (
        <>
            <div className={classes.root} style={{minHeight: `${fullHeight}px`}}>
                <div className={classes.section}>
                    { title('Total news articles achieved') }
                    <p className={classes.number}>{total.countUp}</p>
                </div>
                <div className={classes.section}>
                    { title('First news article achieved') }
                    { date(+earliest.countUp) }
                </div>
                <div className={classes.section}>
                    { title('Most recent news article achieved') }
                    { date(+latest.countUp) }
                </div>
                <div ref={forwardedRef}> </div>
            </div>
        </>
    )
});

export default DocumentsTextSummary