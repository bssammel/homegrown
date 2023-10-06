//first line
const { User, Spot, SpotImage } = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


// const router = require('express').Router();

router.get('/current', requireAuth, async (req,res) =>{
    const {user} = req;
    //console.log("User Id?: ",user.id);
    const ownerId = user.id;
    const where = {};
    where.ownerId = ownerId
    const currentUserSpots = await Spot.findAll({
        where,// TODO: same as below need to add aggregates
    });
    return res.json({currentUserSpots});
})

//! Add an Image to a Spot based on the Spot's Id 
// TODO : Nothing, fully passing
router.post('/:spotId/images', requireAuth, async (req,res,next) =>{
    // * isolate needed info
    const {url, preview} = req.body;//isolate info for new spot image to be created
    const spotId = req.params.spotId;//spot id to pass in with image details
    console.log(`#####spotId:  ${spotId}`);
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

    // const spotImageReturn = {
    //     id: newSpotImage.id,
    //     url: newSpotImage.url,
    //     preview: newSpotImage.preview
    // }
   
    return res.json({id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview});
})

//!Get Spot based on spotId
router.get('/:spotId', async (req,res,next) =>{
    const desiredSpot = await Spot.findByPk(req.params.spotId);
    if(!desiredSpot){
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        return next(err);
    } // TODO: add aggregates
    return res.json(desiredSpot);
})

router.get('/', async (req, res) =>{
    //where = {};
    const spots = await Spot.findAll();
    return res.json({// TODO: Need to add aggregates for avg rating and preview image url
        spots,
    });

});

const validateSpotCreation = [
    check('address')
        .exists({ checkFalsy : true})
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy : true})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy : true})
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy : true})
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy : true})
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy : true})
        .isDecimal()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy : true})
        .isLength({min: 1, max: 49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy : true})
        .withMessage('Desription is required'),
    check('price')
        .exists({ checkFalsy : true})
        .isNumeric()
        .withMessage('Price per day is requited'),
    handleValidationErrors
];

router.post('/', requireAuth, validateSpotCreation, async (req,res, next) =>{ // TODO: not sure the require auth is functioning as expected here
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
    return res.json({
        spot: newSpot
    });
 });




//last line
module.exports = router;
