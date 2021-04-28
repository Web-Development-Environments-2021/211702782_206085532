let context;
let shape = new Object();
let board;
let score;
let domInteraction = 0;
let speedCounter = 0;
let defaultDir;
let monsters;
let lives;
let medicine;
let clock;
let candy;
let numOfMonsters;
// time
let start_time;
let time_elapsed;
let interval;
let gameTime;
// sound
let sound;
let soundPlaying = 0;
let soundFail;
// colors
let color5Points;
let color15Points;
let color25Points;
let pac_color;
// food
let foodOnBoard = 50; //updating number of food on the board
let foodAmount;
let food; //list of food kinds left
// controls
let keyUp;
let keysDown;
let keyLeft;
let keyRight;

$(document).ready(function() {
	context = gameCanvas.getContext("2d");
	
	// game start listener
	$("#gameStarter").change( (e) => {
		
		soundFail = document.getElementById('gameOverAudio'); 
		sound = document.getElementById('backgroundAudio'); 
		Start();
	})
});


// prevent scrolling with game controls
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

/**
 * This function is triggered when the user wants to enable/disable the music playing
 */
function playMusic(){
	playBTN = document.getElementById('playBTN'); 
	if(soundPlaying==0){
		// if(domInteraction == 0){
		// 	alert("enabling sound");
		// 	domInteraction = 1;
		// }		
		sound.play();
		soundPlaying = 1;
		playBTN.innerHTML = "Pause music &#9208;";
	}
	else if(soundPlaying==1){
		sound.pause();
		soundPlaying = 0;
		playBTN.innerHTML = "Play music &#9658;";
	}
	
}

/*
	this funciton bulids the canvas of the game
	assign numbers to cells indicating:
	0 - empty cell
	1 - food 5 points
	2 - food 15 points
	3 - food 25 points
	4 - packman
	5 - wall
	6 - monster 1
	7 - monster 2
	8 - monster 3
	9 - monster 4
	10 - medicine
	11 - clock
	12 - candy

*/
function Start() {

	$("#gameAlerts").find("span").text("");

	board = new Array();
	score = 0;
	lives = 5;
	pac_color = "yellow";
	let cnt = 400;
	let food_remain = foodAmount;
	let pacman_remain = 1;
	start_time = new Date();
	defaultDir = 4;
	let m1 = new Object();
	let m2 = new Object();
	let m3 = new Object();
	let m4 = new Object();
	medicine = new Object();
	clock = new Object();
	candy = new Object();
	monsters = [m1, m2, m3, m4];		
	let food1_remain = Math.floor(foodAmount*0.6);
	let food2_remain = Math.floor(foodAmount*0.3);
	let food3_remain = food_remain - (food1_remain + food2_remain);
	food = [food1_remain, food2_remain, food3_remain];
	
	if(soundPlaying == 0){
		sound.play();
		soundPlaying = 1;
	}	

	initGameBoard(food_remain, food, pacman_remain, cnt);
	
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			let key;
			if (specialKeyboardKeys.includes(e.code)){
				key = e.code;
			}
			else {
				key = e.key;
			}

			keysDown[key] = true;
		},
		false
	);
	addEventListener(           
		"keyup",
		function(e) {

			let key;
			if (specialKeyboardKeys.includes(e.code)){
				key = e.code;
			}
			else {
				key = e.key;
			}

			keysDown[key] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 100);
}

function initGameBoard(food_remain, food, pacman_remain, cnt){
	monsters_remain = numOfMonsters;
	board = initBoardWalls(board);	
	for (var i = 0; i < 20; i++) {
		
		for (var j = 0; j < 20; j++) {
			
			//put obstacles			
			if(i == 10 && j==10){
				candy.id = 12;
				candy.i = i;
				candy.j = j;
				candy.direction = 1;
				candy.remain = 0;
				board[i][j] = 12;
			}			
			//randomly choose monsters for the edges
			if(monsters_remain > 0){

				monsters_remain -= drawMonsters(i, j, board, monsters[monsters_remain-1]);
			}										
			if(board[i][j] != 5 && board[i][j] != 12 && (board[i][j] < 6 || board[i][j] > 9)) {				
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) { //draw food
					while(food[Math.floor(randomNum*10)%3] <= 0){ 
						randomNum = Math.random();
					}							
					food_remain--;
					food[Math.floor(randomNum*10)%3] -= 1;
					board[i][j] = Math.floor(randomNum*10)%3 + 1;

				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					if(pacman_remain > 0){ // draw pacman	
						shape.i = i;
						shape.j = j;
						pacman_remain--;
						board[i][j] = 4;
					}						
					
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	initTemporaryObject(medicine, 10);
	initTemporaryObject(clock, 11);	
	while (food_remain > 0) {
		
		randomNum = Math.random();
		while(food[Math.floor(randomNum*10)%3] <= 0){
			randomNum = Math.random();
		}			
		food[Math.floor(randomNum*10)%3] -= 1;
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = Math.floor(randomNum*10)%3 + 1;
		food_remain--;
	}
	if (pacman_remain > 0){
		randomNum = Math.random();
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 4;
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		pacman_remain--;
	}
}

function drawMonsters(i, j, board, m){
	if(i == 0 && j==0){
		m.id = 6;
		m.i = i;
		m.j = j;
		m.remain = 0;
		board[0][0] = m.id;
		m.direction = 4;
		return 1;
	} else if(i == 0 && j==19){		
		m.id = 7;
		m.i = i;
		m.j = j;
		m.remain = 0;
		board[0][19] = m.id;
		m.direction = 1;
		return 1;
	} else if(i == 19 && j==0){
		m.id = 8;
		m.i = i;
		m.j = j;
		m.remain = 0;
		board[19][0] = m.id;
		m.direction = 4;
		return 1;
	} else if(i == 19 && j==19){
		m.id = 9;
		m.i = i;
		m.j = j;
		m.remain = 0;
		board[19][19] = m.id;
		m.direction = 1;
		return 1;
	}
	return 0;
}

function initTemporaryObject(o, id){
	o.id = id;
	o.i = -1;
	o.j = -1;
	o.count = 0;
	o.start_show = Infinity;
}

function findRandomEmptyCell(board) {
	do  {
		i = Math.floor(Math.random() * 19 + 1);
		j = Math.floor(Math.random() * 19 + 1);
	}while (board[i][j] != 0);

	return [i, j];
}

/**
 * this function detects the key pressed
 * @returns appropriate enumeations for each command
 */
function GetKeyPressed() {
	if (keysDown[keyUp]) {
		return 1;
	}
	if (keysDown[keyDown]) {
		return 2;
	}
	if (keysDown[keyLeft]) {
		return 3;
	}
	if (keysDown[keyRight]) {
		return 4;
	}
}

function Draw(direction) {
	gameCanvas.width = gameCanvas.width; //clean board
	lblScore.value = score;
	lblTime.value = (gameTime - time_elapsed).toFixed(2);

	context.beginPath();
	context.rect(0, 0, 600, 600); 
	context.fillStyle = "#4B4453"; //color
	context.fill();

	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 20; j++) {
			var center = new Object();
			center.x = i * 30 + 15;
			center.y = j * 30 + 15;
			let img;
			if(direction){
				defaultDir = direction;
			}
			if (board[i][j] == 4) {				
				drawPacman(defaultDir, pac_color, center);
							
			} else if (board[i][j] == 1) { //food1

				context.beginPath();
				context.arc(center.x, center.y, 10, 0*Math.PI, 2*Math.PI); // because each cell on canvas is 30X30px
				context.fillStyle = color5Points; //color
				context.fill();

			} else if (board[i][j] == 2) { //food2

				context.beginPath();
				context.arc(center.x, center.y, 10, 0*Math.PI, 2*Math.PI); 
				context.fillStyle = color15Points; //color
				context.fill();

			} else if (board[i][j] == 3) { //food3

				context.beginPath();
				context.arc(center.x, center.y, 10, 0*Math.PI, 2*Math.PI); 
				context.fillStyle = color25Points; //color
				context.fill();

			} else if (board[i][j] == 5) { //wall
				context.beginPath();
				context.rect(center.x - 15, center.y - 15, 30, 30); 
				context.fillStyle = "#4B4453"; //color
				context.fill();
				context.strokeStyle = "#4FFBDF";
				context.stroke();
			}
			if (board[i][j] == 6)  //monster 1				
			{
				img = document.getElementById('p1.png');
			}
			else if (board[i][j] == 7)  //monster 2			
			{
				img = document.getElementById('p2.png');
			}
			else if (board[i][j] == 8)  //monster 3				
			{
				img = document.getElementById('p3.png');
			}
			else if (board[i][j] == 9) { //monster 4		
				img = document.getElementById('p4.png');
			}
			else if (board[i][j] == 10) { //medicine		
				img = document.getElementById('md.png');
			}
			else if (board[i][j] == 11) { //clock		
				img = document.getElementById('clock.png');
			}
			else if (board[i][j] == 12) { //candy		
				img = document.getElementById('candy.png');
			}
			if(img){

				context.drawImage(img, center.x - 15 , center.y - 15, 30, 30);
			}		
		}
	}
}
/*
 * this function updates the score after a catch of a pacman 
 * @param {*} mId - the id of the monster that caught the pacman 
 */
function updateScore(mId){
	if(mId==9){
		let lives_left = "pacman"+ lives.toString();
		let life = document.getElementById(lives_left);
		life.style.display = "none";
		lives -=1
		if(lives>0){
			lives_left = "pacman"+ lives.toString();
			life = document.getElementById(lives_left);
			life.style.display = "none";
			lives -=1
			score -= 20;
		}
	}
	else{
		let lives_left = "pacman"+ lives.toString();
		let life = document.getElementById(lives_left);
		life.style.display = "none";
		score -= 10;
		lives -=1;
	}			
	if (score<=0 || lives<= 0)
	{
		$("#gameAlerts").find("span").text("Loser!");

		if(soundPlaying == 1){
			sound.pause();
		}
		soundFail.play();
		soundPlaying = 0;	
		score <=0 ? score = 0 : lives = 0;					
		clearKeysDown();			
		setTimeout(slowDeath, 100);
		window.clearInterval(interval);		
	}	
	else{
		caught(board);
		while(foodOnBoard<foodAmount){
			emptyCell = findRandomEmptyCell(board);
			i = Math.floor(Math.random()*10)%3;
			board[emptyCell[0]][emptyCell[1]] = i+1;
			food[i] += 1; 
			foodOnBoard += 1;
		}
		clearKeysDown();
	}	

}

function updateMonsterPosition(m){	

	//update the board to the last value it continued before monster stepped on it
	m.remain != 4 ? board[m.i][m.j] = m.remain: board[m.i][m.j] = 0;
	
	chooseMonsterDirection(m);

	switch(m.direction){
		case 1: // up			
			if (m.j > 0 && board[m.i][m.j - 1] != 5 && board[m.i][m.j - 1] < 6) { // moveUp
				m.remain = board[m.i][m.j-1];
				m.j--;			
			}
			break;
		case 2: // down
			if (m.j < 19 && board[m.i][m.j + 1] != 5 && board[m.i][m.j + 1] < 6) {
				m.remain = board[m.i][m.j+1];
				m.j++;
			}
			break;
		case 3: // left
			if (m.i > 0 && board[m.i - 1][m.j] != 5 && board[m.i - 1][m.j] < 6) { // moveLeft
				m.remain = board[m.i-1][m.j];
				m.i--;
			}
			break;
		case 4: // right
			if (m.i < 19 && board[m.i + 1][m.j] != 5 && board[m.i + 1][m.j] < 6) {
				m.remain = board[m.i+1][m.j];	
				m.i++;
			}
			break;
	}
		
	if (m.remain == 4 && m.id != 12) {
		updateScore(m.id);
	}
	if(m.remain == 4 && m.id == 12){
		score += 50;
		candy.i = -1;
		candy.j = -1;
		pac_color = "#00C9A7";
		return;
	}	
	board[m.i][m.j] = m.id;
	
}
/*
	This funciton updates the position of monsters and the pacman
	after each catch by monster 
*/
function caught(board){
	
	$("#gameAlerts").find("span").text("you're not carefull");
	// alert("you're not carefull");
			shape.i = 0;
			shape.j = 0;
			let emptyCell = findRandomEmptyCell(board);
			shape.i = emptyCell[0];
			shape.j = emptyCell[1];
			for(let a=0; a < numOfMonsters; a++){
				switch(monsters[a].id){
					case 6:
						board[monsters[a].i][monsters[a].j] = 0;
						monsters[a].i = 0;
						monsters[a].j = 0;
						break;
					case 7:
						board[monsters[a].i][monsters[a].j] = 0;
						monsters[a].i = 0;
						monsters[a].j = 19;
						break;
					case 8:
						board[monsters[a].i][monsters[a].j] = 0;
						monsters[a].i = 19;
						monsters[a].j = 0;
						break;
					case 9:
						board[monsters[a].i][monsters[a].j] = 0;
						monsters[a].i = 19;
						monsters[a].j = 19;
						break;
				}
			}
}

function chooseMonsterDirection(m){
	let rnd = Math.floor(Math.random()*10);	

	//change direction if meet end of board, wall or other monster
	if(rnd<5){
		while( ((m.direction == 1 && (m.j == 0 || board[m.i][m.j - 1] == 5 || board[m.i][m.j - 1] >= 6))
		|| (m.direction == 2 && (m.j == 19 || board[m.i][m.j + 1] == 5 || board[m.i][m.j + 1] >= 6))
		|| (m.direction == 3 && (m.i == 0 || board[m.i-1][m.j] == 5 || board[m.i-1][m.j] >= 6))
		|| (m.direction == 4 && (m.i == 19 || board[m.i+1][m.j] == 5 || board[m.i+1][m.j] >= 6))))
		{		
			switch((rnd % 4) + 1){
				case 1:
					if(m.direction!=2){
						m.direction = 1;
					}
					break;
				case 2:
					if(m.direction!=1){
						m.direction = 2;
					}
					break;
				case 3:
					if(m.direction!=4){
						m.direction = 3;
					}
					break;
				case 4:
					if(m.direction!=3){
						m.direction = 4;
					}
					break;
			}
			rnd = Math.floor(Math.random()*10);
		}
	}

	else{
		if (rnd<5){
			if(m.i<shape.i && m.direction!=3){//direction = right
				m.direction = 4;
			}
			else if(m.i>shape.i && m.direction!=4){//direction = left
				m.direction = 3;
			}
		}
		else{
			if (m.j<shape.j && m.direction!=1){//direction = down
				m.direction = 2;
			}
			else if(m.j>shape.j && m.direction!=2){//direction up
				m.direction = 1;
			}
		}
	}
}

function restartGame(){
	window.clearInterval(interval);
	let life = document.getElementById("pacman1");
	life.style.display = "inline";
	life = document.getElementById("pacman2");
	life.style.display = "inline";
	life = document.getElementById("pacman3");
	life.style.display = "inline";
	life = document.getElementById("pacman4");
	life.style.display = "inline";
	life = document.getElementById("pacman5");
	life.style.display = "inline";
	Start();
}

function navigateToSettings(){
	if(soundPlaying == 1){
		soundPlaying = 0;
		sound.pause();
		soundFail.pause();
	}
	window.clearInterval(interval);
	$("#GameLayout").addClass("hidden");
	$("#Settings").removeClass("hidden");
}


function UpdatePosition() {
	speedCounter += 1

	if (speedCounter % 2 ==1){
		for(let i =0; i < numOfMonsters; i++){
			updateMonsterPosition(monsters[i]);
		}
		if(candy.i != -1){
			updateMonsterPosition(candy);
		}
	}	
	board[shape.i][shape.j] = 0;
	direction = GetKeyPressed();
	if (direction == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 5) {
			shape.j--;
		}
	}
	if (direction == 2) {
		if (shape.j < 19 && board[shape.i][shape.j + 1] != 5) {
			shape.j++;
		}
	}
	if (direction == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 5) {
			shape.i--;
		}
	} 
	if (direction == 4) {
		if (shape.i < 19 && board[shape.i + 1][shape.j] != 5) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] >= 1 && board[shape.i][shape.j] <= 3){
		foodOnBoard -= 1;
		food[board[shape.i][shape.j]-1] -= 1;
		score += (board[shape.i][shape.j] - 1) * 10 + 5; //resulting in 5, 15 or 25 for food1 food2 and food3 respectively 
	}
	if(board[shape.i][shape.j] >= 6 && board[shape.i][shape.j] <= 9){ //monsters
		updateScore(board[shape.i][shape.j]);
	}
	if(board[shape.i][shape.j] >= 10 && board[shape.i][shape.j] <= 12){ //special objects
		switch(board[shape.i][shape.j]){
			case 10:
				if(lives<5){
					lives += 1;
					let lives_left = "pacman"+ lives.toString();		
					let life = document.getElementById(lives_left);
					life.style.display = "inline";
				}								
				medicine.count--;
				medicine.start_show = Infinity;
				break;
			case 11:
				start_time = new Date();
				clock.count--;
				clock.start_show = Infinity;
				break;	
			case 12:
				score += 50;
				candy.i = -1;
				candy.j = -1;
				pac_color = "#00C9A7";
				break;	
		}		
	}
	board[shape.i][shape.j] = 4;
	let currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if ((currentTime - start_time)/1000 >= gameTime && lives > 0) {
		window.clearInterval(interval);
		if(score>100){
			$("#gameAlerts").find("span").text("Winner!!!");
			// window.alert("Winner!!!");
		}
		else{
			$("#gameAlerts").find("span").text("You are better than " + score + "points!");
			// window.alert("You are better than " + score + "points!");
		}
		clearKeysDown();
		sound.pause();	
		soundPlaying = 0;	
	} else {	
		updatePositionOfSpecialObjects(medicine, currentTime, 1);
		updatePositionOfSpecialObjects(clock, currentTime, 3);
		updatePositionOfSpecialObjects(candy, currentTime, 7);	
		Draw(direction);
	}
}

function clearKeysDown(){
	keysDown[keyUp] = false; 
	keysDown[keyDown] = false; 
	keysDown[keyLeft] = false; 
	keysDown[keyRight] = false; 
}

function updatePositionOfSpecialObjects(o, currentTime, delay){

	if(Math.floor((currentTime - start_time)/1000) % 10 == delay && o.count == 0){
		//add medicine remove medicine
		let emptyCell = findRandomEmptyCell(board); 
		o.i = emptyCell[0];
		o.j = emptyCell[1];
		board[o.i][o.j] = o.id;
		o.start_show = currentTime;
		o.count++;
	}
	else if((currentTime - o.start_show)/1000 >= 5){
		board[o.i][o.j] = 0;
		o.start_show = Infinity;
		if(o.count == 1){
			o.count--;
		}
	}

}

function drawPacman(dir, pac_color, center)
{
	switch(dir){
		case 1: //up
			context.beginPath();
			context.arc(center.x, center.y, 15, 1.65 * Math.PI, 1.35 * Math.PI); // pacman's body
			context.lineTo(center.x, center.y);
			context.fillStyle = pac_color; //color
			context.fill();
			context.beginPath();
			context.arc(center.x-7, center.y, 2, 0, 2 * Math.PI); // packman's eye
			context.fillStyle = "black"; //color
			context.fill();
			break;
		case 2: //down
			context.beginPath();
			context.arc(center.x, center.y, 15, 0.65 * Math.PI, 0.35 * Math.PI); // packman's body
			context.lineTo(center.x, center.y);
			context.fillStyle = pac_color; //color
			context.fill();
			context.beginPath();
			context.arc(center.x + 5, center.y - 5, 2, 0, 2 * Math.PI); // packman's eye
			context.fillStyle = "black"; //color
			context.fill();
			break;
		case 3:	//left
			context.beginPath();
			context.arc(center.x, center.y, 15, 1.15 * Math.PI, 0.85 * Math.PI); // packman's body
			context.lineTo(center.x, center.y);
			context.fillStyle = pac_color; //color
			context.fill();
			context.beginPath();
			context.arc(center.x + 2, center.y - 7, 2, 0, 2 * Math.PI); // packman's eye
			context.fillStyle = "black"; //color
			context.fill();
			break;
		case 4: // right
			context.beginPath();
			context.arc(center.x, center.y, 15, 0.15 * Math.PI, 1.85 * Math.PI); // packman's body
			context.lineTo(center.x, center.y);
			context.fillStyle = pac_color; //color
			context.fill();
			context.beginPath();
			context.arc(center.x + 2, center.y - 7, 2, 0, 2 * Math.PI); // packman's eye
			context.fillStyle = "black"; //color
			context.fill();
			break;					
	}
}

function initBoardWalls(){
	return [
		[0 ,0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 5, 5, 5, 0, 5, 0, 5, 0, 0, 0, 0, 5, 0, 5, 0, 5, 5, 5, 0],
		[0, 5, 0, 0, 0, 5, 0, 5, 0, 5, 5, 0, 5, 0, 5, 0, 0, 0, 5, 0],
		[0, 5, 0, 0, 0, 5, 0, 5, 0, 0, 0, 0, 5, 0, 5, 0, 0, 0, 5, 0],
		[0, 0, 0, 5, 0, 5, 0, 5, 0, 5, 5, 0, 5, 0, 5, 0, 5, 0, 0, 0],
		[0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0],
		[0, 0, 0, 5, 0, 0, 0, 5, 0, 5, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0],
		[0, 5, 5, 5, 5, 5, 0, 5, 0, 0, 5, 0, 5, 0, 5, 5, 5, 5, 5, 0],
		[0, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0],
		[0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 5, 5, 0],
		[0, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0],
		[0, 5, 5, 5, 5, 5, 0, 5, 0, 0, 5, 0, 5, 0, 5, 5, 5, 5, 5, 0],
		[0, 0, 0, 5, 0, 0, 0, 5, 0, 5, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0],
		[0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 5, 0, 5, 0, 0, 0, 5, 0, 0, 0],
		[0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 5, 0, 5, 0, 5, 0, 0, 0, 0, 0],
		[0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 5, 0, 0, 0, 5, 0],
		[0, 5, 0, 0, 0, 0, 0, 5, 0, 5, 5, 0, 5, 0, 5, 0, 0, 0, 5, 0],
		[0, 5, 5, 5, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 5, 0, 5, 5, 5, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0]		
	];
}

function slowDeath(){	
	let img = document.getElementById('rip.png');
	context.drawImage(img, 50 , 50, 524, 524);	
	setTimeout(function(){soundFail.pause()}, 3000);	
}