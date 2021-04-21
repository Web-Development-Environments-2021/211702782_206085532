var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var defaultDir;

$(document).ready(function() {
	context = gameCanvas.getContext("2d");
	Start();
});

/*
	this funciton bulids the canvas of the game
	assign numbers to cells indicating:
	0 - empty cell
	1 - food
	2 - packman
	4 - wall
*/
function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 400;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	defaultDir = 4;
	for (var i = 0; i < 20; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 20; j++) {
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
				
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
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
	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 20; j++) {
			var center = new Object();
			center.x = i * 30 + 15;
			center.y = j * 30 + 15;
			if(direction){
				defaultDir = direction;
			}
			if (board[i][j] == 2) {				
				drawPacman(defaultDir, pac_color, center);
							
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // food
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 15, center.y - 15, 30, 30); // because each cell on canvas is 30X60
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	direction = GetKeyPressed();
	if (direction == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (direction == 2) {
		if (shape.j < 19 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (direction == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	} 
	if (direction == 4) {
		if (shape.i < 19 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw(direction);
	}
}

function drawPacman(dir, pac_color, center)
{
	switch(dir){
		case 1: //up
			context.beginPath();
			context.arc(center.x, center.y, 15, 1.65 * Math.PI, 1.35 * Math.PI); // packman's body
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
