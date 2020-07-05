import axios from "axios";
import { FETCH_MOVIES, AUTH_USER, AUTH_ERROR } from './types';

/*
We are using redux thunk instead of redux promise here. Redux thunk allows our action creators to return a function, which is dispatch, and it will wait to call this dispatch function until the api request is complete, so it acts just like a promise but just different syntax. Once the request is returned, we '.then' invoke dispatch with the appropriate object for the action ({type: , payload: }), or we catch an error if it occurs in the api call. "With Thunk, we wrap our action in a function that gets dispatch as an argument, that way we can call dispatch whenever we want, like after a request comes back from a server. Thunk tells redux that some actions are in fact functions and a 'thunk' is a function that wraps an expression to delay its evaluation". We initialized Thunk in src/index.js when we created our store. Action creators are functions that return actions ({type: , payload: }), but here, our action creator is a function that returns a function (dispatch) that is only invoked when the api request finishes. THEN dispatch will be invoked and THEN the action object is returned and sent to the reducer. 
*/
export const fetchMovies = (page = 1) => dispatch => {
  axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_MOVIE_DB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`
  ).then(function (response) {
    dispatch({ type: FETCH_MOVIES, payload: response.data });
  })
  .catch(function (error) {
    console.log(error);
  });
};

export const signup = (formProps, callback) => dispatch => {
  axios.post(
    '/auth/signup',
    formProps
  ).then(function (response) {
    dispatch({ type: AUTH_USER, payload: response.data });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('email', response.data.email);
    callback();
  })
  .catch(function (error) {
    dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
  });
};

export const signin = (formProps, callback) => dispatch => {
  axios.post(
    '/auth/signin',
    formProps
  ).then(function (response) {
    dispatch({ type: AUTH_USER, payload: response.data });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('email', response.data.email);
    callback();
  })
  .catch(function (error) {
    dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
  });
};

export const signout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');

  return {
    type: AUTH_USER,
    payload: ''
  };
};
