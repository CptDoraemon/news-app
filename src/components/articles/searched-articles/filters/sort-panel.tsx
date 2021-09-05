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
    minWidth: 200
  },
  resetFontSize: {
    fontSize: theme.typography.fontSize
  }
}));

export interface SortPanelProps {
  toggleSort: (sortType: SortTypes) => void,
  sortType: SortTypes
}

const SortPanel: React.FC<SortPanelProps> = ({toggleSort, sortType}) => {
  const classes = useStyles();

  const handleChange = (e: any) => {
    const newType = e.target.value;
    if (newType === sortType) return;

    toggleSort(newType);
  };

  return (
    <FormControl className={classes.root} color={"secondary"}>
      <InputLabel htmlFor="searched-article-sort">Sort by</InputLabel>
      <Select
        value={sortType}
        onChange={handleChange}
        inputProps={{
          name: 'sort',
          id: 'searched-article-sort',
        }}
        className={classes.resetFontSize}
      >
        <MenuItem value={SortTypes.relevance}
                  className={classes.resetFontSize}>{capitalizeString(SortTypes.relevance)}</MenuItem>
        <MenuItem value={SortTypes.date} className={classes.resetFontSize}>{capitalizeString(SortTypes.date)}</MenuItem>
      </Select>
    </FormControl>
  )
};

export default SortPanel
