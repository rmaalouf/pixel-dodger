<?php

//Create connection to database

parse_str ($_SERVER['QUERY_STRING']);

$con=mysqli_connect("localhost", "vorento_game", "pixeldodger514", "vorento_game");

$result = mysqli_query($con, "SELECT * FROM top_score ORDER BY score DESC");
//mysqli_data_seek ($result, 15*$range);

echo '</br>';
echo '<table class="score_table" style="width: 600px;border:1px solid black;">';
echo '<caption style="border:1px solid black;">TOP SCORES</caption>';
echo '<tr><th>Rank</th><th>Name</th><th>Score</th></tr>';

if (mysqli_num_rows($result) >= 15+15*$range) {
	mysqli_data_seek($result, 15*$range);
	$exists=1;
}

if ($range==0) { $exists=1; }

for ($i=1 + 15*$range; $i<=15 + 15*$range; $i++) {
	if($exists==1) {
	$row = mysqli_fetch_array($result);
	}
	echo '<tr><td id=rank' . $i . '>' . $i . '</td><td>' . $row['name'] . '</td><td>' . $row['score'] . '</td></tr>';
	}
echo '</table>';
echo '<span id="previous" class="change_range">previous</span> <span id="next" class="change_range">next</span>';

mysqli_close($con);

?>
