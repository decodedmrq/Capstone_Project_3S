/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var order =  sequelize.define('order', {
    orderid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    ordertypeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    pickupaddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deliveryaddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pickupdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deliverydate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    recipientphone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recipientname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    fee: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cod: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    pickupaddresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deliveryaddresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      getAllTaskOfShipper: function(taskOrder, orderStatusModel, shipperid, taskdate) {
        return order.findAll({
          attributes: ['orderid', 'ordertypeid', 'pickupaddress', 'deliveryaddress', 'pickupdate', 'deliverydate', 'statusid'],
          include: [{
            model: taskOrder,
            attributes: ['tasktype', 'taskdate'],
            where: {
              shipperid: shipperid,
              taskdate: taskdate
            }
          },{
            model: orderStatusModel,
            attributes: ['statusname']
          }
          ]
        });
      }
    }
  });
  return order;
};
