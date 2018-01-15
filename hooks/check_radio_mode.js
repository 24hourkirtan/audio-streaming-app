#!/usr/bin/env node

// This checks if app should be built in radio-only mode

var fs = require('fs');
var path = require('path');

function loadConfigXMLDoc(filePath) {
    var fs = require('fs');
    var xml2js = require('xml2js');
    var json = "";
    try {
        var fileData = fs.readFileSync(filePath, 'ascii');
        var parser = new xml2js.Parser();
        parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
            json = result;
        });
        console.log("File '" + filePath + "' was successfully read.");
        return json;
    } catch (ex) {
        console.log(ex)
    }
}

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(to_replace, "g"), replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

var configXMLPath = "./config.xml";
var rawJSON = loadConfigXMLDoc(configXMLPath);
var preferences = rawJSON.widget.preference;
for(var i = 0; i < preferences.length; i++){
    if(preferences[i].$.name == "radio-only" ){
        replace_string_in_file("./www/app/app.js", "menu.html", "menu2.html");
    }
}