import { useState } from "react";
// import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview } from "../../store/reviews";
import { getSpotDetails } from "../../store/spots";
// import SpotDetails from "../SpotDetails/SpotDetails";
import { getSpotReviews } from "../../store/reviews";

function NewReviewModal() {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState("");
  const [errors, setErrors] = useState({});
  //   const { id } = useParams();
  //   const userId = useSelector((state) => state.session.user.id);
  const id = useSelector((state) => Object.keys(state.spot)[0]);
  //   console.log("This h");
  const { closeModal } = useModal();

  const handleReview = (e) => setReview(e.target.value);
  const handleStars = (e) => setStars(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const reviewData = {
      //   userId: userId,
      //   spotId: id,
      review,
      stars,
    };

    let newlyCreatedReview;
    newlyCreatedReview = await dispatch(createNewReview(reviewData, id));

    if (newlyCreatedReview.errors) {
      setErrors(newlyCreatedReview.errors);
    }
    // const passProps = () => {
    //   return <SpotDetails hail={"mary"} />;
    // };

    if (newlyCreatedReview.id) {
      console.log("successful submission");
      await dispatch(getSpotDetails(id))
        .then(dispatch(getSpotReviews(id)))
        .then(closeModal());
    }
  };

  return (
    <>
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={review}
            onChange={handleReview}
            placeholder="Leave your review here..."
            required
          />
        </label>
        {review.length < 10 && (stars !== "" || stars !== null) && (
          <p className="error-message">
            {"At least 10 characters are needed to submit a review."}
          </p>
        )}
        {errors.review && <p className="error-message">{errors.review}</p>}
        <label>
          Stars
          <input
            type="number"
            max={5}
            min={1}
            value={stars}
            onChange={handleStars}
            required
          />
        </label>
        {/* {console.log("#################### Stars: " + stars)} */}
        {(stars === "" || stars === null) && (
          <p className="error-message">
            {"Please leave a star rating to accompany your review."}
          </p>
        )}
        {errors.stars && <p className="error-message">{errors.stars}</p>}
        <button
          type="submit"
          disabled={review.length < 10 || stars === "" || stars === null}
        >
          Submit your Review
        </button>
      </form>
    </>
  );
}

export default NewReviewModal;
