'use strict';

var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks');



exports.list_all_tasks = function (req, res) {
  Task.find({}, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.create_a_task = function (req, res) {
  var new_task = new Task(req.body);
  new_task.save(function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.read_a_task = function (req, res) {
  Task.findById(req.params.taskId, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.update_a_task = function (req, res) {
  Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
// Task.remove({}).exec(function(){});
exports.delete_a_task = function (req, res) {

  Task.remove({
    _id: req.params.taskId
  }, function (err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

/////////////////////////////////////////////////////////////////
exports.search_a_task = function (req, res) {
  Task.find({
    //name: { $regex: req.params.textSearch, $options: 'i'}
    $text: { $search: req.params.textSearch }
  }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

const getOrders = async function (qtt, pageIdx, cb) {
  // Find all events in database
  let orders, errMsg;
  await Task.
    find(
      {}).
    skip((pageIdx - 1) * qtt).
    limit(qtt).
    then(res => {
      orders = res;
    }).
    catch(err => {
      errMsg = err.message;
    });

  // Error => Response to user
  if (!orders) {
    return cb(400, { msg: errMsg });
  }

  // Count all documents match keyword
  Task.
    countDocuments({}).
    then(cnt => {
      let totalPages = (cnt % qtt === 0) ? Math.floor(cnt / qtt) : Math.floor((cnt / qtt) + 1);
      //let totalPages = if(cnt % qtt ===0){return Math.floor(cnt / qtt)}else{Math.floor((cnt / qtt) + 1)}
      cb(200, { listData: orders, totalPages: totalPages, cnt, qtt });
    });
}

exports.get_task_paginate = function (req, res) {
  let qttConvert = parseInt(req.params.qtt, 10);
  let pageIdxConvert = parseInt(req.params.pageIdx, 10);
  let qtt = isNaN(qttConvert) || qttConvert <= 0 ? 1 : qttConvert;
  let pageIdx = isNaN(pageIdxConvert) || pageIdxConvert <= 0 ? 1 : pageIdxConvert;
  getOrders(qtt, pageIdx, function (sttCode, data) {
    res.status(sttCode).json(data);
  });
}
exports.search_paginate = function (req, res) {
  let qttConvert = parseInt(req.params.qtt, 10);
  let pageIdxConvert = parseInt(req.params.pageIdx, 10);
  let qtt = isNaN(qttConvert) || qttConvert <= 0 ? 1 : qttConvert;
  let pageIdx = isNaN(pageIdxConvert) || pageIdxConvert <= 0 ? 1 : pageIdxConvert;

  searchOrders(req.params.textSearch, pageIdx, qtt, function (sttCode, data) {
    res.status(sttCode).json(data);
  });
}
const searchOrders = async function (textSearch, pageIdx, qtt, cb) {
  let orders, errMsg;
  await Task.
    find(
      {
        name: { $regex: textSearch }
      }).
    skip((pageIdx - 1) * qtt).
    limit(qtt).
    then(res => {
      orders = res;
    }).
    catch(err => {
      errMsg = err.message;
    });

  // Negate access new id if failed adding
  if (!orders) {
    return cb(400, { msg: errMsg });
  }

  // Count 
  Task.
    countDocuments({
      name: { $regex: textSearch }
    }).
    then(cnt => {
      let totalPages = (cnt % qtt === 0) ? Math.floor(cnt / qtt) : Math.floor((cnt / qtt) + 1);
      cb(200, { data: orders, totalPages: totalPages });
    });
}

exports.upload = function (req, res) {
  console.log(req.files.avatar);
  let path = './public/images' + "\\" + req.files.avatar.name;
  console.log(path);
  req.files.avatar.mv(path, (err) => {
    if(!err){
      console.log("SUCCESS");
    } else {
      console.log(err);
    }
    res.send("UPLOAD SUCCESS!!!");
  });
};
