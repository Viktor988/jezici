<?php
    require '../../../main.php';

    if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
        http_response_code(200);
    }
    else if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $konekcija = connectToDB();
        $action = getAction();
        $lcode = checkPost("lcode");

        if($action == "header"){
            $obj = json_decode($_POST["mydata"]);
            $name = $obj->name;
            $description = $obj->description;
            $idlanguage=$obj->idlanguage;
            $id = 1;
           
            if($idlanguage==1 || $idlanguage=='-1'){
            $sql = "UPDATE engine_header
                    SET name='$name' WHERE lcode = '$lcode'";
            $header = mysqli_query($konekcija, $sql);
            $sql = "UPDATE engine_footer
                    SET description='$description' WHERE lcode = '$lcode'";
            $footer = mysqli_query($konekcija, $sql);
            var_dump($header);
          }
          else{
            $sql = "UPDATE engine_headerlanguage
                    SET nameEngine='$name' WHERE idlcode = '$lcode' and idlanguage='$idlanguage'";
            $header = mysqli_query($konekcija, $sql);
            $sql2 = "UPDATE engine_footerlanguage
            SET descriptionEngineFooter='$description' WHERE idlcode = '$lcode' and idlanguage='$idlanguage'";
                $header = mysqli_query($konekcija, $sql2);
            var_dump($header);
          }
          
      
      }


        if($action == "appearance"){

            $obj = json_decode($_POST["mydata"]);
            $color = $obj->color;
            $borderRadius = $obj->borderRadius;
            $id = 1;
            $sql = "UPDATE engine_styles
                    SET accentColor='$color',borderRadius='$borderRadius' WHERE lcode = '$lcode'";
            $appearance = mysqli_query($konekcija, $sql);

        }
        if($action == "location"){

            $obj = json_decode($_POST["mydata"]);
            $longitude = $obj->longitude;
            $latitude = $obj->latitude;

            $sql = "UPDATE engine_contact
                    SET longitude='$longitude',latitude='$latitude' WHERE lcode = '$lcode'";
            $location = mysqli_query($konekcija, $sql);

        }
        if($action == "contact"){

            $obj = json_decode($_POST["mydata"]);
            $adress = $obj->adress;
            $phone = $obj->phone;
            $web = $obj->web;
            $email = $obj->email;
            $yt = $obj->yt;
            $instagram = $obj->instagram;
            $fb = $obj->fb;
            $sql = "UPDATE engine_contact
                    SET address='$adress',phone='$phone',email='$email',web='$web',fb='$fb',instagram='$instagram',yt='$yt' WHERE lcode = '$lcode'";
            $location = mysqli_query($konekcija, $sql);

        }
        if($action == "confirmation"){

            $obj = json_decode($_POST["mydata"]);
            $adress = $obj->adress;
            $phone = $obj->phone;
            $occupancy = $obj->occupancy;
            $city = $obj->city;
            $country = $obj->country;
            $card = $obj->card;
            $cvv = $obj->cvv;
            $checkIn = $obj->checkIn;
            $sql = "UPDATE engine_confirmation
                    SET adress='$adress',phone='$phone',occupancy='$occupancy',city='$city',country='$country',card='$card',cvv='$cvv',checkIn='$checkIn' WHERE lcode = '$lcode'";
            $confirmation = mysqli_query($konekcija, $sql);

        }
        if($action == "footer"){

            $obj = json_decode($_POST["mydata"]);
            $description = $obj->description;
            $sql = "UPDATE engine_footer
                    SET description='$description' WHERE lcode = '$lcode'";
            $footer = mysqli_query($konekcija, $sql);

        }
        if($action == "selectdates"){

            $obj = json_decode($_POST["mydata"]);
            $children = $obj->children;
            $cents = $obj->cents;
            $sameDay = $obj->sameDay;
            $nights = $obj->nights;
            $sql = "UPDATE engine_selectdates
                    SET children='$children',cents='$cents',sameDayReservation='$sameDay',nights='$nights' WHERE lcode = '$lcode'";
            $selectDates = mysqli_query($konekcija, $sql);

        }
        if($action == "messages"){

            $obj = json_decode($_POST["mydata"]);
            $welcome = $obj->welcome;
            $voucher = $obj->voucher;
            $noAvail = $obj->noAvail;
            $idlanguage = $obj->idlanguage;
            $book = $obj->book;
            if($idlanguage=="1" || $idlanguage=="-1"){
            $sql = "UPDATE engine_messages
                    SET welcome='$welcome',voucher='$voucher',book='$book',noAvail='$noAvail' WHERE lcode = '$lcode'";
            $header = mysqli_query($konekcija, $sql);}
            else{
              $sql = "UPDATE engine_messagelanguage
              SET welcomeMessage='$welcome',voucherMessage='$voucher',bookMessage='$book',noAvailMessage='$noAvail' WHERE idlcode = '$lcode' and idlanguage='$idlanguage'";
              $header = mysqli_query($konekcija, $sql);
               }
              }
        if($action == "logo"){
          if(checkPostExists("clear")){
            $url = "";
          }
          else {
            $url = saveImage("logo", $lcode . "_" . time(), "/beta/images/");
          }
          $sql = "UPDATE engine_styles
                  SET logo='$url' WHERE lcode = '$lcode'";
          $appearance = mysqli_query($konekcija, $sql);
        }
        if($action == "background"){
          if(checkPostExists("clear")){
            $url = "";
          }
          else {
            $url = saveImage("background", $lcode . "_" . time(), "/beta/images/");
          }
          $sql = "UPDATE engine_styles
                  SET backgroundImg='$url' WHERE lcode = '$lcode'";
          $appearance = mysqli_query($konekcija, $sql);
        }
        $konekcija->close();

    }
    else {
        http_response_code(405);
    }
