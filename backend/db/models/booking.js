'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    
    static associate(models) {
      // define association here
      Booking.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId',
          onDelete:'CASCADE'
        }
      )
      Booking.belongsTo(
        models.User,
        {
          foreignKey: 'userId',
          onDelete:'CASCADE'
        }
      )
    }
  }
  Booking.init({
    spotId:{type: DataTypes.INTEGER, allowNull:false},
    userId:{type: DataTypes.INTEGER, allowNull:false},
    startDate: {
      type: DataTypes.DATE, 
      allowNull: false,
      validate: {
        isDate:true,
      }
    },
    endDate: {
      type: DataTypes.DATE, 
      allowNull: false,
      validate: {
        isDate:true,
      }
    },
    // isNotEmail(value) {
    //   if (Validator.isEmail(value)) {
    //     throw new Error("Cannot be an email.");
    //   }
    // }
  }, {
    sequelize,
    modelName: 'Booking',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]//protects sensitive information by excluding it from .findAll
      }
    }
  });
  return Booking;
};
