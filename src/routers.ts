export enum NewsCategory {
	HEADLINE= `headline`,
	BUSINESS= `business`,
	ENTERTAINMENT= `entertainment`,
	HEALTH= `health`,
	SCIENCE= `science`,
	SPORTS= `sports`,
	TECHNOLOGY= `technology`
}

export const newsCategories = Object.values(NewsCategory);

const routers = {
	root: {
		path: '/',
		getPathWithQuery: ({category}: {category: string}) => `/?category=${category}`
	},
	search: {
		path: '/search'
	},
	analytics: {
		path: '/analytics'
	},
	topic: {
		path: '/topic'
	}
}

export default routers
