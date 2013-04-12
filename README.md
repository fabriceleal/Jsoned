# Jsoned
The json stream editor utility.

## Installation:

(use the "-g" option so you have the jsoned command-line utility installed. You'll probably need to use sudo)

npm install jsoned -g 

## Usage:

Simple example:

```shell
> echo "[1,2,3]" | jsoned -m "' _ * 2 '"
[2,4,6]
```

Which is the same as:

```shell
> echo "[1,2,3]" | jsoned -m "function(x){return x*2;}"
[2,4,6]
```

Check the wiki for detailed info ...

## About Jsoned

As you can see in the wiki, there are inconsistencies through the commands, mainly in the stuff that is sent into the functions provided as input. I shall review this.
First called jed, I renamed it as jsoned, as "jed" was already a npm module >:(
