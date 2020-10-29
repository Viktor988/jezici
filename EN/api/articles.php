<?php


require "main.php";

$konekcija = connectToDB();
$account = $_GET["account"];
$value = $_GET["value"];
if($value != 0 && $value != 1 && $value != 3){
  echo "Pogresna vrednost";
  die();
}
$sql = "UPDATE all_users SET articles = $value WHERE account = '$account' AND status = 1";
mysqli_query($konekcija, $sql);
echo "Uspesno postavljeni artikli na vrednost $value za nalog $account";

 ?>
