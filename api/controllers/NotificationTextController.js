module.exports = {
    save: function (req, res) {
        if (req.body) {
            NotificationText.saveData(req.body, res.callback2);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    delete: function (req, res) {
    
        if (req.body) {
          console.log(req.body);
            NotificationText.deleteData(req.body, res.callback2);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    find: function (req, res) {

        if (req.body) {
            NotificationText.getAll(req.body, res.callback2);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findOne: function (req, res) {

        if (req.body) {
            NotificationText.getOne(req.body, res.callback2);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findLimited: function (req, res) {
        if (req.body) {
            if (req.body.pagenumber && req.body.pagenumber != "" && req.body.pagesize && req.body.pagesize != "") {
                NotificationText.findLimited(req.body, res.callback2);
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
