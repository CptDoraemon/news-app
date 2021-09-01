import {useMemo} from "react";
import * as queryString from "query-string";
import {useLocation} from "react-router-dom";

const useGetCategoryFromQuery = (): null | string => {
	const location = useLocation();
	return  useMemo(() => {
		const qs = queryString.parse(location.search);
		return !qs.category ? null : Array.isArray(qs.category) ? qs.category[0] : qs.category;
	}, [location.search])
}

export default useGetCategoryFromQuery
