<?php

include_once './conn.php';

$data = array();
$sql = "select count(*) as cc, DATE_FORMAT(createtime,'%Y-%m-%d') as zday from xgame_active_booking where createtime > '2018-08-31' group by zday";
$query = mysqli_query($link,$sql);
while($re = $query->fetch_assoc()){
	$data[] = $re;
}

?>




<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Office Automation System- JIBEI</title>
    </head>
    <body>
<table border="1">
	<tr>
		<td>日期</td>
		<td>注册手机数量</td>
	</tr>
<?php
foreach($data as $v){
	echo <<<EOF
	<tr>
		<td>{$v['zday']}</td>
		<td>{$v['cc']}</td>
	</tr>
EOF;
}
?>
</table>
</body>
</html>
