# Jsoned
Json Editor using Node. First called jed, I renamed it as jsoned, as "jed" was already a npm module >:(

## Installation:

(use the "-g" option so you have the jsoned command-line utility installed. You'll probably need to use sudo)
npm install jsoned -g 

## Usage:

Simple example:

> echo "[1,2,3]" | jsoned -m "' _ * 2 '"
[2,4,6]

Which is the same as:

> echo "[1,2,3]" | jsoned -m "function(x){return x*2;}"
[2,4,6]


TODO: more examples ...
