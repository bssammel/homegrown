// import React, { Component } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { getSpotDetails } from "../../store/spots";
import { deleteCurrentReview, getSpotReviews } from "../../store/reviews";
import "./DeleteReviewModal.css";

function DeleteReviewModal(props) {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { id, spotId } = props.state;
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    const deleteSpotMsg = await dispatch(deleteCurrentReview(id));

    if (deleteSpotMsg.message === "Successfully deleted") {
      dispatch(getSpotDetails(spotId)).then(() =>
        dispatch(getSpotReviews(spotId)).then(closeModal())
      );
      // .then(navigate(`/spots/current`));
    }
  };

  return (
    <>
      <section id="delete-modal">
        <div id="modal-text">
          <h1>Confirm Delete</h1>
          <h3>Are you sure you want to delete this review?</h3>
        </div>
        <div className="delete-buttons">
          <button
            className="delete-buttons  delete-button"
            id="yes-delete"
            onClick={handleDelete}
          >
            {"Yes (Delete Review)"}
          </button>
          <button
            className="delete-buttons"
            id="no-delete"
            onClick={closeModal}
          >
            {"No (Keep Review)"}
          </button>
        </div>
      </section>
    </>
  );
}

export default DeleteReviewModal;
