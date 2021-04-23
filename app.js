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

$(document).ready(function() {
	context = gameCanvas.getContext("2d");
	Start();
});

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
	let monster_remain = 4;
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
	
	sound = document.getElementById('pacman.mpeg'); 
	sound.play();
	//document.getElementById("pacman.mpeg");
	//document.body.appendChild(this.sound);

	initGameBoard(board, food_remain, food, pacman_remain, monster_remain, cnt);
	
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
	interval = setInterval(UpdatePosition, 120);
}

function initGameBoard(board, food_remain, food, pacman_remain, monster_remain, cnt){
	for (var i = 0; i < 20; i++) {
		board[i] = new Array();
		
		for (var j = 0; j < 20; j++) {
			
			//put obstacles
			drawWalls(i,j,board);			

			if(board[i][j] != 5) {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) { //draw food
					while(food[Math.floor(randomNum*10)%3] <= 0){
						randomNum = Math.random();
					}							
					food_remain--;
					food[Math.floor(randomNum*10)%3]--;
					board[i][j] = Math.floor(randomNum*10)%3 + 1;

				} else if (randomNum < (1.0 * (pacman_remain + monster_remain + food_remain)) / cnt) {
					if(pacman_remain > 0){ // draw pacman
						shape.i = i;
						shape.j = j;
						pacman_remain--;
						board[i][j] = 4;
					}
					else if(monster_remain > 0){
						monsters[monster_remain-1].id = 5 + monster_remain;
						board[i][j] = monsters[monster_remain-1].id;
						monsters[monster_remain-1].i = i;
						monsters[monster_remain-1].j = j;
						monsters[monster_remain-1].remain = 0;
						monsters[monster_remain-1].direction = 1;
						monster_remain--;
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
	initTemporaryObject(candy, 12);
	while (food_remain > 0 || monster_remain > 0) {
		if(food_remain > 0){
			randomNum = Math.random();
			while(food[Math.floor(randomNum*10)%3] <= 0){
				randomNum = Math.random();
			}			
			food[Math.floor(randomNum*10)%3]--;
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = Math.floor(randomNum*10)%3 + 1;
			food_remain--;
		}
		else if(monster_remain > 0){			
			var emptyCell = findRandomEmptyCell(board);			
			monsters[monster_remain-1].id = 5 + monster_remain;
			board[emptyCell[0]][emptyCell[1]] =monsters[monster_remain-1].id;
			monsters[monster_remain-1].i = emptyCell[0];
			monsters[monster_remain-1].j = emptyCell[1];
			monsters[monster_remain-1].remain = 0;
			monsters[monster_remain-1].direction = 1;
			monster_remain--;
		}
	}
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
	// context.beginPath();
	// context.rect(0, 0, 600, 600); // because each cell on canvas is 30X30
	// context.fillStyle = "#C197FF"; //color
	// context.fill();

	let backgroundImg;
	backgroundImg = document.getElementById('b1.png');
	context.drawImage(backgroundImg, 0,0, 600, 600);

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

				img = document.getElementById('c1.png');

			} else if (board[i][j] == 2) { //food2

				img = document.getElementById('c3.png');

			} else if (board[i][j] == 3) { //food3

				img = document.getElementById('c2.png');

			} else if (board[i][j] == 5) { //wall
				context.beginPath();
				context.rect(center.x - 15, center.y - 15, 30, 30); // because each cell on canvas is 30X30
				context.fillStyle = "#845EC2"; //color
				context.fill();
				context.strokeStyle = "White";
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
	
	

	let rnd = Math.floor(Math.random()*10);	
	let counter = 4;

	//change direction if meet end of board, wall or other monster
	while( ((m.direction == 1 && (m.j == 0 || board[m.i][m.j - 1] == 5 || board[m.i][m.j - 1] >= 6))
	|| (m.direction == 2 && (m.j == 19 || board[m.i][m.j + 1] == 5 || board[m.i][m.j + 1] >= 6))
	|| (m.direction == 3 && (m.i == 0 || board[m.i-1][m.j] == 5 || board[m.i-1][m.j] >= 6))
	|| (m.direction == 4 && (m.i == 19 || board[m.i+1][m.j] == 5 || board[m.i+1][m.j] >= 6))) && counter != 0)
	{		
		counter -= 1;
		m.direction = (rnd % 4) + 1;
		rnd = Math.floor(Math.random()*10);
	}

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
		
	if (m.remain == 4) {
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
			sound.pause();
			score <=0 ? score = 0 : lives = 0;					
			window.alert("you lost! " + lives + " lives! " + score + " score!");
			clearKeysDown();
			window.clearInterval(interval);	

			setTimeout(slowDeath, 2000);
			setTimeout(restartGame, 5000);			

			
			
		}	
		else{
			alert("you're not carefull");
			clearKeysDown();
		}	
	}	
	board[m.i][m.j] = m.id;
	
}

function restartGame(){
	if(confirm("want to play again?")){
		Start();
	}
	else{
		//here should come a button go back or something/////////////////////////////////////////////////////////////////////////////////
	}
}


function UpdatePosition() {

	for(let i =0; i < 4; i++){
		updateMonsterPosition(monsters[i]);
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
				score += 40;
				candy.count--;
				candy.start_show = Infinity;
				break;					
		}		
	}
	board[shape.i][shape.j] = 4;
	let currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 50 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if ((currentTime - start_time)/1000 >= 60 && lives > 0) {
		window.clearInterval(interval);
		window.alert("Game over, your score is: " + score);
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

function drawWalls(i,j,walls){
	if (
		(j == 1 && i == 1) ||(j == 2 && i == 1) ||(j == 3 && i == 1) ||(j == 1 && i == 2) ||
		(j == 1 && i == 3) ||(j == 3 && i == 4) ||(j == 3 && i == 5) ||(j == 3 && i == 6) ||
		(j == 3 && i == 7) ||(j == 2 && i == 7) ||(j == 4 && i == 7) ||(j == 5 && i == 7) ||
		(j == 5 && i == 8) ||(j == 5 && i == 10) ||(j == 5 && i == 11) || (j == 4 && i == 11) ||
		(j == 3 && i == 11) ||(j == 2 && i == 11) ||(j == 3 && i == 12) ||(j == 3 && i == 13) ||
		(j == 3 && i == 14) ||(j == 1 && i == 16) ||(j == 1 && i == 17) ||(j == 1 && i == 18) ||
		(j == 2 && i == 18) ||(j == 3 && i == 18) ||

		//the vertical line
		(j == 7 && i == 1) || (j == 7 && i == 2) || (j == 7 && i == 3) || (j == 7 && i == 4) ||
		(j == 7 && i == 5) || (j == 7 && i == 6) || (j == 7 && i == 7) || (j == 7 && i == 8) ||
		(j == 7 && i == 10) || (j == 7 && i == 11) || (j == 7 && i == 12) || (j == 7 && i == 13) ||
		(j == 7 && i == 14) || (j == 7 && i == 15) || (j == 7 && i == 16) || (j == 7 && i == 17) ||

		(j == 9 && i == 3) || (j == 10 && i == 3) || (j == 9 && i == 6) || (j == 10 && i == 6) ||
		(j == 9 && i == 9) || (j == 10 && i == 9) || (j == 9 && i == 12) || (j == 10 && i == 12) ||
		(j == 9 && i == 15) || (j == 10 && i == 15) || (j == 9 && i == 18) || (j == 10 && i == 18) ||
		(j == 9 && i == 0) || (j == 10 && i == 0) ||

		//the 2nd vertical line
		(j == 12 && i == 1) || (j == 12 && i == 2) || (j == 12 && i == 3) || (j == 12 && i == 4) ||
		(j == 12 && i == 5) || (j == 12 && i == 6) || (j == 12 && i == 7) || (j == 12 && i == 8) ||
		(j == 12 && i == 10) || (j == 12 && i == 11) || (j == 12 && i == 12) || (j == 12 && i == 13) ||
		(j == 12 && i == 14) || (j == 12 && i == 15) || (j == 12 && i == 16) || (j == 12 && i == 17) ||


		(j == 16 && i == 1) ||(j == 17 && i == 1) ||(j == 18 && i == 1) ||(j == 18 && i == 2) ||
		(j == 18 && i == 3) ||(j == 16 && i == 4) ||(j == 16 && i == 5) ||(j == 16 && i == 6) ||
		(j == 16 && i == 7) ||(j == 17 && i == 7) ||(j == 15 && i == 7) ||(j == 14 && i == 7) ||
		(j == 14 && i == 8) ||(j == 14 && i == 10) ||(j == 14 && i == 11) || (j == 15 && i == 11) ||
		(j == 16 && i == 11) ||(j == 17 && i == 11) ||(j == 16 && i == 12) ||(j == 16 && i == 13) ||
		(j == 16 && i == 14) ||(j == 18 && i == 16) ||(j == 18 && i == 17) ||(j == 18 && i == 18) ||
		(j == 17 && i == 18) ||(j == 16 && i == 18) 

	) {
		
		board[i][j] = 5;
	}
}

function slowDeath(){
	let center = new Object();
	center.x = shape.i * 30 + 15;
	center.y = shape.j * 30 + 15;
	context.beginPath();
	context.rect(center.x - 15, center.y - 15, 30, 30); 
	context.fillStyle = "#C197FF"; 
	context.fill();
	img = document.getElementById('rip.png');
	board[shape.i][shape.j] = context.drawImage(img, 50 , 50, 524, 524);
}