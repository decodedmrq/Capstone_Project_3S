/* jshint indent: 2 */
var bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {

  var user = sequelize.define('users', {
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
    instanceMethods: {
      authenticate: function(plainTextPassword){
        console.log("old: "+plainTextPassword);
        console.log("old gen: "+ bcrypt.hashSync(plainTextPassword,bcrypt.genSaltSync(10)));
        console.log("new: "+this.password);

        return bcrypt.compareSync(plainTextPassword, this.password);
      },
      encyptPassword: function(plainTextPassword){
        if(!plainTextPassword){
          return ''
        }else{
          var salt = bcrypt.genSaltSync(10);
          return bcrypt.hashSync(plainTextPassword,salt);
        }
      }
    },
    classMethods: {
      getAllUsers: function() {
        return user.findAll({});
      },
      findUserByUsername:  function(username){
        return user.findOne({
          where: {
            username: username
          }
        })
      }
    }


  });

  //var beforeSave = function(user){
  //  if(!user.changed('password')) return;
  //  user.password = user.encryptPassword(user.password);
  //}
  //
  //User.beforeCreate(beforeSave);
  //User.beforeUpdate(beforeSave);

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
