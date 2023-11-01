const { User, Spot, Review, Booking, SpotImage } = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')
const { reformatTimes } = require('../../utils/date-time');


const express = require('express');

const router = express.Router();

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
                include : { model: SpotImage,
                    as: 'previewImage',
                    where: {preview: true},
                    attributes: ['url'],},
                attributes: ['id','ownerId','address', 'city','state', 'country', 'lat', 'lng','name','price', ]
            },
        ],
    });

    for (let i = 0; i < Bookings.length; i++) {
        const booking = Bookings[i];
        const timestampArr = [booking.createdAt, booking.updatedAt, booking.startDate, booking.endDate];
        let newTimestamps = reformatTimes(timestampArr, "getCurrentBookings");
        booking.createdAt = newTimestamps[0];
        booking.updatedAt = newTimestamps[1];
        booking.startDate = newTimestamps[2].splice(0,9);
        booking.endDate = newTimestamps[3].splice(0,9);
    }  

    return res.json({Bookings});
})

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
        // err.title = 'Forbidden';
        // err.errors = { message: 'Forbidden' };
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

//! Verify Dates for bookings
const verifyDates = (newStart, newEnd, existingStart, existingEnd) => {

    // newStart = newStart

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
//! Edit a Booking by bookingId
router.put('/:bookingId', requireAuth, async (req,res,next) =>{
    console.log(req.body)
    // const { newStartDate, newEndDate} = req.body;
    const newStartDate = req.body.startDate;
    const newEndDate = req.body.endDate;
    // console.log("###################################");
    // console.log(newStartDate)
    // console.log(newEndDate)
    //     console.log("###################################");
    const bookingId = Number(req.params.bookingId);
    const bookingToUpdate  = await Booking.findByPk(req.params.bookingId);

    if(!bookingToUpdate){
        const err = new Error('Booking couldn\'t be found');
        err.status = 404;
        return next(err);
    } 

    const conflictingErr = () => {
        const err = new Error('Sorry, this spot is already booked for the specific dates');
        err.errors = { startDate: 'Start date conflicts with an existing booking', endDate: 'End date conflicts with an existing booking'};
        err.status = 403;
        return next(err);
    }

    const bookedSpotId = bookingToUpdate.spotId;
    console.log('bookedSpotId', bookedSpotId);

    const {user} = req;
    const currentUserId = user.id;
    const bookingUser = bookingToUpdate.userId;
    if (currentUserId !== bookingUser){
        const err = new Error('Forbidden');
        // err.title = 'Forbidden';
        // err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    }

    // const bookingStartDate = req.body.startDate;
    const parsedNewStartDate = Date.parse(newStartDate);
    // const bookingEndDate = req.body.endDate;
    const parsedNewEndDate = Date.parse(newEndDate);

    //!now check that the body is valid
    //end date has to be greater than start after parsed
    //* get startDate

    const timeDifference = parsedNewEndDate - parsedNewStartDate; //if less than or = to 0, means startDate is before or the same as end date; pos = end date after start, valid
    if(timeDifference <= 0 ){
        const err = new Error('Bad Request');
        err.errors = { endDate: 'endDate cannot be on or before startDate' };
        err.status = 403;
        return next(err);
    }//great, the body is valid, what about those dates though, do they interfere with an already booked time?
   
    const where = {};
    where.spotId = bookedSpotId;
    const existingBookingDates = await Booking.findAll({
        where,
        attributes: ['id','startDate', 'endDate']
    });
    // console.log(existingBookingDates);
    for (let i = 0; i < existingBookingDates.length; i++) {
        const datePairObj = existingBookingDates[i];


        retrievedStart = datePairObj.dataValues.startDate;
        retrievedStartYikes = retrievedStart.slice(0,9);
        parsedRetrievedStart = Date.parse(retrievedStartYikes);

        
        retrievedEnd = datePairObj.dataValues.endDate;
        retrievedEndYikes = retrievedEnd.slice(0,9);
        parsedRetrievedEnd = Date.parse(retrievedEndYikes);

        const verifiedDate = verifyDates(parsedNewStartDate, parsedNewEndDate, parsedRetrievedStart, parsedRetrievedEnd);

        if(verifiedDate === false){
            if(bookingId !== existingBookingDates[i].dataValues.id) return conflictingErr();
        } 
    };

//     console.log("###################################");
// console.log(newStartDate)
// console.log(newEndDate)
//     console.log("###################################");

    const startDate = newStartDate;
    const endDate = newEndDate;
    const id = bookingId;
    const spotId = bookedSpotId;
    const userId = bookingUser;

    const updatedBooking = await bookingToUpdate.update({id: id, spotId:spotId, userId:userId, startDate:newStartDate, endDate:newEndDate})

    return res.json(updatedBooking);
});



//last line
module.exports = router;
