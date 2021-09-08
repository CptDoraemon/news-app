import React, {ChangeEvent, useCallback, useMemo, useRef} from "react";
import {
  alpha,
  Button,
  CircularProgress, IconButton, InputAdornment,
  makeStyles,
  TextField,
  useMediaQuery
} from "@material-ui/core";
import {KeyboardDatePicker, KeyboardDatePickerProps, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {MOBILE} from "../../theme/theme";
import {useTheme} from "@material-ui/core/styles";
import SelectFilter from "./select-filter";
import {useMount} from "react-use";
import PaperWrapper from "./paper-wrapper";
import useSearchFilters from "./use-search/use-search-filters";
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(1, -1),
    [MOBILE(theme)]: {
      margin: theme.spacing(-0.5),
    },
    '& > div': {
      margin: theme.spacing(1),
      [MOBILE(theme)]: {
        margin: theme.spacing(0.5),
      }
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    margin: theme.spacing(2, -1, 1, -1),
    [MOBILE(theme)]: {
      margin: theme.spacing(1, -0.5),
      // flexDirection: 'column',
      // alignItems: 'flex-start',
      // justifyContent: 'flex-start',
    },
    '& > div': {
      margin: theme.spacing(1),
      [MOBILE(theme)]: {
        margin: theme.spacing(0.5),
      }
    },
  },
  submitButton: {
    width: '12ch',
    fontSize: theme.typography.h6.fontSize,
    height: 56,
    fontWeight: 700,
    '&:disabled': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.3)
    },
    [MOBILE(theme)]: {
      width: '10ch',
      height: 40,
      fontSize: theme.typography.body2.fontSize,
    }
  },
  datePicker: {
    width: 180,
    margin: 0,
  }
}));

interface SearchInputProps {
}

const SearchInput = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(MOBILE(theme));
  const keywordRef = useRef<HTMLInputElement>(null);
  const searchFilter = useSearchFilters();
  const disabled = false;

  const datePickerProps = useMemo<Partial<KeyboardDatePickerProps>>(() => ({
    minDate: '2020-01-01',
    maxDate: new Date(),
    variant: "inline",
    format: "MM/dd/yyyy",
    margin: "dense",
    inputVariant: 'outlined',
    className: classes.datePicker,
    KeyboardButtonProps: {
      'aria-label': 'change date'
    }
  }), [classes.datePicker]);

  useMount(() => {
    keywordRef.current?.focus();
  });

  const handleSubmit = useCallback((e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchFilter.submitSearch()
  }, [searchFilter]);

  const handleClearKeyword = useCallback(() => {
    searchFilter.keyword._setValue('')
  }, [searchFilter.keyword])

  return (
    <PaperWrapper>
      <form className={classes.root} onSubmit={handleSubmit}>
        <div className={classes.inputRow}>
          <div>
            <TextField
              value={searchFilter.keyword.value}
              onChange={searchFilter.keyword.handleChange}
              id={'news-search-text-field'}
              label={'Keyword'}
              variant={'outlined'}
              InputLabelProps={{shrink: false, classes: {root: classes.inputLabel}}}
              inputRef={keywordRef}
              size={isMobile ? 'small' : 'medium'}
              fullWidth={true}
              disabled={disabled}
              InputProps={{
                endAdornment: searchFilter.keyword.value.length > 0 ?
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear keyword"
                      onClick={handleClearKeyword}
                      edge="end"
                    >
                      <CancelIcon/>
                    </IconButton>
                  </InputAdornment> :
                  <></>
              }}
            />
          </div>
          <div>
            <Button
              variant={'contained'}
              disableElevation
              color={'secondary'}
              type={'submit'}
              disabled={disabled}
              className={classes.submitButton}
            >
              {
                disabled ?
                  <CircularProgress size={15}/> :
                  'Search'
              }
            </Button>
          </div>
        </div>
        <div className={classes.filterRow}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div>
              <KeyboardDatePicker
                id="date-picker-start-date"
                label="Start Date"
                value={searchFilter.startDate.value}
                onChange={searchFilter.startDate.handleChange}
                disabled={disabled}
                {...datePickerProps}
              />
            </div>
            <div>
              <KeyboardDatePicker
                id="date-picker-end-date"
                label="End Date"
                value={searchFilter.endDate.value}
                onChange={searchFilter.endDate.handleChange}
                disabled={disabled}
                {...datePickerProps}
              />
            </div>
          </MuiPickersUtilsProvider>
          <div>
            <SelectFilter label={'category'} data={searchFilter.category}/>
          </div>
          <div>
            <SelectFilter label={'sort by'} data={searchFilter.sortBy}/>
          </div>
          <div>
            <SelectFilter label={'sort order'} data={searchFilter.sortOrder}/>
          </div>
        </div>
      </form>
    </PaperWrapper>
  )
};

export default SearchInput
