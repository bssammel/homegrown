//first line
const { User, Spot, Review, Booking } = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//! Delete bookings made my owner of spot or guest
// TODO: Nothing, complete
router.delete('/:bookingId', requireAuth, async (req, res, next) => {

    //* Booking obj
    const bookingToDelete = await Booking.findByPk(req.params.bookingId);
    if(!bookingToDelete){
        const err = new Error('Booking couldn\'t be found');
        err.status = 404;
        return next(err);
    };

    //* current User
    const {user} = req;
    const userId = user.id;

    //* isolate guestId
    const guestId = bookingToDelete.userId;

    //* isolate ownerId from spot
    const spotId = bookingToDelete.spotId;
    const bookedSpot = await Spot.findByPk(spotId);
    const ownerId = bookedSpot.ownerId;
    
    // * Authorize User
    if (userId !== ownerId && userId !== guestId){
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    } else if (userId === ownerId || userId === guestId){
        //* get startDate
        const bookingStartDate = bookingToDelete.startDate;
        const parsedStartDate = Date.parse(bookingStartDate);
        const currentTime = Date.now();
        const timeDifference = currentTime - parsedStartDate; //if negative, means startDate is in future, pos = past
        if(timeDifference > 0){
            const err = new Error('Bookings that have been started can\'t be deleted');
            // err.title = 'Forbidden';
            // err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        } else {
            await bookingToDelete.destroy();
            return res.json({
                message: "Successfully deleted"
            });
        }
    }
})

//! Get bookings made by current user
// TODO: -----
router.get('/current', requireAuth, async (req,res) =>{
    const {user} = req;
    const userId = user.id;
    const where = {};
    where.userId = userId;
    const Bookings = await Booking.findAll({
        where,
        include: [
            {
                model: Spot,
                attributes: ['id','ownerId','address', 'city','state', 'country', 'lat', 'lng','name','price']
            },
        ],
    });
    return res.json({Bookings});
})



//last line
module.exports = router;
