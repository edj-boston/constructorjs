var Edge = require('../../src/models/Edge.js'),
	uuid = require('uuid'),
	validateUUID = require('../../lib/validateUUID.js'),
	Vertex = require('../../src/models/Vertex.js');


var Model = function(options) {

	if( typeof options == 'undefined' || options == null) {
		throw new Error('You must pass an options object');
	}

	// Populate this with defaults or options
	for( prop in this.defaults) {
		this[prop] = options.hasOwnProperty(prop) ? options[prop] : this.defaults[prop];
	}

	this.validate();

	return this;

}

Model.prototype.defaults = {
	amplitude	: 0,
	autoReverse	: true,
	comment		: '',
	edges		: {},
	f			: 0,
	g			: 0,
	height		: 1,
	k			: 0,
	reflection	: 0,
	name		: '',
	phase		: 0,
	speed		: 0,
	vertices	: {},
	width		: 1
};

Model.prototype.validate = function() {

	// Validate types against defaults
	for( prop in this.defaults ) {
		if( typeof this[prop] != typeof this.defaults[prop] ) {
			throw new Error('`' + prop + '` must be a ' + typeof this.defaults[prop]);
		}
	}

	// Validate the amplitude value
	if( this.amplitude < 0 || this.amplitude > 1 ) {
		throw new Error('`amplitude` must be a number between 0 and 1 (inclusive)');
	}

	// Validate the f value
	if( this.f < 0 || this.f > 1 ) {
		throw new Error('`f` must be a number between 0 and 1 (inclusive)');
	}

	// Validate the g value
	if( this.g < -1  || this.g > 1 ) {
		throw new Error('`g` must be a number between -1 and 1 (inclusive)');
	}

	// Validate the height value
	if( this.height <= 0 ) {
		throw new Error('`height` must be a number greater than 0');
	}

	// Validate the k value
	if( this.k < 0 || this.k > 1 ) {
		throw new Error('`k` must be a number between 0 and 1 (inclusive)');
	}

	// Name must be a string of some length
	if( this.name.length < 1) {
		throw new Error('`name` length must be greater than 1');
	}

	// Validate the phase value
	if( this.phase < 0 || this.phase > 1 ) {
		throw new Error('`phase` must be a number between 0 and 1 (inclusive)');
	}

	// Validate the reflection value
	if( this.reflection < 0 || this.reflection > 1 ) {
		throw new Error('`reflection` must be a number between 0 and 1 (inclusive)');
	}

	// Validate the speed value
	if( this.speed < -1  || this.speed > 1 ) {
		throw new Error('`speed` must be a number between -1 and 1 (inclusive)');
	}

	// Validate the width value
	if( this.width <= 0 ) {
		throw new Error('`width` must be a number greater than 0');
	}

	// Check to make sure that vertices referenced in edges are present
	for(id in this.edges) {
		if( !this.vertices.hasOwnProperty(this.edges[id].a) || !this.vertices.hasOwnProperty(this.edges[id].b) ) {
			throw new Error('Vertex passed to Edge constructor not found in vertices property');
		}
	}

};

Model.prototype.addVertex = function(type, x, y, vx, vy) {

	var id = uuid.v4();
	var vertex = new Vertex(type, x, y, vx, vy);

	this.vertices[id] = vertex;

	return id;

};

Model.prototype.deleteVertex = function(id) {

	if( this.vertices.hasOwnProperty(id) ) {
		delete this.vertices[id];
	} else {
		throw new Error('Cannot delete vertex because the id was not found');
	}

	// Delete any edges that reference this vertex
	for(edgeId in this.edges) {
		if( this.edges[edgeId].a == id || this.edges[edgeId].b == id ) {
			delete this.edges[edgeId];
		}
	}

	return true;

};

Model.prototype.addEdge = function(type, a, b, length, amplitude, phase) {

	var id = uuid.v4();
	var edge = new Edge(type, a, b, length, amplitude, phase);

	this.edges[id] = edge;

	this.validate();

	return id;

};

module.exports = Model;