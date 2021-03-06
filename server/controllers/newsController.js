
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

exports.getNewsItem = (req, res) => {
    var sql = "SELECT * FROM news WHERE news_id = ?"
    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
        res.status(400).json({"error":err.message});
        return;
        }
        res.json(row)
    });
}

exports.createNewsItem = (req, res) => {
    const { title, text } = req.body
    var sql = 'INSERT INTO news (title, text ) VALUES (?,?)'
    var params = [title, text]
    db.run(sql, params, function (err, result) {
      console.log(err);
      if (err){
          res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": result,
            "id" : this.lastID
        })
    });
}

exports.updateNewsItem = (req, res) => {
    const { title, text } = req.body
    db.run(
      `UPDATE news SET 
          title = COALESCE(?,title),
          text = COALESCE(?,text)
          WHERE news_id = ?`,
      [ title, text, req.params.id],
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({ message: "success" })
      }
    );
  }

  exports.deleteNewsItem = (req, res) => {
    db.run(
      'DELETE FROM news WHERE news_id = ?',
      req.params.id,
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({"message":"deleted", changes: this.changes})
    });
  }