import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getCurrentUserSpots } from "../../store/spots";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";
import "./ManageSpots.css";

const ManageSpots = () => {
  console.log("the Manage Spots is running");
  const sessionUser = useSelector((state) => state.session.user);
  console.log(sessionUser);

  //if sessionUser is null, then we need to redirect them to home with a pop up with "You are not signed in! If you would like to manage your spots, please sign in"

  const currentUserSpotsArr = useSelector((state) => {
    Object.values(state.spot);
    console.log(state);
    console.log(state.spot);
    return Object.values(state.spot)[0];
  });

  console.log("currentUserSpots");
  console.log(currentUserSpotsArr);

  let numUserSpots;
  let showUserSpots = false;

  if (
    Array.isArray(currentUserSpotsArr) &&
    currentUserSpotsArr.length &&
    sessionUser
  ) {
    numUserSpots = currentUserSpotsArr.length;
    if (numUserSpots > 0) showUserSpots = true;
  } else {
    numUserSpots = -1;
  }

  const dispatch = useDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    console.log("The useEffect in ManageSpots.jsx is executing");
    dispatch(getCurrentUserSpots());
  }, [dispatch, numUserSpots]); //add length here for delete function, maybe need one for update too? hmmmmmmmm how could I tell what changes were implemented?-- oh, updatedAt, if the updatedAt value changes, then I know it was changed.

  const handleModalClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const hasReviews = function (spot) {
    if (spot) {
      if (typeof spot.avgRating === "string") {
        spot.avgRating = Number(spot.avgRating);
        console.log(
          "$$$$$$$$$$$$$$$$$$$$$$$$$$$ what is going on with avg rating? here is spot.avgRating: ",
          spot.avgRating,
          "`\n`  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ spot rating type: " +
            typeof spot.avgRating
        );
      }
      console.log(
        "&&&&&&&&&&&&&&&&&&&&&&&&&&& what is going on with avg rating? here is spot.avgRating: ",
        spot.avgRating,
        "`\n`  &&&&&&&&&&&&&&&&&&&&&& spot rating type: " +
          typeof spot.avgRating
      );
      if (spot.avgRating > 0 && typeof spot.avgRating === "number") {
        // console.log(`the current user is the author`);
        const formattedRating = spot.avgRating.toFixed(2);
        return formattedRating;
        // return spot.avgRating;
      } else {
        // console.log(`The current user is not the author.`);
        return "New";
      }
    } else numUserSpots++;
  };

  return (
    <>
      <h1>Manage Spots</h1>
      {/* 
      {console.log("values to show create spot button")}
      {console.log(numUserSpots)}
      {console.log(sessionUser)} */}
      {sessionUser && (
        <h1 className="nav-button" id="new-spot-button">
          <NavLink exact to="/spots/new">
            Create a New Spot
          </NavLink>
        </h1>
      )}

      {showUserSpots && (
        <section className="spots-grid">
          {currentUserSpotsArr.map((spot) => (
            <NavLink
              key={spot.id}
              className="single-spot"
              to={`/spots/${spot.id}`}
            >
              <div className="spot-data">
                <div className="image">
                  <img className="spot-image" src={spot.previewImage} alt="" />
                </div>
              </div>
              <div className="details">
                <div className="location-rating">
                  <p id="city-state">
                    {spot.city}, {spot.state}
                  </p>
                  <p id="star-rating">★ {hasReviews(spot)}</p>
                </div>

                <p id="price">${spot.price.toFixed(2)} night</p>
                <ul>
                  <li
                    className="user-spot-button button remove-underline"
                    id="update-spot-button"
                  >
                    <NavLink to={`/spots/${spot.id}/edit`}>Update</NavLink>
                  </li>
                  <li
                    className="user-spot-button remove-bullet"
                    id={`delete-spot-button-${spot.id}`}
                    onClick={handleModalClick}
                  >
                    <OpenModalButton
                      buttonText="Delete"
                      // onButtonClick={navigate("/spots/current")}
                      modalComponent={
                        <DeleteSpotModal state={{ id: spot.id }} />
                      }
                    />
                  </li>
                </ul>
              </div>
            </NavLink>
          ))}
        </section>
      )}
    </>
  );
};

export default ManageSpots;
