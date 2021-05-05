
var db = require('../database/db');

exports.getNews = (req, res) => {
    var sql = "SELECT * FROM news ORDER BY news_id DESC"
    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
        res.status(400).json({"error":err.message});
        return;
        }
        res.json(row)
    });
}