var db = require('../database/db');

exports.getGalleries = (req, res) => {
  var sql = 'SELECT * FROM galleries ORDER BY gallery_id DESC';
  var params = [];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.getGalleryById = (req, res) => {
  var sql = 'SELECT * FROM galleries WHERE gallery_id = ?';
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.getGalleryItem = (req, res) => {
  var sql = 'SELECT * FROM gallery_items ORDER BY ord ASC';
  var params = [];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.getGalleryItemByGalleryId = (req, res) => {
  var sql = 'SELECT * FROM gallery_items WHERE gallery_id = ?';
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.createGallery = (req, res) => {
  console.log('route create gallery');
  const { title, description } = req.body;
  var sql = 'INSERT INTO galleries (title, description ) VALUES (?,?)';
  var params = [title, description];
  db.run(sql, params, function (err, result) {
    console.log(err);
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

exports.updateGallery = (req, res) => {
  const { title, description } = req.body;
  db.run(
    `UPDATE galleries SET 
          title = COALESCE(?,title),
          description = COALESCE(?,description)
          WHERE gallery_id = ?`,
    [title, description, req.params.id],
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

exports.createGalleryItem = (req, res) => {
  console.log('route create gallery item');
  const { type, gallery_id, filepath, thumbnail, title, caption, ord } =
    req.body;
  var sql =
    'INSERT INTO gallery_items (type, gallery_id, filepath, thumbnail, title, caption, ord ) VALUES (?,?,?,?,?,?,?)';
  var params = [type, gallery_id, filepath, thumbnail, title, caption, ord];
  db.run(sql, params, function (err, result) {
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

exports.updateGalleryItem = (req, res) => {
  console.log('update gallery item');
  const { type, gallery_id, filepath, title, caption, ord } = req.body;
  db.run(
    `UPDATE gallery_items SET 
          type = COALESCE(?,type),
          gallery_id = COALESCE(?,gallery_id),
          filepath = COALESCE(?,filepath),
          thumbnail = COALESCE(?,thumbnail),
          title = COALESCE(?,title),
          caption = COALESCE(?,caption),
          ord = COALESCE(?,ord)
          WHERE gallery_item_id = ?`,
    [type, gallery_id, filepath, title, caption, ord, req.params.id],
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

exports.deleteGallery = (req, res) => {
  db.run(
    'DELETE FROM galleries WHERE gallery_id = ?',
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

exports.deleteGalleryItem = (req, res) => {
  db.run(
    'DELETE FROM gallery_items WHERE gallery_item_id = ?',
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
