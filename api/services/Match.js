var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    team1: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        index: true
    },
    team2: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        index: true
    },
    venue: { type: { type: String, default: 0 }, default: 0 },
    overs: { type: Number, default: 0 },
    link: { type: String, default: 0 },
    result: { type: String, default: 0 },
    tournament: {
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
        index: true
    },
    comment: { type: String, default: "" },
    toss: { type: String, default: 0 },
    firstBat: { type: Number, default: 1 },
    team1score: { type: String, default: 0 },
    team2score: { type: String, default: 0 },
    status: { type: Boolean, default: false },
    newtarget: { type: String, default: 0 },
    newOvers: { type: Number, default: 0 },
    startTime: { type: Date, default: Date.now },
    bat: { type: Number, default: 1 },
    suspended: { type: Boolean, default: false },
    cupName: { type: String, default: "" },
    team1Runs: { type: Number, default: 0 },
    team1Wicket: { type: Number, default: 0 },
    team1Overs: { type: Number, default: 0 },
    team2Runs: { type: Number, default: 0 },
    team2Overs: { type: Number, default: 0 },
    team2Wicket: { type: Number, default: 0 },
    favorite: { type: Number, default: 1 },
    rate1: { type: Number, default: 1 },
    rate2: { type: Number, default: 1 },
    dlRuns: { type: Number, default: 0 }
});

module.exports = mongoose.model('Match', schema);

var models = {
    saveData: function (data, callback) {
        var match = this(data);
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data).exec(function (err, updated) {
                if (err) {

                    callback(err, null);
                } else if (updated) {
                    callback(null, updated);
                } else {
                    callback(null, {});
                }
            });
        } else {
            match.timestamp = new Date();
            match.save(function (err, created) {
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
    getOneForBackend: function (data, callback) {
        this.findOne({
            "_id": data._id
        }).populate([{
            path: "team1",
            select: {
                _id: 1,
                name: 1
            }
        }]).populate([{
            path: "team2",
            select: {
                _id: 1,
                name: 1
            }
        }]).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (found && Object.keys(found).length > 0) {
                callback(null, found);
            } else {
                callback(null, {});
            }
        });
    },
    deleteData: function (data, callback) {
        this.findOneAndRemove({
            _id: data._id
        }, function (err, deleted) {
            if (err) {
                callback(err, null);
            } else if (deleted) {
                callback(null, deleted);
            } else {
                callback(null, {});
            }
        });
    },

    change: function(data,callback){
      if (data._id) {
          this.findOneAndUpdate({
              _id: data._id
          }, {$set:data}).exec(function (err, updated) {
              if (err) {

                  callback(err, null);
              } else if (updated) {
                  callback(null, updated);
              } else {
                  callback(null, {});
              }
          });
      }
    },
    getAll: function (data, callback) {
        this.find({}).exec(function (err, found) {
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
    getOne: function (data, callback) {
        this.findOne({
            "_id": data._id
        }).populate([{
            path: "team1",
            select: {
                _id: 1,
                name: 1
            }
        }]).populate([{
            path: "team2",
            select: {
                _id: 1,
                name: 1
            }
        }]).lean().exec(function (err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (found && Object.keys(found).length > 0) {
                Session.getAllByMatch(data,function(err,sessionData) {
                    if(!err) {
                        found.session = sessionData;
                        callback(null, found);
                    }
                });

            } else {
                callback(null, {});
            }
        });
    },
    findLimited: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function (callback) {
                    Match.count({
                        cupName: {
                            '$regex': check
                        }
                    }).exec(function (err, number) {
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
                function (callback) {
                    Match.find({
                        cupName: {
                            '$regex': check
                        }
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).populate([{
                        path: "team1",
                        select: {
                            _id: 0,
                            name: 1
                        }
                    }]).populate([{
                        path: "team2",
                        select: {
                            _id: 0,
                            name: 1
                        }
                    }]).exec(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            for (var j = 0; j < newreturns.data; j++) {
                                console.log(j);
                                console.log("in for");
                            }
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                }
            ],
            function (err, data4) {
                if (err) {
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
