module.exports = {
    save: function (req, res) {
        function callback(err, data) {
            Global.response(err, data, res);
        }
        if (req.body) {
            User.saveData(req.body, callback);
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
            User.deleteData(req.body, callback);
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
            User.getAll(req.body, callback);
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
            User.getOne(req.body, callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findLimited: function (req, res) {
        function callback(err, data) {
            console.log(data);
            Global.response(err, data, res);
        }
        if (req.body) {
            if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
                User.findLimited(req.body, callback);
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
    login: function (req, res) {
        function callback(err, data) {
            if (err) {
                res.json({
                    value: false,
                    data: {
                        message: err
                    }
                });
            } else if (data.name) {
                delete data.password;
                req.session.user = data;
                req.session.userid = sails.md5(data._id+Date()+_.random(0,1000000));
                req.session.save();
                console.log(req.session);
                delete data._id;
                res.json({
                    value: true,
                    data: data,
                    userid: req.session.userid
                });
            } else {
                res.json({
                    value: false,
                    data: data
                });
            }
        }
        if (req.body) {
            if (req.body.contact && req.body.contact !== "" && req.body.password && req.body.password !== "") {
                User.login(req.body, callback);
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

    profile: function (req, res) {

        var user = req.session.user;
        if (user) {
            res.json(user);
        } else {
            res.json({});
        }
    },
    changePassword: function (req, res) {
        function callback(err, data) {
            Global.response(err, data, res);
        }
        if (req.body) {
            if (req.session.user) {
                req.body._id=req.session.user._id;
                if (req.body.oldPassword && req.body.oldPassword !== "" && req.body.newPassword && req.body.newPassword !== "") {
                    User.changePassword(req.body, callback);
                } else {
                    res.json({
                        value: false,
                        data: "Please provide parameters"
                    });
                }
            } else {
                res.json({
                    value: false,
                    data: "User not logged-in"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    // become a member

    becomeMember: function (req, res) {
        function callback(err, data) {
            if (err) {
                res.json({
                    value: false,
                    data: {
                        message: err
                    }
                });
            } else if (data.name) {

                res.json({
                    value: true,
                    data: {
                        message: "MemberCreated"
                    }
                });
            } else {
                res.json({
                    value: false,
                    data: data
                });
            }
        }
        if (req.body) {
            User.becomeMember(req.body, callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

};
