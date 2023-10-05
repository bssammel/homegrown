//first line
const { User, Spot } = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js')

const router = require('express').Router();

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



router.get('/', async (req, res) =>{
    //where = {};
    const spots = await Spot.findAll();
    return res.json({// TODO: Need to add aggregates for avg rating and preview image url
        spots,
    });
});


//last line
module.exports = router;
