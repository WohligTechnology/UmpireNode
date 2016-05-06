module.exports = {
    save: function(req, res) {
        function callback(err, data) {
            Global.response(err, data, res);
        }
        if (req.body) {
            Session.saveData(req.body, callback);
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
            Session.deleteData(req.body, callback);
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
            Session.getAll(req.body, callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findOne: function(req, res) {
        function callback(err, data) {
            Global.response(err, data, res);
        }
        if (req.body) {
            Session.getOne(req.body, callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findLimited: function(req, res) {
        function callback(err, data) {
            Global.response(err, data, res);
        }
        if (req.body) {
            if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
                Session.findLimited(req.body, callback);
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
    // sessionRuns: function(req, res) {
    //     console.log(req.body);
    //     if (req.body) {
    //         Session.sessionRuns(req.body, res.callback);
    //     } else {
    //         res.json({
    //             value: false,
    //             data: "Invalid Request"
    //         });
    //     }
    // },
    change: function(req, res) {
        var over = 0;
        var runs = 0;
        var bat = 0;
        var matchid = 0;
        var favourite = 0;
        var suspended = false;
        var socketCallback = function(err, data) {
            if (err) {

            } else {
                sails.sockets.broadcast(req.body._id, {
                    data: data,
                    value: true,
                    serverTime: Date()
                });
                console.log("SOCKET CALLED");
            }
        };
        var getMatchDetails = function(err, data) {
            Match.getOne(req.body, socketCallback);
        };

        function callback(err, data) {
            // OVERS
            bat = data.bat;
            favourite = data.favorite;
            suspended = data.suspended;
            // console.log(data);
            if (bat == 1) {
                over = data.team1Overs;
                runs = data.team1Runs;
                wicket = data.team1Wicket;
            } else {
                over = data.team2Overs;
                runs = data.team2Runs;
                wicket = data.team2Wicket;
            }
            async.parallel({
                    incrementBall: function(callback) {
                        if (req.body.incrementBall !== '' && req.body.incrementBall) {
                            Session.incrementBall(req.body.incrementBall, bat, req.body._id, over, callback);
                        } else {
                            callback(null, {});
                        }
                    },
                    incrementRun: function(callback) {
                        if (req.body.incrementRun !== '' && req.body.incrementRun) {
                            Session.incrementRun(req.body.incrementRun, bat, req.body._id, runs, callback);
                        } else {
                            callback(null, {});
                        }
                    },
                    incrementWicket: function(callback) {
                        if (req.body.incrementWicket !== '' && req.body.incrementWicket) {
                            Session.incrementWicket(req.body.incrementWicket, bat, req.body._id, wicket, callback);
                        } else {
                            callback(null, {});
                        }
                    },
                    changeBat: function(callback) {
                        if (req.body.changeBat !== '' && req.body.changeBat) {
                            Session.changeBat(req.body.changeBat, bat, req.body._id, callback);
                        } else {
                            callback(null, {});
                        }
                    },
                    changeSuspended: function(callback) {
                        if (req.body.changeSuspended !== '' && req.body.changeSuspended) {
                            Session.changeSuspended(req.body.changeSuspended,suspended,req.body._id, callback);
                        } else {
                            callback(null, {});
                        }
                    },
                    changeRate: function(callback) {
                        if (req.body.rate1 !== '' && req.body.rate1 && req.body.rate2 !== '' && req.body.rate2) {
                            Session.changeRate(req.body.rate1, req.body.rate2, req.body._id, callback);
                        } else {
                            callback(null, {});
                        }
                    },

                    sessionRuns: function(callback) {
                        if (req.body.run !== '' && req.body.run) {
                            Session.sessionRuns(req.body, callback);
                        } else {
                            callback(null, {});
                        }
                    },

                },
                function(err, data) {
                    if (!err) {
                        res.callback2(null, data);
                        getMatchDetails();
                    } else {
                        res.callback2(null, err);
                    }
                });
        }
        if (req.body) {
            Match.getOneForBackend(req.body, callback);
        } else {
            res.json({
                error: "inValid Format"
            });
        }
    },
    // CREATE SESSION

    createSession: function(req, res) {
        console.log("In session");
        var inning = 0;
        var runs = 0;
        var bat = 0;
        var matchid = 0;

        function callback(err, data) {
            bat = data.bat;
            firstBat = data.firstBat;
            if (bat == 1) {
                runs = data.team1Runs;
            } else if (bat == 2) {
                runs = data.team2Runs;
            }
            if (bat == firstBat) {
                inning = 1;
            } else {
                inning = 2;
            }
            Session.createSession(req.body._id, inning, req.body.overs, runs, res.callback2);
        }
        if (req.body.overs !== "" && req.body.overs) {
            console.log(req.body);
            Match.getOneForBackend(req.body, callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    // DELETE SESSION

    deleteSession: function(req, res) {

        if (req.body.overs !== "" && req.body.overs) {
            console.log(req.body);
            Session.deleteSession(req.body, res.callback2);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    // CHANGE FAVOURITE

    changeFavourite: function(req, res) {
        function callback(err, data) {
            favourite = data.favorite;
            if (req.body.changeFavourite !== '' && req.body.changeFavourite) {
                Session.changeFavourite(req.body.changeFavourite, favourite, req.body._id, res.callback2);
            }
        }
        if (req.body) {
            Match.getOneForBackend(req.body, callback);
        } else {
            res.json({
                error: "inValid Format"
            });
        }
    },
    // CHANGE DLRUNS

    changeDlruns: function(req, res) {
        if (req.body.changeDlruns !== '' && req.body.changeDlruns) {
          Session.changeDlruns(req.body.changeDlruns, req.body._id, res.callback2);
        } else {
            res.json({
                error: "inValid Format"
            });
        }
    },
};
