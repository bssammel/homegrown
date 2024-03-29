'use strict';

const {Review} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([{
      spotId: 1,
      userId: 4,
      review: "I really enjoyed setting up my wildflower garden here! Had a separate entrance and lots of hoses. Really sandy and rocky soil made it hard to get started.",
      stars: 4,
    },
    {
      spotId: 3,
      userId: 4,
      review: "The lawn maintenance team drove over my broccoli that had intentionally gone to seed!",
      stars: 2,
    },
    {
      spotId: 3,
      userId: 4,
      review: "I planted corn, cowpeas, sungold tomatoes and seminole pumpkins alongside the native wildflowers in the retention wall raised bed. Great soil!",
      stars: 5,
    },
    {
      spotId: 1,
      userId: 4,
      review: "The property lacks pollinators due to the property owner mowing every other day",
      stars: 2,
    },
    {
      spotId: 2,
      userId: 5,
      review: "Got to learn about the uses of cinquefoil from the medicinal garden where I was starting chamomile and feverfew.",
      stars: 5,
    },
    {
      spotId: 2,
      userId: 5,
      review: "No pesticide use allowed in this organic garden. Awful",
      stars: 3,
    },
  ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: {[Op.in]: ["I really enjoyed setting up my wildflower garden here! Had a separate entrance and lots of hoses. Really sandy and rocky soil made it hard to get started.",
      "I planted corn, cowpeas, sungold tomatoes and seminole pumpkins alongside the native wildflowers in the retention wall raised bed. Great soil!",
      "Got to learn about the uses of cinquefoil from the medicinal garden where I was starting chamomile and feverfew.","No pesticide use allowed in this organic garden. Awful","The property lacks pollinators due to the property owner mowing every other day", "The lawn maintenance team drove over my broccoli that had intentionally gone to seed!",]}
    }, {})
    
  }
};
