#!/bin/bash


curl "https://api.github.com/users/fabriceleal/repos" | ../jed.js -s "'_.fork == false'" | ../jed.js -m "
	' [_.name, _.created_at.slice(0, 7), _.pushed_at.slice(0, 7), _.updated_at.slice(0, 7)] '"
