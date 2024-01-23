import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getAllSpots } from "../../store/spots";
import "./AllSpots.css";

const SpotList = () => {
  // console.log(state);
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const spotList = useSelector((state) => Object.values(state.spot));
  // console.log(7);
  // console.log(spotList);

  //   function goToSpot(spotId) {
  //     dispatch(getSpotDetails(spotId));
  //     navigate(`/spots/${spotId}`);
  //   }

  useEffect(() => {
    console.log(8);
    dispatch(getAllSpots());
  }, [dispatch]);

  if (!Array.isArray(spotList[0])) {
    return <h1>Looking for spots in your area!</h1>;
  }
  const hasReviews = function (spot) {
    if (spot) {
      if (spot.avgRating > 0) {
        // console.log(`the current user is the author`);
        const formattedRating = spot.avgRating.toFixed(2);
        return formattedRating;
      } else {
        // console.log(`The current user is not the author.`);
        return "New";
      }
    } else return 0;
  };
  return (
    <>
      <h1 id="all-spots-title">Grow Spots</h1>
      <section className="spots-grid">
        {spotList[0]?.map((spot) => (
          <NavLink
            key={spot.id}
            className="single-spot"
            to={`/spots/${spot.id}`}
          >
            <div
              className="spot-data"
              //   key={spot.id}
              //   className="single-spot"
              // onClick={navigate(`/spots/${spot.id}`)}
            >
              <div className="image">
                <img
                  className="spot-image"
                  src={spot.previewImage}
                  alt=""
                  // height={250}
                  // width={250}
                />
              </div>

              <div className="location-rating">
                <p id="city-state">
                  {spot.city}, {spot.state}
                </p>
                <p id="star-rating">★ {hasReviews(spot)}</p>
              </div>

              <p id="price">${spot.price} night</p>
            </div>
          </NavLink>
        ))}
      </section>
    </>
  );
};

export default SpotList;
