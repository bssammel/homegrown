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
      spotId: 4,
      userId: 14,
      startDate: "01-02-2003",
      endDate: "02-02-2003",
    },
    {
      spotId: 6,
      userId: 14,
      startDate: "10-22-2003",
      endDate: "11-23-2003",
    },
    {
      spotId: 5,
      userId: 15,
      startDate: "09-20-2003",
      endDate: "10-21-2003",
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
