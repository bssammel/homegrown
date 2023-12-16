'use strict';

const {SpotImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await SpotImage.bulkCreate([ {
    spotId:1,
    url:'https://gardeningsolutions.ifas.ufl.edu/images/plants/flowers/yellow_wildflowers_field.jpg',
    preview:true
   },
   {
    spotId:2,
    url:'https://enjoyburlington.com/wp-content/uploads/sites/10/2015/06/Starr-farm-venuecrop.jpg',
    preview:true
   },
   {
    spotId:3,
    url:'https://www.icloud.com/5220c404-6225-43fe-b9a5-41956640db08',
    preview:true
   },
   {
    spotId:3,
    url:'https://www.icloud.com/158c08c8-4221-4fe8-91b3-747699ffa4e4',
    preview:false
   },
  ],{validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {[Op.in]: ["imageUrlForOakGroveTinyHome",
        "imageUrlForLakesideCommunityGarden",
        "imageUrlForSlopingBackyard1",
        "imageUrlForSlopingBackyard2"]}
    }, {})
  }
};
