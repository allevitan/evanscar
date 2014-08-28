var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb');

var mongoURI = process.env.MONGOHQ_URL || process.env.MONGOLOCAL_URI
console.log(mongoURI);

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    mongo.Db.connect(mongoURI, function(err, db){
	db.collection('loc', function(er, loc){
	    loc.findOne({name: 'car'}, function(err, car){
		res.render('layout', {loc: car.loc});
	    });
	});
    });
})

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('update', function(id){
	mongo.Db.connect(mongoURI, function(err, db){
	    db.collection('loc', function(er, loc){
		loc.update({name: 'car'}, {name: 'car', loc: id}, {upsert: true}, function(){
		    io.emit('update', id);
		    console.log('location updated to ' + id);
		});
	    });
	});
    });
});


http.listen(app.get('port'), function() {
  console.log("Evan's car is running at localhost:" + app.get('port'));
})
