import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewSpot } from "../../store/spots";

const NewSpotForm = () => {
  const dispatch = useDispatch();

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [errors, setErrors] = useState({});

  const spots = useSelector((state) => state.spots);

  const handleStreetAddress = (e) => setStreetAddress(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleState = (e) => setState(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);
  const handleLatitude = (e) => setLatitude(e.target.value);
  const handleLongitude = (e) => setLongitude(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handlePrice = (e) => setPrice(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const formData = {
      streetAddress,
      city,
      state,
      country,
      latitude,
      longitude,
      description,
      name,
      price,
    };

    let newlyCreatedSpot;
    //cut out if you see this  :(
    try {
      newlyCreatedSpot = await dispatch(createNewSpot(formData));

      //iff newlyCreatedSpot.id navigate to new id
      if (newlyCreatedSpot.errors) {
        setErrors(newlyCreatedSpot.errors);
        //use error obj on form jsx to conditionally render errors using p tag
      }
    } catch (error) {
      // if ()
    }
  };

  return (
    <section>
      <h1>Create a New Spot</h1>
      <form
        className="create-spot-form"
        // onSubmit={}
      >
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
            Catch guests' attention with a spot title that highlights what makes
            your place special.
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
            value={name}
            onChange={handleName}
            placeholder="Price per season (USD)"
            required
          />
        </section>
      </form>
    </section>
  );
};

export default NewSpotForm;
