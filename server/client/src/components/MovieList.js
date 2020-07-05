import React, { Component } from "react";
import styled from "styled-components";
import Movie from "./Movie";
import { connect } from "react-redux";
import * as actions from '../actions';
import _ from "lodash";
import InfiniteScroll from 'react-infinite-scroller';

class MovieList extends Component {  
  constructor () {
    super()
    
    this.loadItems = this.loadItems.bind(this)
    
    this.state = {
      hasMoreItems: true
    }
  }

  // componentDidMount () {
  //   this.props.fetchMovies()
  // }

  loadItems (page) {
    if (page < this.props.totalPages || this.props.totalPages === 0) {
      this.props.fetchMovies(page)
    } else {
      this.setState({ hasMoreItems: false })
    }
  }

  render() {
    // we are using lodash's map function because this.props.movies is an object and the built-in js map function only works on arrays. We need to perform a function on every item in an object here, and lodash allows that functionality. For every movie in the object we will instantiate and return a Movie component to fill the Movie Grid component.
    // const movies = _.map(this.props.movies, (m) => {
    //   return <Movie id={m.id} key={m.id} title={m.title} img={m.poster_path} />
    // });

   
      const movies = this.props.order.map((id) => {
        const movie = this.props.movies[id];
  
        return <Movie id={movie.id} key={id} title={movie.title} img={movie.poster_path} />
      });

    // Instead of needing to have a user click a page button through pagination, we can implement the Infinite Scroll component (a custom npm package). For this library we need to define a pageStart number, a loadMore function and a hasMore boolean value, plus the items or components that we want rendered (in this case the Movie Grid). The loadMore function will be conditionally invoked, based on the boolean value of the hasMore prop. If we scroll to the bottom and the state of hasMoreItems is true, more will be loaded. In the loadItems function, we'll determine if there are more "pages" to load and if so, we'll call fetch movies with the new "page" and the hasMoreItems state prop will stay true. If we're at the last page, hasMoreItems will be set to false and the scroll will stop.
    return (
      <InfiniteScroll
        loadMore={this.loadItems}
        pageStart={0}
        hasMore={this.state.hasMoreItems}>
        <MovieGrid>
          {movies}
        </MovieGrid>
      </InfiniteScroll>
    );
  }
}

function mapStateToProps (state) {
  return {
    movies: state.movies,
    order: state.movies_order,
    totalPages: state.total_pages
  }
};

export default connect(
  mapStateToProps,
  actions
)(MovieList);

/* Notice that Movie Grid is not an imported component from another file. We are defining the component here as a styled div. This would be a stateless component and we really only care about the css it provides, so styled components are a new way to combine React, ES6 and CSS in a simplified way. See full documentation at the link below, with some basics detailed below
https://styled-components.com/docs
*/
const MovieGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 2em;
  margin: 0 auto;
`;

/*
Styled component benefits:
1. Automatic critical CSS: styled-components keeps track of which components are rendered on a page and injects their styles and nothing else, fully automatically. Combined with code splitting, this means your users load the least amount of code necessary.

2. No class name bugs: styled-components generates unique class names for your styles. You never have to worry about duplication, overlap or misspellings.

3. Easier deletion of CSS: it can be hard to know whether a class name is used somewhere in your codebase. styled-components makes it obvious, as every bit of styling is tied to a specific component. If the component is unused (which tooling can detect) and gets deleted, all its styles get deleted with it.

4. Simple dynamic styling: adapting the styling of a component based on its props or a global theme is simple and intuitive without having to manually manage dozens of classes.

5. Painless maintenance: you never have to hunt across different files to find the styling affecting your component, so maintenance is a piece of cake no matter how big your codebase is.

6. Automatic vendor prefixing: write your CSS to the current standard and let styled-components handle the rest.
*/