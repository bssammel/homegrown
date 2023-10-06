//first line
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//! Get Reviews written by current user
// TODO: need to make foreign key set up for preview image to pull in data from there and add the column to spot.previewImage
router.get('/current', requireAuth, async (req,res) =>{
    const {user} = req;
    // console.log("User Id?: ",user.id);
    const userId = user.id;
    const where = {};
    where.userId = userId;
    const currentUserReviews = await Review.findAll({
        where,
        include: [
            {
                model: User,
                attributes: ['id','firstName','lastName']
            },
            {
                model: Spot,
                attributes: ['id','ownerId','address', 'city','state', 'country', 'lat', 'lng','name','price', ]
            },
            {
                model: ReviewImage,
                attributes: ['id','url']
            },
        ],
    });
    return res.json({currentUserReviews});
})



//last line
module.exports = router;
