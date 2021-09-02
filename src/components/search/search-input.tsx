import React from "react";
import {Button, makeStyles, TextField} from "@material-ui/core";
import useSearch from "./useSearch";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles((theme) => ({
	root: {
	  width: '100%',
  },
  inputRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(-1),
    '& > div': {
      margin: theme.spacing(1),
    },
    '& div:first-child': {
      flex: '1 1 auto'
    },
    '& div:last-child': {
      flex: '0 0 auto'
    }
  },
  inputLabel: {
	  display: 'none'
  },
  filterRow: {

  }
}));

interface SearchInputProps {}

const SearchInput = () => {
  const classes = useStyles();
  const search = useSearch();

  return (
    <div className={classes.root}>
      <div className={classes.inputRow}>
        <div>
          <TextField
            value={search.keyword}
            onChange={search.handleKeywordChange}
            id={'news-search-text-field'}
            label={'Keyword'}
            variant={'outlined'}
            InputLabelProps={{ shrink: false, classes: {root: classes.inputLabel} }}
            size={'small'}
            fullWidth={true}
          />
        </div>
        <div>
          <Button variant={'contained'} disableElevation color={'secondary'} style={{height: 40}}>
            Search
          </Button>
        </div>
      </div>
      <div className={classes.filterRow}>
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={search.startDate}
            onChange={search.handleStartDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          </MuiPickersUtilsProvider>
        </div>
      </div>
    </div>
  )
};

export default SearchInput
