import { FETCH_MOVIES } from '../actions/types';

import { normalize, schema } from 'normalizr';

/*
Normalizing payload data: The normalizr library allows us to de-nest our redux state, or create an object of movie objects that each have an id (which makes it very easy to find the movie we want in other parts of the code, we won't have to search through an array to find an item by the id, we can access it directly. This can be seen in the mapStateToProps function where we return {movie: movies[ownProps.match.params.id]}). This is what our state will look like:
{
  297802: { vote_count: 1618, id: 297802, video: false, vote_average: 6.9, title: "Aquaman", … },
  299536: { vote_count: 10427, id: 299536, video: false, vote_average: 8.3, title: "Avengers: Infinity War", … },
  324857: { vote_count: 728, id: 324857, video: false, vote_average: 8.5 }
}

This is very helpful in the situation where APIs return JSON data with deeply nested objects and change the structure to match the state that we want. See link for good example on transforming blog post data into an object we can easily access with id's:
https://github.com/paularmstrong/normalizr
*/
export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_MOVIES:

      const movieSchema = new schema.Entity('movies');

      const movieListSchema = new schema.Array(movieSchema);

      console.log(normalize(action.payload.results, movieListSchema))

      const normalizedMovies = normalize(action.payload.results, movieListSchema).entities.movies;

      return {...normalizedMovies, ...state} ;
    default:
      return state;
  }
}
