/* aftersave: uglifyjs <self> -mco ../../dist/js/functions.min.js */

$(document).ready(function(){

	$.ajaxSetup({
		async: false
	});

	getInfo('json','matches');
	getInfo('xml', 'posiciones');
	getInfo('xml', 'fixture');
	getInfo('xml', 'goleadores');

	findFechas();
	loadFecha();


});

var nextMatches;
var positions = [];
var fixture;
var scorers;
var fechaActual = [];
var fechaProxima = [];
var fechas = [];

function getData(typeInfo,url,pos) {

	$.get( url , function( data ) {
		var xml = data;

		if(typeInfo == 'posiciones')
			positions[pos] = xmlToJson(xml).posiciones;

		if(typeInfo == 'fixture')
			fixture = xmlToJson(xml).fixture;

		if(typeInfo == 'goleadores')
			scorers = xmlToJson(xml).goleadores;
	});
}

function getInfo(typeF,typeInfo) {

	if(typeF == 'json' && typeInfo == 'matches') {
		$.getJSON( "http://data.bolavip.com/json/argentina.json", function( data ) {
			nextMatches = data;	
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
}

function findFechas() {
	var nameTournament = fixture.campeonato.text;
	$(".site-tournament-title").html(nameTournament);
	
	$.each(fixture.fecha, function( index, matches ) {
		if(matches.estado == 'actual') {
			fechaActual[fechaActual.length] = matches;
		}

		if(matches.estado == 'proxima') {
			fechaProxima[fechaProxima.length] = matches;
			//fechaActual = matches;
		}

		fechas[fechas.length] = matches;
	});	
}

function loadFecha() {
	var sectionMatches = $(".site-tournament-matches");
	sectionMatches.empty();
	for (var i = fechaActual.length - 1; i >= 0; i--) {
		if(fechaActual[i].orden != 3 || fechaActual[i].fn == 12) {
			$.each(fechaActual[i].partido, function(index, partido){
				cargarPartido(fechaActual[i],partido, sectionMatches);
			});
		} else {
			cargarPartido(fechaActual[i],fechaActual[i].partido, sectionMatches);
		}
	}
}

function cargarPartido(fecha, partido, section) {
	var divMatch = $("<div class='site-tournament-match'>");
	var figure = $("<figure>");
	var divTeamL = $("<div class='site-match-team'>");
	var divTeamV = $("<div class='site-match-team'>");
	var escudoLocal = $("<img class='site-match-team-escudo' src='http://data.bolavip.com/img/teams/"+partido.local.id+".gif' />");
	var labelLocal = $("<label class='site-match-team-name'>"+partido.local.text+"</label>");

	var labelGLocal = $("<label class='site-match-team-goles'>"+partido.goleslocal.text+"</label>");
	var labelGVisitante = $("<label class='site-match-team-goles fLeft'>"+partido.golesvisitante.text+"</label>");

	var escudoVisitante = $("<img class='site-match-team-escudo' src='http://data.bolavip.com/img/teams/"+partido.visitante.id+".gif' />");
	var labelVisitante = $("<label class='site-match-team-name'>"+partido.visitante.text+"</label>");
	

	divTeamL.append(escudoLocal,labelLocal,labelGLocal);
	divTeamV.append(escudoVisitante,labelVisitante,labelGVisitante);

	figure.append(divTeamL,divTeamV);

	divMatch.append(figure);

	section.append(divMatch);

}


function findFecha (nbrFecha) {
	fechaActual = [];
	$.each(fechas, function(index,fecha) {
		if(fecha.fn == nbrFecha) {
			fechaActual.push(fecha);
		}
	});
}