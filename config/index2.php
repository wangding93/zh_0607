<?php
//status = 2; 完成预约 status = 1; 未登录
$arr = array(
    'result' => 0,
    'code' => '',
);

include_once './conn.php';
$action = $_REQUEST['action'];
$table_name = 'xgame_active_booking';
try
{
    if(isset($action) && $action == 'setcode'){
        $sql = "select * from tb_phone_pfft where status = 2";
        $query = mysqli_query($link,$sql);
        while($re = $query->fetch_assoc()){
            $cdkey = '';
            $msg = '【디지펫어드벤처】고객님이 예약해주신 게임이 드디어 오픈합니다.빠른(다운로드)게임들어가기.10만원 어치의 이벤트 받고 자기만의 디지몬을 진화하세요! 예약이벤트 CD KEY: '.$cdkey;
            $sms_re = sendMessage($re['phone'],$msg);
        }

        close_error($link,1);
    }elseif(isset($action) && $action == 'sendcode'){//立即登录
        $phone = $_REQUEST['phone'];
	    $area = $_REQUEST['area'];
        $area = substr($area,1,5);
//        $phone = $area.$phone;
        if(empty($phone)){
            close_error($link,-1);
        }
        $code = (int)$_REQUEST['code'];
        if(empty($code) || $code < 1){
            close_error($link,-1);
        }
        
        $sql = "select * from {$table_name} where phone = '{$phone}' and vcode = '{$code}' and status = 1";
        $query = mysqli_query($link,$sql);
        $re = $query->fetch_assoc();
        if(!isset($re['id']) || $re['id'] < 1){
            close_error($link,-2);
        }else{
            /**
             $sql = "select * from tb_code where status = 1";
             $query = mysqli_query($link,$sql);
             $re2 = $query->fetch_assoc();
            
             if(!isset($re2['id']) || $re2['id'] < 1){
                 close_error($link,-3);
             }
            
             $msg = '您注册帐号的验证码为:'.$re2['vcode'];
             $sms_re = sendMessage($phone,$msg);
             if(!$sms_re){
                 close_error($link,-4);
             }
            
             $sql = "update tb_code set status = 2 , phone = '{$phone}' , vsource = '{$re['vsource']}' where id = {$re2['id']}";
             $query = mysqli_query($link,$sql);
             * */
            
            $sql = "update {$table_name} set status = 2 where id = {$re['id']}";
            $query = mysqli_query($link,$sql);
            
            close_error($link,1);
        }
    }elseif(isset($action) && $action == 'setphone'){//点击发送验证码
        $phone = $_REQUEST['phone'];
	    $area = $_REQUEST['area'];
        // $area = substr($area,1,5);
        //判断
        if(in_array($area, ["852"]))
        {
            //处理 前面加上00 852 --> 00852
            $area = "00".$area;
        }
        // TODO
        // $sms_re = sendMessageNew ("0085267642412",8888);
        $phone = $area.$phone;
        if(empty($phone)){
            close_error($link,-1);
        }
        $source = (int)$_REQUEST['source'];

        $date = date('Y-m-d H:i:s');
        
        $sql = "select id,status,vcode from {$table_name} where phone = '{$phone}'";
        $query = mysqli_query($link,$sql);
        $re = $query->fetch_assoc();
        if(isset($re['id']) && $re['id'] > 0 && $re['status'] == 2){
            close_error($link,-2);
        }elseif(isset($re['id']) && $re['id'] > 0 && $re['status'] == 1){
            $sms_re = sendMessageNew ($phone,$re['vcode']);
            if(!$sms_re){
                close_error($link,-3);
            }
        }else{
            $code = mt_rand(100000, 999999);
            $sms_re = sendMessageNew ($phone,$code);
            if(!$sms_re){
                close_error($link,-3);
            }
            $sql = "insert into {$table_name} (phone,vcode,vsource,status,area,createtime) values ('{$phone}','{$code}',{$source},1,'{$area}','{$date}')";
            $query = mysqli_query($link,$sql);
        }
        close_error($link,1);
    }elseif(isset($action) && $action == 'iplookup'){
        //$ip = $_REQUEST['ip'];
        $ip = get_real_ip();
        $url =  "http://127.0.0.1:81/geoip/index.php?ip=".$ip;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
	    echo $output;
        //$output = json_decode($output,true);
	//var_dump($output);exit;
        return $output;
    }else{
        close_error($link,0);
    }
}
catch (Exception $e)
{
    close_error($link,0);
}

function get_real_ip()
{
    $ip=FALSE;
    //客户端IP 或 NONE
    if(!empty($_SERVER["HTTP_CLIENT_IP"])){
        $ip = $_SERVER["HTTP_CLIENT_IP"];
    }
    //多重代理服务器下的客户端真实IP地址（可能伪造）,如果没有使用代理，此字段为空
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode (", ", $_SERVER['HTTP_X_FORWARDED_FOR']);
        if ($ip) { array_unshift($ips, $ip); $ip = FALSE; }
        for ($i = 0; $i < count($ips); $i++) {
            if (!eregi ("^(10│172.16│192.168).", $ips[$i])) {
                $ip = $ips[$i];
                break;
            }
        }
    }
    //客户端IP 或 (最后一个)代理服务器 IP
    return ($ip ? $ip : $_SERVER['REMOTE_ADDR']);
}

function sendMessageNew($phone, $code) {
    include("../aliyundysms/api_demo/SmsDemo.php");
    $response = SmsDemo::sendSms($phone,$code);
    // var_dump($response);exit;
    $re_json = json_encode($response);
    $file_name = './log/'.date('Ymd',time()).".log";
    $re = file_put_contents($file_name,date('Y-m-d H:i:s').'>>>in>>>>>'.$phone.'>>>'.$code."\n",FILE_APPEND);
    $re = file_put_contents($file_name,date('Y-m-d H:i:s').'>>>out>>>>>'.$re_json."\n",FILE_APPEND);

    $sgins = false ;
    $ret = json_decode($re_json,true);
    if($ret['Message'] == 'OK'){
        $sgins = true;
    }
    return $sgins;
}


