const { Spot, SpotImage, sequelize} = require('../db/models');

const getPreviewImageURL = async function(spotId){
    let previewImageURL = "this is just a test";
    
    // const desiredSpot = await Spot.findByPk(spotId);

    const desiredSpot = await Spot.findAll({
        where : {id: spotId},

        include: [
            { model: SpotImage,
            attributes: ['id','url','preview']}
        ],
        attributes:["id"],
        group:['Spot.id',  'SpotImages.id'],//!!!!!! missing from clause 
    });


    // console.log(desiredSpot[0].dataValues.SpotImages[0].dataValues.url)

    if(!desiredSpot[0].dataValues.SpotImages[0]){
        previewImageURL = null;
    } else {
        previewImageURL = desiredSpot[0].dataValues.SpotImages[0].dataValues.url;
    }

    return previewImageURL;
}

module.exports = { getPreviewImageURL };
