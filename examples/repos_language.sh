#!/bin/bash

curl "https://api.github.com/users/fabriceleal/repos" | ../jed.js -s "'_.fork == false'" | ../jed.js -m " '_.language' " | ../jed.js -r "
	function(res, input){
		if(input == null){
			input = \"unknown\";
		}
		res[input] = (res[input] ? res[input] : 0) + 1;
		
		return res;
	}
" "{}" | ../jed.js -do "function(arg){var ret=[]; for(var i in arg){ ret.push([i, arg[i]]);} return ret; }"
