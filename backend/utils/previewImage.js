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
        for (let j = 0; j < desiredSpot[0].dataValues.SpotImages.length; j++) {
            const spotImgObj = desiredSpot[0].dataValues.SpotImages[j];
            console.log("spotImgObj");
            console.log(spotImgObj);
            console.log("spotImgObj.dataValues.preview: ",spotImgObj.dataValues.preview);


            if(spotImgObj.dataValues.preview === true){
                console.log("the preview value on the current spot image object is TRUE");
                previewImageURL = spotImgObj.dataValues.url;
                return previewImageURL;
            }else if(spotImgObj.dataValues.preview === false) {
                console.log("the preview value on the current spot image object is FALSE");
                previewImageURL = null;
            }
            previewImageURL = null;
        }
    }
    return previewImageURL;
}

module.exports = { getPreviewImageURL };
