import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpotDetails } from "../../store/spotDetails";

const SpotDetails = () => {
  const { spotId } = useParams();
  // const spotDetails = useSelector(
  //     state => state.spot.entries.find(singleSpot => singleSpot.id === spotId )
  // )
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const spotDetails = useSelector((state) => state.spotDetails.spotDetails);
  console.log("hey this is supposed to be the spotDetails obj");
  console.log(spotDetails);

  useEffect(() => {
    console.log("this is the useEffect in spotdetailsjsx");

    dispatch(getSpotDetails(parseInt(spotId))).then(() => setIsLoading(false));
  }, [dispatch, spotId]);
  //   if (isLoading) {
  //     return <h1>Loading...</h1>;
  //   } else {
  return (
    <>
      <h1>{spotDetails.name}</h1>
      <p className="location">
        {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
      </p>
      <h2>
        Hosted by: {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
      </h2>
      <p>{spotDetails.description}</p>
    </>
  );
};

export default SpotDetails;
