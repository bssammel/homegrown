import { csrfFetch } from "./csrf";
console.log("the spot.js file is running");

//? These are all the action types used! They are listed in CRUD order from least specific to most specific
const CREATE_SPOT = "spots/createSpot";
const LOAD_SPOTS = "spots/loadSpots";
const LOAD_SPOT_DETAILS = "spots/loadDetails";
const LOAD_USER_SPOTS = "spots/loadUserSpots";
const EDIT_SPOT = "spots/editSpot";
const DELETE_SPOT = "spots/deleteSpot";

//?These are all the action creators listed in CRUD order from least specific to most specific
export const createSpot = (newSpot) => {
  return {
    type: CREATE_SPOT,
    newSpot,
  };
};
//this is the action creator for loadSpots, this is triggered in the thunk dispatch
export const loadSpots = (spots) => {
  //   console.log(5);
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

export const loadUserSpots = (userSpots) => {
  console.log("loadUserSpots function in spots.js");
  return {
    type: LOAD_USER_SPOTS,
    userSpots,
  };
};

export const editSpot = (editSpot) => {
  console.log("edit spot action");
  return {
    type: EDIT_SPOT,
    editSpot,
  };
};

export const deleteSpot = (spot) => {
  console.log("delete spot action");
  return {
    type: DELETE_SPOT,
    spot,
  };
};

//?These are all the thunk action creators! Listed in CRUD order!
export const createNewSpot = (newSpotData) => async (dispatch) => {
  console.log("hello I am here on line 63 in store/spots.js");
  console.log(newSpotData);

  const res = await csrfFetch(`/api/spots`, {
    method: "POST",
    body: JSON.stringify(newSpotData),
  });
  let data = await res.json();
  if (res.ok) {
    dispatch(createSpot(data));
  }
  return data;
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

export const getCurrentUserSpots = () => async (dispatch) => {
  // console.log("The getCurrentUserSpots function in spots.js is running");
  const res = await csrfFetch(`/api/spots/current`);
  console.log(res);
  if (res.ok) {
    // console.log("response was okay");
    const userSpots = await res.json();
    // console.log("this is a line trying to figure out when an error is throwing" );
    // console.log(userSpots);
    dispatch(loadUserSpots(userSpots));
  }
};

export const editCurrentSpot = (editSpotData) => async (dispatch) => {
  console.log("editSpotData");
  console.log(editSpotData);
  const res = await csrfFetch(`/api/spots/${editSpotData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editSpotData),
  });

  if (!res.ok) {
    return res;
  }

  if (res.ok) {
    const editedSpot = await res.json();
    console.log("res");
    console.log(res);
    dispatch(editSpot(editedSpot));
    return editedSpot;
  }
};

export const deleteCurrentSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    const deleteSpotMsg = await res.json();
    dispatch(deleteSpot(spotId));
    return deleteSpotMsg;
  }
  return res;
};

//state object
// const initialState = {};

/// reducer
const spotsReducer = (state = {}, action) => {
  // console.log(6)
  switch (action.type) {
    case CREATE_SPOT: {
      return { ...state, [action.newSpot.id]: action.newSpot };
    }
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
    case LOAD_USER_SPOTS: {
      // return { ...state, [action.userSpots]: action.userSpots };
      const newState = {};
      const userSpotObj = Object.values(action.userSpots);
      userSpotObj.forEach((userSpot) => {
        newState[userSpot.id] = userSpot;
      });
      return newState;
    }
    case EDIT_SPOT: {
      return { ...state, [action.editSpot.id]: action.editSpot };
    }
    case DELETE_SPOT: {
      return { ...state, spot: [action.spot] };
    }
    default:
      return state;
  }
};

export default spotsReducer;
