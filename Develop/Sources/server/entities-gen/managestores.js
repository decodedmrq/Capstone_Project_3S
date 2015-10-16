/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('managestores', { 
    managerid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};