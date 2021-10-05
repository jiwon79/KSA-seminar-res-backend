const express = require('express')
const mongoose = require('mongoose');
const { Schema } = mongoose;

const app = express()
const port = process.env.PORT || 3000;

mongoose.connect(process.env.KSA_SEMINAR_KIOSK_DB);
var db = mongoose.connection;
db.on('error', function(){
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('Connected!');
});

var userLogSchema = new Schema(
  {
    name: String,
    time: String,
    number: String
  }
)

app.get('/', (req, res) => {
  var UserLog = mongoose.model('UserLog', userLogSchema, 'user_log');
  var userLogData = new UserLog({
    name: '권순호',
    time: '2021020',
    number: '19-001'
  });

  userLogData.save().then(() => res.send('success'));
})

app.get('/userLog', (req, res) => {
  var datas = mongoose.model('userLog', userLogSchema, 'user_log');
  var rowData = [];
  datas.find(function(error, userLog) {
    if(error) {
      console.log("error : ", error)
    } else {
      userLog.forEach(function(row) {
        rowData.push(row);
        console.log("data : ", row)
      })
    }
    res.json(rowData);
  })
  // res.json({name: 'naemanaem'});
})

// a,b,c,d,e 정보 주면 reserve_log table에 넣기
// 오늘 날짜가 있으면 업데이ㅌ, 없으면 새로 생성






app.get('/auth', (req, res) => {
  res.send(req.query.id+','+req.query.pw)
})

app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});