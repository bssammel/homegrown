import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteCurrentSpot, getCurrentUserSpots } from "../../store/spots";

function DeleteSpotModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault;
    const deleteSpotMsg = await dispatch(deleteCurrentSpot(id));

    if (deleteSpotMsg.message === "Successfully deleted") {
      dispatch(getCurrentUserSpots())
        .then(closeModal())
        .then(navigate(`/spots/current`));
    }
  };

  return (
    <>
      <section id="delete-modal">
        <h1>Confirm Delete</h1>
        <h3>Are you sure you want to remove this spot?</h3>
        <div className="delete-buttons">
          <button
            className="delete-buttons"
            id="yes-delete"
            onClick={handleDelete}
          >
            {"Yes (Delete Spot)"}
          </button>
          <button
            className="delete-buttons"
            id="no-delete"
            onClick={closeModal}
          >
            {"No (Keep Spot)"}
          </button>
        </div>
      </section>
    </>
  );
}

export default DeleteSpotModal;
