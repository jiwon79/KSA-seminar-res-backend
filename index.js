const express = require('express') //express를 설치했기 때문에 가져올 수 있다.
const app = express()
const port = process.env.PORT || 3000;

var mongoose = require('mongoose');
mongoose.connect(process.env.KSA_SEMINAR_KIOSK_DB);
var db = mongoose.connection;
db.on('error', function(){
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('Connected!');
});

var Schema = mongoose.Schema;
var userLogSchema = new Schema(
  {
    name: String,
    time: String,
    number: String
  }
)

// var userLogSchema = new Schema(
//   {
//     currentTime: String, 
//     stu_num: String, 
//     stu_name: String, 
//     phone_num: String,
//     option: String,
//     info: {
//       seminar: String,
//       time: String
//     }
//   }
// )


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


app.get('/auth', (req, res) => {
  res.send(req.query.id+','+req.query.pw)
})

app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});