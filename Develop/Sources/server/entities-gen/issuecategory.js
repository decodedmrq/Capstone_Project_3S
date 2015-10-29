/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('issuecategory', { 
    categoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryname: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
