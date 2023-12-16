import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spot/loadSpots'

//this is the action creator for loadSpots, this is triggered in the thunk dispatch
const loadSpots = (spots) => {
    // console.log(5)
    return{
        type: LOAD_SPOTS,
        spots//payload same as spots: spots
    };
};

// this is the fetch for spots, it is within a thunk action creator

export const getAllSpots = () => async (dispatch) => {
    // console.log(4)
    const res = await csrfFetch('/api/spots');
    if(res.ok){
        const spots = await res.json();
        dispatch(loadSpots(spots));//triggers the load spots action on the front
        return spots;
    }
}

//state object
const initialState = {};

/// reducer
const spotsReducer = (state = initialState, action) => {
    // console.log(6)
    switch(action.type){
        case LOAD_SPOTS:{
            const newState = {};
            const spotObj = Object.values(action.spots)
            spotObj.forEach(spot => { 
                newState[spot.id] = spot;
            });
            return newState;
            // return {...state, entries: [...action.spots]};
        }
        default: return state;
    }
}

export default spotsReducer;
