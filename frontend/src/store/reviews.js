import { csrfFetch } from "./csrf";
console.log("the reviews.js file is running");

const CREATE_REVIEW = "reviews/createReview";
const LOAD_SPOT_REVIEWS = "reviews/loadReviews";
const DELETE_REVIEW = "reviews/deleteReviews";

export const createReview = (newReview) => {
  console.log("line 9 of reviews store: the create review action");
  return {
    type: CREATE_REVIEW,
    newReview,
  };
};

export const loadSpotReviews = (reviews) => {
  console.log("line 17 of reviews store: the load review action");
  return {
    type: LOAD_SPOT_REVIEWS,
    reviews,
  };
};

export const deleteSpotReview = (review) => {
  console.log("line 25 of reviews store: the delete review action");
  console.log("delete review action");
  return {
    type: DELETE_REVIEW,
    review,
  };
};

export const createNewReview = (newReviewData, spotId) => async (dispatch) => {
  console.log("line 34 of reviews store: the create review thunk");
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newReviewData),
  });
  if (!res.ok) {
    return res;
  } else if (res.ok) {
    const createdReview = await res.json();
    dispatch(createReview(createReview));
    return createdReview;
  }
};

export const getSpotReviews = (spotId) => async (dispatch) => {
  console.log("line 52 of reviews store: the load review thunk");
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  console.log("response at line 54");
  console.log(res);
  if (res.ok) {
    const spotReviews = await res.json();
    dispatch(loadSpotReviews(spotReviews));
  }
};
export const deleteCurrentReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    const deleteReviewMsg = await res.json();
    dispatch(deleteSpotReview(reviewId));
    return deleteReviewMsg;
  }
  return res;
};

const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_REVIEW: {
      return { ...state, [action.newReview.id]: action.newReview };
    }
    case LOAD_SPOT_REVIEWS: {
      console.log("Load spot reviews reducer case is running");
      const newState = {};
      console.log("line 81 of reviews store, the action.reviews:");
      console.log(action.reviews);
      const reviewArr = Object.values(action.reviews);
      reviewArr.forEach((review) => {
        newState[review.id] = review;
      });
      console.log("line 87, new state:");
      console.log(newState);
      return newState;
    }
    default: {
      console.log("The default state is running");
      return state;
    }
  }
};

export default reviewsReducer;
