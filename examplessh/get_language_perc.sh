#!/bin/bash



curl "https://api.github.com/users/fabriceleal/repos" | ../jed.js -m "' _.name '" | ../jed.js -ma "
	function(name, setter){
        var output = '';
        fork(
                'curl',
                [ 'https://api.github.com/repos/fabriceleal/' + name + '/languages' ],
                null,
                function(data){
                        output += data;
                },
                null,
                function(code){
                        var data = JSON.parse(output);
                        setter(data);
                        return true;
                });
  }" | ../jed.js -r "
	function(res, input){ 
		if(input){
			for(var i in input){
				if(input[i]){
					res[i] = input[i] + (res[i]? res[i]: 0); 
				} 
			} 
		} 
		return res;
	} " "{}" | ../jed.js -r "
	function(res, input){
		console.log(input);

		for(var i in input){
			console.log(i);
			res.push( [ i, input[i]] );
		}
		return res;
	}
	" "[]" > ../languages.json


