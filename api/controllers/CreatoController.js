var mime
module.exports = {
    save: function(req, res) {
        if (req.body) {
            Creato.saveData(req.body, res.callback2);
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
            Creato.deleteData(req.body, callback);
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
            Creato.getAll(req.body, callback);
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
            Creato.getOne(req.body, callback);
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
                Creato.findLimited(req.body, callback);
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

    //IMAGE UPLOAD

    index1: function(req, res) {
        function callback2(err) {
            Config.GlobalCallback(err, fileNames, res);
        }
        var fileNames = [];
        req.file("file").upload({
            maxBytes: 10000000 // 10 MB Storage 1 MB = 10^6
        }, function(err, uploadedFile) {
            if (uploadedFile && uploadedFile.length > 0) {
                async.each(uploadedFile, function(n, callback) {

                    Config.uploadFile(n.fd, function(err, value) {
                        if (err) {
                            callback(err);
                        } else {
                        
                            fileNames.push(value.name);
                            callback(null);
                        }
                    });
                }, callback2);
            } else {
                callback2(null, {
                    value: false,
                    data: "No files selected"
                });
            }
        });
    },
    readFile: function(req, res) {
        Config.readUploaded(req.query.file, req.query.width, req.query.height, req.query.style, res);
    },

};
