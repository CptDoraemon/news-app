import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Title from "./utilitis/title";
import Content from "./utilitis/content";

const contentParagraphs = [
    'The band height of each category is the percentage of news count in that category to the total news count in that day. ' +
    'Given the number of news archived each day fluctuate and follow a weekly pattern, the percentage tells a better story that how people\'s interest in different news change over time.',
    'Some patterns can be observed from the graph: due to the spreading of the novel coronavirus at the beginning of 2020, more and more health news were being reported.',
    'Since the early March of 2020, many countries and cities in Europe and North America starts to lockdown, at the same time we see a decline in sport and entertainment news.'
];

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        '&:before': {
            height: 0
        }
    },
    rootExpanded: {
        margin: 0
    },
    summaryRoot: {
        width: '100%',
    },
    summaryExpanded: {
        minHeight: 48
    },
    summaryWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '2rem'
    },
    line: {
        width: '30%',
        height: 2,
        margin: '0 12px',
        backgroundColor: '#999'
    },
    detailWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

interface ExpansionPanelNoteProps {

}

const StackedLineChartExpansionPanelNote: React.FC<ExpansionPanelNoteProps> = () => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const handleChange = () => {
        setExpanded((prevState) => !prevState)
    };

    return (
        <ExpansionPanel
            expanded={expanded}
            onChange={handleChange}
            classes={{
                root: classes.root,
                expanded: classes.rootExpanded
            }}>
            <ExpansionPanelSummary
                classes={{
                    root: classes.summaryRoot,
                    expanded: classes.summaryExpanded
                }}
            >
                <div className={classes.summaryWrapper}>
                    <div className={classes.line}> </div>
                    { expanded ? <RemoveCircleOutlineIcon style={{fontSize: '2rem'}}/> : <AddCircleOutlineIcon style={{fontSize: '2rem'}}/> }
                    <div className={classes.line}> </div>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.detailWrapper}>
                <Title value={['How to use this graph?']}/>
                {
                    contentParagraphs.map((str, i) => <Content value={str} key={i}/>)
                }
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
};

export default StackedLineChartExpansionPanelNote