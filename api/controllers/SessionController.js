module.exports = {
    save: function (req, res) {
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
    delete: function (req, res) {
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
    find: function (req, res) {
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
    findOne: function (req, res) {
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
    findLimited: function (req, res) {
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
};
