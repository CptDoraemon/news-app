import {useState} from "react";
import {useMount, usePrevious} from "react-use";
import useInputFilter from "./use-input-filter";
import useDatePickerFilter from "./use-date-picker-filter";
import {useHistory, useLocation} from "react-router-dom";
import routers, {newsCategories} from "../../../routers";
import useSelectFilter from "./use-select-filter";

const queryString = require('query-string');

const categoryOptions = [
  {
    key: 'all',
    displayName: 'all'
  },
  ...newsCategories.map(c => ({
    key: c,
    displayName: c
  }))
];

const sortByOptions = [
  {
    key: 'relevance',
    displayName: 'relevance'
  },
  {
    key: 'date',
    displayName: 'date'
  }
];

const sortOrderOptions = [
  {
    key: 'desc',
    displayName: 'descending'
  },
  {
    key: 'asc',
    displayName: 'ascending'
  }
]

const dateToYyyymmdd = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const yyyymmddToDate = (yyyymmdd: string) => {
  const array = yyyymmdd.split('-');
  // @ts-ignore
  return new Date(...array)
}

const useSearchFilters = () => {
  const history = useHistory();
  const location = useLocation();
  const [redirectCounter, setRedirectCounter] = useState(0);
  const previousRedirectCounter = usePrevious(redirectCounter);

  const keyword = useInputFilter('');
  const startDate = useDatePickerFilter(new Date('2020-01-04T00:00:00'));
  const endDate = useDatePickerFilter();
  const category = useSelectFilter(categoryOptions[0].key, categoryOptions);
  const sortBy = useSelectFilter(sortByOptions[0].key, sortByOptions);
  const sortOrder = useSelectFilter(sortOrderOptions[0].key, sortOrderOptions);

  if (previousRedirectCounter !== undefined && previousRedirectCounter !== redirectCounter) {
    const params = {
      keyword: keyword.value,
      startDate: dateToYyyymmdd(startDate.value as Date),
      endDate: dateToYyyymmdd(endDate.value as Date),
      category: category.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    };
    history.push(`${routers.search.path}?${queryString.stringify(params)}`);
  }

  const parseStateFromQueryParam = () => {
    const parsed = queryString.parse(location.search);
    const filters: { [key: string]: any } = {
      keyword,
      startDate,
      endDate,
      category,
      sortBy,
      sortOrder
    }
    Object.keys(parsed).forEach(key => {
      if (key === 'startDate' || key === 'endDate') {
        filters[key]._setValue(yyyymmddToDate(parsed[key]))
      } else if (filters[key] !== undefined) {
        filters[key]._setValue(parsed[key])
      }
    });

    if (location.search.length > 0) {
      setRedirectCounter(prev => prev + 1);
    }
  }

  const submitSearch = async () => {
    if (startDate === null || endDate === null || !keyword) {
      return
    }
    setRedirectCounter(prev => prev + 1);
  };

  useMount(() => parseStateFromQueryParam());

  return {
    keyword,
    startDate,
    endDate,
    category,
    sortBy,
    sortOrder,
    submitSearch,
  }
}

export default useSearchFilters
