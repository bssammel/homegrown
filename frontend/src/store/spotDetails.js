// import { csrfFetch } from "./csrf";

// const LOAD_SPOT_DETAILS = 'spotDetails/loadDetails';
// console.log("spotDetails.js is running")

// //this is the action creator triggered in the thunk
// const loadSpotDetails = (spotDetails) => {
//     console.log("loadSpotDetails function in spotDetails.js")
//     return {
//         type: LOAD_SPOT_DETAILS,
//         spotDetails
//     };
// };

// //this is the fetch for the details of a specific spot, it is within a thunk action creator
// export const getSpotDetails = (spotId) => async (dispatch) => {
//     const res = await csrfFetch(`api/spots/${spotId}`);
//     if(res.ok){
//         console.log("the response was okay")
//         const spotDetails = await res.json();
//         console.log(spotDetails)
//         dispatch(loadSpotDetails(spotDetails));
//         return spotDetails;
//     }else{
//         console.log("the response was not okay")
//     }
// }

// const initialState = {};

// const spotDetailsReducer = (state = initialState, action) => {
//     console.log("yo, this is supposed to be the spotDetailsReducer running")
//     switch(action.type){
//         case LOAD_SPOT_DETAILS:{
//             const newState = {};
//             console.log("this is supposed to be the action")
//             console.log(action)
//             const spotDetailsObj = action.spotDetails;
//             newState.spotDetails = spotDetailsObj;
//             return newState;
//         }
//         default : {
//             console.log("the default case in spotDetails is running")
//             return state;
//         }
//     }
// }

// export default spotDetailsReducer;
