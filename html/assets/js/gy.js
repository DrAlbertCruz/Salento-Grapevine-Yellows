window.onload = function() {
	var newExperimentButton = document.getElementById("newExperimentButton");
	var refreshButton = document.getElementById("refreshButton");
	var currentExperiment = new experiment();
	var currentJob = new imageJob();
	
	newExperimentButton.onclick = function() {
		var currentExperiment = new experiment();
		return false;
	};
	refreshButton.onclick = function() {
		currentExperiment.display();
		return false;
	};
}

var imageJob = function() {
	var fs = require('fs');							// Require fs
	this.imagePath = "../localized/";				// Path to images
	this.numClasses = 6;							// Repeated, probably need to address this
	// Randomly select one of the six labels
	this.label = Math.floor( Math.random() * this.numClasses );		
	// Switch based on random label
	switch (this.label) {
		case 0:
			this.files = fs.readdirSync( this.imagePath + "Black_rot" ); break;
		case 1:
			this.files = fs.readdirSync( this.imagePath + "Control" ); break;
		case 2:
			this.files = fs.readdirSync( this.imagePath + "Esca" ); break;
		case 3:
			this.files = fs.readdirSync( this.imagePath + "Grapevine_yellow" ); break;
		case 4:
			this.files = fs.readdirSync( this.imagePath + "Leaf_blight" ); break;
		case 5:
			this.files = fs.readdirSync( this.imagePath + "Other" ); break;
	}
	
}

var experiment = function() {
	// Results are a 6x6 confusion matrix. By convention:
	// 0 - Black rot
	// Control
	// Esca
	// GY
	// Leaf blight
	// Other
	// This is indexed as a 1-D array
	this.numClasses = 6;
	this.confMatrix = new Array(this.numClasses*this.numClasses);
	for (i = 0; i < this.numClasses; i++ ) {
		for (j = 0; j < this.numClasses; j++ ) {
			this.confMatrix[i + (this.numClasses-1)*j] = 0;
		}
	}
	// results.incr, increment a point in the confusion matrix.
	// First element is the correct label, second element is the guess
	this.increment = function(i, j) {
		this.confMatrix[i + (this.numClasses-1)*j]++;
		return false;
	};
	this.display = function() {
		for (i = 0; i < this.numClasses; i++ ) {
			for (j = 0; j < this.numClasses; j++ ) {
				var a = document.getElementById( "c" + i + j );
				document.getElementById( "c" + i + j ).innerHTML = this.confMatrix[i + (this.numClasses-1)*j];
			}
		}
		return false;
	};
}