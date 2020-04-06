<?php
$root = dirname(dirname(__FILE__));

require $root . '/vendor/autoload.php';
use \Dotenv\Dotenv;


$dotenv = new Dotenv($root . '/config');
$dotenv->load();


$conn = \App\Includes\Setup::connectDBInfo();
$now = time();

//$auditObject = new \App\Services\Audit();

$diff = 300; //5 min

$low = $now - $diff;
$top = $now + $diff;

$query = "SELECT * FROM schedule_deployment WHERE deployed = 0 AND deployment_time >= $low AND deployment_time<=$top";

$result = mysqli_query($conn, $query);

if ($result===false) throw new \Exception("DB Query problem:" . $query);

$rows = mysqli_num_rows($result);

$ids = array();

if ($rows){
    while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
        $ids[$row['article_id']] = $row['uid'];
    }
}

foreach ($ids as $id=>$uid){

    //deploy article
    $query = "UPDATE articles SET status = 3, reviewer_id = $uid  WHERE id = $id";
    $result = mysqli_query($conn, $query);

    $query = 'UPDATE schedule_deployment SET deployed = 1 WHERE article_id = ' . $id ;
    $result = mysqli_query($conn, $query);

//    $auditObject->addEvent($uid, \App\Services\Audit::CHANGE_STATUS_ARTICLE, array('STATUS'=>'deployed to production', 'ID'=>$id));
}



