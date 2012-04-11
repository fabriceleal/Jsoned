#!/bin/bash



curl "https://api.github.com/users/fabriceleal/repos" | ../jed.js -s "' _.fork == false '" | ../jed.js -m "' _.name '" | ../jed.js -ma "
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
		res.push( [ input.key, input.value] );
		
		return res;
	}
	" "[]" | ../jed.js -do "
	function(obj, args){
		obj.sort(function (a1, a2){
			// Order by codebase size, the second subscript of the element
			return a2[1] - a1[1];
		});
		return obj;
	}
	" > languages.json


