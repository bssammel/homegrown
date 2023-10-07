//first line
const { User, Spot, Review, Booking } = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
                attributes: ['id','ownerId','address', 'city','state', 'country', 'lat', 'lng','name','price']
            },
        ],
    });
    return res.json({Bookings});
})


//last line
module.exports = router;
