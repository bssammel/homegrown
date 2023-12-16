import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { NavLink } from "react-router-dom";
import { getAllSpots } from "../../store/spots";

const SpotList = () => {
    // console.log(state);
    const dispatch = useDispatch();
    const spotList = useSelector((state) => Object.values(state.spot));
    console.log(7)
    console.log(spotList);

    useEffect(() => {
        console.log(8)
        dispatch(getAllSpots());
    }, [dispatch]);

    // console.log("oh look a spot");
    spotList[0].forEach((spot)=> {
        console.log("oh look a spot");
        console.log(spot)
        console.log("do you see it");
    })
    return(
        <>
        <h1>Grow Spots</h1>
        <section className="spots-grid">
        {spotList[0]?.map((spot) =>(
           
            <div key = {spot.id}>
        <p>This is {spot.name} for spot with {spot.id}. It is in {spot.city}, {spot.state}. With an average rating of {spot.avgRating} and a weekly price of {spot.price}, it is described as "{spot.description}". The image is below: </p>
        <img src={spot.previewImage} alt="" />
        </div>
        ) 
        
        )}
        </section>
        </>

    )
}


export default SpotList;
