import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import {getSpotDetails} from "../../store/spotDetails";
import { getSpotDetails } from "../../store/spots";

const SpotDetails = () => {
  const { id } = useParams();
  console.log(id);
  //   const navigate = useNavigate();
  //   const [goToSpot, setGoToSpot] = useState(id);

  const spotDetails = useSelector((state) =>
    state.spot ? state.spot[id] : null
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetails(id));
  }, [dispatch, id]);

  if (!spotDetails) {
    console.log("spotDetails is null");
    return <h1>spotDetails is null</h1>;
  }

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
