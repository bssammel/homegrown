import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewSpot } from "../../store/spots";

const NewSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  // const [latitude, setLatitude] = useState("");
  // const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [errors, setErrors] = useState({});

  // const spots = useSelector((state) => state.spots);

  const handleStreetAddress = (e) => setStreetAddress(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleState = (e) => setState(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);
  // const handleLatitude = (e) => setLatitude(e.target.value);
  // const handleLongitude = (e) => setLongitude(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handlePrice = (e) => setPrice(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    // if(!latitude)  = 1;

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

    if (!formData.lat) formData.lat = 1;
    if (!formData.lng) formData.lng = 2;

    let newlyCreatedSpot;

    newlyCreatedSpot = await dispatch(createNewSpot(formData));

    //if newlyCreatedSpot.id navigate to new id
    if (newlyCreatedSpot.id) {
      navigate(`/spots/${newlyCreatedSpot.id}`);
    }
    if (newlyCreatedSpot.errors) {
      setErrors(newlyCreatedSpot.errors);
      //use error obj on form jsx to conditionally render errors using p tag
    }
  };

  return (
    <section>
      <h1>Create a New Spot</h1>
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
          <button type="submit">Create new Spot</button>
          {/* <button type="button" onClick={handleCancelClick}>
            Cancel
          </button> */}
        </section>
      </form>
    </section>
  );
};

export default NewSpotForm;