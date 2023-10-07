//first line
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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

//!Add an image to a Review based on the reviewId
// TODO: completed, no changes needed
router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    // * isolate needed info for post
    const {url} = req.body;
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

//!Edit a review by reviewId
// TODO: nothing, completed
router.put('/:reviewId', requireAuth, validateReviewCreation, async(req, res, next) => {
    // * isolate needed info for post
    const {review, stars} = req.body;
    const reviewId = Number(req.params.reviewId);
    const desiredReview = await Review.findByPk(reviewId);

    if(!desiredReview){
        const err = new Error('Review couldn\'t be found');
        err.status = 404;
        return next(err);
    }

    // * Proper Auth- is current user author of review?
    const {user} = req;
    const currentUserId = user.id;
    const reviewUserId = desiredReview.userId;
    if(currentUserId !== reviewUserId){
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    }

    // * update review
    await desiredReview.update({
        review: review,
        stars: stars
    })
    
    return res.json({id: desiredReview.id,
        userId: desiredReview.userId,
        spotId: desiredReview.spotId,
        review: desiredReview.review,
        stars: desiredReview.stars,
        createdAt: desiredReview.createdAt,
        updatedAt: desiredReview.updatedAt,
    })

});




//last line
module.exports = router;
