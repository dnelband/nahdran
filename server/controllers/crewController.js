
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


exports.getCrewMember = (req, res) => {
    var sql = "SELECT * FROM crew WHERE crew_id = ?"
    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
        res.status(400).json({"error":err.message});
        return;
        }
        res.json(row)
    });
}

exports.createCrewMember = (req, res) => {
    const { name, job, type, picture, about } = req.body
    var sql = 'INSERT INTO crew (name, job, type, picture, about ) VALUES (?,?,?,?,?)'
    var params = [name, job, type, picture, about]
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

exports.updateCrewMember = (req, res) => {
    const { name, job, type, picture, about } = req.body
    db.run(
      `UPDATE crew SET 
          name = COALESCE(?,name),
          job = COALESCE(?,job),
          type = COALESCE(?,type),
          picture = COALESCE(?,picture),
          about = COALESCE(?,about)
          WHERE crew_id = ?`,
      [  name, job, type, picture, about, req.params.id],
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({ message: "success" })
      }
    );
  }

  exports.deleteCrewMember = (req, res) => {
    db.run(
      'DELETE FROM crew WHERE crew_id = ?',
      req.params.id,
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({"message":"deleted", changes: this.changes})
    });
  }