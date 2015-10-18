/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

  var user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userrole: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userstatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      getAllUsers: function() {
        return user.findAll({});
      },

      getOneUser: function(username){
        return user.findOne({
          where:{
            'username':username,
          }
        });
      },

      postOneUser: function(newUser){
        return user.build(newUser).save();
      },

      deleteUser: function (users) {
        return users.destroy()
      },

      putUser: function(currentUser){
        return currentUser.save();
      }
    }

  });

  //users.removeAttribute('id');

  return user;
};

/*
* Note by HoangLVQ:
*
* - timestamp: true => Xoá đi column CreateAt
* - freezeTableName: false => ngăn việc sửa tên model mặc định
* - classMethods: {} => Định nghĩa các funtion trong entity
* - users.removeAttribute('id) => Mặc định nếu bảng không primarykey thì sẽ tự thêm một column ID. Xoá đi cột ID này
*
* */