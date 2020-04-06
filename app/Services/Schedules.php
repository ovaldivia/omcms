<?php
namespace App\Services;
use \App\Services\Service;

class Schedules extends Service {
    function __construct(){
        parent::__construct();
    }

    public function save(&$form){

        $errors = $this->validate($form);

        if (count($errors)) return $errors;

        $form->id = $this->insert($form);

        return $errors;
    }

    public function insert($form)
    {
        $id = false;

        if ($form) {

            unset($form->id);

            $query = 'INSERT INTO schedule_deployment SET ' . $this->getFields($form, array('add_date')) ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);

            $id = mysqli_insert_id($this->conn);
        }

        return $id;
    }

    public function deleteByArticleId($id)
    {
        $rtn = false;

        if ($id) {

            $query = 'DELETE FROM schedule_deployment WHERE article_id= ' . $id . ' AND deployed = 0' ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);

            $rtn = true;
        }

        return $rtn;
    }

    private function validate($form){

        $errors = array();

        if (!$form->article_id)
            $errors[] = 'Article ID cannot be empty';

        if (!$form->deployment_time)
            $errors[] = 'Deployment Time cannot be empty';

        if ($form->deployment_time < time())
            $errors[] = 'Deployment Time must be in a later time';


        return $errors;
    }

}