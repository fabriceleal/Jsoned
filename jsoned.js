#!/usr/local/bin/node

// Using /usr/sbin/node throws a weird error: "axconfig: port 1 is not active" and "axconfig: port 2 is not active"

var functional = require('./functional/functional.js');
var gengetopt = require('gengetopt-js');
var fs = require('fs');

/*
Usage:

echo "[1,2,3,4]" | jed.js -m "'+1'"

is equivalent to

echo "[1,2,3,4]" | jed.js -m "function(x){return(x+1);}"

*/

var spawn = require('child_process').spawn;

/*
	Generic fork function, with callbacks for incoming data on stdin, stdout, stderr and exit
*/
function fork(command, args, onStdinData, onStdoutData, onStderrData, onExit){
	var exec = spawn(command, args);
	
	exec.stdin.on('data', function(data){
		if(onStdinData){
			onStdinData(data);
		}
	});
	exec.stdout.on('data', function(data){
		if(onStdoutData){
			onStdoutData(data);
		}
	});
	exec.stderr.on('data', function(data){
		if(onStderrData){
			onStderrData(data);
		}
	});
	exec.on('exit', function(code){
		if(onExit){
			onExit(code);
		}
	});

}

// Debug
//console.log(functional)

var processing = {
	"map" : {
		"process" : function(data, callback, args, finalCallback){ 
			var data = functional.map(callback, data);
			finalCallback(data);
			return data;
		}		
	},
	"map-async" : {
		"process" : function(data, callback, args, finalCallback){
			var data = functional.mapAsync(callback, data, finalCallback);
			
			return data;
		}
	},
	"select" : {
		"process" : function(data, callback, args, finalCallback){ 
			var data = functional.select(callback, data);
			
			finalCallback(data);

			return data;
		}
	},
	"reduce" : {
		"process" : function(data, callback, args, finalCallback){
			// args[0] Should be an initial value for the aggregation result 
			var obj = eval("(" + args.reduce_init + ")");
			//console.log('Evaled = ' + obj);

			var data = functional.reduce(callback, obj, data);

			finalCallback(data);

			return data;
		}		
	},
	"doityourself" : {
		"process" : function(data, callback, args, finalCallback){
			var data = callback(data, args);
			
			finalCallback(data);

			return data;
		}
	}
};

// By default, identity, simply return the input itself (?)
var 	strategy  = "map",
	extraArgs = {},
	callback  = '_', 
	lastRead = -1;

var opts = gengetopt.parseArgs(process.argv).transf;
if(opts.hasOwnProperty("m")){
	// Map with callback
	strategy = "map";
	callback = eval("(" + opts["m"] + ")");
}else if(opts.hasOwnProperty("mf")){
	// Map with file
	strategy = "map";
	callback = eval("(" + fs.readFileSync(opts["mf"], 'utf8') + ")");


}else if(opts.hasOwnProperty("ma")){
	// Map-Assync with callback
	strategy = "map-async";
	callback = eval("(" + opts["ma"] + ")");
}else if(opts.hasOwnProperty("maf")){
	// Map-Assync with file
	strategy = "map-async";
	callback = eval("(" + fs.readFileSync(opts["maf"], 'utf8') + ")");


}else if(opts.hasOwnProperty("s")){
	// Select with callback
	strategy = "select";
	callback = eval("(" + opts["s"] + ")");
}else if(opts.hasOwnProperty("sf")){
	// Select with file
	strategy = "select";
	callback = eval("(" + fs.readFileSync(opts["sf"], 'utf8') + ")");


}else if(opts.hasOwnProperty("r")){
	// Reduce with callback
	strategy = "reduce";
	callback = eval("(" + opts["r"] + ")");
	extraArgs.reduce_init = opts["i"];
}else if(opts.hasOwnProperty("rf")){
	// Reduce with callback
	strategy = "reduce";
	callback = eval("(" + fs.readFileSync(opts["rf"], 'utf8') + ")");
	extraArgs.reduce_init = opts["i"];


}else if(opts.hasOwnProperty("d")){
	// Do-it-yourself with callback
	strategy = "doityourself";
	callback = eval("(" + opts["d"] + ")");
}else if(opts.hasOwnProperty("df")){
	// Do-it-yourself with file
	strategy = "doityourself";
	callback = eval("(" + fs.readFileSync(opts["df"], 'utf8') + ")");
}

/*
Usage:
jed.js -[s|ma|m|d] "Callback-function"
jed.js -r "Callback-function" -i "InitValue"
*/


/*
// Get command line args
process.argv.forEach(function (val, index, arr){
	lastRead = index;

	if(index == 0 || index == 1)
		return; // Ignore first two parameters

	switch(index){
		case 2: // Strategy (map, select, reduce)
			if(["m", "-m", "map", "-map"].indexOf(val) > -1){
				strategy = "map";
			}else if (["ma", "-ma", "map-async", "-map-async"].indexOf(val) > -1){
				strategy = "map-async";
			}else if (["s", "-s", "sel", "-sel", "select", "-select"].indexOf(val) > -1){
				strategy = "select";
			}else if (["r", "-r", "red", "-red", "reduce", "-reduce"].indexOf(val) > -1){
				strategy = "reduce";
			}else if (["d", "-d", "do", "-do"].indexOf(val) > -1){
				strategy = "doityourself";
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
//console.log(lastRead);
extraArgs = process.argv.slice( lastRead );
//console.log('extraArgs = ' + extraArgs);
*/

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
	//console.log(input);

	var data = JSON.parse(input);

	processing[strategy].process(data , callback, extraArgs, function(data){
		process.stdout.write(JSON.stringify(data) + '\n');
	});
	
});

