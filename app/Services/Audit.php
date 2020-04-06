<?php
namespace App\Services;
use \App\Services\Service;

class Audit extends Service {

    const LOGIN_EVENT = 'login';
    const CREATE_ARTICLE = 'create_article';
    const UPDATE_ARTICLE = 'update_article';
    const MOVE_ARTICLE = 'move_article';
    const MOVE_ARTICLE_PREV = 'move_article_prev';
    const MOVE_ARTICLE_NEXT = 'move_article_next';
    const CHANGE_STATUS_ARTICLE = 'change_status_article';
    const CREATE_FLASH_NEWS = 'create_flash_news';
    const UPDATE_FLASH_NEWS = 'update_flash_news';
    const UPDATE_USER_PROFILE = 'update_user_profile';
    const UPDATE_PASSWORD = 'update_password';

    public function addEvent($uid, $event, $data = array()){

        $form = new \stdClass();

        $form->uid = $uid;
        $form->event = $event;
        $form->description = self::getDescription($event, $data);

        self::insert($form);
    }

    public function insert($form)
    {
        $id = false;

        if ($form) {

            unset($form->id);

            $query = 'INSERT INTO audit SET ' . $this->getFields($form, array('add_date')) ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);

            $id = mysqli_insert_id($this->conn);
        }

        return $id;
    }

    public function loadList(){
        $list = array();

        $query = "SELECT audit.*, (SELECT username FROM users WHERE uid = audit.uid) username FROM audit ORDER by add_date DESC LIMIT 100";

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

    //private
    private function getDescription($event, $data = array()){
        $str = '';

        if ($event == self::LOGIN_EVENT){
            $str = 'Login from IP_ADDRESS';
        }
        elseif($event == self::CREATE_ARTICLE){
            $str = 'Article id=ID was created';
        }
        elseif($event == self::UPDATE_ARTICLE){
            $str = 'Article id=ID was updated';
        }
        elseif($event == self::MOVE_ARTICLE){
            $str = 'Article id=ID was moved';
        }
        elseif($event == self::MOVE_ARTICLE_NEXT){
            $str = 'Article id=ID was moved to the next position';
        }
        elseif($event == self::MOVE_ARTICLE_PREV){
            $str = 'Article id=ID was moved to previous position';
        }
        elseif($event == self::CHANGE_STATUS_ARTICLE){
            $str = 'Article id=ID status changed to STATUS';
        }
        elseif($event == self::CREATE_FLASH_NEWS){
            $str = 'Flash news id=ID was created';
        }
        elseif($event == self::UPDATE_FLASH_NEWS){
            $str = 'Flash news id=ID was updated';
        }

        foreach ($data as $key => $value){

            $str = str_replace($key,$value,$str);
        }

        return $str;
    }
}