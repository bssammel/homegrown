import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import {getSpotDetails} from "../../store/spotDetails";
import { getSpotDetails } from "../../store/spots";
import { getSpotReviews } from "../../store/reviews";
import dateTimeModifier from "../../helpers/dateTimeModifier";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import NewReviewModal from "../NewReviewModal/NewReviewModal";
import DeleteReviewModal from "./DeleteReviewModal";
import "./SpotDetails.css";

const SpotDetails = () => {
  const { id } = useParams();
  // console.log(id);
  //   const navigate = useNavigate();
  //   const [goToSpot, setGoToSpot] = useState(id);

  const sessionUser = useSelector((state) => state.session.user);

  const spotDetails = useSelector((state) =>
    state.spot ? state.spot[id] : null
  );
  const isCurrUserAuthor = function (review) {
    if (sessionUser) {
      // console.log(`review user Id: , ${review.User.id}`);
      // console.log("session user Id: ", sessionUser.id);
      if (review.User.id === sessionUser.id) {
        // console.log(`the current user is the author`);
        return true;
      } else {
        console.log(`The current user is not the author.`);
        return false;
      }
    } else return false;
  };

  const reviewObj = useSelector((state) =>
    state.reviews ? state.reviews : null
  );

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

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log();
    dispatch(getSpotDetails(id)).then(() => dispatch(getSpotReviews(id)));
  }, [dispatch, id, reviewListLength]);

  if (!spotDetails || !spotDetails.Owner) {
    // console.log("spotDetails is null");
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
        // console.log("loop ended");
        // console.log(review.userId);
        // console.log(sessionUser.id);
        if (review.userId === sessionUser.id) userWroteReviewBool = true;
        // console.log(userWroteReviewBool);
        // console.log("loop ended");
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

  const previewImageObj = spotDetails.SpotImages.filter(
    (image) => image.preview === true
  )[0];
  const nonPreviewImageArr = spotDetails.SpotImages.filter(
    (image) => image.preview !== true
  );
  const nonPreviewImageArrLengthBool = nonPreviewImageArr.length > 0;
  // console.log(nonPreviewImageArrLengthBool);

  // if ( && sessionUser) {
  //   //if reviews populated correctly and user is logged in
  //   if (sessionUser.id === ownerId) {
  //     showBeFirstReviewText = false; //if currently logged in user is owner;
  //   }
  // }
  const hasReviews = function (spot) {
    if (spot) {
      // console.log("line 120 of spot details");
      // console.log(spot);
      if (spot.avgStarRating > 0) {
        // console.log(`spor `);
        const formattedRating = spot.avgStarRating.toFixed(2);
        return formattedRating;
      } else {
        // console.log(`The current user is not the author.`);
        return "New";
      }
    } else return 0;
  };

  // const comingSoonAlert = function () {
  //   alert()
  // }

  return (
    <>
      <section className="spot-details">
        <h1 id="spot-name">{spotDetails.name}</h1>
        <p className="location">
          {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
        </p>
        {Array.isArray(spotDetails.SpotImages) && (
          <section id="spot-images">
            <div id="previewImage">
              <img src={previewImageObj.url} />
            </div>
            {Array.isArray(nonPreviewImageArr) &&
              nonPreviewImageArrLengthBool && (
                <section className="small-images">
                  {nonPreviewImageArr.map((smallImgObj) => (
                    <div key={smallImgObj.id} className="single-small-image">
                      <img src={smallImgObj.url} />
                    </div>
                  ))}
                </section>
              )}
          </section>
        )}
        <div className="bottom-container">
          <div>
            <h2 className="hostDetails">
              Hosted by: {spotDetails.Owner.firstName}{" "}
              {spotDetails.Owner.lastName}
            </h2>
            <p className="description">{spotDetails.description}</p>
          </div>
          <div className="reserve">
            <div>
              <p>${spotDetails.price} night</p>
              <p id="star-rating">★ {hasReviews(spotDetails)}</p>
            </div>
            <button
              onClick={() => {
                alert("Feature Coming Soon");
              }}
            >
              Reserve
            </button>
          </div>
        </div>
      </section>
      {showBeFirstReviewText && <h3>Be the first to post a review!</h3>}
      {Array.isArray(reviewList) && reviewsBool && (
        <section className="spot-reviews">
          {reviewList.map((review) => (
            <div key={review.id}>
              <p>
                <h4>{review.User.firstName} </h4>
                <h4>
                  {" " + dateTimeModifier(review.createdAt, "Month Year")}:
                </h4>{" "}
                {review.review}. This user gave this garden spot a rating of{" "}
                {review.stars} stars out of 5.
              </p>
              {isCurrUserAuthor(review) && (
                <OpenModalButton
                  buttonText="Delete"
                  // onButtonClick={navigate("/spots/current")}
                  modalComponent={
                    <DeleteReviewModal
                      state={{ id: review.id, spotId: review.spotId }}
                    />
                  }
                />
              )}
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
