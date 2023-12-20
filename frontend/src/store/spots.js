import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/loadSpots";
const LOAD_SPOT_DETAILS = "spots/loadDetails";

//this is the action creator for loadSpots, this is triggered in the thunk dispatch
export const loadSpots = (spots) => {
  console.log(5);
  return {
    type: LOAD_SPOTS,
    spots, //payload same as spots: spots
  };
};

//this is the action creator for loadSpotDetails, this is triggered in the thunk dispatch
export const loadSpotDetails = (detailedSpot) => {
  console.log("loadSpotDetails function in spots.js");
  return {
    type: LOAD_SPOT_DETAILS,
    detailedSpot,
  };
};

// this is the fetch for spots, it is within a thunk action creator

export const getAllSpots = () => async (dispatch) => {
  console.log("The getAllSpots function in spots.js is running");
  const res = await csrfFetch("/api/spots");
  if (res.ok) {
    const spots = await res.json();
    dispatch(loadSpots(spots)); //triggers the load spots action on the front
    return spots;
  }
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  if (res.ok) {
    console.log("The getSpotDetails function in spots.js is running");
    const spotDetails = await res.json();
    dispatch(loadSpotDetails(spotDetails));
  }
};

//state object
// const initialState = {};

/// reducer
const spotsReducer = (state = {}, action) => {
  // console.log(6)
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = {};
      const spotObj = Object.values(action.spots);
      spotObj.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
      // return {...state, entries: [...action.spots]};
    }
    case LOAD_SPOT_DETAILS:
      return { ...state, [action.detailedSpot.id]: action.detailedSpot };
    default:
      return state;
  }
};

// export const spotDetailsReducer = (state = initialState, action) => {
//   console.log("yo, this is supposed to be the spotDetailsReducer running");
//   switch (action.type) {
//     case LOAD_SPOT_DETAILS: {
//       const newState = {};
//       console.log("this is supposed to be the action");
//       console.log(action);
//       const spotDetailsObj = action.spotDetails;
//       newState.spotDetails = spotDetailsObj;
//       return newState;
//     }
//     default: {
//       console.log("the default case in spotDetails is running");
//       return state;
//     }
//   }
// };

export default spotsReducer;