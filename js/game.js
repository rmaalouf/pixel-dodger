//AUTHOR: Ralph Maalouf

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>.

var canvas = document.getElementById("canvas");
var cc = canvas.getContext("2d");
var w = $("#canvas").width();
var h = $("#canvas").height();
loaded = 0;
game_on = 0;
starting_score = 0;
activate_secret = 0;
current_background_color="white";
current_obstacle_interior_color="black";
current_obstacle_border_color="black";
current_ship_interior_color=current_obstacle_interior_color;
current_ship_border_color=current_obstacle_border_color;
document.addEventListener('keydown', intro_music_keyboard);
top_score_range=0;
get_scores();
console.log(top_score_range);

//setup once on page load
(function(){
	//disable arrow keys default behavior to prevent page scrolling
	disable_keys();

	//store DOM elements in variables
	audio = document.getElementById("audio");
	audio1 = document.getElementById("audio1");
	audio2 = document.getElementById("audio2");
	music_checkbox = document.getElementById("music");
	media_checkbox = document.getElementById("media");
	pause_checkbox = document.getElementById("pause");
	video = document.getElementById("vid");
	text = document.getElementById("text");
	table = document.getElementById("table");
	name_input = document.getElementById("name");
	top_score = document.getElementById("topscore");
	
	//user option changes
	music_checkbox.addEventListener("click", music_toggle);
	pause_checkbox.addEventListener("click", pause_toggle);
	
	//play introduction music
	disable_primary_music = 0;
	music_play(intro_track[0]);
	
	//intro screen
	cc.strokeStyle=current_obstacle_border_color;
	cc.strokeRect(0,0,800,500);
	cc.font="20px Georgia";
	cc.fillText("Welcome To Pixel Dodger",260,h/2-70);
	cc.fillText("A Game By Ralph Maalouf",260,h/2);
}())

//setup pregame screen
setTimeout(function(){
	cc.clearRect(0,0,800,500);
	cc.strokeStyle=current_obstacle_border_color;
	cc.strokeRect(0,0,800,500);
	cc.font="20px Georgia";

	cc.fillStyle="black";
	cc.fillText("TURN YOUR SOUND ON",270,h/2-100);
	cc.fillText("Read The Instructions Very Carefully",220,h/2-50);
	
	cc.fillStyle="red";
	cc.fillText("ENTER YOUR NAME AT THE TOP",230,h/2+50);
	cc.fillText("Click On The Screen To Start",250,h/2+100);
	
	canvas.onclick=function(){
		if (loaded == 0 && name_input.value != "") {
		music_play(track[0]);
		countdown(current_background_color, current_obstacle_border_color);
		initialize = setTimeout(init, 1500);
		loaded=1;
		}
		else if (loaded == 0 && name_input.value == "") {
			cc.clearRect(0,0,800,500);
			cc.strokeRect(0,0,800,500);
			cc.fillText("YOU MUST ENTER YOUR NAME AT THE TOP",200,h/2-80);
			cc.fillText("THEN Click On The Screen To Start",230,h/2-20);
		}
	}
},3000)

//pregame countdown
function countdown() {

	//clear the canvas
	cc.clearRect(0,0,800,500);
	
	//fill canvas background
	cc.fillStyle=current_obstacle_border_color;
	cc.fillRect(0,0,800,500);
	
	//draw border around canvas
	cc.strokeStyle=current_background_color;
	cc.strokeRect(0,0,800,500);
	
	//write text
	cc.font="20px Georgia";
	cc.fillStyle=current_background_color;
	cc.fillText("READY!",w/2-30,h/2);

setTimeout(function () {
	//clear the canvas
	cc.clearRect(0,0,800,500);
	
	//fill canvas background
	cc.fillStyle=current_obstacle_border_color;
	cc.fillRect(0,0,800,500);
	
	//draw border around canvas
	cc.strokeStyle=current_background_color;
	cc.strokeRect(0,0,800,500);
	
	//write text
	cc.fillStyle=current_background_color;
	cc.fillText("GO!",w/2-20,h/2);
	
	setTimeout(function() {document.addEventListener('keydown', pause_key)}, 1000); //initializing pause key
	
	}, 1000);
}

//initializing variables before the start of each game
function init(score_start) {
	document.removeEventListener("keydown",intro_music_keyboard);
	get_scores();
	current_background_color="white";
	current_obstacle_border_color="black";
	current_obstacle_interior_color="black";
	current_ship_interior_color=current_obstacle_interior_color;
	current_ship_border_color=current_obstacle_border_color;
	secret_code_500=0;
	secret_code_1000=0;
	secret_code_1500=0;
	secret_code_2000=0;
	game_on=1;
	score=starting_score;
	number_of_obstacles=0;
	nx=0;	//storing x-axis keyboard movement
	ny=0;	//storing y-axis keyboard movement
	cw=10; //cell width
	audio2.pause();
	music_toggle();
	canvas_refresh_rate=10;
	beginning_difficulty=2000 //this number sets the obstacle creation interval. The higher number the easier it is.
	current_difficulty=beginning_difficulty;
	move_obstacle_rate=10;
	score_increment_rate=60;
	collision_refresh_rate=60;
	pause_increment=0;
	obstacle = []; //creating empty array to store obstacles 
	create_ship(); //calling function to set the initial position of the ship
	
	start(beginning_difficulty, "") //this function starts the game
}

//calls all the functions that animate and enforce rules
function start(create_obstacle_rate, special_track){
	document.addEventListener('keydown', keyboard); //initializing keyboard
	
	if (special_track != "") {
		if (special_track != "continue") {
			audio.pause();
			disable_primary_music = 1;
			music_special(special_track);
		}
		else if (special_track == "continue") music_special(special_track);
		
	} //playing music track
	else {
	disable_primary_music = 0;
	music_toggle();
	}
	
	//pt = setInterval(function(){paint();}, canvas_refresh_rate); //repaint the canvas every 'canvas_refresh_rate' milliseconds
	game_on = 1
	paint()
	
		console.log("paint: " + canvas_refresh_rate);
	obst = setInterval (create_obstacle, create_obstacle_rate); //adds an element to the obstacle[] every 'create_obstacle_rate' milliseconds
		console.log ("create obstacle: " + create_obstacle_rate);
	mv = setInterval(move_obstacle, move_obstacle_rate); //reduces the x-value of each element in obstacle array every 'move_obstacle_rate' milliseconds
		console.log("move obstacle: " + move_obstacle_rate);
	col = setInterval(function(){collision_check(nx, 10)},collision_refresh_rate); //checks for collisions every 'collision_refresh_rate' milliseconds
		console.log("collision_check: " + collision_refresh_rate);
	sco = setInterval(function(){increment_score()},score_increment_rate);
		console.log("increment score: " + score_increment_rate);
}

//stopping all dynamic components and keyboard input
function stop(wait){
	game_on = 0
	document.removeEventListener("keydown",keyboard);
	document.removeEventListener("keydown", pause_key);
	if (wait === undefined) wait=0;
	if(typeof pt != "undefined") clearInterval(pt);
	if(typeof obst != "undefined") clearInterval(obst);
	if(typeof mv != "undefined") clearInterval(mv);
	if(typeof col != "undefined") clearInterval(col);
	if(typeof col != "undefined") clearInterval(sco);
	//if the game was not stopped due to a pause then wait 500ms so that the player can see how he lost, then clear the canvas.
	if (document.getElementById("pause").checked == false) {
		setTimeout(function(){cc.clearRect(0,0,800,500)},wait);
	}
}

function create_ship() {
	ship={
		x: 0, 
		y: h/2
	}	
}

function create_obstacle() {

	if (number_of_obstacles > 10) {obstacle.shift(); number_of_obstacles--;};
	
	obstacle[number_of_obstacles]={
			x: w-1*cw,
			y: (Math.random()-0.06)*500
	}
	number_of_obstacles++;
	
}

function move_obstacle(){

	for(var i = 0; i <= obstacle.length -1 ; i++) {
		obstacle[i].x-=move_obstacle_rate/60*cw;
	}
}

function increment_score() {
	score+=1;
	document.getElementById("score").innerHTML=score;	
	next_level()
}

function next_level() {
	if (score == 250) change_difficulty("", "", 1500, "white", "blue", "blue", "blue", "blue", "");
	if (score == 500 && media_checkbox.checked == true) change_difficulty("splash_audio","500pts!! Well Done...For A NOOB BWAHAHAHA!", 1250, "white", "brown", "brown", "blue", "blue", "media/audio/sounds/kefka_laugh.mp3")
	else if (score == 500 && media_checkbox.checked == false) change_difficulty("","", 1250, "white", "brown", "brown", "blue", "blue", "media/audio/sounds/kefka_laugh.mp3")
	if (score == 750) change_difficulty("","", 1200, "white", "green", "green", "red", "red", "");
	if (score == 1000 && media_checkbox.checked == true) change_difficulty("video","media/video/youfool.ogg", 1100, "gold", "black", "gold", "black", "black", "media/audio/mortalkombat.mp3");
	else if (score == 1000 && media_checkbox.checked == false) change_difficulty("","", 1100, "gold", "black", "gold", "black", "black", "");
	if (score == 1250) change_difficulty("","", 1020, "blue", "white", "white", "white", "white", "continue");
	if (score == 1500 && media_checkbox.checked == true) change_difficulty("","", 980, "black", "orange", "orange", "red", "red", "continue")
	else if (score == 1500 && media_checkbox.checked == false) change_difficulty("","", 980, "black", "orange", "orange", "red", "red", "continue");
	if (score == 2000 && media_checkbox.checked == true) change_difficulty("splash_audio","CONGRATS!! YOU BEAT THE GAME...NOT!!!!", 950, "black", "white", "black", "black", "white", "continue")
	else if (score == 2000 && media_checkbox.checked == false) change_difficulty("","", 950, "black", "white", "black", "black", "white", "continue");
	if (score == 2100) change_difficulty("", "", 940, "black", "silver", "black", "silver", "silver", "");
	if (score == 2200) change_difficulty("", "", 930, "black", "yellow", "black", "yellow", "yellow", "");
	if (score == 2300) change_difficulty("", "", 920, "black", "pink", "black", "pink", "pink", "");
	if (score == 2400) change_difficulty("", "", 910, "black", "orange", "black", "orange", "orange", "");
	if (score == 2500) change_difficulty("", "", 900, "black", "red", "black", "red", "red", "");
}

function change_difficulty(taunt_type, taunt_content, create_obstacle_rate, background_color, obstacle_border_color, obstacle_interior_color, ship_border_color, ship_interior_color, special_track) {
	
	stop();
	score++; //incrementing score to prevent a loop
	
	current_difficulty=create_obstacle_rate;
	current_background_color=background_color;
	current_obstacle_border_color=obstacle_border_color;
	current_obstacle_interior_color=obstacle_interior_color;
	current_ship_interior_color=ship_interior_color;
	current_ship_border_color=ship_border_color;
	
	if (taunt_type == "splash") {
		setTimeout(function(){splash(taunt_content)},10);
		setTimeout(function(){countdown()},1700);
		setTimeout(function(){paint()},2800);
		setTimeout(function(){start(create_obstacle_rate, "")},3500);
		setTimeout(function(){change_color()}, 3500);
	}
	
	else if (taunt_type == "splash_audio") {
		audio_clip(special_track);
		setTimeout(function(){splash(taunt_content)},10);
		setTimeout(function(){countdown()},1700);
		setTimeout(function(){paint()},2800);
		if (special_track == "continue") 
		setTimeout(function(){start(create_obstacle_rate, "continue")},3500);
		else setTimeout(function(){start(create_obstacle_rate, "")},3500);
		
		setTimeout(function(){change_color()}, 3500);
	}
	
	else if (taunt_type == "video") {
		if (special_track != "") disable_primary_music = 1;
		setTimeout(function(){video_play(taunt_content)},10);
			video.addEventListener('ended', function (event){
			setTimeout(function(){countdown()},100);
			setTimeout(function(){paint()},1200);
			setTimeout(function(){start(create_obstacle_rate, special_track)},1900);
			setTimeout(function(){change_color()}, 1900);
			video.removeEventListener(event.type, arguments.callee);
		})
	}
	
	else {
		start(create_obstacle_rate, "continue"); //lower number is harder
		change_color();
		document.addEventListener('keydown', pause_key); //initializing pause key
	}
}

var paint = function () {

	//clear the canvas
	cc.clearRect(0,0,800,500);
	
	//fill canvas background
	cc.fillStyle=current_background_color;
	cc.fillRect(0,0,800,500);
	
	//draw canvas border
	cc.strokeStyle=current_obstacle_border_color;
	cc.strokeRect(0,0,800,500);

	//fill ship
	cc.fillStyle=current_ship_interior_color;
	cc.fillRect(ship.x + nx*cw, ship.y + ny*cw, cw, cw);
	
	//stroke ship
	cc.strokeStyle=current_ship_border_color;
	cc.strokeRect(ship.x + nx*cw, ship.y + ny*cw, cw, cw);
	
	//fill obstacles
	cc.fillStyle=current_obstacle_interior_color;
	for(var z = 0; z<=obstacle.length -1 ; z++) {
		cc.fillRect(obstacle[z].x, 0, cw, obstacle[z].y);
		cc.fillRect(obstacle[z].x, obstacle[z].y+4*cw, cw, 500);
	}
	
	//stroke obstacles
	cc.lineWidth=3;
	cc.strokeStyle=current_obstacle_border_color;
	for(var z = 0; z<=obstacle.length -1 ; z++) {
		cc.strokeRect(obstacle[z].x, 0, cw, obstacle[z].y);
		cc.strokeRect(obstacle[z].x, obstacle[z].y+4*cw, cw, 500);
	}
	cc.lineWidth=1;

	if(game_on==1){
		window.requestAnimationFrame(paint);
	}
	
}
	
function change_color(){
	if(typeof pt != "undefined") clearInterval(pt);
//	pt = setInterval(function(){paint()}, canvas_refresh_rate);
	}


function collision_check(movement, tolerance) {
	for(var q=0; q < obstacle.length; q++) {
		if(Math.abs(ship.x + movement*cw - obstacle[q].x) < tolerance) {
		
			if(ship.y + ny*cw < obstacle[q].y - 5 || ship.y + ny*cw > obstacle[q].y+3.45*cw) {
				ship.x = obstacle[q].x - movement*cw - 10;
				paint();
				audio_clip("media/audio/sounds/explosion.mp3");
				game_over();
			}
		}
	}
}
	
function splash(message) {
	cc.fillStyle=current_obstacle_border_color;
	cc.fillRect(0,0,800,500);
	
	cc.strokeStyle=current_obstacle_border_color;
	cc.strokeRect(0,0,800,500);

	cc.font="20px Georgia";
	cc.fillStyle=current_background_color;
	cc.fillText(message,350-4*message.length,h/2);
}
	
function game_over() {

	unlock_code();
	submit_score();
	//if (score > top_score.innerHTML) submit_score();
	//if (name_input.value != "") submit_score();
	console.log("score: " + score, "top: " + top_score.innerHTML);

	game_on=0;
	current_obstacle_border_color="black";
	current_background_color="white";
	current_obstacle_interior_color="white";
	current_ship_interior_color=current_obstacle_interior_color;
	current_ship_border_color=current_obstacle_border_color;
	wait=500;
	
	stop(wait);
				
	setTimeout(function(){
		cc.strokeStyle=current_obstacle_interior_color;
		cc.strokeRect(0,0,800,500);
		cc.font="20px Georgia";
		cc.fillStyle="black"
		cc.fillText("GAME OVER",350,h/2);
		cc.fillText("SCORE: " + score, 350, h/2+70);
				
		ending();

	},wait);
		
	if (top_score.innerHTML < score) top_score.innerHTML=parseInt(score);
}

function unlock_code() {

short1 = document.getElementById("shortcut1")
short2 = document.getElementById("shortcut2")
short3 = document.getElementById("shortcut3")
short4 = document.getElementById("shortcut4")

if (score >= 1000 && short1.innerHTML == "") {code_message(); document.getElementById("shortcut1").innerHTML = "-500 points shortcut: at the start of the game quickly press \'1 a a b b\'" }
if (score >= 1500 && short2.innerHTML == "") {code_message(); document.getElementById("shortcut2").innerHTML = "-1000 points shortcut: at the start of the game quickly press \'2 a b b a\'"}
if (score >= 2000 && short3.innerHTML == "") {code_message(); document.getElementById("shortcut3").innerHTML = "-1500 points shortcut: at the start of the game quickly press \'3 b o o b\'"}
if (score >= 2500 && short4.innerHTML == "") {code_message(); document.getElementById("shortcut4").innerHTML = "-2000 points shortcut: at the start of the game quickly press \'4 b d d b\'"}

}

function code_message() {
		console.log(code_message);
		document.getElementById("secret_code").style.display = "inline-block";
		setTimeout(function() {document.getElementById("secret_code").style.display = "none"}, 7000);
}

function submit_score() {

	console.log ("Submitting score");

	submit=new XMLHttpRequest();
	
	submit.onreadystatechange=function() {
		if (submit.readyState==4 && submit.status==200) {
			//document.getElementById("table").innerHTML=submit.responseText;		
		}
	}
	
	submit.open("GET", "./php/submit_score.php?" + "name=" + name_input.value + "&" + "score=" + score);
	submit.send();
}

function get_scores() {

	retrieve=new XMLHttpRequest();
	retrieve.onreadystatechange=function() {
		if (retrieve.readyState==4 && retrieve.status==200) {
			document.getElementById("table").innerHTML=retrieve.responseText;
		}
	}
	
	retrieve.open("GET", "./php/top_scores.php?" + "range=" + top_score_range);
	retrieve.send();
	
	//min_score=new XMLHttpRequest();
	//min_score.onreadystatechange=function() {
		//if (min_score.readyState==4 && min_score.status==200) {
		//	min_score=min_score.responseText
	//	}
	//}
	//min_score.open("GET", "./php/min_score.php");
	//min_score.send();

	setTimeout(function() {if (typeof previous !== "undefined") previous = document.getElementById("previous").onclick=function(){if (top_score_range>0) top_score_range-=1; console.log(top_score_range); get_scores();}},500);
	setTimeout(function() {if (typeof next !== "undefined") document.getElementById("next").onclick=function(){if (top_score_range<=10) top_score_range+=1; console.log(top_score_range); get_scores();}},500);
	
}
	
function ending() {
	
	if (score > 500 && score < 750 && media.checkbox == true) {
		video_ending("media/video/jokerlaugh.ogg");
		
		} else if (score > 750 && score < 1000 && media.checkbox == true) {
		video_ending("media/video/yoursoul.ogg");
		
		} else if (score > 1000 && score < 1500 && media.checkbox == true) {
		video_ending("media/video/noo.ogg");
	
		} else if (score > 1500 && score < 2000 && media.checkbox == true) {
		video_ending("media/video/commandolied.ogg");
		
	} else {
		audio.pause();
		restart();
	}
}

function video_ending(filename) {
	video_play(filename);

	video.addEventListener('ended', function (event){
		restart()
		video.removeEventListener(event.type,arguments.callee);
	})
}

function restart() {
		music_special("");
		if(typeof initialize != "undefined") clearInterval(initialize);
		setTimeout(function(){countdown()},500);
		initialize = setTimeout(function(){init(starting_score)}, 2000);
}

//define keyboard keys
function keyboard(event) {
	var key = event.which;

	if(key == "38" && ny>-25) ny--; //up
	if(key == "40" && ny<24) ny++; //down

	if(key == "65" && nx>5) nx-=5; else if (key == "65" && nx <=5) nx=0; //jump left
	if(key == "37" && nx>5) nx-=5; else if (key == "37" && nx <=5) nx=0; //jump left

	if(key == "68" && nx<w/10-5) {nx+=5;collision_check(nx, 50)};
	if(key == "39" && nx<w/10-5) {nx+=5;collision_check(nx, 50)};

	if(key == "83" && ny<14) ny+=10; else if (key == "83" && ny>=14) ny=24; //jump down
	if(key == "87" && ny>-15) ny-=10; else if (key == "87" && ny<=-15) ny=-25; //jump up
	
	if(key == "69") { //'e' key to skip music track
		i++;
		if (i > track.length-1) i=0;
		music_play(track[i]);
		console.log("next track select:" + track[i])
	}
	
	if(key == "81") { //'q' key to go to previous music track
		i--;
		if (i < 0) i=track.length-1;
		music_play(track[i]);
		console.log("previous track select:" + track[i])
	}

	secret_codes(event);
}

function intro_music_keyboard(event) {

	var key=event.which
	
	if (document.activeElement.id != "name") {
	
		if(key == "69") { //'e' key to skip music track
			i++;
			if (i > intro_track.length-1) i=0;
			music_play(intro_track[i]);
			console.log("next track select:" + intro_track[i])
		}
	
		if(key == "81") { //'q' key to go to previous music track
			i--;
			if (i < 0) i=intro_track.length-1;
			music_play(intro_track[i]);
			console.log("previous track select:" + intro_track[i])
		}
	}
}

function secret_codes(event){
	var key = event.which;
	media_status = media_checkbox.checked

//secret code for 500 points
	if (key == "49") {
		activate_secret=1;
		secret_code_500=0;
	};
	
	if (key == "50") {
		activate_secret=2;
		secret_code_1000=0;
	};
	
	if (key == "51") {
		activate_secret=3;
		secret_code_1500=0;
	};
	
	if (key == "52") {
		activate_secret=4;
		secret_code_2000=0;
	};

if (activate_secret == 1 && key == "65" && (secret_code_500 == 0 || secret_code_500 == 1)) secret_code_500++;
else if (activate_secret == 1 && key == "66" && (secret_code_500 == 2 || secret_code_500 == 3)) secret_code_500++;
else if (activate_secret == 1) secret_code_500=0;
if (secret_code_500==4) {media_checkbox.checked = false; score=499; starting_score=499; setTimeout(function(){audio.pause()},40);audio_clip("media/audio/sounds/zeldasecret.mp3");setTimeout(function(){if (music_checkbox.checked == true) audio.play()}, 1300); activate_secret=0;secret_code_500=0};


if (activate_secret == 2 && key == "65" && secret_code_1000 == 0) secret_code_1000++;
else if (activate_secret == 2 && key == "66" && secret_code_1000 == 1) secret_code_1000++;
else if (activate_secret == 2 && key == "66" && secret_code_1000 == 2) secret_code_1000++;
else if (activate_secret == 2 && key == "65" && secret_code_1000 == 3) secret_code_1000++;
else if (activate_secret == 2) secret_code_1000=0;
if (secret_code_1000==4) {media_checkbox.checked = false; score=999; starting_score=999;setTimeout(function(){audio.pause()},40);audio_clip("media/audio/sounds/zeldasecret.mp3");setTimeout(function(){if (music_checkbox.checked == true) audio.play()}, 1300);activate_secret=0;secret_code_1000=0};

if (activate_secret == 3 && key == "66" && secret_code_1500 == 0) secret_code_1500++;
else if (activate_secret == 3 && key == "79" && secret_code_1500 == 1) secret_code_1500++;
else if (activate_secret == 3 && key == "79" && secret_code_1500 == 2) secret_code_1500++;
else if (activate_secret == 3 && key == "66" && secret_code_1500 == 3) secret_code_1500++;
else if (activate_secret == 3) secret_code_1500=0;
if (secret_code_1500==4) {media_checkbox.checked = false; score=1499; starting_score=1499; setTimeout(function(){audio.pause()},40);audio_clip("media/audio/sounds/zeldasecret.mp3");setTimeout(function(){if (music_checkbox.checked == true) audio.play()}, 1300); activate_secret=0;secret_code_1500=0};

if (activate_secret == 4 && key == "66" && secret_code_2000 == 0) secret_code_2000++;
else if (activate_secret == 4 && key == "68" && secret_code_2000 == 1) secret_code_2000++;
else if (activate_secret == 4 && key == "68" && secret_code_2000 == 2) secret_code_2000++;
else if (activate_secret == 4 && key == "66" && secret_code_2000 == 3) secret_code_2000++;
else if (activate_secret == 4) secret_code_2000=0;
if (secret_code_2000==4) {media_checkbox.checked = false; score=1999; starting_score=1999; setTimeout(function(){audio.pause()},40);audio_clip("media/audio/sounds/zeldasecret.mp3");setTimeout(function(){if (music_checkbox.checked == true) audio.play()}, 1300); activate_secret=0;secret_code_2000=0};

}
	
function pause_key(event) {
	var key = event.which;
	if(key == "32") {
		if (pause_increment > 3) return;
		if (pause_checkbox.checked == false) pause_checkbox.checked = true
		else if (pause_checkbox.checked == true) pause_checkbox.checked = false;
		pause_toggle();
	}
}

function disable_keys() {
	window.addEventListener("keydown", function(e) {
		// arrow keys
		if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
		}
	}, false);
}

//play video clip
function video_play(filename){
	
	video.src=filename;
	
	vid.style.display="inline";

	text.style.display="none";
	canvas.style.display="none";
	table.style.display="none";
	audio.pause();
	audio2.pause();
	
	video.play();
	
	video.addEventListener('ended', function (event){
		video.style.display="none";
		canvas.style.display="inline";
		text.style.display="block";
		table.style.display="block";
		if (document.getElementById("music").checked == true && disable_primary_music != 1) {
			setTimeout(function(){audio.play();}
		,2000);
		};
		video.removeEventListener(event.type, arguments.callee);
	})
}

//play main audio track
function music_play (filename){
	if (document.getElementById("music").checked == true && disable_primary_music == 0) {
		audio.src=filename;
		audio.play();
	}
}

//play short audio clip
function audio_clip (filename){
	if (document.getElementById("sounds").checked == true) {
		audio1.src=filename;
		audio1.play();
	}
}

//play ending audio track
function music_special (filename){
	if (document.getElementById("music").checked == true) {
		if (filename != "continue") {
		audio2.src=filename;
		audio2.play();
		}
		else audio2.play()
	}
}

//toggle music player
function music_toggle(){
	if (document.getElementById("music").checked == false) audio.pause();
	if (document.getElementById("music").checked == true) audio.play();
}



//toggle game pause
function pause_toggle(){
	
		console.log(pause_increment, document.getElementById("pause").checked, game_on);
	
	if (pause_increment > 3) return;
	
	//pausing

	if (document.getElementById("pause").checked == true && game_on==1) {
		if (music_checkbox.checked == true) {audio.pause(); audio2.pause()};
		stop();
		setTimeout(function(){document.addEventListener('keydown', pause_key)},3000);
		audio_clip("media/audio/sounds/logoff.wav");
	}
	
	//unpausing
	if (document.getElementById("pause").checked == false) {
		pause_increment++;
		if (music_checkbox.checked == true) {
			setTimeout(function(){audio.play();},800);
		}
		audio_clip("media/audio/sounds/logon.wav");
		setTimeout(function(){
			change_difficulty("splash","                    Unpausing",current_difficulty, current_background_color, current_obstacle_border_color, current_obstacle_interior_color, current_ship_interior_color, current_ship_border_color, "")
		},10);
	}
}
