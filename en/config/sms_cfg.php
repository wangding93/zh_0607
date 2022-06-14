<?php
/**
 * 大汉三通短信云平台http接入实例：json格式
 *
 */
//Base URL
define ( 'URL', "http://www.dh3t.com/json/sms" );
//账号，必填
define ( 'ACCOUNT', "dh66541" );
//密码，必填
define ( 'PASSWORD', md5 ( "3cvSqFzT" ) );
//短信签名，必填
define ( 'SIGN', "[디지몬:리턴]" );
//短信子码,选填
define ( 'SUBCODE', "853101" );



//$sms_cfg = array(
//    'userid'    => 113,
//    'account'   => "Kexun_0188",
//    'password'  => "Kx12345",
//);
?>
