'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User,
        {
          foreignKey: 'ownerId',
          onDelete:'CASCADE'
        }
      ),
      Spot.hasMany(
        models.SpotImage,
        {
          foreignKey: 'spotId'
        }
      ),
      Spot.hasMany(
        models.Review,
        {
          foreignKey:'spotId'
        }
      )

    }
  }
  Spot.init({
    ownerId: {type: DataTypes.INTEGER, allowNull:false},
    address: {type: DataTypes.STRING, allowNull:false},
    city: {type: DataTypes.STRING, allowNull:false},
    state: {type: DataTypes.STRING, allowNull:false},
    country: {type: DataTypes.STRING, allowNull:false},
    lat: {type: DataTypes.DECIMAL, validate:{
      max: 90,
      min: -90,
      isDecimal:true
    }},
    lng: {type: DataTypes.DECIMAL, validate:{
      max: 180,
      min: -180,
      isDecimal:true
    }},
    name: {type: DataTypes.STRING, allowNull:false},
    description: {type: DataTypes.STRING, allowNull:false},
    price: {type: DataTypes.INTEGER, allowNull:false, validate: {min: 1} }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]}
      }
  });
  return Spot;
};
