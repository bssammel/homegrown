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
  console.log("id: ", id);
  // const spot = useSelector((state) => {
  //   // console.log("running here");
  //   console.log(state.spot);
  //   console.log(state.spot.undefined);
  //   // const spotArr = state.spot.undefined;

  //   // function findMatch(spotId) {
  //   //   console.log("findMatch");
  //   //   for (let i = 0; i < spotArr.length; i++) {
  //   //     const spotObj = spotArr[i];
  //   //     console.log(spotObj);
  //   //     if (spotObj["id"] === spotId) {
  //   //       return spotObj;
  //   //     }
  //   //   }

  //   //   return;
  //   // }
  //   // const currentSpot = findMatch(id);
  //   // currentSpot ? state.spot : null;
  //   // console.log(currentSpot);
  // });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spotDetails = useSelector((state) =>
    state.spot ? state.spot[id] : null
  );
  console.log("spotDetails");
  console.log(spotDetails);
  // let forceUE;
  // if (!spotDetails || !spotDetails.Owner) {
  //   forceUE = 1;
  // }
  // const spotValList = Object.values(spotDetails);

  // const spotToEdit = dispatch(getSpotDetails(id));
  // console.log("spotToEdit");
  // console.log(spotToEdit);
  const sessionUser = useSelector((state) => state.session.user);
  // console.log(sessionUser);

  // console.log(spot);
  let spotObjValArrLength;

  // if (typeof spot === "object") {
  //   console.log("spot is an object");
  // } else {
  //   console.log("spot is not an object, it is ", typeof spot);
  //   spotObjValArrLength = -1;
  // }
  // const spotObjValArr = Object.values(spot);
  // let spotObjValArrLength;
  // if (!(spotObjValArr && spotObjValArr.length)) {
  //   spotObjValArrLength = spotObjValArr.length;
  // } else {
  //   spotObjValArrLength = -1;
  // }

  const [streetAddress, setStreetAddress] = useState(spotDetails.address);
  const [city, setCity] = useState(spotDetails.city);
  const [state, setState] = useState(spotDetails.state);
  const [country, setCountry] = useState(spotDetails.country);
  const [description, setDescription] = useState(spotDetails.description);
  const [name, setName] = useState(spotDetails.name);
  const [price, setPrice] = useState(spotDetails.price);

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
  }, [dispatch, id, spotObjValArrLength]);

  if (!spotDetails) {
    console.log("spotDetails is null");
    // forceUEArr.push["missing garnish"];
    spotObjValArrLength = -1;
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
      <form onSubmit={handleSubmit}></form>
    </section>
  );
};

export default UpdateSpot;
