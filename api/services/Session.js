var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  match: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    index: true
  },
  inning: Number,
  run: Number,
  over: Number,
  timestamp: Date
});

module.exports = mongoose.model('Session', schema);

var models = {
    saveData: function(data, callback) {
      var Session = this(data);
      if (data._id) {
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
        Session.timestamp = new Date();
        Session.save(function(err, created) {
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
    sessionRuns: function(data, callback) {
      console.log("In start");
      var currentover = 0;
      if (data.run) {
        console.log(data);
        console.log(" server data ends ");
        // check current over
        Match.findOne({
          "_id": data._id
        }).exec(function(err, found) {
            if (err) {
              callback(err, null);
            } else if (found) {
              console.log(found);
              //find one and update it
              if (found.bat==1) {
                currentover = found.team1Overs;
                console.log("Current : 11.11");
              } else {
                currentover = found.team2Overs;
                console.log("Current : 20");
              }
              Session.findOne({
                  match: data._id,
                  over: {
                    $gt: currentover
                  }
                }).sort({
                  over: 1
                }).exec(function(err, gotId) {
                  console.log(gotId);
                  if (err) {
                    console.log(err);
                    callback(err, null);
                  } else if (gotId) {
                    // update here
                    var data2 = _.clone(data);
                    delete data2._id;
                    if (gotId._id) {
                      Session.findOneAndUpdate({
                        _id: gotId._id
                      }, data2).exec(function(err, updated) {
                        if (err) {
                          console.log(err);
                          callback(err, null);
                        } else if (updated) {
                          callback(null, updated);
                        } else {
                          callback(null, {});
                        }
                      });
                    }
                  } else {
                    callback(null, {});
                  }
                });
              }
              else {
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
          this.find({}).exec(function(err, found) {
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
        getAllByMatch: function(data, callback) {
          this.find({
            match: data._id
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
          data.pagenumber = parseInt(data.pagenumber);
          data.pagesize = parseInt(data.pagesize);
          async.parallel([
              function(callback) {
                Session.count({
                  inning: parseInt(data.search)
                }).exec(function(err, number) {
                  if (err) {
                    console.log(err);
                    callback(err, null);
                  } else if (number && number != "") {
                    newreturns.total = number;
                    newreturns.totalpages = Math.ceil(number / data.pagesize);
                    callback(null, newreturns);
                  } else {
                    callback(null, newreturns);
                  }
                });
              },
              function(callback) {
                Session.find({
                  inning: parseInt(data.search)
                }, {
                  password: 0
                }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).populate('Match').exec(function(err, data2) {
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
        }
    };

    module.exports = _.assign(module.exports, models);
