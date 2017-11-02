$(document).ready(function () {
	//FIREBASE=========================================================
	var config = {
		apiKey: "AIzaSyAKvAYT_VtRQ20veXTgYxufvaoH0jnctVc",
		authDomain: "train-schedule-d10bf.firebaseapp.com",
		databaseURL: "https://train-schedule-d10bf.firebaseio.com",
		projectId: "train-schedule-d10bf",
		storageBucket: "",
		messagingSenderId: "1093986322802"
	};
	firebase.initializeApp(config);
	//VARIABLES=========================================================
	var database = firebase.database();

	// CAPTURE BUTTON CLICK
	$("#submit").on("click", function () {

		//VALUES FOR EACH VARIABLE IN HTML
		var name = $('#nameInput').val().trim();
		var dest = $('#destInput').val().trim();
		var time = $('#timeInput').val().trim();
		var freq = $('#freqInput').val().trim();

		// PUSH NEW ENTRY TO FIREBASE
		database.ref().push({
			name: name,
			dest: dest,
			time: time,
			freq: freq,
			timeAdded: firebase.database.ServerValue.TIMESTAMP
		});
		// NO REFRESH
		$("input").val('');
		return false;
	});

	//ON CLICK CHILD FUNCTION
	database.ref().on("child_added", function (childSnapshot) {

		var name = childSnapshot.val().name;
		var dest = childSnapshot.val().dest;
		var time = childSnapshot.val().time;
		var freq = childSnapshot.val().freq;

		function decrementmin() {
			location.reload();
		};

		//CONVERT TRAIN TIME================================================
		var freq = parseInt(freq);
		//CURRENT TIME
		var currentTime = moment();
		var Enteredtime = moment(childSnapshot.val().time, 'HH:mm');
		var trainTime = moment(Enteredtime).format('HH:mm');

		//DIFFERENCE B/T THE TIMES 
		var trainTimediff = moment(trainTime, 'HH:mm');
		var tDifference = moment().diff(moment(trainTimediff), 'minutes');
		//REMAINDER 
		var tRemainder = tDifference % freq;
		//MINUTES UNTIL NEXT TRAIN
		var minsAway = freq - tRemainder;
		//NEXT TRAIN
		var nextTrain = moment().add(minsAway, 'minutes');

		//TABLE DATA=====================================================
		//APPEND TO DISPLAY IN TRAIN TABLE
		$('#currentTime').text(currentTime);
		$('#trainTable').append(
			"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
			"</td><td id='destDisplay'>" + childSnapshot.val().dest +
			"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
			"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm a") +
			"</td><td id='awayDisplay'>" + minsAway + ' minutes until arrival' + "</td></tr>");

		counter = clearInterval();
		counter = setInterval(decrement, 1000);
		counter = setInterval(decrementmin, 60000);

		function decrement() {
			var currentTime = moment();
			$('#currentTime').text(currentTime);
		};

	});

}); //END DOCUMENT.READY