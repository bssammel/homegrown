const { Spot, SpotImage} = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const router = express.Router();


//!Delete a Spot Image based on Image Id
router.delete('/:imageId', requireAuth, async (req,res,next) => {
    //* SpotImage obj
    const spotImageToDelete = await SpotImage.findByPk(req.params.imageId);
    if(!spotImageToDelete){
        const err = new Error('Spot Image couldn\'t be found');
        err.status = 404;
        return next(err);
    };

    //* current User
    const {user} = req;
    const userId = user.id;

    //* isolate ownerId from spot
    const spotId = spotImageToDelete.spotId;
    const spotWithImage = await Spot.findByPk(spotId);
    const ownerId = spotWithImage.ownerId;
    
    // * Authorize User
    if (userId !== ownerId){
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    }

    await spotImageToDelete.destroy();
    return res.json({
        message: "Successfully deleted"
    });

});

//last line
module.exports = router;
