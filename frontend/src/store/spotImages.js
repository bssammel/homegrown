import { csrfFetch } from "./csrf";

const CREATE_IMAGE = "spotImages/createSpotImage";

export const createImage = (newImage) => {
  return {
    type: CREATE_IMAGE,
    newImage,
  };
};

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

const spotImagesReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_IMAGE: {
      return { ...state, [action.newImage.id]: action.newSpotImage };
    }
    default: {
      console.log("The default state is running");
      return state;
    }
  }
};

export default spotImagesReducer;
