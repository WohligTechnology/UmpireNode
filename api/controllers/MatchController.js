module.exports = {
    save: function(req, res) {
        var socketCallback = function(err, data) {
            if (err) {

            } else {
                sails.sockets.broadcast(req.body._id, {
                    data: data,
                    value: true,
                    serverTime: Date()
                });
                console.log("SOCKET CALLED");
                res.json({
                    data: "Match saved",
                    value: true
                });
            }
        };
        var getMatchDetails = function(err, data) {
            Match.getOne(req.body, socketCallback);
        };
        if (req.body) {
            Match.saveData(req.body, getMatchDetails);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findOneForBackend: function(req, res) {

        var callback = function(err, data) {
            if (!err) {
                res.json({
                    data: data,
                    value: true,
                });
            } else {
                res.json({
                    error: err,
                    value: false
                });
            }
        };
        if (!req.isSocket) {
            return res.badRequest();
        } else {
            sails.sockets.join(req, req.body._id, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("user Added to room " + req.body._id);
                }
            });
        }
        if (req.body) {
            Match.getOne(req.body, callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    delete: function(req, res) {
        function callback(err, data) {
            Global.response(err, data, res);
        }
        if (req.body) {
            Match.deleteData(req.body, res.callback2);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    find: function(req, res) {
        function callback(err, data) {
            Global.response(err, data, res);
        }
        if (req.body) {
            Match.getAll(req.body, res.callback2);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findOne: function(req, res) {
        var callback = function(err, data) {
            if (!err) {
                res.json({
                    data: data,
                    value: true,
                    serverTime: Date(),
                });
            } else {
                res.json({
                    error: err,
                    value: false
                });
            }
        };
        if (!req.isSocket) {
            return res.badRequest();
        } else {
            sails.sockets.join(req, req.body._id, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("user Added to room " + req.body._id);
                }
            });
        }
        if (req.body) {
            Match.getOne(req.body, callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findLimited: function(req, res) {

        if (req.body) {
            if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
                Match.findLimited(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    checkUserLogin: function(req, res) {

        res.callback(null, {
            value: true
        });
    },
    findLimitedForBackend: function(req, res) {

        if (req.body) {
            if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
                Match.findLimited(req.body, res.callback2);
            } else {
                res.json({
                    value: false,
                    data: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    change: function(req, res) {
        var socketCallback = function(err, data) {
            if (err) {} else {
                sails.sockets.broadcast(req.body._id, {
                    data: data,
                    value: true,
                    serverTime: Date()
                });
                console.log("SOCKET CALLED");
            }
        };
        // var callback2 = function(err, data) {
        //   if (err) {
        //
        //   } else {
        //     User.findOne({
        //       "_id": req.session.user._id
        //     }).exec(function(err, userdata) {
        //       if (!err) {
        //         sails.sockets.broadcast(req.body._id, {
        //           data: data,
        //           value: true,
        //           serverTime: Date(),
        //           userid: userdata.userid
        //         });
        //
        //       } else {
        //         res.json({
        //           error: err,
        //           value: false,
        //           serverTime: Date(),
        //         });
        //       }
        //     });
        //     console.log("SOCKET CALLED");
        //   }
        // };
        var callback = function(err, data) {
            res.callback(err, data);
            Match.getOne(req.body, socketCallback);
        };
        if (req.body && req.body._id) {

            async.parallel([function(callbackAA) {
                var data3 = _.clone(req.body);
                delete data3.sesRun;
                Match.change(data3, callbackAA);
            }, function(callbackAA) {
                var data2 = {};
                if (req.body.sesRun) {
                    data2._id = req.body._id;
                    data2.run = req.body.sesRun;
                    Session.sessionRuns(data2, callbackAA);
                } else {
                    callbackAA(null, {});
                }

            }], function(err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data[0]);
                }

            });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
};
