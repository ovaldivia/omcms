<?php
namespace App\Services;
use \App\Services\Service;

class Banner extends Service {

    function __construct(){
        parent::__construct();
    }

    public function loadList($filter = array()){

        $list = array();

        $where = $filter['where']?:'1';
        $order = $filter['order']?:'';
        $fields = $filter['fields']?:'*';
        $limit = $filter['limit']?:'';
        $offset = $filter['offset']?:'0';

        $pagination = '';

        if ($limit){

            $pagination = "LIMIT $limit OFFSET $offset";

        }

        $query = "SELECT $fields FROM banners WHERE $where $order $pagination";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
                $obj = (object) $row;
                $obj->banner = true;
                $list[] = $obj;
            }
        }
        mysqli_free_result($result);

        return $list;
    }

    public function load($id){

        $rtn = false;

        $query = "SELECT * FROM banners WHERE id = $id";

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

            $query = 'INSERT INTO banners SET ' . $this->getFields($form, array('add_date','date')) ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);

            $id = mysqli_insert_id($this->conn);
        }

        return $id;
    }

    public function update($id, $form){

        if ($form) {

            $query = 'UPDATE banners SET ' . $this->getFields($form) . ' WHERE id = ' . $id ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);
        }
    }

    public function previousOrderRecord($id){
        return $this->getOrderRecord($id,false);
    }

    public function nextOrderRecord($id){
        return $this->getOrderRecord($id, true);
    }

    private function getOrderRecord($excludeId=0, $max=true){
        $rtn = false;

        $order = $max? 'max(`order`)':'min(`order`)';

        $where = '';
        if ($excludeId && $max){
            //next
            $where = " select max(`order`) from banners where  `order` < (select `order` from banners  WHERE id = $excludeId) ";
        }elseif ($excludeId && !$max){
            //previous
            $where = " select min(`order`) from banners where  `order` > (select `order` from banners  WHERE id = $excludeId) ";
        }else
            $where = "select $order from banners";

        $query = "select id, `order` from banners where `order` = ($where) limit 1";
        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
            $rtn = (object) $row;
        }
        mysqli_free_result($result);

        return $rtn;
    }

    //private methods

    private function validate($form){

        $errors = array();

        if (!$form->name)
            $errors[] = 'Name cannot be empty';

        if (!$form->type)
            $errors[] = 'Type cannot be empty';

        if (!$form->content)
            $errors[] = 'Content cannot be empty';

        return $errors;
    }
}