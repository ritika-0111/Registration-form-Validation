var db = require('./db');


var hel = function(post,sql) {
   db.query(sql, post, (err, result) => {
      if(err) throw err;
      console.log(result);
      return result;
  });
};

var eg= function(username,sql){
    db.query(sql, username, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
           res.send("Username Unavailable")}
});
};




module.exports = {
  hel: hel,
  eg: eg
}
