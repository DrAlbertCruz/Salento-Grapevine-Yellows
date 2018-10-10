window.onload = function() {
	var newExperimentButton = document.getElementById("newExperimentButton");
	var yesButton = document.getElementById("yesButton");
	var noButton = document.getElementById("noButton");
	var submitButton = document.getElementById("submitButton");
	var emailField = document.getElementById("emailField");
	var currentExperiment = new experiment();
	var currentJob = new imageJob();
	
	newExperimentButton.onclick = function() {
		currentExperiment.resetExperiment();
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
	
	// Callback for when the user clicks on the 'send' button to report results via email
	submitButton.onclick = function() {
		var resultsString = 'Hi,%0A%0AI%20got%20the%20following%20results:%0A' 
							+ currentExperiment.displayString()
							+ '%0AThanks!';
		window.open( 'mailto:'
		             + emailField.getAttribute("value")
					 + '?subject=GY%20detection%20results&body='
					 + resultsString
					 );
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
	
	// Call this function to get a string of formatted results
	this.displayString = function () {
		return 'True%20positives:%20' + this.tp + '%0A'
				+ 'False%20negatives:%20' + this.fn + '%0A'
				+ 'False%20positives:%20' + this.fp + '%0A'
				+ 'True%20negatives:%20' + this.tn + '%0A';
	}
	
	// This function used to set everything to zero
	this.resetExperiment = function() {
		this.n = 0;				// Number of negatives
		this.p = 0;				// Number of positives
		this.tp = 0;			// Number of true positives
		this.tn = 0;			// Number of true negatives
		this.fp = 0;			// Number of false positives
		this.fn = 0;			// Number of false negatives
	};
	
	this.display = function() {
		document.getElementById( "truePositives" ).innerHTML = this.tp;
		document.getElementById( "falseNegatives" ).innerHTML = this.fn;
		document.getElementById( "falsePositives" ).innerHTML = this.fp;
		document.getElementById( "trueNegatives" ).innerHTML = this.tn;
	};
}