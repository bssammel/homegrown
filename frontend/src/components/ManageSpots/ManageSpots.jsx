//#TODO:add to App.jsx router
//#TODO:create store/warehouse for getUserSpots within spots store
//#TODO: imports for manage spots
//TODO: set up function for manage spots
//TODO: get all desired data out and displayed
//TODO:
//TODO:
//TODO:

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getCurrentUserSpots } from "../../store/spots";

const ManageSpots = () => {
  console.log("the Manage Spots is running");
  const sessionUser = useSelector((state) => state.session.user);
  console.log(sessionUser);

  //if sessionUser is null, then we need to redirect them to home with a pop up with "You are not signed in! If you would like to manage your spots, please sign in"

  const currentUserSpotsArr = useSelector((state) => {
    Object.values(state.spot);
    console.log(state);
    console.log(state.spot);
    return Object.values(state.spot);
  });

  console.log("currentUserSpots");
  console.log(currentUserSpotsArr);

  let numUserSpots = currentUserSpotsArr.length;
  //dependency array  value for rerendering when a spot is deleted

  //   const updatedAtArrayFunc = function (userSpotsArr) {
  //     const updatedAtArr = [];
  //     for (let i = 0; i < numUserSpots; i++) {
  //       const spot = userSpotsArr[i];
  //       const updatedAtVal = spot.updatedAt;
  //       console.log(updatedAtVal);
  //       updatedAtArr.push(updatedAtVal);
  //     }
  //     return updatedAtArr;
  //   };

  //   const updatedAtArr = updatedAtArrayFunc(currentUserSpotsArr);
  //considering potential issue with updated at and how objects work won't always come back the exact same order, but since that would just cause an additional rerender, I think it should be fine.

  //Okay it was not fine, it was constantly re-rendering and constantly calling to the db.

  //going to have to try it within the update form.

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("The useEffect in ManageSpots.jsx is executing");
    dispatch(getCurrentUserSpots());
  }, [dispatch, numUserSpots]); //add length here for delete function, maybe need one for update too? hmmmmmmmm how could I tell what changes were implemented?-- oh, updatedAt, if the updatedAt value changes, then I know it was changed.

  return (
    <>
      <h1>This is where I would put the current spots if I had any!</h1>
      {sessionUser && numUserSpots < 1 && (
        <li className="nav-button" id="new-spot-button">
          <NavLink exact to="/spots/new">
            Create a New Spot
          </NavLink>
        </li>
      )}
    </>
  );
};

export default ManageSpots;
