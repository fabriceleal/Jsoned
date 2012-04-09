#!/usr/local/bin/node

// Using /usr/sbin/node throws a weird error: "axconfig: port 1 is not active" and "axconfig: port 2 is not active"

var functional = require('./functional/functional.js')

// Debug
//console.log(functional)

var processing = {
	"map" : {
		"process" : function(data, callback, args){ 
			return functional.map(callback, data);
		}		
	},
	"select" : {
		"process" : function(data, callback, args){ 
			return functional.select(callback, data);
		}
	},
	"reduce" : {
		"process" : function(data, callback, args){ 
			return functional.reduce(callback, args[0], data);
		}		
	}
};

// By default, identity, simply return the input itself (?)
var 	strategy  = "map",
	extraArgs = [],
	callback  = '_';

// Get command line args
process.argv.forEach(function (val, index, arr){
	if(index == 0 || index == 1)
		return; // Ignore first two parameters

	switch(index){
		case 2: // Strategy (map, select, reduce)
			if(["m", "-m", "map", "-map"].indexOf(val) > -1){
				strategy = "map";
			}else if (["s", "-s", "sel", "-sel", "select", "-select"].indexOf(val) > -1){
				strategy = "select";
			}else if (["r", "-r", "red", "-red", "reduce", "-reduce"].indexOf(val) > -1){
				strategy = "reduce";
			}
			
			break;
		case 3: // Callback
			
			// This will have to work for inputs such as '+1' or function(x){return x+1;}
			callback = eval("(" + val + ")");
			
			break;
	}	
	//process.stdout.write(index + ': ' + val + '\n');
});

// All the rest goes into extraArgs
extraArgs = process.argv.slice(4);


// Read input (json) from stdin
process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk){
	/*
	process.stdout.write('data ' + i + ' = ' +chunk);	
	process.stdout.write('index at = ' + i);
	i = i+1;
	*/
	input += chunk;
	/*
	var data = JSON.parse(chunk);
	var outdata = data; //{ "a" : "test" };

	
	
	process.stdout.write( JSON.stringify(outdata) + '\n');*/
});


process.stdin.on('end', function(){
	/*process.stdout.write('the end!\n');*/
	var data = JSON.parse(input);

	data = processing[strategy].process(data , callback, extraArgs);
	
	process.stdout.write( JSON.stringify(data) + '\n');
});

