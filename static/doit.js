var socket = io();

window.onload = function(){
    watchSpots();
}

function watchSpots(){
    var spots = ['A','B','B+','C','R'];
    for (var i in spots){
	var spot = document.getElementById(spots[i]);
	spot.onclick = function(){
	    socket.emit('update',this.id);
	}
    }
}

socket.on('update', function(id){
    clearSpots();
    document.getElementById(id).classList.add('active');
});

function clearSpots(){
    var spots = ['A','B','B+','C','R'];
    for (var i in spots){
	var spot = document.getElementById(spots[i]);
	spot.classList.remove('active');
    }
}
