import { useState } from "react";
// import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview } from "../../store/reviews";
import { getSpotDetails } from "../../store/spots";
// import { getSpotReviews } from "../../store/reviews";

function NewReviewModal() {
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
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

    // console.log("This is supposed to be the review data obj");
    // console.log(reviewData);

    let newlyCreatedReview;
    // console.log("hey this should be the id: ", id);
    newlyCreatedReview = await dispatch(createNewReview(reviewData, id));

    if (newlyCreatedReview.errors) {
      setErrors(newlyCreatedReview.errors);
      //use error obj on form jsx to conditionally render errors using p tag
    }
    if (newlyCreatedReview.id) {
      console.log("successful submission");
      dispatch(getSpotDetails(id))
        // .dispatch(getSpotReviews(id))
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
        {errors.review && <p>{errors.review}</p>}
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
        {errors.stars && <p>{errors.stars}</p>}
        <button type="submit">Submit your Review</button>
      </form>
    </>
  );
}

export default NewReviewModal;
