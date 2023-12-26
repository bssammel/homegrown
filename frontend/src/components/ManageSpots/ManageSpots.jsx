//#TODO:add to App.jsx router
//#TODO:create store/warehouse for getUserSpots within spots store
//TODO:imports for manage spots
//TODO: set up function for manage spots
//TODO: get all desired data out and displayed
//TODO:
//TODO:
//TODO:

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserSpots } from "../../store/spots";

const ManageSpots = () => {
  return (
    <>
      <h1>This is where I would put the current spots if I had any!</h1>
    </>
  );
};

export default ManageSpots;
