import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';
import sessionReducer from './session';
import spotsReducer from './spots';
import spotDetailsReducer from './spotDetails';

console.log(1)
const rootReducer = combineReducers({
  session: sessionReducer,
  spot : spotsReducer,
  spotDetails: spotDetailsReducer
  
});
console.log(2)

let enhancer; //special version of createStore that wraps another layer around redux store to allow for the enhaned store to change how a store behaves
if (import.meta.env.MODE === 'production') {//in production this enhancer will apply the thunk middleware only
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;//in development we want to be able to ciew err
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));

}

const configureStore = (preloadedState) => {
  console.log(3)
    return createStore(rootReducer, preloadedState, enhancer);
  };

export default configureStore;
