<?php
namespace App\Services;
use \App\Includes\Setup;
use \App\Includes\Utils;

abstract class Service{
    function __construct(){
        $this->conn = Setup::connectDBInfo();
    }

    /**
     * Get string of sql query formatted assignments from object. ie. SET id =0, add_time='2018-01-01', ...
     * @param $frm
     * @return string
     */
    protected function getFields($frm, $dateFields = array('add_date'))
    {

        $sql = '';

        $vars = get_object_vars($frm); //get all fields

        $prefix = '';


        foreach( $vars as $fieldName => $value )

            if (  (substr( $fieldName,0,1 ) !== '_') ) //if field name does not start with underscore
            {
                if ( gettype( $value ) == 'integer' || gettype( $value ) =='double')
                {
                    //numeric field
                    $fieldValue =  mysqli_real_escape_string( $this->conn, $value );
                }
                elseif ( in_array($fieldName, $dateFields) &&  !is_numeric($value) && Utils::is_date($value))
                {
                    //date field - formatted as yyyy-mm-dd hh:mm:ss
                    $fieldValue =  '"' . strftime("%Y-%m-%d %H:%M:%S",strtotime( mysqli_real_escape_string( $this->conn, $value ) ))  . '"';
                }
                else
                {
                    //any other field
                    $fieldValue =  '"' . mysqli_real_escape_string( $this->conn, $value ) . '"';
                }


                $sql.= $prefix . '`' .$fieldName . '` = ' . $fieldValue . "\n";

                $prefix = ',';
            }


        return $sql;
    }
}