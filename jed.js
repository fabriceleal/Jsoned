#!/usr/local/bin/node

// Using /usr/sbin/node throws a weird error: "axconfig: port 1 is not active" and "axconfig: port 2 is not active"

// Get command line args
process.argv.forEach(function (val, index, arr){
	process.stdout.write(index + ': ' + val + '\n');
});


// Read input (json) from stdin
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk){
	
	
	process.stdout.write('data = ' + chunk);
});




