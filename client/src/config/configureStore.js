import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

function configureStore(initialState={}) {
  const enhancer = compose(
    applyMiddleware(thunk)
  );

  return createStore(rootReducer, initialState, enhancer);
}

export default configureStore();
