
var db = require('../database/db');

exports.getPages = (req, res) => {
    var sql = "SELECT * FROM pages ORDER BY page_id DESC"
    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
        res.status(400).json({"error":err.message});
        return;
        }
        res.json(row)
    });
}

exports.getPageByLink = (req, res) => {
  var sql = 'SELECT * FROM pages WHERE link = ?';
  var params = [req.params.link]
  db.all(sql, params, (err, row) => {
      if (err) {
      res.status(400).json({"error":err.message});
      return;
      }
      res.json(row)
  });
}

exports.getPageById = (req, res) => {
    var sql = 'SELECT * FROM pages WHERE page_id = ?';
    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
        res.status(400).json({"error":err.message});
        return;
        }
        res.json(row)
    });
  }

exports.createPage = (req, res) => {
    console.log('route create page');
  const { title, link, background_image, show_in_menu } = req.body
  var sql = 'INSERT INTO pages (title, link, background_image, show_in_menu ) VALUES (?,?,?,?)'
  var params = [title, link, background_image, show_in_menu]
  db.run(sql, params, function (err, result) {
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

exports.updatePage = (req, res) => {
  const { title, link, background_image, show_in_menu } = req.body
  db.run(
    `UPDATE pages SET 
        title = COALESCE(?,title),
        link = COALESCE(?,link),
        background_image = COALESCE(?,background_image),
        show_in_menu = COALESCE(?,show_in_menu)
        WHERE page_id = ?`,
    [ title, link, background_image, show_in_menu, req.params.id],
    function (err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    }
  );
}

exports.deletePage = (req, res) => {
  db.run(
    'DELETE FROM pages WHERE page_id = ?',
    req.params.id,
    function (err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({"message":"deleted", changes: this.changes})
  });
}