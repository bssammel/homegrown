import { csrfFetch } from "./csrf";

const CREATE_IMAGE = "spotImages/createSpotImage";
// const LOAD_SPOT_REVIEWS = "reviews/loadReviews";

export const createImage = (newImage) => {
  return {
    type: CREATE_IMAGE,
    newImage,
  };
};

// export const loadSpotReviews = (reviews) => {
//   return {
//     type: LOAD_SPOT_REVIEWS,
//     reviews,
//   };
// };

export const createNewSpotImage =
  (newImageData, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newImageData),
    });
    if (!res.ok) {
      return res;
    } else if (res.ok) {
      const createdSpotImage = await res.json();
      dispatch(createImage(newImageData));
      return createdSpotImage;
    }
  };

// export const getSpotReviews = (spotId) => async (dispatch) => {
//   const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
//   if (res.ok) {
//     const spotReviews = await res.json();
//     dispatch(loadSpotReviews(spotReviews));
//   }
// };
// export const deleteCurrentReview = (reviewId) => async (dispatch) => {
//   const res = await csrfFetch(`/api/reviews/${reviewId}`, {
//     method: "DELETE",
//   });
//   if (res.ok) {
//     const deleteReviewMsg = await res.json();
//     dispatch(deleteSpotReview(reviewId));
//     return deleteReviewMsg;
//   }
//   return res;
// };

const spotImagesReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_IMAGE: {
      return { ...state, [action.newImage.id]: action.newSpotImage };
    }
    // case LOAD_SPOT_REVIEWS: {
    //   // console.log("Load spot reviews is running");
    //   const newState = {};
    //   const reviewArr = Object.values(action.reviews);
    //   reviewArr.forEach((review) => {
    //     newState[review.id] = review;
    //   });
    //   return newState;
    // }
    default: {
      console.log("The default state is running");
      return state;
    }
  }
};

export default spotImagesReducer;
