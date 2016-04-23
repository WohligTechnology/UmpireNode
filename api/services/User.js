var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    password: String,
    mobile: String,
    deviceid: String,
    expiry: Date,
    timestamp: Date
});

module.exports = mongoose.model('User', schema);

var models = {
    saveData: function (data, callback) {
        var user = this(data);
        if (data._id) {
            data.expiry = new Date(data.expiry);
            this.findOneAndUpdate({
                _id: data._id
            }, data).exec(function (err, updated) {
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
            user.save(function (err, created) {
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
    getAll: function (data, callback) {
        this.find({}, {
            password: 0
        }).exec(function (err, found) {
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
        }, {
            password: 0
        }).exec(function (err, found) {
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
    findLimited: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function (callback) {
                    User.count({
                        name: {
                            '$regex': check
                        }
                    }).exec(function (err, number) {
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
                function (callback) {
                    User.find({
                        name: {
                            '$regex': check
                        }
                    }, {
                        password: 0
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function (err, data2) {
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
            function (err, data4) {
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
    login: function (data, callback) {
        if (data.password && data.password) {
            data.password = sails.md5(data.password);
        }
        this.findOne({
            mobile: data.mobile,
            password: data.password,
            expiry: {
                $gte: new Date()
            }
        }, {
            password: 0
        }).exec(function (err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (found && found.email != "") {
                callback(null, found);
            } else {
                callback(null, {});
            }
        });
    },
    changePassword: function (data, callback) {
        if (data.password && data.password != "") {
            data.password = sails.md5(data.password);
        }
        if (data.editpassword && data.editpassword != "") {
            data.editpassword = sails.md5(data.editpassword);
        }
        this.findOneAndUpdate({
            _id: data._id,
            password: data.password
        }, {
            password: data.editpassword
        }).exec(function (err, updated) {
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
};

module.exports = _.assign(module.exports, models);
