function createInputs() {
<<<<<<< HEAD
=======
	/* let instead of var -> lets are only available inside the block
	createInputs() in this case, while vars could be modified */
>>>>>>> f832849817badeb25a21152f901baac2bdc45d3f
	let count = document.getElementById('subjectCount').value;
	// Get position where pasting new code
	let area = document.getElementById('input-area');
	
	for (let i = 1; i <= count; i++) {
		area.innerHTML += `Subject ${i}: <input type="number" class="mark-input" placeholder="0-100"><br><br/>`;
	}
	// Hide Step 1, Show Step2
	document.getElementById('step1').classList.add('hidden');
	document.getElementById('step2').classList.remove('hidden');
}

function calculateGrade() {
	let allBoxes = document.getElementsByClassName('mark-input');
<<<<<<< HEAD
	let marks = [];
	let total = 0;
	let marksList = "";
=======
	let total = 0;

>>>>>>> f832849817badeb25a21152f901baac2bdc45d3f
	for (let i = 0; i < allBoxes.length; i++) {
		// Number() converts text into integer
		let val = Number(allBoxes[i].value)
		total = total + val;
<<<<<<< HEAD
		marks[i] = val;
		let individualGrade = "F";
		if (val >= 90) {
			individualGrade = "A";
		}
		else if (val >= 80) {
			individualGrade = "B";
		}
		else if (val >= 70) {
			individualGrade = "C";
		}
		else if (val >= 60) {
			individualGrade = "D";
		}
		marksList += `<br><br>Subject ${i+1}: ${individualGrade}`;
	}
	let avg = total / allBoxes.length;
	let finalGrade = "F";

	if (avg >= 90) {
		finalGrade = "A";
	}
	else if (avg >= 80) {
		finalGrade = "B";
	}
	else if (avg >= 70) {
		finalGrade = "C";
	}
	else if (avg >= 60) {
		finalGrade = "D";
	}
	// Show results
	document.getElementById('showMarks').innerHTML = marksList;
	document.getElementById('showTotal').innerText = total;
	document.getElementById('showAverage').innerText = avg.toFixed(1) + "%";
	document.getElementById('showFinal').innerText =finalGrade;
=======
	}

	let avg = total / allBoxes.length;
	let grade = "F";

	if (avg >= 90) {
		grade = "A";
	}
	else if (avg >= 80) {
		grade = "B";
	}
	else if (avg >= 70) {
		grade = "C";
	}
	else if (avg >= 60) {
		grade = "D";
	}
	// Show results
	document.getElementById('showTotal').innerText = total;
	document.getElementById('showAverage').innerText = avg.toFixed(1) + "%";
	document.getElementById('showFinal').innerText = grade;
>>>>>>> f832849817badeb25a21152f901baac2bdc45d3f

	document.getElementById('step2').classList.add('hidden');
	document.getElementById('step3').classList.remove('hidden');
}
