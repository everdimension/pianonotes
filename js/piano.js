
var notes = [ 'c', 'd', 'e', 'f', 'g', 'a', 'b' ];
var accidentals = [ "", "", " sharp", " flat" ];

var note_element = $(".note_sheet .note").children("span");
var note_accidental = note_element.find("span");

function getNote() {
  note = "";
	var random_key = Math.round(Math.random()*6);
	var random_acc = Math.round(Math.random()*3);
	var random_oct = Math.round(Math.random()*1) + 4;
  
  var onlyNote = notes[random_key];
  var onlyOct = random_oct;
  var onlyAcc = accidentals[random_acc];
  
  if (onlyNote == notes[6] && onlyOct == 5) {
    onlyOct = onlyOct - 1;
  }
	
	var note = onlyNote + onlyOct + onlyAcc;
	
  	note_element.addClass('note-' + onlyNote + onlyOct);
  	note_accidental.addClass(onlyAcc);

	
	return note;
}

function removeNote(guessedNote) {
  note_element.removeClass('note-' + guessedNote[0] + guessedNote[1]);
  note_accidental.removeClass(guessedNote.slice(3));
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
	}
	else {
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

note = getNote();


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
  removeNote(note);
	note = getNote();
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
  removeNote(note);
	note = getNote();
});



// Cheats

$(".cheat1-btn").on("click", function() {
	$(".cheat1").fadeToggle('fast');
});

$(".cheat2-btn").on("click", function() {
	$(".cheat2").fadeToggle('fast');
});