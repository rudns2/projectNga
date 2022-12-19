var mysql = require('mysql');
var connection =  mysql.createConnection({
  host: "us-cdbr-east-06.cleardb.net",
  user: "be56d8a8000248",
  password: "60ea205d",
  database:'heroku_4918cc839f598eb',
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// memo를 추출 할때
function getMemo(callback) {
  connection.query('SELECT * FROM hm order by id desc', (err, rows) => {
    if (err) throw err;
    callback(rows);
  })
};
function insertHm(name, content, callback) {
  connection.query(`insert into hm(create_time, name, content) values(now(),'${name}', '${content}')`,(err) => {
    if (err) throw err;
    callback();
  })
}

function getHmByid(id, callback) {
  console.log(id);
  connection.query(`select * from hm where id=${id}`, (err,row) => {
    if(err) throw err;
    callback(row);
  })
}

function updateHm(id,content,name,callback) {
  connection.query(`UPDATE hm set create_time= now(),name='${name}',content='${content}' where id=${id}`, (err) => {
    if (err) throw err;
    callback();
  })
}

function deleteByid(id, callback) {
  connection.query(`DELETE from hm where id=${id}`, (err) => {
    if (err) throw err;
    callback();
  })
}
// JOIN INSERT INTO
function hmJoin(name,address,birth,id,pw,callback){
  connection.query(`INSERT INTO  hmjoinmember(create_time,name,address,birth,id,pw) VALUES(NOW(), '${name}','${address}','${birth}','${id}','${pw}')`,(err)=>{
    if(err)throw err;
    callback();
  })
}
function loginCheck(id, pw, callback){
  connection.query(`select * from hmjoinmember where id='${id}' and pw='${pw}' `,
  (err, results)=> {
    if (err) throw err;
    callback(results);
  })
}
function updateHmFix( name, img, callback) {
  connection.query(`UPDATE hmfix set create_time= now(),name='${name}',img='${img}' where od=${od}`, (err) => {
    if (err) throw err;
    callback();
  })
}

function gethmfix(callback) {
  connection.query('SELECT * FROM hmfix order by id desc', (err, rows) => {
    if (err) throw err;
    callback(rows);
  })
};

function getHmfixByid(id, callback) {
  console.log(id);
  connection.query(`select * from hmfix where id=${id}`, (err,row) => {
    if(err) throw err;
    callback(row);
  })
}

function updateHmfix(id,img,name,callback) {
  connection.query(`UPDATE hmfix set create_time= now(),name='${name}',img='${img}' where id=${id}`, (err) => {
    if (err) throw err;
    callback();
  })
}

function deleteByhmfixid(id, callback) {
  connection.query(`DELETE from hmfix where id=${id}`, (err) => {
    if (err) throw err;
    callback();
  })
}

module.exports = {
  getMemo,insertHm,getHmByid,updateHm,deleteByid,hmJoin,loginCheck,updateHmFix,gethmfix,getHmfixByid,deleteByhmfixid,updateHmfix
}