<?php
/**
 * Gets the gravatar for a give email. It uses Gravatar params. See
 * @param $email
 * @param int $s
 * @param string $d
 * @param string $r
 * @param bool $img
 * @param array $atts
 * @return string
 */
function get_gravatar( $email, $s = 80, $d = 'mp', $r = 'g', $img = false, $atts = array() ) {
    $url = 'https://www.gravatar.com/avatar/';
    $url .= md5( strtolower( trim( $email ) ) );
    $url .= "?s=$s&d=$d&r=$r";
    if ( $img ) {
        $url = '<img src="' . $url . '"';
        foreach ( $atts as $key => $val )
            $url .= ' ' . $key . '="' . $val . '"';
        $url .= ' />';
    }
    return $url;
}

/**
 * Wrapper around getenv
 */
function env($key){
    return getenv($key)??'';
}

function stringToColorCode($str) {
    $code = dechex(crc32($str));
    $code = substr($code, 0, 6);
    return $code;
}