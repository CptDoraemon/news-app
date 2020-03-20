import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useCountUp} from "react-countup";
import {bigNumber, content} from "./styles/analytics-styles";

const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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

const DocumentsTextSummary: React.FC<DocumentsTextSummaryProps> = ({totalDocuments, earliestDocumentDate, latestDocumentDate}) => {

    const classes = useStyles();
    const total = useCountUp({start: totalDocuments - 10, end: totalDocuments, duration: 5});
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
            <div className={classes.root} style={{height: `${window.innerHeight - 100}px`}}>
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
            </div>
        </>
    )
};

export default DocumentsTextSummary