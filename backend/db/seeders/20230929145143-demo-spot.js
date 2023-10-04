'use strict';

const {Spot} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "12345 County Line",
        city: "Smalltown",
        state: "Florida",
        country: "United States of America",
        lat: 90.0000000,
        lng: -180.0000000,
        name: "Oak Grove Tiny Home",
        description: "Perfect space to grown native wildflowers",
        price: 10,
      },
      {
        ownerId: 2,
        address: "24680 Maple Lane",
        city: "Regulartown",
        state: "Vermont",
        country: "United States of America",
        lat: 44.502260,
        lng: -73.251974,
        name: "Lakeside Community Garden",
        description: "Grow heirloom crops alongside others at this breezy community garden",
        price: 15,
      },
      {
        ownerId: 3,
        address: "67890 Post Office Road",
        city: "Smalltown",
        state: "Florida",
        country: "United States of America",
        lat: -90.0000000,
        lng: 180.0000000,
        name: "Sloping Backyard",
        description: "Retention wall raised bed makes for a easy to maintain butterfly garden with partial sun througout the rest of the yard",
        price: 20,
      },
    ],{validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {[Op.in]: ['Oak Grove Tiny Home', 'Lakeside Community Garden', 'Sloping Backyard']}
    }, {})
  }
};
