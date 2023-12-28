//#TODO:add to App.jsx router
//#TODO:create store/warehouse for getUserSpots within spots store
//#TODO: imports for update spots
//TODO: set up function for update spots
//TODO: get all desired data out and displayed into form
//TODO: update
//TODO:
//TODO:

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSpotDetails, editCurrentSpot } from "../../store/spots";

const UpdateSpot = () => {
  const { id } = useParams();
  const spot = useSelector((state) => {
    console.log("running here");
    console.log(state.spot);
    console.log(state.spot.undefined);
    const spotArr = state.spot.undefined;
    const currentSpot = function findMatch() {
      for (let i = 0; i < spotArr.length; i++) {
        const spotObj = spotArr[i];
        if (spotObj.id === id) {
          return spotObj;
        }
      }
    };
    currentSpot ? state.spot : null;
    console.log(currentSpot);
  });
  //   const spotToEdit = dispatch(getSpotDetails(id));
  //   console.log("spotToEdit");
  //   console.log(spotToEdit);
  const sessionUser = useSelector((state) => state.session.user);
  console.log(sessionUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(spot);

  if (typeof spot === "object") {
    console.log("spot is an object");
  } else {
    console.log("spot is not an object, it is ", typeof spot);
  }
  const spotObjValArr = Object.values(spot);
  let spotObjValArrLength;
  if (!(spotObjValArr && spotObjValArr.length)) {
    spotObjValArrLength = spotObjValArr.length;
  } else {
    spotObjValArrLength = -1;
  }

  const [streetAddress, setStreetAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [description, setDescription] = useState(spot.description);
  const [name, setName] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);

  const [errors, setErrors] = useState({});

  const handleStreetAddress = (e) => setStreetAddress(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleState = (e) => setState(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handlePrice = (e) => setPrice(e.target.value);

  useEffect(() => {
    dispatch(getSpotDetails(id));
  }, [dispatch, id, spotObjValArrLength]);

  if (!spot || !spot.Owner) {
    console.log("spotDetails is null");
    // forceUEArr.push["missing garnish"];
    return <h1>Getting those details for you!</h1>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      address: streetAddress,
      city,
      state,
      country,
      // lat: latitude,
      lat: 1,
      // lng: longitude,
      lng: 2,
      description,
      name,
      price,
    };

    const updatedSpot = await dispatch(editCurrentSpot(formData));

    if (updatedSpot.id) {
      navigate(`/spots/${updatedSpot.id}`);
    }
    if (updatedSpot.errors) {
      setErrors(updatedSpot.errors);
      //use error obj on form jsx to conditionally render errors using p tag
    }
  };

  return (
    <section>
      <h1>Update Your Spot</h1>
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <section className="spot-location-form">
          <h2>Where is your place located?</h2>
          <h3>
            Guests will only get your exact address once they booked a
            reservation.
          </h3>
          <label>
            Street Address
            <input
              type="text"
              value={streetAddress}
              onChange={handleStreetAddress}
              placeholder="2110 Blue Ridge Road"
              required
            />
            {errors.address && <p>{errors.address}</p>}
            {/* conditional rendering above for address errors message */}
          </label>
          <label>
            City
            <input
              type="text"
              value={city}
              onChange={handleCity}
              placeholder="Raleigh"
              required
            />
          </label>
          <label>
            State
            <input
              type="text"
              value={state}
              onChange={handleState}
              placeholder="North Carolina"
              required
            />
          </label>
          <label>
            Country
            <input
              type="text"
              value={country}
              onChange={handleCountry}
              placeholder="United States of America"
              required
            />
          </label>
        </section>
        <section className="spot-description-form">
          <h2>Describe your place to guests.</h2>
          <h3>
            Mention the best features of your space, especially any special
            features like pollinator activity, sun exposure, compost bins,
            outdoor sinks, or provided supplies.
          </h3>
          <textarea
            value={description}
            onChange={handleDescription}
            placeholder="Please write at least 30 characters."
            required
          />
        </section>
        <section className="spot-name-form">
          <h2>Create a title for your spot</h2>
          <h3>
            Catch guests{`&apos;`} attention with a spot title that highlights
            what makes your place special.
          </h3>
          <input
            type="text"
            value={name}
            onChange={handleName}
            placeholder="Name of your spot."
            required
          />
        </section>
        <section className="spot-price-form">
          <h2>Set a base price for your spot</h2>
          <h3>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </h3>
          <input
            type="number"
            value={price}
            onChange={handlePrice}
            placeholder="Price per season (USD)"
            required
          />
        </section>
        <section className="spot-form-buttons">
          <button type="submit">Update Your Spot</button>
          {/* <button type="button" onClick={handleCancelClick}>
            Cancel
          </button> */}
        </section>
      </form>
    </section>
  );
};

export default UpdateSpot;
