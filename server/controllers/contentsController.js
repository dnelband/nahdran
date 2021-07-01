var db = require('../database/db');

exports.getContents = (req, res) => {
  var sql = 'SELECT * FROM contents ORDER BY ord ASC';
  var params = [];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.getContentsByPageId = (req, res) => {
  var params = [req.params.id];
  var sql = 'SELECT * FROM contents WHERE page_id = ? ORDER BY content_id DESC';
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.createContents = (req, res) => {
  console.log('route create contents');
  const { page_id, type, value, ord } = req.body;
  var sql =
    'INSERT INTO contents (page_id, type, value, ord ) VALUES (?,?,?,?)';
  var params = [page_id, type, value, ord];
  db.run(sql, params, function (err, result) {
    console.log(err);
    console.log(result);
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: result,
      id: this.lastID,
    });
  });
};

exports.updateContents = (req, res) => {
  const { page_id, type, value, ord } = req.body;
  db.run(
    `UPDATE contents SET 
          page_id = COALESCE(?,page_id),
          type = COALESCE(?,type),
          value = COALESCE(?,value),
          ord = COALESCE(?,value)
          WHERE content_id = ?`,
    [page_id, type, value, ord, req.params.id],
    function (err, result) {
      console.log(err);
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: 'success' });
    }
  );
};

exports.deleteContents = (req, res) => {
  db.run(
    'DELETE FROM contents WHERE content_id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: 'deleted', changes: this.changes });
    }
  );
};
