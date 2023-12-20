import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import {getSpotDetails} from "../../store/spotDetails";
import { getSpotDetails } from "../../store/spots";
import { getSpotReviews } from "../../store/reviews";
import dateTimeModifier from "../../helpers/dateTimeModifier";

const SpotDetails = () => {
  const { id } = useParams();
  console.log(id);
  //   const navigate = useNavigate();
  //   const [goToSpot, setGoToSpot] = useState(id);

  const spotDetails = useSelector((state) =>
    state.spot ? state.spot[id] : null
  );

  console.log("line 18 in spot details.jsx");

  const reviewObj = useSelector((state) =>
    state.reviews ? state.reviews : null
  );
  console.log("this is supposed to be review Obj");
  console.log(reviewObj);
  const reviewList = Object.values(reviewObj)[0];
  console.log("This is supposed to be the reviewList");
  console.log(reviewList);
  console.log(typeof reviewList);
  console.log(`reviewList is an array: ${Array.isArray(reviewList)}`);
  // console.log(`reviewList is ${reviewList.length} items long`);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetails(id))
      // .then(
      //   console.log(
      //     "The useEffect is going to dispatch the getSpotReviews action"
      //   )
      // )
      .then(() => dispatch(getSpotReviews(id)));
  }, [dispatch, id]);

  if (!spotDetails) {
    console.log("spotDetails is null");
    return <h1>Getting those details for you!</h1>;
  }

  if (!reviewList) {
    return <h1>Loading some reviews for you!</h1>;
  }

  return (
    <>
      <section className="spot-details">
        <h1>{spotDetails.name}</h1>
        <p className="location">
          {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
        </p>
        <h2 className="hostDetails">
          Hosted by: {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
        </h2>
        <p className="description">{spotDetails.description}</p>
      </section>
      <section className="spot-reviews">
        {reviewList.map((review) => (
          <div key={review.id}>
            <p>
              This Review was written by {review.User.firstName} and reads the
              following :{review.review}. It was written in
              {" " + dateTimeModifier(review.createdAt, "Month Year")}. This
              user gave this garden spot a rating of {review.stars} stars out of
              5.
            </p>
          </div>
        ))}
      </section>
    </>
  );
};

export default SpotDetails;
