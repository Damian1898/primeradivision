/* aftersave: uglifyjs <self> -mco ../../dist/js/functions.min.js */

$(document).ready(function(){
	getInfo('json','matches');
	getInfo('xml', 'posiciones');
	getInfo('xml', 'fixture');
	getInfo('xml', 'goleadores');
});

var matches;
var positions = [];
var fixture;
var scorers;

function getData(typeInfo,url,pos) {

	$.get( url , function( data ) {
		var xml = data;

		if(typeInfo == 'posiciones')
			positions[pos] = xmlToJson(xml);

		if(typeInfo == 'fixture')
			fixture = xmlToJson(xml);

		if(typeInfo == 'goleadores')
			scorers = xmlToJson(xml);
	});
}

function getInfo(typeF,typeInfo) {

	if(typeF == 'json' && typeInfo == 'matches') {
		$.getJSON( "http://data.bolavip.com/json/argentina.json", function( data ) {
			matches = data;	
		});
	}

	if(typeF == 'xml'){
		if(typeInfo == 'posiciones') {
			var url = "http://data.bolavip.com/xml/primeraa/deportes.futbol.primeraa."+typeInfo+".1.1.xml";
			getData(typeInfo,url,0);
			url = "http://data.bolavip.com/xml/primeraa/deportes.futbol.primeraa."+typeInfo+".1.2.xml";
			getData(typeInfo,url,1);
		} else {			
			var url = "http://data.bolavip.com/xml/primeraa/deportes.futbol.primeraa."+typeInfo+".xml";
			getData(typeInfo,url);		
		}
	}

}

 function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				var nodeName = attribute.nodeName;
				nodeName = nodeName.replace("#","");
				obj[nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			nodeName = nodeName.replace("#","");
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

