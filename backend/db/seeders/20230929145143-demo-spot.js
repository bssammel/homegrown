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
        name: "Lake Side Community Garden",
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
        name: "Sloping Backyard with plenty of partial shade",
        description: "Retention wall raised bed makes for a easy to maintain butterfly garden",
        price: 20,
      },
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
