'use strict';

const {ReviewImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId:4,
        url:"imageUrlForReviewForOakGrove"
      },
      {
        reviewId:5,
        url:"imageUrlForReviewForRaisedBed"
      },
      {
        reviewId:6,
        url:"imageUrlForReviewForLakeside"
      },
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {[Op.in]: ["imageUrlForReviewForOakGrove",
      "imageUrlForReviewForRaisedBed",
      "imageUrlForReviewForLakeside"]}
    }, {})
  }
};
