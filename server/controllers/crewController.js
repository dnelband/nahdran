var db = require('../database/db');

exports.getCrew = (req, res) => {
  var sql = 'SELECT * FROM crew ORDER BY ord ASC';
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.getCrewMember = (req, res) => {
  var sql = 'SELECT * FROM crew WHERE crew_id = ?';
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.createCrewMember = (req, res) => {
  const { name, job, type, picture, about, ord } = req.body;
  var sql =
    'INSERT INTO crew (name, job, type, picture, about, ord ) VALUES (?,?,?,?,?,?)';
  var params = [name, job, type, picture, about, ord];
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

exports.updateCrewMember = (req, res) => {
  console.log(req.params.id);
  const { name, job, type, picture, about, ord } = req.body;
  db.run(
    `UPDATE crew SET 
          name = COALESCE(?,name),
          job = COALESCE(?,job),
          type = COALESCE(?,type),
          picture = COALESCE(?,picture),
          about = COALESCE(?,about),
          ord = COALESCE(?,ord)
          WHERE crew_id = ?`,
    [name, job, type, picture, about, ord, req.params.id],
    function (err, result) {
      console.log(result);
      console.log(err);
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: 'success' });
    }
  );
};

exports.deleteCrewMember = (req, res) => {
  db.run(
    'DELETE FROM crew WHERE crew_id = ?',
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
