import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Chip} from "@material-ui/core";
import getDateString from "../utilities/get-date-string";
import InputLabel from "@material-ui/core/InputLabel";
import CancelIcon from '@material-ui/icons/Cancel';


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 200,
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    cancelIcon: {
        position: 'absolute',
        right: 5
    }
}));

export interface FilterByDateProps{
    pendingDateFilter: number
    dateFilter: number,
    setDateFilter: (date: number) => void,
}

const FilterByDate: React.FC<FilterByDateProps> = ({pendingDateFilter, dateFilter, setDateFilter}) => {
    const classes = useStyles();

    let chip;
    if (dateFilter) {
        chip = (
            <Chip
                label={`${getDateString(dateFilter)}`}
                onDelete={() => setDateFilter(0)}
                classes={{
                    root: classes.root,
                }}
                color={"secondary"}
                deleteIcon={<CancelIcon className={classes.cancelIcon}/>}
            />
        )
    } else if (pendingDateFilter) {
        chip = (
            <Chip
                label={`${getDateString(pendingDateFilter)}`}
                onClick={() => setDateFilter(pendingDateFilter)}
                className={classes.root}
                variant="outlined"
                color={"secondary"}
            />
        )
    } else {
        chip = (
            <Chip
                label={'Use chart to set date'}
                variant="outlined"
                disabled
                className={classes.root}
            />
        )
    }

    return (
        <>
            <InputLabel shrink>Filter by date:</InputLabel>
            {chip}
        </>
    )
};

export default FilterByDate