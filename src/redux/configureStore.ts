import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import {initState} from "./state";
import rootReducers from "./reducers/root-reducers";

// import { createLogger } from 'redux-logger'
// const loggerMiddleware = createLogger();

const preloadedState = initState;
export default function configureStore() {
    return createStore(
        rootReducers,
        preloadedState,
        applyMiddleware(thunkMiddleware)
        // applyMiddleware(thunkMiddleware, loggerMiddleware)
    )
}