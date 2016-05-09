var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
  name: String,
  password: String,
  mobile: String,
  deviceid: String,
  expiry: Date,
  userid: {
    type: Date,
    default: Date.now
  },
  timestamp: Date
});

module.exports = mongoose.model('User', schema);

var models = {
  saveData: function(data, callback) {
    //        delete data.password;
    var user = this(data);
    if (data._id) {
      data.expiry = new Date(data.expiry);
      data.password=sails.md5(data.password);
      data.userid = new Date();
      this.findOneAndUpdate({
        _id: data._id
      }, data).exec(function(err, updated) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (updated) {
          callback(null, updated);
        } else {
          callback(null, {});
        }
      });
    } else {
      user.timestamp = new Date();
      data.expiry = new Date();
      user.password = sails.md5(user.password);

      user.save(function(err, created) {
        if (err) {
          callback(err, null);
        } else if (created) {
          callback(null, created);
        } else {
          callback(null, {});
        }
      });
    }
  },
  deleteData: function(data, callback) {
    this.findOneAndRemove({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else if (deleted) {
        callback(null, deleted);
      } else {
        callback(null, {});
      }
    });
  },
  getAll: function(data, callback) {
    this.find({}, {
      password: 0
    }).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (found && found.length > 0) {
        callback(null, found);
      } else {
        callback(null, []);
      }
    });
  },
  getOne: function(data, callback) {
    this.findOne({
      "_id": data._id
    }, {
      password: 0
    }).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (found && Object.keys(found).length > 0) {
        callback(null, found);
      } else {
        callback(null, {});
      }
    });
  },
  findLimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    data.pagenumber = parseInt(data.pagenumber);
    data.pagesize = parseInt(data.pagesize);
    async.parallel([
        function(callback) {
          User.count({
            name: {
              '$regex': check
            }
          }).exec(function(err, number) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (number && number !== "") {
              newreturns.total = number;
              newreturns.totalpages = Math.ceil(number / data.pagesize);
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
        },
        function(callback) {
          User.find({
            name: {
              '$regex': check
            }
          }, {
            password: 0
          }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data2 && data2.length > 0) {
              newreturns.data = data2;
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
        }
      ],
      function(err, data4) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (data4) {
          callback(null, newreturns);
        } else {
          callback(null, newreturns);
        }
      });
  },

  // login by pooja

  login: function(data, callback) {
    data.password = sails.md5(data.password);
    User.findOne({
      mobile: data.contact,
      password: data.password
    }).exec(function(err, data2) {
      if (err) {
        callback(err, null);
      } else if (data2) {
        var cutoff = new Date();

        //check expiry date
        User.findOne({
          mobile: data.contact,
          password: data.password,
          expiry: {
            $gte: cutoff
          }
        }, {
          _id: 1,
          name: 1,
          expiry: 1
        }, function(err, data3) {
          if (err) {
            callback(err, null);
          } else if (data3) {

            data3.password = "";
            data3.userid = cutoff;
            //update userid
            User.findOneAndUpdate({
              _id: data3._id
            }, {
              $set: {
                userid: cutoff
              }
            }).exec(function(err, updated) {
              console.log("done");
            });
            //update userid

            callback(null, data3);
          } else {
            callback(null, {
              message: "DateExpired"
            });
          }
        });

      } else {
        callback(null, {
          message: "IncorrectCredentials"
        });
      }
    });
  },
  changePassword: function(data, callback) {
    if (data.oldPassword && data.oldPassword !== "") {
      data.oldPassword = sails.md5(data.oldPassword);
    }
    if (data.newPassword && data.newPassword !== "") {
      data.newPassword = sails.md5(data.newPassword);
    }
    this.findOneAndUpdate({
      _id: data._id,
      password: data.oldPassword
    }, {
      password: data.newPassword
    }).exec(function(err, updated) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (updated) {
        callback(null, {
          message: "PasswordChangedSuccessfully"
        });
      } else {
        callback(null, {
          message: "IncorrectOldPAssword"
        });
      }
    });
  },

  // become a member

  becomeMember: function(data, callback) {
    var register = this(data);
    register.timestamp = new Date();
    register.mobile = data.contact;
    //        check if user present

    this.findOne({
      "mobile": register.mobile
    }).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (_.isEmpty(found)) {
        register.save(function(err, created) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, created);
          }
        });
      } else {
        callback(null, {
          message: "UserAlreadyRegistered"
        });
      }
    });

  },


};

module.exports = _.assign(module.exports, models);
