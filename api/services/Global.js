/**
 * GlobalController
 *
 * @description :: Server-side logic for managing Globals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    response: function (err, data, res) {
        if (err) {
            res.json({
                value: false,
                data: err
            });
        } else if (data && (data.length > 0 || Object.keys(data).length > 0)) {
            res.json({
                value: true,
                data: data
            });
        } else {
            res.json({
                value: false,
                data: data
            });
        }
    }
};
