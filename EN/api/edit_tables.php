<?php

require "main.php";

$konekcija = connectToDB();

$lcodes = [];
$sql = "SELECT lcode FROM all_properties";
$rezultat = mysqli_query($konekcija, $sql);
while($red = mysqli_fetch_assoc($rezultat)){
  array_push($lcodes, $red["lcode"]);
}

for($i=0;$i<sizeof($lcodes);$i++){
  $lcode = $lcodes[$i];
  $sql = "ALTER TABLE `guests_$lcode` ADD `id_number` VARCHAR(63) NOT NULL DEFAULT '' AFTER `registration_data`, ADD `id_type` VARCHAR(63) NOT NULL DEFAULT '--' AFTER `id_number`;";
  mysqli_query($konekcija, $sql);
}

/*
SELECT * FROM information_schema.tables WHERE table_name LIKE '%1603244423'

*/

 ?>
