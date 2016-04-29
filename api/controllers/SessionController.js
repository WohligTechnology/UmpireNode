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
            if (req.body.pagenumber && req.body.pagenumber != "" && req.body.pagesize && req.body.pagesize != "") {
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
    sessionRuns: function(req, res) {
        console.log(req.body);
        if (req.body) {
            Session.sessionRuns(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    change: function(req, res) {
        var over = 0;
        var runs = 0;
        var bat = 0;
        var matchid = 0;

        function callback(err, data) {
            // OVERS
            bat = data.bat;
            if (bat == 1) {
                over = data.team1Overs;
                runs = data.team1Runs;
            } else {
                over = data.team2Overs;
                runs = data.team2Runs;
            }


            if (req.body.incrementBall !== '' && req.body.incrementBall) {
                console.log("In IB");
                Session.incrementBall(req.body.incrementBall, bat, req.body._id, over, res.callback2);
            }

            // increment runs
            else if (req.body.incrementRun !== '' && req.body.incrementRun) {

                Session.incrementRun(req.body.incrementRun, bat, req.body._id, runs, res.callback2);
        }
        // increment wicket
        else if (req.body.incrementWicket !== '' && req.body.incrementWicket) {
            Session.incrementWicket(req.body, res.callback);
        }
        // change bat
        else if (req.body.changeBat !== '' && req.body.changeBat) {
            Session.changeBat(req.body, res.callback);
        }
        // change bat
        else if (req.body.rate1 !== '' && req.body.rate1 && req.body.rate2 !== '' && req.body.rate2) {
            Session.changeRate(req.body, res.callback);
        }
        // change favourite
        else if (req.body.changeFavourite !== '' && req.body.changeFavourite) {
            Session.changeFavourite(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    }
    if (req.body) {
        Match.getOneForBackend(req.body, callback);
    } else {}

},
};
