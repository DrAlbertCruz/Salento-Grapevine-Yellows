/*** Constants ***/
DOMAIN_PATH = 'http://sleipnir.cs.csubak.edu/~acruz/Salento-Grapevine-Yellows-Dataset/';
IMAGE_PATH = DOMAIN_PATH + 'raw/';

/*************** IMAGE JOB ***************/
// Constructor for an image job. Will randomly pick a population, then
// randomly select an image. The images are convieniently named 'image-'
var imageJob = function() {
    this.imagePath = IMAGE_PATH;     // Path to images
    // 1/3 a prior chance of pulling a GY yellows. Otherwise it will be
    // healthy control or other. Only use images that were actually 
    // collected by Salento because otherwise it is easy to cheat because
    // of the background.
    /*** Select a random image ***/
    this.validImage = false;
    while (!this.validImage) {
        this.label = Math.floor( Math.random() * 3 );
        switch (this.label) {
            case 0:
                this.imagePath = this.imagePath + "GY/"; break;
            case 1:
                this.imagePath = this.imagePath + "Other/"; break;
            case 2:
                this.imagePath = this.imagePath + "Healthy/"; break;
        }
        // There are 85 images in the directory with the smallest amount
        // of images
        this.imagePath = this.imagePath + 'image-' 
            + Math.ceil( Math.random() * 85 ) + '.jpg';
        // Make sure the image is valid
        this.validImage = imageExists(this.path);
    }

    document.getElementById("imagePane").setAttribute("src",
            this.imagePath);
    document.getElementById("imagePane").setAttribute("width","450px");
}

/*************** EXPERIMENT JOB ***************/
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
        return 'True positives: ' + this.tp + '\r\n'
            + 'False negatives: ' + this.fn + '\r\n'
            + 'False positives: ' + this.fp + '\r\n'
            + 'True negatives: ' + this.tn + '\r\n';
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

/**************** ELEMENTS ***************/
// Button to create a new experiment
var newExperimentButton = document.getElementById("newExperimentButton");
// Yes button for trial
var yesButton = document.getElementById("yesButton");
// No button for trial
var noButton = document.getElementById("noButton");
// Submit button for sending results via email
var submitButton = document.getElementById("submitEmail");
// Email address field when sending results via email
var emailField = document.getElementById("emailInput");
// Name field when sending results via email
var nameField = document.getElementById("nameInput");
// Create experiment, set new experiment
var currentExperiment = new experiment();
// Create new job, set new job
var currentJob = new imageJob();
// Get the modal
var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// Get modal text <p> element
var modalText = document.getElementById('modalText');

/**************** MODAL BUTTON ***************/
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// Function to display the modal with a custom alert message
function modalAlert( textMsg ) {
    // Block if the input is not a string
    if (typeof textMsg === 'string' || textMsg instanceof String) {
        modal.style.display = "block";
        modalText.innerHTML = textMsg;
    }
}

/**************** GAME LOGIC ***************/
// This callback should reset the experiment and display a new image.
newExperimentButton.onclick = function() {
    // Reset experiment
    currentExperiment.resetExperiment();
    // Reset table of results
    currentExperiment.display();
    // Sew a new image job
    setNewImage();
    // Alert them that they have reset all experimental results
    modalAlert( "All experimental results have been reset!" );
    return false;
}

// Callback for when the user clicks the yes button. A 'yes' response
// is used to indicate belief in GY.
yesButton.onclick = function() {
    currentExperiment.increment( currentJob.label, 0 ); 
    setNewImage();
    return false;
}

// Callback for when the user clicks the no button. A 'no' response is
// used to indicate disbelief in GY.
noButton.onclick = function() {
    currentExperiment.increment( currentJob.label, 1 );	
    setNewImage();
    return false;
};

// Callback for when the user clicks on the 'send' button to report 
// results via email
submitButton.onclick = function() {
    var resultsString = 'Hi,\r\n\r\nHere is a summary of your results:\r\nName: '
        + nameField.value + '\r\n'
        + currentExperiment.displayString() + '\r\n'
        + 'Thanks!';
    var data = {
        name: nameField.value,
        email: emailField.value,
        message: resultsString
    };
    $.ajax({
        type: "POST",
        url: "email.php",
        data: data,
        success: function() {
            emailOKAlert.style.display='initial';
        },
        error: function() {
            emailBadAlert.style.display='initial';
        }
    });
    return false;
};

setNewImage = function() {
    currentJob = new imageJob();	// Reset job
    currentExperiment.display();	// Refresh the display
};


/**************** WINDOW CALLBACKS ***************/
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.onload = function() {
}

function imageExists(image_url) {
    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, true);
    http.send();

    return http.status != 404;
}

function spamcheck($field) {
    $field=filter_var($field, FILTER_SANITIZE_EMAIL);

    if(filter_var($field, FILTER_VALIDATE_EMAIL)) {
        return true;
    }
    else {
        return false;
    }
}

function sendMail($toEmail, $fromEmail, $subject, $message) {
    $validFromEmail = spamcheck($fromEmail);
    if($validFromEmail) {
        mail($toEmail, $subject, $message, "From: $fromEmail");
    }
}

