var notes = [ 'c', 'd', 'e', 'f', 'g', 'a', 'b' ];
var accidentals = [ "", "", " sharp", " flat" ];

var note_element = $(".note_sheet.treble .note").children("span");
var note_accidental = note_element.find("span");
var note_element_bass = $(".note_sheet.bass .note").children("span");
var note_accidental_bass = note_element_bass.find("span");

function getNote() {
  var note = "";
  var bassup = false;
  var created = false;
	var random_key = Math.round(Math.random()*6);
	var random_acc = Math.round(Math.random()*3);
	if ($(".bass").is(":visible")) {
		var random_oct = Math.round(Math.random()*3) + 2;
	} else {
		var random_oct = Math.round(Math.random()*1) + 4;
	}
  
  var onlyNote = notes[random_key];
  var onlyOct = random_oct;
  var onlyAcc = accidentals[random_acc];
  
  if (onlyNote == notes[6] && onlyOct == 5) {
    onlyOct = onlyOct - 1;
  }

  if (notes.indexOf(onlyNote) < 3 && onlyOct == 2) {
    onlyOct = onlyOct + 1;
  } else if (notes.indexOf(onlyNote) == 3 && onlyOct == 2 && onlyAcc == " flat") {
  	onlyAcc = accidentals[Math.round(Math.random()*2)];
  }

	var note = onlyNote + onlyOct + onlyAcc;
	
  	if ($(".bass").is(":visible")) {
  		if (onlyOct < 4) {
  			if (onlyOct == 3 && notes.indexOf(onlyNote) > 3 && ! Math.round(Math.random()*2)) {
  				// displaying bass note in treble clef
  				note_element.addClass('note-' + onlyNote + onlyOct + "-treble");
		  		note_accidental.addClass(onlyAcc);
		  		created = true;
  			} else {
		  		note_element_bass.addClass('note-' + onlyNote + onlyOct);
		  		note_accidental_bass.addClass(onlyAcc);
		  		var bassup = true;
		  	}
	  	}
  		else if (onlyOct == 4 && notes.indexOf(onlyNote) < 6 && Math.round(Math.random()*2)) {
  			// displaying treble note in bass clef
  			note_element_bass.addClass('note-' + onlyNote + onlyOct + "-bass bassup");
  			note_accidental_bass.addClass(onlyAcc);
  			var bassup = true;
  		}
  	}
  	if (! bassup && ! created) {
  		note_element.addClass('note-' + onlyNote + onlyOct);
  		note_accidental.addClass(onlyAcc);
  	}
	
	return [note, bassup];
}

function removeNote(guessedNote, checkBass) {
	if (checkBass) {
		if (guessedNote[1] > 3) {
			// means it was treble note in bass clef
			note_element_bass.removeClass('note-' + guessedNote[0] + guessedNote[1] + "-bass");
			note_element_bass.removeClass("bassup");
  			note_accidental_bass.removeClass(guessedNote.slice(3));
		} else {
			note_element_bass.removeClass('note-' + guessedNote[0] + guessedNote[1]);
	  		note_accidental_bass.removeClass(guessedNote.slice(3));
		}
  	} else {
  		if (guessedNote[1] == 3) {
  			// means it was bass note in treble clef
  			note_element.removeClass('note-' + guessedNote[0] + guessedNote[1] + "-treble");
	  		note_accidental.removeClass(guessedNote.slice(3));
  		} else {
			note_element.removeClass('note-' + guessedNote[0] + guessedNote[1]);
	  		note_accidental.removeClass(guessedNote.slice(3));
	  	}
  	}
}

function ambigNote (taskNote) {
	var octave = taskNote[1];
	var accidental = taskNote.slice(2);
	var justKey = taskNote[0];

	// Mi Sharp and Pha	Flat
	if (justKey == notes[2] && accidental == " sharp") {
		return notes[3] + octave;
	}

	if (justKey == notes[3] && accidental == " flat") {
		return notes[2] + octave;
	}

	// B Sharp -> C at higher oct
	if (justKey == notes[6] && accidental == " sharp") {
		newOct = Number(octave) + 1;
		return notes[0] + newOct;
	}

	// Other Flats  
	if (accidental.indexOf("flat") >= 0) {
			var notePos = notes.indexOf(justKey);
			if (notePos != 0) {
				return notes[notePos - 1] + octave + " sharp";
			}
			if (notePos == 0) {
				// C Flat -> B at lower oct
				newOct = Number(octave) - 1;
				return notes[6] + newOct;
			}
	} else {
		return taskNote;
	}
}

function popAnswer (answer) {
	$(".answer").hide();
	$(".answer").slideDown('fast');
	if (answer == "correct") {
		$(".answer").removeClass("wrong");
		$(".answer").addClass("correct").find("p").text("Right!");
	}
	else {
		$(".answer").removeClass("correct");
		$(".answer").addClass("wrong").find("p").text("Nope!");    
	}
}


var noteInfo = getNote();
note = noteInfo[0];
bassup = noteInfo[1];


// Clicks

$('.anchor').on('click', function() {
	var noteNew = ambigNote (note);
	var noteClicked = $(this).data('note');
	if (noteClicked == noteNew) {
		popAnswer ("correct");
	}
	else {
		popAnswer ("wrong");
	}
	removeNote(note, bassup);
	var noteInfo = getNote();
	note = noteInfo[0];
	bassup = noteInfo[1];
});

$('#piano').find('span').on("click", function() {   
	
	var noteNew = ambigNote (note);
	
	var noteClicked = $(this).parent().prev().find(".anchor").data('note') + " sharp";
	// $(".task p").append(noteClicked);
	
	if (noteClicked == noteNew) {
		popAnswer ("correct");    
	}
	else {
		popAnswer("wrong");
	}
	removeNote(note, bassup);
	var noteInfo = getNote();
	note = noteInfo[0];
	bassup = noteInfo[1];
});



// Cheats

$(".cheat1-btn").on("click", function() {
	$(".cheat1").fadeToggle('fast');
});

$(".cheat2-btn").on("click", function() {
	$(".cheat2").fadeToggle('fast');
});

$(".cheat3-btn").on("click", function() {
	$(".answer").hide();
	if ($(".bass").is(":visible")) {
		$(".bass").hide();
	} else {
		$(".bass").fadeIn();
	}
	removeNote(note, bassup);
	$(".treble").toggleClass('pull-left');
	var noteInfo = getNote();
	note = noteInfo[0];
	bassup = noteInfo[1];
});