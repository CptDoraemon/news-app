import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer, {initState} from './reducers'
// import { createLogger } from 'redux-logger'
// const loggerMiddleware = createLogger();

const preloadedState = initState;
export default function configureStore() {
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(thunkMiddleware)
        // applyMiddleware(thunkMiddleware, loggerMiddleware)
    )
}