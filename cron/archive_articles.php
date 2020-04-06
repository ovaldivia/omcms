<?php
$root = dirname(dirname(__FILE__));
set_include_path($root);
require_once "includes/Setup.php";
$conn = \App\Includes\Setup::connectDBInfo();
$low = date('Y-m-d', strtotime('-60 days'));

//change to archive if deployed to production and 30 days old
$query = "UPDATE articles SET status = 4 WHERE `status` = 3 AND tags like '%NOVEDADES%' AND permanent=0 AND `date` < '$low'";

$result = mysqli_query($conn, $query);

if ($result===false) throw new \Exception("DB Query problem:" . $query);




