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
      spotId: 4,
      userId: 14,
      review: "I really enjoyed setting up my wildflower garden here! Had a separate entrance and lots of hoses. Really sandy and rocky soil made it hard to get started.",
      stars: 3.5,
    },
    {
      spotId: 6,
      userId: 14,
      review: "I planted corn, cowpeas, sungold tomatoes and seminole pumpkins alongside the native wildflowers in the retention wall raised bed. Great soil!",
      stars: 4.5,
    },
    {
      spotId: 5,
      userId: 15,
      review: "Got to learn about the uses of cinquefoil from the medicinal garden where I was starting chamomile and feverfew.",
      stars: 4.5,
    },
  ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: {[Op.in]: ["I really enjoyed setting up my wildflower garden here! Had a separate entrance and lots of hoses. Really sandy and rocky soil made it hard to get started.",
      "I planted corn, cowpeas, sungold tomatoes and seminole pumpkins alongside the native wildflowers in the retention wall raised bed. Great soil!",
      "Got to learn about the uses of cinquefoil from the medicinal garden where I was starting chamomile and feverfew."]}
    }, {})
    
  }
};
