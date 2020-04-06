<?php
namespace App\Services;
use \App\Services\Service;

class User extends Service {

    function __construct(){
        parent::__construct();
    }

    /**
     *
     * @param $username
     * @param $password
     * @return bool|user object
     * @throws \Exception
     */
    public function checkLogin($username, $password){
        $rtn = false;

        $query = 'SELECT * FROM users WHERE username = "'. mysqli_escape_string($this->conn,$username).  '" AND password=sha1("' . $password . '")' ;

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $obj = (object) $result->fetch_assoc();
            $rtn = $obj;
        }
        mysqli_free_result($result);


        return $rtn;
    }


    public function changePassword($uid, $password){

        $query = 'UPDATE users SET password=sha1("' . $password . '") WHERE uid = '.$uid ;

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);
    }


    public function listUsers(){

        //Get users
        $query = "SELECT uid, username FROM users where deleted = 0";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        $users = array();

        if ($rows){
            while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
                $obj = (object) $row;
                $users[] = $obj;
            }
        }

        mysqli_free_result($result);

        return $users;
    }

    public function getUser($id){

        $rtn = false;

        //Get users
        $query = "SELECT * FROM users where uid = " . $id;

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $obj = (object) $result->fetch_assoc();
            $rtn = $obj;
        }
        mysqli_free_result($result);

        return $rtn;
    }

    public function save(&$form){

        $errors = $this->validate($form);

        if (count($errors)) return $errors;

        $this->update($form->uid, $form);

        return $errors;
    }

    public function update($id, $form){

        if ($form) {

            unset($form->uid);

            $query = 'UPDATE users SET ' . $this->getFields($form) . ' WHERE uid = ' . $id ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);
        }
    }


    private function validate($form){

        $errors = array();

        if (!$form->first_name)
            $errors[] = 'First name cannot be empty';

        if (!$form->last_name)
            $errors[] = 'Last name cannot be empty';

        if (!$form->email)
            $errors[] = 'Email cannot be empty';

        if (!$form->profile_image)
            $errors[] = 'Image cannot be empty';

        return $errors;
    }

}