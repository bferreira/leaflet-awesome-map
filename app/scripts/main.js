/*jslint browser: true*/
/*global L */

(function (window, document, L, undefined) {
	'use strict';

	function buffer(leafletGeometry, distance){
		var reader = new jsts.io.GeoJSONReader();
		var input = reader.read(leafletGeometry.toGeoJSON());
		input = input.geometry.buffer(distance);

		var bufferGeoJSON = new jsts.io.GeoJSONWriter().write(input);
		return L.geoJson(bufferGeoJSON);
	}

	L.Icon.Default.imagePath = 'images/';

	/* create leaflet map */
	var map = L.map('map', {
		center: [52.5377, 13.3958],
		zoom: 4
	});

	/* add default stamen tile layer */
	var stamen = new L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	});

	// for all possible values and explanations see "Template Parameters" in https://msdn.microsoft.com/en-us/library/ff701716.aspx
	//Aerial  AerialWithLabels | Birdseye | BirdseyeWithLabels | Road
	var bingArialWL = new L.BingLayer("Ao-Ru3hxROyJwLhKJPKtOvsNGp4wnKi4w0UGhXRrXSfFOWv1_SUAs-2WXroS3Y9F", {type: "AerialWithLabels"});
	var bingRoad = new L.BingLayer("Ao-Ru3hxROyJwLhKJPKtOvsNGp4wnKi4w0UGhXRrXSfFOWv1_SUAs-2WXroS3Y9F", {type: "Road"});
	var bingAerial = new L.BingLayer("Ao-Ru3hxROyJwLhKJPKtOvsNGp4wnKi4w0UGhXRrXSfFOWv1_SUAs-2WXroS3Y9F", {type: "Aerial"});


	map.addControl(new L.Control.Layers({"Bing Aerial": bingAerial, "Bing Arial with Labels": bingArialWL, "Bing Road": bingRoad, 'Staman':stamen}, {}));
	stamen.addTo(map);

	L.marker([52.5, 13.4]).addTo(map);

	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	var drawControl = new L.Control.Draw({
		position: 'topleft',
		draw: {
			polyline: {
				metric: true
			},
			polygon: {
				allowIntersection: false,
				showArea: true,
				drawError: {
					color: '#b00b00',
					timeout: 1000
				},
				shapeOptions: {
					color: '#bada55'
				}
			},
			circle: {
				shapeOptions: {
					color: '#662d91'
				}
			},
			marker: false
		},
		edit: {
			featureGroup: drawnItems,
			remove: true,
			buffer: {
				replace_polylines: false,
				separate_buffer: false
			}
		}
	});
	map.addControl(drawControl);


	map.on('draw:created', function (e) {
		var type = e.layerType,
			layer = e.layer;

		// Do whatever else you need to. (save to db, add to map etc)
		drawnItems.addLayer(layer);
	});


}(window, document, L));