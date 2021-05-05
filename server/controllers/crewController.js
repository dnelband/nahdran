
var db = require('../database/db');

exports.getCrew = (req, res) => {
    var sql = "SELECT * FROM crew ORDER BY crew_id DESC"
    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
        res.status(400).json({"error":err.message});
        return;
        }
        res.json(row)
    });
}