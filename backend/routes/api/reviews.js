//first line
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//!Add an image to a Review based on the reviewId
// TODO: -----
router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    // * isolate needed info for post
    const {url} =req.body;
    const reviewId = Number(req.params.reviewId);
    const reviewWithNewImage = await Review.findByPk(reviewId);

    if(!reviewWithNewImage){
        const err = new Error('Review couldn\'t be found');
        err.status = 404;
        return next(err);
    }

    // * Proper Auth- is current user author of review?
    const {user} = req;
    const userId = user.id;
    const reviewUserId = reviewWithNewImage.userId;
    if(userId !== reviewUserId){
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    }

    if(reviewWithNewImage){
        let reviewImage;
        const currentReviewImages = await ReviewImage.findAll({
            where: {reviewId : reviewId}
        });
        if(currentReviewImages.length <= 9){
            reviewImage = await ReviewImage.create({
                reviewId, url
            });
        } else {
            const err = new Error('Maximum number of images for this resource was reached' );
            err.status = 403;
            return next(err);
        }
        const newReviewImage = {
            id: reviewImage.id,
            url: reviewImage.url
        }

        return res.json({id: reviewImage.id,
            url: reviewImage.url})
    }





});


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
