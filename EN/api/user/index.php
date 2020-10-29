<?php

require '../main.php';

function fixRow($row)
{
  if(isset($row["services"]))
  {
    $row["services"] = json_decode($row["services"]);
  }
  if(isset($row["currencies"]))
  {
    $row["currencies"] = json_decode($row["currencies"]);
  }
  if(isset($row["discount"]))
  {
    $row["discount"] = json_decode($row["discount"]);
  }
  if(isset($row["access"]))
  {
    $row["access"] = json_decode($row["access"]);
  }
  if(isset($row["rules"]))
  {
    $row["rules"] = json_decode($row["rules"]);
  }
  if(isset($row["values"]) && is_string($row["values"]))
  {
    $row["values"] = json_decode($row["values"]);
  }
  if(isset($row["old_data"]))
  {
    $row["old_data"] = json_decode($row["old_data"]);
  }
  if(isset($row["new_data"]))
  {
    $row["new_data"] = json_decode($row["new_data"]);
  }
  if(isset($row["dayprices"]))
  {
    $row["dayprices"] = json_decode($row["dayprices"]);
  }
  if(isset($row["boards"]))
  {
    $row["boards"] = json_decode($row["boards"]);
  }
  if(isset($row["planned_earnings"]))
  {
    $row["planned_earnings"] = json_decode($row["planned_earnings"]);
  }
  return $row;
}
function old_fixReservation($row, $channel_logos, $room_names, $room_shortnames)
{
  if($row["status"] == 5)
    $row["status"] = 0;
  $row["services"] = json_decode($row["services"]);
  $row["discount"] = json_decode($row["discount"]);
  $row["dayprices"] = json_decode($row["dayprices"]);
  $row["boards"] = json_decode($row["boards"]);
  $row["additional_info"] = "";
  // Adding room names / shortnames
  $res_rooms = explode(",", $row["rooms"]);
  $row["room_names"] = [];
  $row["room_shortnames"] = [];
  $row["customer_notes"] = $row["note"];
  for($i=0;$i<sizeof($res_rooms);$i++){
    $row["room_names"][$i] = $room_names[$res_rooms[$i]];
    $row["room_shortnames"][$i] = $room_shortnames[$res_rooms[$i]];
  }
  // Adding channel logo
  if(isset($channel_logos[$row["id_woodoo"]]))
    $row["channel_logo"] = $channel_logos[$row["id_woodoo"]];
  else
    $row["channel_logo"] = "https://admin.otasync.me/img/ota/youbook.png";
  $row["amount"] = $row["reservation_price"];
  if($row["id_woodoo"] == "-1" || $row["id_woodoo"] == "-2")
    $row["id_woodoo"] = "";
  // Advance
  $row["payment_gateway_fee"] = json_decode($row["payment_gateway_fee"]);
  if($row["payment_gateway_fee"]->value == 0){
    $row["payment_gateway_fee"] = "";
  }
  else {
    if(!(isset($row["payment_gateway_fee"]->date))){
      $row["payment_gateway_fee"]->date = $row["date_received"];
    }
    if(!(isset($row["payment_gateway_fee"]->payment_type))){
      $row["payment_gateway_fee"]->payment_type = 1;
    }
  }

  return $row;
}


if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
    http_response_code(200);
    die();
}
else if ($_SERVER['REQUEST_METHOD'] != "POST"){
  fatal_error("Invalid method", 405);
}

$key = checkPost("key");
$lcode = checkPost("lcode");
$account = checkPost("account");
$konekcija = connectToDB();
$action = getAction();
$ret_val = [];
$ret_val["status"] = "ok";
$user = getSession($key, $account, $konekcija);

if($action == "contact"){
  $subject = checkPost("subject");
  $message = checkPost("text");
  $image = checkPost("image");
  $agency_id = $user["agency"];
  $sql = "SELECT email FROM all_agencies WHERE id = '$agency_id'";
  $rezultat = mysqli_query($konekcija, $sql);
  $red = mysqli_fetch_assoc($rezultat);
  $to_email = $rezultat["email"];
  $from_email = $user["email"];
  if($to_email != ""){
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "Reply-To: $from_email" . "\r\n" .
    $headers .= "From: noreply@otasync.me";
    $rez = mail($to_email, $subject, $message, $headers);
    if(!$rez)
      fatal_error("Email not sent", 500);
  }
}


// Return
echo json_encode($ret_val);
$konekcija->close();


?>
