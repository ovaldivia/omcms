<?php
namespace App\Services;
use \App\Services\Service;
use \App\Services\User;

class Reports extends Service {

    public function reportUserArticles($period, $event='create_article'){

        $list = array();

        $sel = 'this week';
        if ($period=='last_week'){
            $sel = 'last week';
        }
        $days = array('monday', 'tuesday','wednesday','thursday','friday','saturday','sunday');

        $dates = array();
        foreach ($days as $day){
            $dates[$day] = date( 'Y-m-d', strtotime( $day.' '.$sel ) );
        }

        $cond = '';

        if ($event=='deploy_production'){
            $event = 'change_status_article';
            $cond = " AND description like '%deployed to production'";
        }


        //Get Data
        $user = new User();
        $users = $user->listUsers();

        foreach ($users as $user){

            $prefix = '';

            $uid = $user->uid;

            $sql = "SELECT \n";

            foreach ($dates as $day=>$date){

                $begin = $date . ' 05:00:00';

                $end = date("Y-m-d", strtotime($date) + 60*60*24) . ' 04:59:59';

                $sql .= $prefix . "(SELECT count(*) FROM audit where event='$event' $cond and uid = $uid and add_date between '$begin' and '$end') as $day \n";

                $prefix = ',';
            }

            $result = mysqli_query($this->conn, $sql);

            if ($result===false) throw new \Exception("DB Query problem:" . $sql);

            $rows = mysqli_num_rows($result);

            if ($rows){
                $obj = (object) $result->fetch_assoc();
                $list[$user->username] = $obj;
            }


        }
        mysqli_free_result($result);

        return $list;
    }

}