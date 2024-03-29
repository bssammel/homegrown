'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId',
          onDelete:'CASCADE'
        }
      )
      Review.belongsTo(
        models.User,
        {
          foreignKey: 'userId',
          onDelete:'CASCADE'
        }
      )
      Review.hasMany(
        models.ReviewImage,
        {
          foreignKey: 'reviewId',
          onDelete:'CASCADE'
        }
      )
    }
  }
  Review.init({
    spotId:{type: DataTypes.INTEGER, allowNull:false},
    userId:{type: DataTypes.INTEGER, allowNull:false},
    review: {type: DataTypes.STRING, allowNull:false},
    stars: {type: DataTypes.DECIMAL, allowNull: false}
  }, {
    sequelize,
    modelName: 'Review',
    defaultScope: {
      // attributes: {
      //   exclude: ["createdAt", "updatedAt"]}
      }
  });
  return Review;
};
