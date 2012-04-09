#!/usr/bin/node

# Usage


# Read input (json) from stdin
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk){
	process.stdout.write('data = ' + chunk);
});

# Write result to stdout


