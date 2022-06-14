<?php
$DB_Host = '10.0.0.176';
$DB_User = 'gamedb';
$DB_Pwd = 'gamepass@gs.jibei.com';
$DB_Database = 'ldy_xgame_fb';
$sms_cfg = array(
    'userid'    => '299',
    'account'   => "jbwlkj",
    'password'  => "520620",
);


$link = @mysqli_connect($DB_Host,$DB_User,$DB_Pwd);
if(!$link) {
    close_error(null,0);
}
mysqli_select_db($link,$DB_Database);
if(!mysqli_select_db($link,$DB_Database)){
    close_error($link,0);
}
mysqli_set_charset($link,'utf8');

function close_error($link,$code){
    if(!is_null($link)){
        $link->close();
    }
    $arr = array(
        'result' => $code
    );
    echo json_encode($arr);
    exit();
}

?>
