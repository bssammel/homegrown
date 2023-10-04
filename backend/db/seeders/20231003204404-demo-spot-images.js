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
    url:'imageUrlForOakGroveTinyHome',
    preview:true
   },
   {
    spotId:2,
    url:'imageUrlForLakesideCommunityGarden',
    preview:true
   },
   {
    spotId:3,
    url:'imageUrlForSlopingBackyard1',
    preview:true
   },
   {
    spotId:3,
    url:'imageUrlForSlopingBackyard2',
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
