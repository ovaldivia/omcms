<?php
$root = dirname(dirname(__FILE__));
set_include_path($root);
require_once "includes/Setup.php";
$conn = \App\Includes\Setup::connectDBInfo();
$low = date('Y-m-d G:i:s', strtotime('-12 hours'));

//change to archive if deployed to production and 30 days old
$query = "UPDATE flash_news SET deleted = 1 WHERE `deleted` = 0 AND `add_date` < '$low'";

$result = mysqli_query($conn, $query);

if ($result===false) throw new \Exception("DB Query problem:" . $query);




