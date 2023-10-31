const { Review, ReviewImage} = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const router = express.Router();


//!Delete a Review Image based on Image Id
router.delete('/:imageId', requireAuth, async (req,res,next) => {
    //* ReviewImage obj
    const reviewImageToDelete = await ReviewImage.findByPk(req.params.imageId);
    if(!reviewImageToDelete){
        const err = new Error('Review Image couldn\'t be found');
        err.status = 404;
        return next(err);
    };

    //* current User
    const {user} = req;
    const userId = user.id;

    //* isolate ownerId from review
    const reviewId = reviewImageToDelete.reviewId;
    const reviewWithImage = await Review.findByPk(reviewId);
    const authorId = reviewWithImage.userId;
    
    // * Authorize User
    if (userId !== authorId){
        const err = new Error('Forbidden');
        // err.title = 'Forbidden';
        // err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    }

    await reviewImageToDelete.destroy();
    return res.json({
        message: "Successfully deleted"
    });

});

//last line
module.exports = router;
