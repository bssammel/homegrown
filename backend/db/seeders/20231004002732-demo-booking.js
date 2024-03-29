'use strict';

const {Booking} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Booking.bulkCreate([
    {
      spotId: 1,
      userId: 4,
      startDate: "01-02-2003",
      endDate: "02-02-2003",
    },
    {
      spotId: 3,
      userId: 4,
      startDate: "10-22-2003",
      endDate: "11-23-2003",
    },
    {
      spotId: 2,
      userId: 5,
      startDate: "09-20-2003",
      endDate: "10-21-2003",
    },
    {
      spotId: 2,
      userId: 5,
      startDate: "01-01-2024",
      endDate: "12-31-2024",
    },
    
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: {[Op.in]: ["01-02-2003",
      "10-22-2003",
      "09-20-2003",]}
    }, {})
  }
};
