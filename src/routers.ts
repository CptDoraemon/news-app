export enum NewsCategory {
  HEADLINE = `headline`,
  BUSINESS = `business`,
  ENTERTAINMENT = `entertainment`,
  HEALTH = `health`,
  SCIENCE = `science`,
  SPORTS = `sports`,
  TECHNOLOGY = `technology`
}

export const newsCategories = Object.values(NewsCategory);

export const getBaseAPI = () => {
  return process.env.NODE_ENV === 'production' ? 'http://localhost' : 'https://api.xiaoxihome.com'
}

const routers = {
  root: {
    path: '/',
    getPathWithQuery: ({category}: { category: string }) => `/?category=${category}`
  },
  search: {
    path: '/search'
  },
  analytics: {
    path: '/analytics'
  },
  topic: {
    path: '/topic'
  },
  article: {
    path: '/article/:id',
    getPathWithId: (id: string) => `/article/${id}`
  }
}

export default routers
