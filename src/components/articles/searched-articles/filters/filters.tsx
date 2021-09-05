import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SortPanel, {SortPanelProps} from "./sort-panel";
import FilterByDate, {FilterByDateProps} from "./filter-by-date";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
    }
  },
  itemWrapper: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    }
  }
}));

interface FiltersProps extends SortPanelProps, FilterByDateProps {

}

const Filters: React.FC<FiltersProps> = ({toggleSort, sortType, pendingDateFilter, dateFilter, setDateFilter}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.itemWrapper}>
        <SortPanel toggleSort={toggleSort} sortType={sortType}/>
      </div>
      <div className={classes.itemWrapper}>
        <FilterByDate pendingDateFilter={pendingDateFilter} dateFilter={dateFilter} setDateFilter={setDateFilter}/>
      </div>
    </div>
  )
};

export default Filters
