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

        var currentover = 0;
        var inning = 0;
        if (data.run) {
            // check current over
            Match.findOne({
                "_id": data._id
            }).exec(function(err, found) {
                if (err) {
                    callback(err, null);
                } else if (found) {
                    //find one and update it
                    if (found.bat == 1) {
                        currentover = found.team1Overs;
                    } else {
                        currentover = found.team2Overs;
                    }
                    if (found.firstBat == found.bat) {
                        inning = 1;
                    } else {
                        inning = 2;
                    }
                    Session.findOne({
                        match: data._id,
                        over: {
                            $gt: currentover
                        },
                        inning: inning
                    }).sort({
                        over: 1
                    }).exec(function(err, gotId) {
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
    sessionRuns2: function(data, callback) {
        Session.findOneAndUpdate({
            _id: data._id
        }, {
            $set: {
                run: data.run
            }
        }).exec(function(err, updated) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
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
    },

    // CHANGE BALL

    incrementBall: function(incrementBall, bat, matchid, over, callback) {
        console.log(incrementBall);
        console.log(bat);
        console.log(matchid);
        console.log(over);
        console.log("In session js ");
        var newOver = over;
        if (incrementBall == 1) {
            if ((over * 10) % 10 == 5) {
                newOver += 0.5;
            } else {
                newOver += 0.1;
            }
        } else if (incrementBall == -1) {
            if ((over * 10) % 10 === 0) {
                newOver -= 0.5;
            } else {
                newOver -= 0.1;
            }
        }
        var updateVal = {};
        newOver = newOver.toFixed(2);
        if (bat == 1) {
            updateVal.team1Overs = newOver;
        } else {
            updateVal.team2Overs = newOver;
        }
        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: updateVal
        }).exec(function(err, updated) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },
    // INCREMENT runs

    incrementRun: function(incrementRun, bat, matchid, runs, callback) {
        newruns = runs + incrementRun;
        var updateVal = {};
        if (bat == 1) {
            updateVal.team1Runs = newruns;
        } else {
            updateVal.team2Runs = newruns;
        }
        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: updateVal
        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },

    // INCREMENT wicket

    incrementWicket: function(incrementWicket, bat, matchid, wicket, callback) {
        newwicket = wicket;
        if (incrementWicket == 1) {
            newwicket += 1;
        } else if (incrementWicket == -1) {
            newwicket -= 1;
        }
        var updateVal = {};
        if (bat == 1) {
            updateVal.team1Wicket = newwicket;
            updateVal.isWicket = true;
        } else {
            updateVal.team2Wicket = newwicket;
              updateVal.isWicket = true;
        }
        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: updateVal
        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },
    // CHANEG BAT

    changeBat: function(changeBat, bat, matchid, callback) {

        if (changeBat === true && bat == 1) {
            newbat = 2;
        } else if (changeBat === true && bat == 2) {
            newbat = 1;
        }
        var updateVal = {};
        updateVal.bat = newbat;
        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: updateVal
        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },
    // CHANEG BAT

    changeSuspended: function( suspended, matchid, callback) {

        var newSuspended = false;
        if (suspended === true) {
            newSuspended = false;
        } else if (suspended === false) {
            newSuspended = true;
        }
        var updateVal = {};
        updateVal.suspended = newSuspended;
        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: updateVal
        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },
    // CHANEG RATE

    changeRate: function(rate1, rate2, matchid, callback) {

        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: {
                "rate1": rate1,
                "rate2": rate2
            }
        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },
    // CHANEG NEW OVERS

    changeNewOvers: function(changeNewOvers, matchid, callback) {

        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: {
                "newOvers": changeNewOvers
            }
        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },
    // CHANEG DLRUNS

    changeDlruns: function(changeDlruns,changeNewOvers, matchid, callback) {
        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: {
                "dlRuns": changeDlruns,
                "newOvers": changeNewOvers
            }
        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },
    // CHANEG COMMENT

    changeComment: function(changeComment, matchid, callback) {
        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: {
                "comment": changeComment
            }
        }).exec(function(err, updated) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },

    // CHANEG Favourite

    changeFavourite: function(changeFavourite, favourite, matchid, callback) {
        var newfavourite = favourite;
        if (changeFavourite === true && favourite == 1) {
            newfavourite = 2;
        } else if (changeFavourite === true && favourite == 2) {
            newfavourite = 1;
        }
        var updateVal = {};
        updateVal.favorite = newfavourite;
        Match.findOneAndUpdate({
            _id: matchid
        }, {
            $set: {
                "favorite": newfavourite
            }
        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                callback(null, {});
            }
        });

    },

    // CREATE SESSION

    createSession: function(matchid, inning, over, runs, callback) {

        // check if already there
        Session.findOne({
            match: matchid,
            inning: inning,
            over: over

        }).exec(function(err, updated) {
            if (err) {
                callback(err, null);
            } else if (updated) {
                callback(null, updated);
            } else {
                var Session2 = new Session({
                    match: matchid,
                    inning: inning,
                    over: over
                });
                Session2.save(function(err, created) {
                    if (err) {
                        callback(err, null);
                    } else if (created) {
                        callback(null, created);
                    } else {
                        callback(null, {});
                    }
                });

            }
        });

    },
    // DELETE SESSION

    deleteSession: function(data, callback) {
        Session.findOneAndRemove({
            match: data._id,
            over: data.overs
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

};

module.exports = _.assign(module.exports, models);
