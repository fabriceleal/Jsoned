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
	" | ../jed.js -do "  /* Re-arranje to match the structure that google whats :| */
		function(input, args){
			var ret = {};

			/* Get list of all the projects */
			ret['projects'] = functional.map('_[0][0]', input);
/*
			ret['months'] = [];

			var yrs = [2011, 2012];
			var mths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
			for(var y in yrs){
				for(var m in mths){
					ret['months'].push(yrs[y] + '-' + mths[m]);
				}
			}
*/
			ret['months'] = ['2011-08', '2011-09', '2011-10', '2011-11', '2011-12', '2012-01', '2012-02', '2012-03', '2012-04']

			ret['data'] = new Array(ret['projects'].length);
			
			/* Each row -> project, Each column -> month */
			/* Compute final matrix */

			for(var i in input){
				for(var j in input[i]){
					var proj = input[i][j][0];
					var month = input[i][j][1];
					var value = input[i][j][2];
					
					if(null == ret['data'][ ret['projects'].indexOf(proj) ]){
						/* Creates array, inits to zero */
						ret['data'][ ret['projects'].indexOf(proj) ] = functional.map(' 0 ', new Array(ret['months'].length)); 
					}

					ret['data'][ ret['projects'].indexOf(proj) ][ ret['months'].indexOf(month) ] = value;
				}				
			}
/**/

			return ret;
		}
	"
