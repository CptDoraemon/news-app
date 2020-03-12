import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SortTypes from "./sort-types";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2, 0),
    }
}));

interface SortPanelProps{
    sortByDate: () => void,
    sortByRelevance: () => void,
    sortType: SortTypes
}

const SortPanel: React.FC<SortPanelProps> = ({sortByDate, sortByRelevance, sortType}) => {
    const classes = useStyles();

    const handleChange = (e: any) => {
        const newType = e.target.value;
        if (newType === sortType) return;

        switch (newType) {
            case SortTypes.RELEVANCE:
                sortByRelevance();
                break;
            case SortTypes.DATE:
                sortByDate();
                break;
            default:
                sortByRelevance();
        }
    };

    return (
        <FormControl className={classes.root} color={"secondary"}>
            <InputLabel htmlFor="searched-article-sort">Sort By</InputLabel>
            <Select
                native
                value={sortType}
                onChange={handleChange}
                inputProps={{
                    name: 'sort',
                    id: 'searched-article-sort',
                }}
            >
                <option value={SortTypes.RELEVANCE}>{SortTypes.RELEVANCE.toLowerCase()}</option>
                <option value={SortTypes.DATE}>{SortTypes.DATE.toLowerCase()}</option>
            </Select>
        </FormControl>
    )
};

export default SortPanel