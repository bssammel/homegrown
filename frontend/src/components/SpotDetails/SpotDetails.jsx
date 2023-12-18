import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import {getSpotDetails} from "../../store/spotDetails";
import { getSpotDetails } from "../../store/spots";

const SpotDetails = () => {
  const { spotId } = useParams();
  //   const navigate = useNavigate();
  //   const [goToSpot, setGoToSpot] = useState(spotId);

  const spotDetails = useSelector((state) =>
    state.spots ? state.spots[spotId] : null
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
  }, [dispatch, spotId]);

  return (
    <>
      <h1>{spotDetails.name}</h1>
      <p className="location">
        {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
      </p>
      <h2 className="hostDetails">
        Hosted by: {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
      </h2>
      <p className="description">{spotDetails.description}</p>
    </>
  );
};

export default SpotDetails;
