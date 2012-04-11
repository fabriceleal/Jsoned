#!/bin/bash

#echo "[\"Jed\"]" | ../jed.js -ma "
curl "https://api.github.com/users/fabriceleal/repos" | ../jed.js -s "' _.fork == false '" | ../jed.js -m "' _.name '" | ../jed.js -ma "
 /* Get list of commits for each personal repository */
	function(name, setter){
        var output = '';
        fork(
                'curl',
                [ 'https://api.github.com/repos/fabriceleal/' + name + '/commits' ],
                null,
                function(data){
                        output += data;
                },
                null,
                function(code){
                        var data = JSON.parse(output);
                        setter({
									'repo' : name,
									'commits': data});
                        return true;
                });
  }" | ../jed.js -s " /* Filter by author */
		'1 == 1'
	" | ../jed.js -m " /* Transform. For each element, count the nbr of commits */
		function(x){ 
			var ret = [];
			var repo = x.repo;
			var times = [];
			
			
			times = functional.reduce(function(res, input){
					var idx = input.commit.committer.date.slice(0, 7) ;
					times[ idx ] = (times[ idx ] ? times[ idx ] : 0 ) + 1;

					return times;
				}, times, x.commits);

			for(var i in times){
				ret.push([repo, i, times[i]]);
			}

			return ret;
		} 
	" | ../jeds.js -do "  /* Re-arranje to match the structure that google whats :| */
		function(input, args){
			ret = {};

			/* Get list of all the projects */
			ret['projects'] = [];

			/* Get min and max month. Fill the blanks */
			ret['months'] = [];

			/* Each row -> project, Each column -> month */
			/* Compute final matrix */
			ret['data'] = [
				[0, 0, 0],
				[0, 0, 0],
			];

			return ret;
		}
	"
