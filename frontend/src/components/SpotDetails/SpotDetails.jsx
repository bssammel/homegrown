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
  let ownerId;
  if (spotDetails && spotDetails.Owner) {
    ownerId = spotDetails.Owner.id;
  } else {
    ownerId = false;
  }

  // let noReviewTextBool;
  // let reviewPlaceholder;
  // if (!reviewsBool && !ownerId) {
  //   // //if the object is still loading
  //   // noReviewTextBool = false; //whether to show
  //   // reviewPlaceholder = "";
  // }

  // let ableToReview;
  // if (sessionUser !== null) {
  //   console.log(sessionUser);
  //   if (spotDetails.Owner) {
  //     console.log(spotDetails.Owner);
  //     if (sessionUser.id !== spotDetails.Owner.id) {
  //       console.log(sessionUser.id);
  //       console.log(spotDetails.Owner);
  //       ableToReview = true;
  //     }
  //   } else {
  //     reviewListLength++;
  //   }
  // } else {
  //   ableToReview = false;
  // }

  // console.log("This is supposed to be the reviewList");
  // console.log(reviewList);
  // console.log(typeof reviewList);
  // console.log(`reviewList is an array: ${Array.isArray(reviewList)}`);
  // console.log(`reviewList is ${reviewList.length} items long`);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log();
    dispatch(getSpotDetails(id)).then(() => dispatch(getSpotReviews(id)));
  }, [dispatch, id, reviewListLength]);

  if (!spotDetails || !spotDetails.Owner) {
    console.log("spotDetails is null");
    reviewListLength = -1;
    return <h1>Getting those details for you!</h1>;
  }

  if (!reviewList || !Array.isArray(reviewList)) {
    return <h1>Loading some reviews for you!</h1>;
  }

  const hasUserWrittenReview = function () {
    if (Array.isArray(reviewList) && reviewList) {
      let userWroteReviewBool = false;
      reviewList.forEach((review) => {
        console.log("loop ended");
        console.log(review.userId);
        console.log(sessionUser.id);
        if (review.userId === sessionUser.id) userWroteReviewBool = true;
        console.log(userWroteReviewBool);
        console.log("loop ended");
      });
      return userWroteReviewBool;
    }
  };

  let showNewReviewButton = false;
  let showBeFirstReviewText = false;
  if (sessionUser) {
    //logged in
    if (sessionUser.id !== ownerId) {
      if (!hasUserWrittenReview()) {
        showNewReviewButton = true;
      }
      if (Array.isArray(reviewList) && !reviewsBool) {
        showBeFirstReviewText = true;
      }
    }
  }

  // if ( && sessionUser) {
  //   //if reviews populated correctly and user is logged in
  //   if (sessionUser.id === ownerId) {
  //     showBeFirstReviewText = false; //if currently logged in user is owner;
  //   }
  // }

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
      {/* need to fix this, this h3 loaded with singedin user who did not own spot, i suspect due to nested logic above evaluating true at one point */}
      {/* {!reviewsBool && !ownerId && (
        <h3>No reviews have been written for this spot yet!</h3>
      )} */}
      {showBeFirstReviewText && <h3>Be the first to post a review!</h3>}
      {Array.isArray(reviewList) && reviewsBool && (
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
        </section>
      )}
      {showNewReviewButton && (
        <p id="new-review-button">
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<NewReviewModal />}
          />
        </p>
      )}
    </>
  );
};

export default SpotDetails;
