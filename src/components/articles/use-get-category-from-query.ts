import {useMemo} from "react";
import * as queryString from "query-string";
import {useLocation} from "react-router-dom";
import routers from "../../routers";

// main page use only
const useGetCategoryFromQuery = (): null | string => {
  const location = useLocation();
  return useMemo(() => {
    if (location.pathname !== routers.root.path) {
      return null
    }
    const qs = queryString.parse(location.search);
    return !qs.category ? null : Array.isArray(qs.category) ? qs.category[0] : qs.category;
  }, [location.pathname, location.search])
}

export default useGetCategoryFromQuery
