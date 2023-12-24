import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import {getSpotDetails} from "../../store/spotDetails";
import { getSpotDetails } from "../../store/spots";
import { getSpotReviews } from "../../store/reviews";
import dateTimeModifier from "../../helpers/dateTimeModifier";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import NewReviewModal from "../NewReviewModal/NewReviewModal";

const SpotDetails = () => {
  const { id } = useParams();
  console.log(id);
  //   const navigate = useNavigate();
  //   const [goToSpot, setGoToSpot] = useState(id);

  const sessionUser = useSelector((state) => state.session.user);

  const spotDetails = useSelector((state) =>
    state.spot ? state.spot[id] : null
  );

  // console.log("line 18 in spot details.jsx");

  const reviewObj = useSelector((state) =>
    state.reviews ? state.reviews : null
  );
  // console.log("this is supposed to be review Obj");
  // console.log(reviewObj);
  const reviewList = Object.values(reviewObj)[0];

  let reviewListLength;
  let reviewsBool;
  if (reviewList && reviewList.length) {
    reviewListLength = reviewList.length;
    reviewsBool = reviewListLength > 0;
  }
  // console.log("This is supposed to be the reviewList");
  // console.log(reviewList);
  // console.log(typeof reviewList);
  // console.log(`reviewList is an array: ${Array.isArray(reviewList)}`);
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
  }, [dispatch, id, reviewListLength]);

  if (!spotDetails || !spotDetails.Owner) {
    console.log("spotDetails is null");
    return <h1>Getting those details for you!</h1>;
  }

  if (!reviewList) {
    return <h1>Loading some reviews for you!</h1>;
  }
  console.log(spotDetails);
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
      {!reviewsBool && <h3>Be the first the leave a review!</h3>}
      {reviewsBool && (
        <section className="spot-reviews">
          {reviewList.map((review) => (
            <div key={review.id}>
              <p>
                This Review was written by {review.User.firstName} and reads the
                following :{review.review}. It was written in
                {" " + dateTimeModifier(review.createdAt, "Month Year")}. This
                user gave this garden spot a rating of {review.stars} stars out
                of 5.
              </p>
            </div>
          ))}
          {sessionUser && sessionUser.id !== spotDetails.Owner.id && (
            <p id="new-review-button">
              <OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<NewReviewModal />}
              />
            </p>
          )}
        </section>
      )}
    </>
  );
};

export default SpotDetails;
