import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSpotDetails, editCurrentSpot } from "../../store/spots";

const UpdateSpot = () => {
  const { id } = useParams();
  console.log("id: ", id);
  const spotDetails = useSelector((state) =>
    state.spot ? state.spot[id] : {}
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("spotDetails");
  console.log(spotDetails);

  let forceUE = 0;
  if (!spotDetails) forceUE++;

  // const sessionUser = useSelector((state) => state.session.user);

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const handleStreetAddress = (e) => setStreetAddress(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleState = (e) => setState(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handlePrice = (e) => setPrice(e.target.value);

  useEffect(() => {
    console.log("Use Effect in progress");
    dispatch(getSpotDetails(id));

    setStreetAddress(spotDetails?.address);
    setCity(spotDetails?.city);
    setState(spotDetails?.state);
    setCountry(spotDetails?.country);
    setDescription(spotDetails?.description);
    setName(spotDetails?.name);
    setPrice(spotDetails?.price);
    //? do I want to place this within a helper function.
  }, [dispatch, id, forceUE]);

  if (!spotDetails) {
    console.log("spotDetails is null");

    return <h1>Getting those details for you!</h1>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      id: id,
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
      price: Number(price.replace(`"`, "")),
    };

    console.log(formData.price);

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
            <br />
            {streetAddress.length < 1 && (
              <p className="error-message">{"Street Address is required."}</p>
            )}
            {errors.address && <p>{errors.address}</p>}
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
            <br />
            {city.length < 1 && (
              <p className="error-message">{"City is required."}</p>
            )}
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
            <br />
            {state.length < 1 && (
              <p className="error-message">{"State is required."}</p>
            )}
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
            <br />
            {country.length < 1 && (
              <p className="error-message">{"Country is required."}</p>
            )}
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
          <br />
          {description.length < 1 && (
            <p className="error-message">
              {"Description needs 30 or more characters."}
            </p>
          )}
        </section>
        <section className="spot-name-form">
          <h2>Create a title for your spot</h2>
          <h3>
            Catch guests{`'`} attention with a spot title that highlights what
            makes your place special.
          </h3>
          <input
            type="text"
            value={name}
            onChange={handleName}
            placeholder="Name of your spot."
            required
          />
          <br />
          {name.length < 1 && (
            <p className="error-message">{"Name is required."}</p>
          )}
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
          <br />
          {price.length < 1 && (
            <p className="error-message">
              {"Price is required and must be a number."}
            </p>
          )}
          {price.toString().includes(".") && (
            <p className="error-message">{"Price must be an integer."}</p>
          )}
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
