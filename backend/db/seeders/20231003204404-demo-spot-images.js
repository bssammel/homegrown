"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://gardeningsolutions.ifas.ufl.edu/images/plants/flowers/yellow_wildflowers_field.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://enjoyburlington.com/wp-content/uploads/sites/10/2015/06/Starr-farm-venuecrop.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://i.pinimg.com/736x/02/6c/86/026c865915b553c221e173284022355e.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://sharonsantoni.com/wp-content/uploads/2020/06/my-french-country-home-june-garden-potager.jpg",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.in]: [
            "https://gardeningsolutions.ifas.ufl.edu/images/plants/flowers/yellow_wildflowers_field.jpg",
            "https://enjoyburlington.com/wp-content/uploads/sites/10/2015/06/Starr-farm-venuecrop.jpg",
            "https://i.pinimg.com/736x/02/6c/86/026c865915b553c221e173284022355e.jpg",
            "https://sharonsantoni.com/wp-content/uploads/2020/06/my-french-country-home-june-garden-potager.jpg",
          ],
        },
      },
      {}
    );
  },
};
