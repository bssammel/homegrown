import { csrfFetch } from "./csrf";
console.log("the reviews.js file is running");

const LOAD_SPOT_REVIEWS = "reviews/loadReviews";

export const loadSpotReviews = (reviews) => {
  return {
    type: LOAD_SPOT_REVIEWS,
    reviews,
  };
};

export const getSpotReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const spotReviews = await res.json();
    dispatch(loadSpotReviews(spotReviews));
  }
};

const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      console.log("Load spot reviews is running");
      const newState = {};
      const reviewArr = Object.values(action.reviews);
      reviewArr.forEach((review) => {
        newState[review.id] = review;
      });
      return newState;
    }
    default: {
      console.log("The default state is running");
      return state;
    }
  }
};

export default reviewsReducer;
