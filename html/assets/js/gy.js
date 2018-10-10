window.onload = function() {
	var newExperimentButton = document.getElementById("newExperimentButton");
	var refreshButton = document.getElementById("refreshButton");
	var yesButton = document.getElementById("yesButton");
	var noButton = document.getElementById("noButton");
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
	
	yesButton.onclick = function() {
		currentExperiment.increment( currentJob.label, 0 ); // Increment results
		setNewImage();
		return false;
	};
	
	noButton.onclick = function() {
		// It doesn't really matter which one this is as long as its not 0
		currentExperiment.increment( currentJob.label, 1 );	// Increment results
		setNewImage();
		return false;
	};
	
	setNewImage = function() {
		currentJob = new imageJob();	// Reset job
		currentExperiment.display();	// Refresh the display
	};
}

var imageJob = function() {
	this.imagePath = "../raw/";				// Path to images
	this.numClasses = 6;							// Repeated, probably need to address this
	// 1/3 a prior chance of pulling a GY yellows
	this.label = Math.floor( Math.random() * 3 );
	switch (this.label) {
		case 0:
			this.imagePath = this.imagePath + "GY/"; break;
		case 1:
			this.imagePath = this.imagePath + "Other/"; break;
		case 2:
			this.imagePath = this.imagePath + "Healthy/"; break;
	}
	this.imagePath = this.imagePath + 'image-' + Math.ceil( Math.random() * 85 ) + '.jpg';
	document.getElementById("imagePane").setAttribute("src",this.imagePath);
	document.getElementById("imagePane").setAttribute("width","450px");
}

var experiment = function() {
	this.n = 0;				// Number of negatives
	this.p = 0;				// Number of positives
	this.tp = 0;			// Number of true positives
	this.tn = 0;			// Number of true negatives
	this.fp = 0;			// Number of false positives
	this.fn = 0;			// Number of false negatives
	
	// results.incr, increment a point in the confusion matrix.
	// First element is the correct label, second element is the guess
	this.increment = function(label, guess) {
		// The 'positive' category in this scenario is the number 0
		if (label == 0 && guess == 0) {
			this.tp++;
			this.p++;
		}
		else if (label == 0 && guess != 0) {
			this.fn++;
			this.p++;
		}
		else if (label != 0 && guess == 0) {
			this.fp++;
			this.n++;
		}
		else {
			this.tn++;
			this.n++;
		}
	};
	
	this.display = function() {
		document.getElementById( "truePositives" ).innerHTML = this.tp;
		document.getElementById( "falseNegatives" ).innerHTML = this.fn;
		document.getElementById( "falsePositives" ).innerHTML = this.fp;
		document.getElementById( "trueNegatives" ).innerHTML = this.tn;
	};
}