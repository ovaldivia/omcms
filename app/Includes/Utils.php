<?php
namespace App\Includes;
class Utils {

    public static function is_date( $str ) {
        try {
            $dt = new \DateTime( trim($str) );
        }
        catch( Exception $e ) {
            return false;
        }
        $month = $dt->format('m');
        $day = $dt->format('d');
        $year = $dt->format('Y');
        if( checkdate($month, $day, $year) ) {
            return true;
        }
        else {
            return false;
        }
    }

    public static function mergeBannerArticles($banners, $articles){

        $list = array_merge($banners, $articles);

        usort($list, function($a, $b)
        {
            return ($a->order > $b->order) ? -1 : 1;
        });

        return $list;

    }

    public static function getIPClientAddress(){
        return $_SERVER['HTTP_X_FORWARDED_FOR']?:$_SERVER['REMOTE_ADDR'];
    }

    public static function getClientCountry(){
        $ip = self::getIPClientAddress();

        return \geoip_country_code_by_name($ip);
    }

}