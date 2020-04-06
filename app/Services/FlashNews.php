<?php
namespace App\Services;
use \App\Services\Service;

class FlashNews extends Service {

    const FIELDS = array('title', 'content', 'deleted');


    public function loadList($filter = array()){
        $list = array();

        $where = $filter['where']?:'1=1';

        $query = "SELECT flash_news.*, (SELECT username FROM users WHERE uid = flash_news.uid) username FROM flash_news WHERE $where ORDER by add_date DESC LIMIT 100";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){

                $obj = (object) $row;
                $list[] = $obj;
            }

        }
        mysqli_free_result($result);

        return $list;
    }

    public function load($id){

        $rtn = false;

        $query = "SELECT * FROM flash_news WHERE id = $id";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $rtn = (object) $result->fetch_assoc();
        }
        mysqli_free_result($result);

        return $rtn;
    }

    public function save(&$form){

        $errors = $this->validate($form);

        if (count($errors)) return $errors;

        if (isset($form->id) && is_numeric($form->id) && $form->id>0){

            $this->update($form->id, $form);

        }else{

            $form->id = $this->insert($form);

        }

        return $errors;
    }

    public function insert($form)
    {
        $id = false;

        if ($form) {

            unset($form->id);

            $query = 'INSERT INTO flash_news SET ' . $this->getFields($form, array('add_date')) ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);

            $id = mysqli_insert_id($this->conn);
        }

        return $id;
    }

    public function update($id, $form){

        if ($form) {

            $query = 'UPDATE flash_news SET ' . $this->getFields($form) . ' WHERE id = ' . $id ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);
        }
    }

    //private methods

    private function validate($form){

        $errors = array();

        if (!$form->title)
            $errors[] = 'Title cannot be empty';

        if (!$form->content)
            $errors[] = 'Content cannot be empty';

        if (strlen($form->content) > 800)
            $errors[] = 'Content cannot be larger than 800 chars';

        if (strlen($form->title) > 70)
            $errors[] = 'Content cannot be larger than 70 chars';

        return $errors;
    }
}