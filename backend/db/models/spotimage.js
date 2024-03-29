'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
  
    static associate(models) {
      // define association here
      SpotImage.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId',
          onDelete:'CASCADE'
        }
      )
    }
  }
  SpotImage.init({
    spotId:{type: DataTypes.INTEGER, allowNull:false},
    url: {type: DataTypes.STRING, allowNull:false},
    preview: {type: DataTypes.BOOLEAN, allowNull: false}
  }, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]}
      }
  });
  return SpotImage;
};
