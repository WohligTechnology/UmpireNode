module.exports = {
    save: function (req, res) {
        if (req.body) {
            AdminUser.saveData(req.body, res.callback2);
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
            AdminUser.deleteData(req.body, res.callback2);
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
            AdminUser.getAll(req.body, res.callback2);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    findOne: function (req, res) {

        if (req.body) {
            AdminUser.getOne(req.body, res.callback2);
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
              AdminUser.findLimited(req.body, res.callback2);
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
