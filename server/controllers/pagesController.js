
var db = require('../database/db');

exports.getPages = (req, res) => {
    var sql = "SELECT * FROM pages ORDER BY ord ASC"
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
  const { title, link, background_image, show_in_menu, ord , background_image_left, background_image_bottom, background_color} = req.body
  var sql = 'INSERT INTO pages (title, link, background_image, show_in_menu, ord, background_image_left, background_image_bottom, background_color ) VALUES (?,?,?,?,?,?,?,?)'
  var params = [title, link, background_image, show_in_menu, ord, background_image_left, background_image_bottom, background_color]
  db.run(sql, params, function (err, result) {
    if (err){
        res.json({"error": err.message})
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
  const { title, link, background_image, show_in_menu, ord, background_image_left, background_image_bottom, background_color } = req.body
  db.run(
    `UPDATE pages SET 
        title = COALESCE(?,title),
        link = COALESCE(?,link),
        background_image = COALESCE(?,background_image),
        show_in_menu = COALESCE(?,show_in_menu),
        ord = COALESCE(?,ord),
        background_image_left = COALESCE(?,background_image_left),
        background_image_bottom = COALESCE(?,background_image_bottom),
        background_color = COALESCE(?,background_color)
        WHERE page_id = ?`,
    [ title, link, background_image, show_in_menu, ord, background_image_left, background_image_bottom, background_color, req.params.id],
    function (err, result) {
      console.log(err);
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