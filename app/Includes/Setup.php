<?php
namespace App\Includes;

class Setup {
    public static function init() {
        self::connectDBInfo();
        self::startSession();
    }
    public static function jsonHeaders(){
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Content-Type: text/html; charset=utf-8');
    }

    public static function startSession(){
        session_name("omcms");
        session_set_cookie_params(0, '/');
        ini_set("session.gc_maxlifetime","14400");

        session_start();

    }

    public static function destroySession(){
        session_unset();
        unset($_SESSION["uid"]);
        unset($_SESSION["username"]);
        session_destroy();
    }

    public static function connectDBInfo(){

        $conn = new \mysqli(env('DB_HOST'), env('DB_USERNAME'), env('DB_PASSWORD'), env('DB_NAME'));

        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Could not open db connetion. " . $conn->connect_error);
        }

        return $conn;
    }

    public static function redirectIfNotLogged(){

        if (!($_SESSION && $_SESSION['uid'])){
            header("Location: /omcmsadmin");
            die();
        }

    }


    public static function redirectNoServiceIfExcludedCountry($code){

        $codes = explode(',', env('EXCLUDED_COUNTRY_CODES'));

        if (in_array($code, $codes)){
            header("Location: /noservice.php");
            die();
        }

    }

}