import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import configureStore from "./redux/configureStore";

// function fetchNews() {
//     fetch()
// }

const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <div>

            </div>
        </Provider>
    )
}

export default App;
