<?php
parse_str ($_SERVER['QUERY_STRING']);

$con=mysqli_connect("localhost", "vorento_game", "pixeldodger514", "vorento_game");

$result = mysqli_query($con, "SELECT * FROM top_score WHERE name=\"$name\" ORDER BY score DESC");
$top_score= mysqli_fetch_assoc($result);
$top = $top_score['score'];
$ip = $_SERVER['REMOTE_ADDR'];

$total_games_played = $top_score['total_games'] + 1;

if(mysqli_num_rows($result)>=1) {
		//Adding data to top score table
		if($score > $top) {
			mysqli_query($con, "UPDATE top_score SET score=$score WHERE name=\"$name\""); 
			mysqli_query($con, "UPDATE top_score SET ip_address=\"$ip\" WHERE name=\"$name\"");
		}

		if($score > 150) {
			mysqli_query($con, "INSERT INTO all_games (name, score, ip_address) VALUES (\"$name\", $score, \"$ip\")");
			mysqli_query($con, "UPDATE top_score SET total_games=$total_games_played WHERE name=\"$name\""); 
		}
}

else {

	mysqli_query($con, "INSERT INTO all_games (name, score, ip_address) VALUES (\"$name\", $score, \"$ip\")");
	mysqli_query($con, "INSERT INTO top_score (name, score) VALUES (\"$name\", $score)");

}
	



mysqli_close($con);

?>
