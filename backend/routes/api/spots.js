//first line
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize} = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const { Op } = require('sequelize');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//! Validate spot creation array to reference below for data validation
const validateSpotCreation = [
    check('address')
        .exists({ checkFalsy : true})
        // .isEmpty({ checkFalsy : true})
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy : true})
        // .isEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy : true})
        // .isEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy : true})
        // .isEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy : true})
        // .isEmpty()
        .isDecimal()
        .isFloat({min: -90, max: 90})
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy : true})
        // .isEmpty()
        .isDecimal()
        .isFloat({min: -180, max: 180})
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy : true})
        // .isEmpty()
        .isLength({min: 1, max: 49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy : true})
        // .isEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy : true})
        // .isEmpty()
        .isInt({min: 1})
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReviewCreation = [
    check('review')
    .exists({checkFalsy : true})
    // .isEmpty()
    .withMessage('Review text is required'),
check('stars')
    .exists({checkFalsy : true})
    // .isEmpty()
    .isInt({min:1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
handleValidationErrors
]


// const router = require('express').Router();
//! Get spots of current user
// TODO: 
router.get('/current', requireAuth, async (req,res) =>{
    const {user} = req;
    //console.log("User Id?: ",user.id);
    const ownerId = user.id;
    const where = {};
    where.ownerId = ownerId
    const Spots = await Spot.findAll({
        where,
        include: [{//avgRating
            model: Review,
            attributes: []
        },
        { model: SpotImage,
            as: 'previewImage',
            where: {preview: true},
            attributes: ['url'],}
    ],

    attributes:[
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), 'avgRating']]
    ,
    group:['Spot.id'],
    raw:true}, 
    );
    return res.json({Spots});
})

//! Add an Image to a Spot based on the Spot's Id 
// TODO : 
router.post('/:spotId/images', requireAuth, async (req,res,next) =>{
    // * isolate needed info
    const {url, preview} = req.body;//isolate info for new spot image to be created
    const spotId = req.params.spotId;//spot id to pass in with image details
    // console.log(`#####spotId:  ${spotId}`);
    // * setting up new spot image
    const spotWithNewImage = await Spot.findByPk(req.params.spotId);//find spot that needs the new image

    if(!spotWithNewImage){//if we can't find the spot that needs the new image, then return err
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    }

    // * confirm if current user is owner of spot
    const {user} = req;//
    const userId = user.id;
    const ownerId = spotWithNewImage.ownerId;
    if(userId !== ownerId){
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    }

    const newSpotImage = await SpotImage.create({  spotId, url, preview  });
   
    return res.json({id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview});
})


//!!!!!!!!!!!!!!!!!!!!!!!!!! Reviews CRUD by Spot Id 
//! Get Reviews for spot by spotId
// TODO: 
router.get('/:spotId/reviews', async (req,res,next) =>{
    const {spotId} = req.params.spotId;
    const where = {};
    where.spotId = req.params.spotId;
    const desiredSpot = await Spot.findByPk(req.params.spotId);
    if(!desiredSpot){
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    } 
    const Reviews = await Review.findAll({
        where,
        include: [
            {
                model: User,
                attributes: ['id','firstName','lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id','url']
            },
        ],
    });

    return res.json({Reviews});
})

//! Create Review for Spot by spotId
// TODO: 
router.post('/:spotId/reviews',requireAuth, validateReviewCreation, async (req,res,next) =>{

    const {user} = req;
    const userId = user.id;

    const {review, stars} = req.body;

    const desiredSpot = await Spot.findByPk(req.params.spotId);
    if(!desiredSpot){
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    } 

    const reviewsForSpotWithUser = await Review.findAll({
        where: {userId : userId, spotId: req.params.spotId}
    })

    if(reviewsForSpotWithUser.length >= 1){
        const err = new Error('User already has a review for this spot')
        err.status = 500;
        return next(err);
    }

    const newReview = await Review.create({
        spotId: Number(req.params.spotId), userId:userId, review:review, stars: stars
    });

    return res.status(201).json({id:newReview.id, userId: newReview.userId, spotId: newReview.spotId, review: newReview.review, stars:  newReview.stars,  createdAt: newReview.createdAt, updatedAt:newReview.updatedAt});
})


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Bookings CRUD based on spotId


//! Verify Dates for bookings
const verifyDates = (newStart, newEnd, existingStart, existingEnd) => {

    if(newStart >= existingStart && newEnd <= existingEnd){
        return false;
    }

    if(existingStart <= newStart && newStart <= existingEnd){
        return false;
    }

    if(existingStart <= newEnd && newEnd <= existingEnd){
        return false;
    }

    if(newStart <= existingStart && existingEnd <= newEnd) return false;

    if(newStart === existingStart || newEnd === existingEnd || newEnd === existingStart || newStart === existingEnd){
        return false;
    }
    return true;
}

//!Create Booking based on spotId
router.post('/:spotId/bookings',requireAuth, async (req,res,next) =>{
    const where = {};
    where.spotId = req.params.spotId;
    const bookedSpotId = Number(req.params.spotId);
    const desiredSpot = await Spot.findByPk(req.params.spotId);
    if(!desiredSpot){
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    } 

    const conflictingErr = () => {
        const err = new Error('Sorry, this spot is already booked for the specific dates');
        err.errors = { startDate: 'Start date conflicts with an existing booking', endDate: 'End date conflicts with an existing booking'};
        err.status = 403;
        return next(err);
    }

    const {user} = req;
    const currentUserId = user.id;
    const spotOwnerId = desiredSpot.ownerId;
    const bookingStartDate = req.body.startDate;
    const parsedStartDate = Date.parse(bookingStartDate);
    const bookingEndDate = req.body.endDate;
    const parsedEndDate = Date.parse(bookingEndDate);
    // console.log(`spotOwnerId: ${spotOwnerId}, currentUserId : ${currentUserId}`);
    if (currentUserId === spotOwnerId){
        // console.log("I am the owner!!!")
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    
    }//! Ensure that person making booking is not owner
    // console.log("I am the guest!!!");
    //!now check that the body is valid
    //end date has to be greater than start after parsed
    //* get startDate

    const timeDifference = parsedEndDate - parsedStartDate; //if less than or = to 0, means startDate is before or the same as end date; pos = end date after start, valid
    if(timeDifference <= 0 ){
            const err = new Error('Bad Request');
            err.errors = { endDate: 'endDate cannot be on or before startDate' };
            err.status = 403;
            return next(err);
    }//great, the body is valid, what about those dates though, do they interfere with an already booked time?
   
    where.spotId = bookedSpotId;
    const existingBookingDates = await Booking.findAll({
        where,
        attributes: ['startDate', 'endDate']
    });
    console.log(existingBookingDates);
    for (let i = 0; i < existingBookingDates.length; i++) {
        const datePairObj = existingBookingDates[i];
    
        retrievedStart = datePairObj.dataValues.startDate;
        parsedRetrievedStart = Date.parse(retrievedStart);
        retrievedEnd = datePairObj.dataValues.endDate;
        parsedRetrievedEnd = Date.parse(retrievedEnd);

        const verifiedDate = verifyDates(parsedStartDate, parsedEndDate, parsedRetrievedStart, parsedRetrievedEnd);

        if(verifiedDate === false) return conflictingErr();
    };
    const spotId = bookedSpotId;
    const userId = currentUserId;
    const startDate = bookingStartDate;
    const endDate = bookingEndDate;

    const newBooking = await Booking.create({spotId, userId, startDate, endDate})

    return res.json(newBooking);
});

//!Get Bookings based on spotId
// TODO:
router.get('/:spotId/bookings',requireAuth, async (req,res,next) =>{
    const where = {};
    where.spotId = req.params.spotId;
    const desiredSpot = await Spot.findByPk(req.params.spotId);
    if(!desiredSpot){
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    } 

    const {user} = req;
    const currentUserId = user.id;
    const spotOwnerId = desiredSpot.ownerId;
    // console.log(`spotOwnerId: ${spotOwnerId}, currentUserId : ${currentUserId}`);
    if(currentUserId !== spotOwnerId){
        console.log("I am the guest!!!")
        const Bookings = await Booking.findAll({
            where,
            attributes: [
                "spotId",
                "startDate",
                "endDate"
            ],
        });
    
        return res.json({Bookings});
    } else if (currentUserId === spotOwnerId){//
        // console.log("I am the owner!!!")/
        const Bookings = await Booking.findAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ['id','firstName','lastName']
                },
            ],
        });
    
        return res.json({Bookings});
    }
});





//!!!!!!!!!!!!!!!!!!!!!!!! routes by spotId

//!Get Spot based on spotId
router.get('/:spotId', async (req,res,next) =>{

    const desiredSpot = await Spot.findAll({
        where : {id: req.params.spotId},

        include: [
        { model: SpotImage,}
    ],
    attributes:[
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
    ],
    group:['Spot.id'],
    });
    if(!desiredSpot){
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    } 

    const aggregates = {};
    aggregates.numReviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: [[sequelize.fn("COUNT", sequelize.col("Review.id")), 'numReviews']]
    })
    const numReviews = aggregates.numReviews[0].dataValues.numReviews;

    aggregates.avgRating = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: [[sequelize.fn("AVG", sequelize.col("Review.stars")), 'avgRating'],]
    })
    const avgRating = aggregates.avgRating[0].dataValues.avgRating;

    desiredSpot[0].dataValues.numReviews = numReviews;
    desiredSpot[0].dataValues.avgRating = avgRating;

    return res.json(desiredSpot);
});

//! Edit a Spot 
// TODO : 
router.put('/:spotId', requireAuth, validateSpotCreation, async (req,res,next) =>{
    // * isolate needed info
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    //isolate info for new spot data to update with
    const spotId = req.params.spotId;//spot id to identify which spot to update;
    // * finding spot to update in db
    const spotToUpdate = await Spot.findByPk(req.params.spotId);

    if(!spotToUpdate){//if we can't find the spot that needs the update, then return err
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    }

    // * Proper Auth! confirm if current user is owner of spot/Proper Auth!
    const {user} = req;//
    const userId = user.id;
    const ownerId = spotToUpdate.ownerId;
    if(userId !== ownerId){
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    }

    //* update spot
    await spotToUpdate.update({
        id: spotId,
        ownerId: ownerId, 
        address: address, 
        city: city, 
        state: state, 
        country: country, 
        lat: lat, 
        lng: lng, 
        name: name, 
        description: description, 
        price: price
    })
   
    return res.json({
        id: spotToUpdate.id,
            ownerId: ownerId, 
            address: spotToUpdate.address, 
            city: spotToUpdate.city, 
            state: spotToUpdate.state, 
            country: spotToUpdate.country, 
            lat: spotToUpdate.lat, 
            lng: spotToUpdate.lng, 
            name: spotToUpdate.name, 
            description: spotToUpdate.description, 
            price: spotToUpdate.price,
            createdAt:spotToUpdate.createdAt,
            updatedAt: spotToUpdate.updatedAt
    });
    
})

//! Delete a Spot 
// TODO : 
router.delete('/:spotId', requireAuth, async (req,res,next) =>{
    const spotId = req.params.spotId;//spot id to identify which spot to delete/destroy
    // * finding spot to delete
    const spotToDelete = await Spot.findByPk(req.params.spotId);

    if(!spotToDelete){//if we can't find the spot to delete, then return err
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    }

    // * Proper Auth! confirm if current user is owner of spot/Proper Auth!
    const {user} = req;//
    const userId = user.id;
    const ownerId = spotToDelete.ownerId;
    if(userId !== ownerId){
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    }

    //* delete spot
    await spotToDelete.destroy();
   
    return res.json({
        message: "Successfully deleted"
    });
})




//!!!!!!!!!!!!!!!!!!!!!!!!!!!! Universal Spots

//! Get all spots
router.get('/', async (req, res) =>{
    // * 1- create array of Spot Objects --Done
    const Spots = await Spot.findAll(
        {include: [
            { model: SpotImage,
                as: 'previewImage',
                where: {preview: true},
                attributes: ['url'],}
        ],

        attributes:[
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "description",
            "price",
            "createdAt",
            "updatedAt",]
        ,
        group:['Spot.id'],
        raw:true},       
    );

    // const testArr = [1, 2, 3, 4, 5, 6];
    // for(let i = 0; i < testArr.length; i++) {    }
   //* 2- create array of Review Objects

    const reviewsObjArr = await Review.findAll();
    console.log('#######');
    console.log(reviewsObjArr);
    // * 3- create array of ratings objects (will just be empty at first unti after first loop)
    const statsObjArr = [];

    // * 3- loop through Review Objects and isolate spotId
    for (let i = 0; i < reviewsObjArr.length; i++) {
        const foundId = reviewsObjArr[i].dataValues.spotId;
         // * 3.1.1-find object in statsobjArr where spotId is foundId on reviewsObjArr
         console.log(`foundId= ${foundId}`)
        //  console.log(`statsObjArr[i].spotId= ${statsObjArr[i].spotId}`)

        console.log("statsObjArr.length",statsObjArr.length)
        if(statsObjArr.length === 0){//* if not found
            const requestedId = reviewsObjArr[i].dataValues.spotId;
            const newStatObj = {};//create new stat obj to be pushed to stats Obj Arr
            newStatObj.spotId = requestedId; // * add SpotId keyvalue pair to newStatObj [{spotId: #, }]
            newStatObj.numReviews = 1; // *-  create numReviews kVP and set as 1 [{spotId: 3, numReviews:1}]
            newStatObj.starsArr = [];
            // console.log(`newStatObj.starsArr isArray= ${Array.isArray(newStatObj.starsArr)}`)
            // console.log(`reviewsObjArr[i].dataValues.stars= ${reviewsObjArr[i].dataValues.stars}`);
            // console.log(`reviewsObjArr[i].dataValues.stars isNum= ${reviewsObjArr[i].dataValues.stars}`);
            const newStarDecimalToPush = Number(reviewsObjArr[i].dataValues.stars);
            newStatObj.starsArr = [newStarDecimalToPush]  // *- then add starsArr to object with review objects stars value starsArr = [#, #, #]
            // console.log(`newStatObj.starsArr isArray= ${Array.isArray(newStatObj.starsArr)}`)
           statsObjArr.push(newStatObj);
            // console.log(statsObjArr)
            // console.log(`statsObjArr[i].starsArr  isArray= ${Array.isArray(statsObjArr[i].starsArr)}`)
            // console.log("I am running at line 469");
        }
        const requestedId = statsObjArr.find((statsObj) => {
            console.log(statsObj, "string")
            console.log(`statsObj.spotId= ${statsObj.spotId}`)
            if(statsObj.spotId === foundId){
                statsObj.numReviews= statsObj.numReviews++;
                // console.log(`statsObj.starsArr = ${statsObj.starsArr}`)
                // console.log(`statsObj.starsArr  isArray= ${Array.isArray(statsObj.starsArr)}`)
                // statsObj.starsArr = statsObj.starsArr;
                statsObj.starsArr.push(reviewsObjArr[i].dataValues.stars);
                statsObjArr[i] = statsObj;
            }  
        });
        
    
    }//looped through all reviewObjects. now to loop through spots objects and add appropriate numReviews and avgRating

    for (let j = 0; j < Spots.length; j++) {
        // const spot = Spots[j];
        // console.log(Spots[j]);
        const requestedSpotId = Spots[j].id;
        // console.log(`requestedSpotId= ${requestedSpotId}`)
        const matchingStatsObj = statsObjArr.find((foundStatsObj) => {
            // console.log(`foundStatsObj.spotId= ${foundStatsObj.spotId}`)
            if(foundStatsObj.spotId === requestedSpotId){
                return foundStatsObj;
            }
        });
        console.log("matchingStatsObj, ",matchingStatsObj)
        if(matchingStatsObj){
            console.log("I am Running ###########")
            Spots[j].numReviews = matchingStatsObj.numReviews;
            Spots[j].avgRating = matchingStatsObj.starsArr.reduce((a,b)=> a+b)/starsArr.length;
        }
    }
    return res.json({// TODO: Need to add aggregates for avg rating and preview image url
        Spots,
        
    });

});


//! add spot 
router.post('/', requireAuth, validateSpotCreation, async (req,res, next) =>{ 
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const {user} = req;
    // console.log("User Id?!!!!!!!!!: ",user.id);
    const ownerId = user.id;
    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

    const newSpot = {
        id: spot.id,
        ownerId: ownerId, 
        address: spot.address, 
        city: spot.city, 
        state: spot.state, 
        country: spot.country, 
        lat: spot.lat, 
        lng: spot.lng, 
        name: spot.name, 
        description: spot.description, 
        price: spot.price,
        createdAt:spot.createdAt,
        updatedAt: spot.updatedAt
    };
    return res.status(201).json({
        spot: newSpot
    });
 });




//last line
module.exports = router;
