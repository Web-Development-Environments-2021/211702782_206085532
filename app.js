let context;
let shape = new Object();
let board;
let score;
let pac_color;
let start_time;
let time_elapsed;
let interval;
let defaultDir;
let monsters;
let lives;
let medicine;
let clock;
let candy;
let sound;
let soundPlaying = 0;
let soundFail;
let domInteraction = 0;
let stepsMonster = 5;
let speedCounter = 0;
let colors = ["green", "blue", "black"]

$(document).ready(function() {
	context = gameCanvas.getContext("2d");
	soundFail = document.getElementById('fail.mpeg'); 
	sound = document.getElementById('pacman.mpeg'); 
	Start();
});

function playTheBTN(){
	playBTN = document.getElementById('playBTN'); 
	if(soundPlaying==0){
		if(domInteraction == 0){
			alert("enabling sound");
		}		
		sound.play();
		soundPlaying = 1;
		domInteraction = 1;
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
	board = new Array();
	score = 0;
	lives = 5;
	pac_color = "yellow";
	let cnt = 400;
	let food_remain = 50;
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
	let food1_remain = Math.floor(50*0.6);
	let food2_remain = Math.floor(50*0.3);
	let food3_remain = food_remain - (food1_remain + food2_remain);
	let food = [food1_remain, food2_remain, food3_remain];
	
	if(domInteraction && soundPlaying == 0){
		sound.play();
		soundPlaying = 1;
	}	

	initGameBoard(food_remain, food, pacman_remain, cnt);
	
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 100);
}

function initGameBoard(food_remain, food, pacman_remain, cnt){
	monsters_remain = 4;
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
			monsters_remain -= drawMonsters(i, j, board, monsters[4-monsters_remain]);
										

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
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw(direction) {
	gameCanvas.width = gameCanvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLives.value = lives;

	context.beginPath();
	context.rect(0, 0, 600, 600); // because each cell on canvas is 30X30
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
				context.arc(center.x, center.y, 10, 0*Math.PI, 2*Math.PI); // because each cell on canvas is 30X30
				context.fillStyle = "green"; //color
				context.fill();

			} else if (board[i][j] == 2) { //food2

				context.beginPath();
				context.arc(center.x, center.y, 10, 0*Math.PI, 2*Math.PI); // because each cell on canvas is 30X30
				context.fillStyle = "black"; //color
				context.fill();

			} else if (board[i][j] == 3) { //food3

				context.beginPath();
				context.arc(center.x, center.y, 10, 0*Math.PI, 2*Math.PI); // because each cell on canvas is 30X30
				context.fillStyle = "white"; //color
				context.fill();

			} else if (board[i][j] == 5) { //wall
				context.beginPath();
				context.rect(center.x - 15, center.y - 15, 30, 30); // because each cell on canvas is 30X30
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
		if(m.id==9){
			score -= 20;
			lives -= 2;
		}
		else{
			score -= 10;
			lives -=1;
		}			
		if (score<=0 || lives<= 0)
		{
			if(soundPlaying == 1){
				sound.pause();

			}
			soundFail.play();
			soundPlaying = 0;	
			score <=0 ? score = 0 : lives = 0;					
			//.alert("you lost! " + lives + " lives! " + score + " score!");
			clearKeysDown();
			window.clearInterval(interval);	

			setTimeout(slowDeath, 100);
			setTimeout(restartGame, 2000);						
			
		}	
		else{
			alert("you're not carefull");
			clearKeysDown();
		}	
	}
	if(m.remain == 4 && m.id == 12){
		score += 50;
		candy.i = -1;
		candy.j = -1;
		pac_color = "#00C9A7";
	}	
	board[m.i][m.j] = m.id;
	
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
	if(confirm("want to play again?")){
		soundFail.pause();
		Start();
	}
	else{
		soundFail.pause();
		//here should come a button go back or something/////////////////////////////////////////////////////////////////////////////////
	}
}


function UpdatePosition() {
	speedCounter += 1

	if (speedCounter % 2 ==1){
		for(let i =0; i < 4; i++){
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
		
		score += (board[shape.i][shape.j] - 1) * 10 + 5; //resulting in 5, 15 or 25 for food1 food2 and food3 respectively 
	}
	if(board[shape.i][shape.j] >= 10 && board[shape.i][shape.j] <= 12){ //special objects
		switch(board[shape.i][shape.j]){
			case 10:
				lives += 1;
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
	if ((currentTime - start_time)/1000 >= 60 && lives > 0) {
		window.clearInterval(interval);
		window.alert("Time is up! your score is: " + score);
		clearKeysDown();
	} else {	
		updatePositionOfSpecialObjects(medicine, currentTime, 1);
		updatePositionOfSpecialObjects(clock, currentTime, 3);
		updatePositionOfSpecialObjects(candy, currentTime, 7);	
		Draw(direction);
	}
}

function clearKeysDown(){
	keysDown[37] = false; 
	keysDown[38] = false; 
	keysDown[39] = false; 
	keysDown[40] = false; 
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
		o.count--;
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
	let center = new Object();
	center.x = shape.i * 30 + 15;
	center.y = shape.j * 30 + 15;
	img = document.getElementById('rip.png');
	board[shape.i][shape.j] = context.drawImage(img, 50 , 50, 524, 524);
}