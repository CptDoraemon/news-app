import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SortTypes from "./sort-types";
import {MenuItem} from "@material-ui/core";

const capitalizeString = (string: string) => {
    const lowercase = string.toLowerCase();
    return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);

};

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2, 0),
        minWidth: 200
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
                value={sortType}
                onChange={handleChange}
                inputProps={{
                    name: 'sort',
                    id: 'searched-article-sort',
                }}
            >
                <MenuItem value={SortTypes.RELEVANCE}>{capitalizeString(SortTypes.RELEVANCE)}</MenuItem>
                <MenuItem value={SortTypes.DATE}>{capitalizeString(SortTypes.DATE)}</MenuItem>
            </Select>
        </FormControl>
    )
};

export default SortPanel