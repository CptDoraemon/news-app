import React from "react";
import {AppBar, makeStyles, Tab, Tabs} from "@material-ui/core";
import {Link} from 'react-router-dom';
import {newsCategories} from "./news-categories";
import useGetCategoryFromQuery from "../articles/use-get-category-from-query";

const useStyles = makeStyles((theme) => ({
	tab: {
		flexShrink: 0,
		flexGrow: 1,
		color: theme.palette.primary.contrastText
	},
	appBarBottomBoxShadow: {
		boxShadow: '0px 4px 4px -1px rgba(0,0,0,0.2), 0px 5px 5px 0px rgba(0,0,0,0.14), 0px 10px 10px 0px rgba(0,0,0,0.12)'
	},
}));

interface HeaderTabsProps {}

const HeaderTabs = () => {
  const classes = useStyles();
	const category = useGetCategoryFromQuery() || '';

  return (
		<AppBar color="primary" position={'static'} className={classes.appBarBottomBoxShadow}>
			<Tabs
				value={(newsCategories as string[]).indexOf(category)}
				indicatorColor="secondary"
				textColor="secondary"
				variant="scrollable"
				scrollButtons="auto"
			>
				{
					newsCategories.map((category, i) =>
						<Tab
							label={category}
							key={category}
							className={classes.tab}
							component={Link}
							to={`/?category=${category}`}
						/>)
				}
			</Tabs>
		</AppBar>
  )
};

export default HeaderTabs
