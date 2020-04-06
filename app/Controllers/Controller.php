<?php
namespace App\Controllers;

abstract class Controller{
    const INT_VALUES_ONLY = 1;

    public $isProduction = false;
    public $permission = 1;
    public $root = '';
    public $pageTitle = '';

    function __construct(){
        $this->conn = \App\Includes\Setup::connectDBInfo();
        $this->mainLayout = '';
        $this->form = new \stdClass();
        $this->root = dirname(dirname(dirname(__FILE__)));

        $this->isProduction = env('ENV')=='production';

    }

    public function render($resp=200){

        if ($resp==404)
            header("HTTP/1.0 404 Not Found");

        include_once $this->mainLayout;
    }

    public function renderView(){
        include_once $this->view;
    }

    public function renderHeader(){

        $header = str_replace('.html.','.header.', $this->view);

        if (file_exists($this->root.'/'.$header)){
            include_once $header;
        }
    }

    public function renderFooter(){

        $footer = str_replace('.html.','.footer.', $this->view);

        if (file_exists($this->root.'/'.$footer)){
            include_once $footer;
        }
    }

    public function _404Action(){
        $this->view = "views/404.html.php";
        $this->render();
    }

    protected function getObjectRequest($fieldNames){
        $array = array();

        foreach ($fieldNames as $fieldName){
            $array[$fieldName] = !empty($_REQUEST[$fieldName])?trim($_REQUEST[$fieldName]):'';
        }

        return (object) $array;
    }

    protected function redirect($url){
        header("Location: $url");
        die();
    }

    protected function formatHtml($errors){
        $html = '';

        if (count($errors)){
            $html = '<ul>';

            foreach ($errors as $error){
                $html .= "<li>$error</li>";
            }

            $html .= '</ul>';
        }

        return $html;
    }

    /**
     * Get value from query string
     * @param $name
     * @param int $type
     * @return bool|mixed
     */
    protected function get($name, $type = 0){

        $value = isset($_REQUEST[$name])? $_REQUEST[$name]:'';

        $value = is_numeric($value)?$value:false;

        if ($type==self::INT_VALUES_ONLY){
            $value = filter_var($value, FILTER_SANITIZE_NUMBER_INT);

        }

        return $value;

    }

    /**
     * Get int value from query string
     * @param $name
     * @return bool|mixed
     */
    protected function getInt($name){
        return $this->get($name, self::INT_VALUES_ONLY);
    }

    protected function loadMessages(){

        if (!empty($_SESSION['success'])){
            $this->success = $_SESSION['success'];
            unset($_SESSION['success']);
        }

        if (!empty($_SESSION['errors'])){
            $this->errors = $_SESSION['errors'];
            unset($_SESSION['errors']);
        }
    }

}