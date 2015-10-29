/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var task = sequelize.define('task', {
        taskid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        orderid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        shipperid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        adminid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        taskstatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tasktype: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        taskdate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        classMethods: {
            associate: function(db) {
                task.belongsTo(db.order, {
                    foreignKey: 'orderid',
                    constraints: false
                });
            },
            getAllHistoryOfShipper: function (shipperid, modelOrder, modelOrderStatus) {
                return task.findAll({
                    attributes: [['taskid', 'id'],['taskdate','date']],
                    where: {
                        shipperid: shipperid,
                        //taskdate: taskdate
                    },
                    include: [
                        {
                            model: modelOrder,
                            //limit: 1,
                            attributes: [['orderid', 'code'], 'statusid', 'fee', 'cod'],
                            where:{
                                //statusid: '1 or 2'
                            },
                            include: {
                                model: modelOrderStatus,
                                attributes: [['statusname', 'statusid']]
                            }
                        }
                    ]
                });
            }
        }
    });
    return task;
};
