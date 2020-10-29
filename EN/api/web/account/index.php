<?php



require '../../main.php';

function initUser($account, $userToken, $konekcija){
  // Fetch properties
  $properties = makeRequest("fetch_properties", array($userToken));
  // Insert all properties
  $all_properties = [];
  foreach ($properties as $key => $value){
    array_push($all_properties, $key);
    $name = mysqli_real_escape_string($konekcija, $value['name']);
    $address = mysqli_real_escape_string($konekcija, $value['address']);
    $zip = $value['zip'];
    $city = mysqli_real_escape_string($konekcija, $value['city']);
    $country = mysqli_real_escape_string($konekcija, $value['country']);
    $email = $value['email'];
    $phone = $value['phone'];
    $latitude = $value['latitude'];
    $longitude = $value['longitude'];
    $custom_calendar = [];
    $sql = "INSERT IGNORE INTO all_properties VALUES
    (
      '$key',
      '$account',
      '$name',
      '',
      '$address',
      '$zip',
      '$city',
      '$country',
      '$email',
      '$phone',
      '$latitude',
      '$longitude',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '[0,0,0,0,0,0,0,0,0,0,0,0]',
      '',
      'EUR',
      1,
      '',
      0,
      1,
      0,
      1,
      0,
      'DD/MM/YYYY',
      'EUR'
     )";
   $rezultat = mysqli_query($konekcija, $sql);
   if(!$rezultat)
     fatal_error("Failed to insert property $key - $name - $account.", 500); // Server failed
  }
  $all_properties = implode(",", $all_properties);
  // Insert user
  $sql = "INSERT INTO all_users (username, pwd, account, status, properties, reservations, guests, invoices, prices, restrictions, avail, rooms, channels, statistics, changelog, articles, wspay, engine, name, email, phone, client_name, company_name, address, city, country, pib, mb, wspay_key, wspay_shop, undo_timer, notify_overbooking, notify_new_reservations, invoice_header, invoice_margin, invoice_issued, invoice_delivery, room_count, ctypes, booking, booking_percentage, expedia, airbnb, private, agency, split)
  VALUES
  (
    '$account',
    '',
    '$account',
    1,
    '$all_properties',
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    0,
    0,
    3,
    'Master',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    60,
    0,
    0,
    0,
    10,
    'today',
    'today',
    0,
    '',
    0,
    15,
    0,
    0,
    1,
    0,
    0
  )";
  $rezultat = mysqli_query($konekcija, $sql);
  if(!$rezultat)
    fatal_error("Failed to insert user.", 500); // Server failed
  makeReleaseRequest("release_token", array($userToken));

  return explode(",", $all_properties);
}

function initProperty($account, $lcode, $konekcija){


  $sql = "CREATE TABLE rooms_$lcode
  (
    id VARCHAR(63) NOT NULL,
    name VARCHAR(255),
    shortname VARCHAR(255),
    type VARCHAR(255),
    price FLOAT,
    availability INT,
    occupancy INT,
    description TEXT,
    images TEXT,
    area FLOAT,
    bathrooms FLOAT,
    houserooms TEXT,
    amenities TEXT,
    booking_engine INT,
    room_numbers TEXT,
    linked_room TEXT,
    parent_room VARCHAR(63),
    additional_prices TEXT,
    status VARCHAR(255),
    created_by VARCHAR(255),
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE channels_$lcode
  (
    id VARCHAR(63) NOT NULL,
    ctype INT,
    name VARCHAR(255),
    tag VARCHAR(255),
    logo VARCHAR(255),
    commission FLOAT,
    hotel_id VARCHAR(255),
    created_by VARCHAR(255),
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE prices_$lcode
  (
    id VARCHAR(63) NOT NULL,
    name VARCHAR(255),
    type VARCHAR(255),
    variation VARCHAR(63),
    variation_type VARCHAR(63),
    vpid VARCHAR(63),
    description TEXT,
    policy INT,
    booking_engine INT,
    board VARCHAR(63),
    restriction_plan VARCHAR(63),
    created_by VARCHAR(255),
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);
  $sql = "INSERT INTO prices_$lcode VALUES (
    '0',
    'Default price',
    'daily',
    '0',
    '1',
    '',
    '',
    '1',
    '1',
    'nb',
    '1',
    'Wubook')";
    mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE restrictions_$lcode
  (
    id VARCHAR(63) NOT NULL,
    name VARCHAR(255),
    type VARCHAR(255),
    rules TEXT,
    created_by VARCHAR(255),
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE changelog_$lcode
  (
    id INT NOT NULL AUTO_INCREMENT,
    data_type VARCHAR(63),
    action VARCHAR(63),
    old_data TEXT,
    new_data TEXT,
    undone INT,
    created_by VARCHAR(255),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE reservations_$lcode
  (
      reservation_code VARCHAR(63) NOT NULL,
      status INT,
      was_modified INT,
      modified_reservation VARCHAR(63),
      new_reservation_code VARCHAR(63),
      date_received DATE,
      time_received TIME,
      date_arrival DATE,
      date_departure DATE,
      nights INT,
      rooms TEXT,
      room_data TEXT,
      real_rooms TEXT,
      room_numbers TEXT,
      men INT,
      children INT,
      guest_ids TEXT,
      customer_name VARCHAR(255),
      customer_surname VARCHAR(255),
      customer_mail VARCHAR(255),
      customer_phone VARCHAR(255),
      customer_country VARCHAR(255),
      customer_address VARCHAR(255),
      customer_zip VARCHAR(255),
      note TEXT,
      payment_gateway_fee TEXT,
      reservation_price FLOAT,
      services TEXT,
      services_price FLOAT,
      total_price FLOAT,
      pricing_plan VARCHAR(63),
      discount TEXT,
      invoices TEXT,
      cc_info INT,
      guest_status VARCHAR(63),
      date_canceled DATE,
      deleted_advance INT,
      addons_list VARCHAR(255),
      id_woodoo VARCHAR(255),
      channel_reservation_code VARCHAR(255),
      additional_data TEXT,
      created_by VARCHAR(255),
      PRIMARY KEY (reservation_code)
    )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE guests_$lcode
  (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255),
      surname VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(255),
      country_of_residence VARCHAR(7),
      place_of_residence VARCHAR(255),
      address TEXT,
      zip VARCHAR(255),
      country_of_birth VARCHAR(7),
      date_of_birth DATE,
      gender VARCHAR(15),
      host_again INT,
      note TEXT,
      total_arrivals INT,
      total_nights INT,
      total_paid INT,
      registration_data TEXT,
      created_by VARCHAR(255),
      PRIMARY KEY (id)
    )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE invoices_$lcode
  (
      id INT NOT NULL AUTO_INCREMENT,
      invoice_number INT,
      invoice_year INT,
      created_date DATE,
      created_time TIME,
      user VARCHAR(255),
      type VARCHAR(255),
      mark VARCHAR(255),
      room_id VARCHAR(63) NOT NULL DEFAULT '',
      status VARCHAR(255),
      issued DATE,
      delivery DATE,
      payment_type INT,
      name VARCHAR(255),
      pib VARCHAR(255),
      mb VARCHAR(255),
      address VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(255),
      reservation_name VARCHAR(255),
      services TEXT,
      price FLOAT,
      note TEXT,
      reservation_code VARCHAR(63),
      created_by VARCHAR(255),
      PRIMARY KEY (id)
    )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE extras_$lcode
  (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255),
      description TEXT,
      type VARCHAR(63),
      price FLOAT,
      pricing INT,
      daily INT,
      dfrom DATE,
      dto DATE,
      restriction_plan VARCHAR(63),
      rooms TEXT,
      specific_rooms TEXT,
      image TEXT,
      tax FLOAT,
      created_by VARCHAR(255),
      PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE policies_$lcode
  (
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(100),
    type varchar(100),
    value int(11),
    freeDays int(11),
    enableFreeDays tinyint(1),
    description text,
    created_by VARCHAR(255),
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);
  // Insert initial policy
  $sql = "INSERT INTO policies_$lcode (name, type, value, enableFreeDays, freeDays, description, created_by) VALUES
  (
    'Osnovna politika',
    'firstNight',
    '0',
    '0',
    '0',
    'U slučaju otkazivanja, zadržava se pravo naplate prve noći rezervacije',
    '1'
  )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE promocodes_$lcode
  (
    id INT NOT NULL AUTO_INCREMENT,
    code varchar(30),
    name varchar(30),
    target varchar(30),
    value varchar(30),
    description varchar(150),
    type varchar(20),
    created_by VARCHAR(255),
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  // Emails
  $sql = "SELECT email FROM all_users WHERE account = '$account' AND status = 1";
  $rezultat = mysqli_query($konekcija, $sql);
  $email = mysqli_fetch_assoc($rezultat);
  $email = $email["email"];

  $sql = "INSERT INTO all_client_emails VALUES (
    '$lcode',
    '$account',
    0,
    '$email',
    0,
    0,
    0,
    0,
    0
  )";
  mysqli_query($konekcija, $sql);

  $sql = "INSERT INTO all_guest_emails VALUES (
    '$lcode',
    '$account',
    0,
    '',
    '',
    0,
    '',
    '',
    0,
    '',
    '',
    1
  )";
  mysqli_query($konekcija, $sql);


  // Inserting wubook data
  $userToken = makeRequest("acquire_token", array($account, "davincijevkod966", "753fa793e9adb95321b061f05e29a78327645c05e097e376"));


  // Rooms
  $rooms = makeRequest("fetch_rooms", array($userToken, $lcode, 0));
  $colors = ["4286f4","0049bf","13b536","157c26","673eef","2e00c9","e59900","ddc133","ef2f2f","8e0c0c"];
  $cal_real_rooms = [];
  $cal_single_rooms = [];
  for($i=0;$i<sizeof($rooms);$i++){
    $id = $rooms[$i]["id"];
    $name = $rooms[$i]["name"];
    $shortname = $rooms[$i]["shortname"];
    $occupancy = $rooms[$i]["occupancy"];
    $price = $rooms[$i]["price"];
    $availability = $rooms[$i]["availability"];
    $color = $colors[$i%10];
    $parent_room = $rooms[$i]["subroom"];
    $room_numbers = [];
    $room_status = [];
    array_push($cal_real_rooms, $id);
    for($j=1;$j<=$availability;$j++){
      array_push($room_numbers, $j);
      array_push($room_status, "clean");
      array_push($cal_single_rooms, $id . "_" . ($j - 1));
    }
    $room_numbers = implode(",", $room_numbers);
    $room_status = implode(",", $room_status);
    $booking_engine = 1;
    if($parent_room != "0"){
      $booking_engine = 0;
    }

    $sql = "INSERT INTO rooms_$lcode VALUES (
      '$id',
      '$name',
      '$shortname',
      'apartment',
      $price,
      $availability,
      $occupancy,
      '',
      '[]',
      0,
      0,
      '[]',
      '[]',
      $booking_engine,
      '$room_numbers',
      '{\"active\":0, \"avail\":0, \"price\":0, \"restrictions\":0, \"variation\": 0, \"variation_type\": \"fixed\"}',
      '$parent_room',
      '{\"active\": 0, \"room\": -1, \"variation\": 0, \"variation_type\": \"fixed\"}',
      '$room_status',
      'Wubook'
    )";
    mysqli_query($konekcija, $sql);
  }

  // Custom calendar
  $custom_calendar = [];
  $custom_calendar["type"] = "room_types";
  $custom_calendar["avail"] = "0";
  $custom_calendar["price"] = "1";
  $custom_calendar["min"] = "0";
  $custom_calendar["room_name"] = "1";
  $custom_calendar["room_type"] = "1";
  $custom_calendar["room_status"] = "1";
  $custom_calendar["room_types"] = $cal_real_rooms;
  $custom_calendar["single_rooms"] = $cal_single_rooms;
  $custom_calendar["days"] = "21";
  $custom_calendar = json_encode($custom_calendar);
  $sql = "UPDATE all_properties SET custom_calendar = '$custom_calendar' WHERE lcode = '$lcode'";
  mysqli_query($konekcija, $sql);

  // Channels
  $channels = makeRequest("get_otas", array($userToken, $lcode));
  for($i=0;$i<sizeof($channels);$i++){
    $id = $channels[$i]["id"];
    $ctype = $channels[$i]["ctype"];
    $hotel_id = $channels[$i]["channel_hid"];
    $sql = "SELECT name, logo, commission
            FROM all_channels
            WHERE ctype = $ctype
            LIMIT 1";
    $rezultat = mysqli_query($konekcija, $sql); // Default channel data
    $red = mysqli_fetch_assoc($rezultat);
    $name = $red["name"];
    $tag = $channels[$i]["tag"];
    if($tag != "")
      $name = $name . " (" . $tag . ")";
    $logo = $red["logo"];
    $commission = $red["commission"];
    $sql = "INSERT INTO channels_$lcode VALUES (
      '$id',
      $ctype,
      '$name',
      '$tag',
      '$logo',
      $commission,
      '$hotel_id',
      'Wubook'
    )";
    mysqli_query($konekcija, $sql);
  }

  // Pricing plans
  $pricing_plans = makeRequest("get_pricing_plans", array($userToken, $lcode));
  $default_price = "";
  for($i=0;$i<sizeof($pricing_plans);$i++){
    $plan_id = $pricing_plans[$i]["id"];
    $plan_name = $pricing_plans[$i]["name"];
    $plan_type = "daily";
    $plan_variation = "";
    $plan_variation_type = "";
    $plan_vpid = "";
    if(isset($pricing_plans[$i]["variation"])){
      $plan_type = "virtual";
      $plan_variation = $pricing_plans[$i]["variation"];
      $plan_variation_type = $pricing_plans[$i]["variation_type"];
      $plan_vpid = $pricing_plans[$i]["vpid"];
    }
    if($plan_type == "daily" && $default_price == "")
      $default_price = $plan_id;
    $sql = "INSERT INTO prices_$lcode VALUES(
      '$plan_id',
      '$plan_name',
      '$plan_type',
      '$plan_variation',
      '$plan_variation_type',
      '$plan_vpid',
      '',
      1,
      0,
      '',
      '',
      'Wubook'
    )";
    mysqli_query($konekcija, $sql);
  }
  // Set default plan
  $sql = "UPDATE all_properties SET default_price = '0' WHERE lcode = '$lcode'";
  mysqli_query($konekcija, $sql);

  // Restriction plans
  $restriction_plans = makeRequest("rplan_rplans", array($userToken, $lcode));
  $sql = "INSERT INTO restrictions_$lcode VALUES(
    '1',
    'Osnovne restrikcije',
    'daily',
    '{}',
    'Wubook'
  )";
  mysqli_query($konekcija, $sql);
  for($i=0;$i<sizeof($restriction_plans);$i++){
    $plan_id = $restriction_plans[$i]["id"];
    $plan_name = $restriction_plans[$i]["name"];
    $plan_type = "daily";
    $plan_rules = "{}";
    if(isset($restriction_plans[$i]["rules"])){
      $plan_type = "compact";
      $plan_rules = json_encode($restriction_plans[$i]["rules"]);
    }
    $sql = "INSERT INTO restrictions_$lcode VALUES(
      '$plan_id',
      '$plan_name',
      '$plan_type',
      '$plan_rules',
      'Wubook'
    )";
    mysqli_query($konekcija, $sql);
  }

  // Fetching all reservations



  $userToken = makeRequest("acquire_token", array($account, "davincijevkod966", "753fa793e9adb95321b061f05e29a78327645c05e097e376"));

  makeUncheckedRequest("push_activation", array($userToken, $lcode, "https://admin.otasync.me/api/notifications/$account"));
  makeUncheckedRequest("unmark_reservations", array($userToken, $lcode, "01/01/2019"));
  $actions = 5; // Already did 5 actions with token
  $reservations = makeRequest("fetch_new_bookings", array($userToken, $lcode, 1, 1));
  $modified_sqls = [];
  while(sizeof($reservations) > 0){
    for($i=0;$i<sizeof($reservations);$i++){ // Insert all
      // Res Data
      $reservation = $reservations[$i];
      $reservation_code = $reservation["reservation_code"];
      $status = $reservation["status"];
      $was_modified = $reservation["was_modified"];
      $modified_reservations = "";
      if(sizeof($reservation["modified_reservations"]))
        $modified_reservations = $reservation["modified_reservations"][0];

      $date_received_time = explode(" ", $reservation["date_received_time"]);
      $date_received = dmyToYmd($date_received_time[0]);
      $time_received = $date_received_time[1];
      $date_arrival = dmyToYmd($reservation["date_arrival"]);
      $date_departure = dmyToYmd($reservation["date_departure"]);
      $nights = dateDiff($date_arrival, $date_departure);

      // Rooms data
      $dayprices = $reservation["dayprices"];
      $rooms = $reservation["rooms"];
      $room_data = [];
      $real_rooms = [];

      $rooms_map = []; // Init map of used rooms
      $sql = "SELECT name, shortname, room_numbers, id, parent_room FROM rooms_$lcode WHERE id IN ($rooms)";
      $rezultat = mysqli_query($konekcija, $sql);
      while($red = mysqli_fetch_assoc($rezultat)){
        $rooms_map[$red["id"]] = [];
        $rooms_map[$red["id"]]["id"] = $red["id"];
        $rooms_map[$red["id"]]["name"] = $red["name"];
        $rooms_map[$red["id"]]["shortname"] = $red["shortname"];
        $rooms_map[$red["id"]]["count"] = 0;
        $rooms_map[$red["id"]]["parent_id"] = $red["id"];
        if($red["parent_room"] != '0'){
          $rooms_map[$red["id"]]["parent_id"] = $red["parent_room"];
        }
        $rooms_map[$red["id"]]["room_numbers"] = [];
      }
      $rooms = explode(",", $rooms);
      for($j=0;$j<sizeof($rooms);$j++){
        $room = $rooms[$j];
        array_push($real_rooms, $rooms_map[$room]["parent_id"]);
        $rooms_map[$room]["count"] += 1;
        $rooms_map[$room]["price"] = array_sum($dayprices[$room]) / sizeof($dayprices[$room]);
      }


      // Get room numbers
      $dfrom = $date_arrival;
      $dto = $date_departure;
      $occupied_rooms = []; // Init occupied rooms struct
      for($j=0;$j<sizeof($real_rooms);$j++){
        $occupied_rooms[$real_rooms[$i]] = [];
      }
      for($j=0;$j<sizeof($real_rooms);$j++){
        $occupied_rooms[$real_rooms[$j]] = []; // It's a map,, use isset to check if it's occupied
      }
      $sql = "SELECT real_rooms, room_numbers FROM reservations_$lcode WHERE date_arrival < '$dto' AND date_departure > '$dfrom' AND status = 1";
      $rezultat = mysqli_query($konekcija, $sql);
      while($red = mysqli_fetch_assoc($rezultat)){
        $res_rooms = explode(",", $red["real_rooms"]);
        $res_room_numbers = explode(",", $red["room_numbers"]);
        for($j=0;$j<sizeof($res_rooms);$j++){
          $occupied_rooms[$res_rooms[$j]][$res_room_numbers[$j]] = 1;
        }
      } // Occupied rooms done

      $room_numbers = [];
      for($j=0;$j<sizeof($real_rooms);$j++){ // Getting available rooms
        $room_id = $real_rooms[$j];
        $n=0;
        while(1){
          if(isset($occupied_rooms[$room_id][$n])){ // Room is occupied
            $n += 1;
          }
          else {
            array_push($room_numbers, $n);
            $occupied_rooms[$room_id][$n] = 1;
            array_push($rooms_map[$room_id]["room_numbers"], $n); // Remember room number used
            break;
          }
        }
      }
      foreach($rooms_map as $key => $values){
        array_push($room_data, $values);
      }
      $rooms = implode(",", $rooms);
      $real_rooms = implode(",", $real_rooms);
      $room_numbers = implode(",", $room_numbers);
      $room_data = json_encode($room_data);

      $men = $reservation["men"];
      $children = $reservation["children"];

      $guest_ids = insertWubookGuest($lcode, $reservation, $konekcija);
      $customer_name = mysqli_real_escape_string($konekcija, $reservation["customer_name"]);
      $customer_surname = mysqli_real_escape_string($konekcija, $reservation["customer_surname"]);
      $customer_mail = mysqli_real_escape_string($konekcija, $reservation["customer_mail"]);
      $customer_phone = mysqli_real_escape_string($konekcija, $reservation["customer_phone"]);
      $customer_country = mysqli_real_escape_string($konekcija, $reservation["customer_country"]);
      $customer_address = mysqli_real_escape_string($konekcija, $reservation["customer_address"]);
      $customer_zip = mysqli_real_escape_string($konekcija, $reservation["customer_zip"]);
      $note = mysqli_real_escape_string($konekcija, $reservation["customer_notes"]);

      $avans = $reservation['payment_gateway_fee'] != "" ? $reservation['payment_gateway_fee'] : 0;
      $payment_gateway_fee = [];
      $payment_gateway_fee["type"] = "fixed";
      $payment_gateway_fee["value"] = $avans;
      $payment_gateway_fee = json_encode($payment_gateway_fee);

      $reservation_price = $reservation["amount"];
      $services = "[]";
      $services_price = 0;
      $total_price = $reservation_price;
      $pricing_plan = "";
      $discount = [];
      $discount["type"] = "fixed";
      $discount["value"] = 0;
      $discount = json_encode($discount);
      $invoices = "[]";
      $cc_info = $reservation['cc_info'];
      $no_show = 0;
      $deleted_advance = isset($reservation['deleted_advance']) ? $reservation['deleted_advance'] : 0;
      $date_canceled = "0001-01-01";
      if(isset($reservation['deleted_at_time'])) {
        $date_canceled = explode(" ", $reservation['deleted_at_time']);
        $date_canceled = dmyToYmd($date_canceled[0]);
      }
      $addons_list = json_encode($reservation["addons_list"]);
      $id_woodoo = $reservation["id_woodoo"];
      $channel_reservation_code = $reservation["channel_reservation_code"];
      $additional_data = "{}";
      if(isset($reservation["ancillary"]))
        $additional_data = mysqli_real_escape_string($konekcija, json_encode($reservation["ancillary"]));
      $created_by = "Wubook";

      // Update old reservation
      if($modified_reservations != "" && $modified_reservations != $reservation_code){
        array_push($modified_sqls, "UPDATE reservations_$lcode SET new_reservation_code = '$reservation_code' WHERE reservation_code = '$modified_reservations'");
      }

      // Insert
      $sql = "INSERT INTO reservations_$lcode VALUES (
        '$reservation_code',
        $status,
        $was_modified,
        '$modified_reservations',
        '',
        '$date_received',
        '$time_received',
        '$date_arrival',
        '$date_departure',
        $nights,
        '$rooms',
        '$room_data',
        '$real_rooms',
        '$room_numbers',
        $men,
        $children,
        '$guest_ids',
        '$customer_name',
        '$customer_surname',
        '$customer_mail',
        '$customer_phone',
        '$customer_country',
        '$customer_address',
        '$customer_zip',
        '$note',
        '$payment_gateway_fee',
        $reservation_price,
        '$services',
        $services_price,
        $total_price,
        '$pricing_plan',
        '$discount',
        '$invoices',
        $cc_info,
        'waiting_arrival',
        '$date_canceled',
        $deleted_advance,
        '$addons_list',
        '$id_woodoo',
        '$channel_reservation_code',
        '$additional_data',
        'Wubook'
      )";
      mysqli_query($konekcija, $sql);
    }
    $reservations = makeRequest("fetch_new_bookings", array($userToken, $lcode, 1, 1)); // Fetch next
    $actions += 1;
    if($actions > 50){ // Reset token
      makeReleaseRequest("release_token", array($userToken));
      $userToken = makeRequest("acquire_token", array($account, "davincijevkod966", "753fa793e9adb95321b061f05e29a78327645c05e097e376"));
      $actions = 0;
    }
  }
  for($i=0;$i<sizeof($modified_sqls);$i++){
    mysqli_query($konekcija, $modified_sqls[$i]);
  }
  makeRequest("release_token", array($userToken));



  // Create avail/price/restriction values tables
  $real_rooms = [];
  $sql = "SELECT id FROM rooms_$lcode WHERE parent_room = '0'"; // Only get real rooms for avail
  $rezultat = mysqli_query($konekcija, $sql);
  while($red = mysqli_fetch_assoc($rezultat)){
    array_push($real_rooms, $red["id"]);
  }
  $rooms = [];
  $restrictions_rooms = [];
  $sql = "SELECT id FROM rooms_$lcode"; // Get all rooms for prices and restrictions
  $rezultat = mysqli_query($konekcija, $sql);
  while($red = mysqli_fetch_assoc($rezultat)){
    array_push($rooms, $red["id"]);
    // Making all fields for restrictions table
    array_push($restrictions_rooms, "min_stay_" . $red["id"]);
    array_push($restrictions_rooms, "min_stay_arrival_" . $red["id"]);
    array_push($restrictions_rooms, "max_stay_" . $red["id"]);
    array_push($restrictions_rooms, "closed_" . $red["id"]);
    array_push($restrictions_rooms, "closed_departure_" . $red["id"]);
    array_push($restrictions_rooms, "closed_arrival_" . $red["id"]);
    array_push($restrictions_rooms, "no_ota_" . $red["id"]);
  }



  // Avail
  $rooms_sql = "room_" . implode(" INT, room_", $real_rooms) . " INT"; // SQL to create a column for each room
  $sql = "CREATE TABLE avail_values_$lcode
  (
    avail_date DATE NOT NULL,
    $rooms_sql,
    PRIMARY KEY (avail_date)
  )";
  $rezultat = mysqli_query($konekcija, $sql);
  // Prices
  $rooms_sql = "room_" . implode(" FLOAT, room_", $rooms) . " FLOAT";
  $sql = "CREATE TABLE prices_values_$lcode
  (
    id VARCHAR(63),
    price_date DATE NOT NULL,
    $rooms_sql,
    PRIMARY KEY (id, price_date)
  )";
  mysqli_query($konekcija, $sql);
  // Restrictions
  $rooms_sql = implode(" INT, ", $restrictions_rooms) . " INT";
  $sql = "CREATE TABLE restrictions_values_$lcode
  (
    id VARCHAR(63),
    restriction_date DATE NOT NULL,
    $rooms_sql,
    PRIMARY KEY (id, restriction_date)
  )";
  mysqli_query($konekcija, $sql);

  // Values of avail/prices/restrictions
  $dfrom = date("Y-m-d");
  $time = strtotime($dfrom);
  $dto = date("Y-m-d", $time+364*24*60*60);
  plansInsertWubook($lcode, $account, $dfrom, $dto, $konekcija);
  $dfrom = date("Y-m-d", $time+365*24*60*60);
  $dto = date("Y-m-d", $time+729*24*60*60);
  plansInsertWubook($lcode, $account, $dfrom, $dto, $konekcija);
  plansInsertWubook($lcode, $account, "2021-03-01", "2021-03-31", $konekcija);


  // Articles

  $sql = "CREATE TABLE categories_$lcode
  (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(63) NOT NULL,
    parent_id INT,
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  $sql = "CREATE TABLE articles_$lcode
  (
    id INT NOT NULL AUTO_INCREMENT,
    category_id INT NOT NULL,
    barcode INT NOT NULL DEFAULT -1,
    code INT NOT NULL,
    tax_rate TINYINT NOT NULL DEFAULT 0,
    description VARCHAR(32),
    class TINYINT NOT NULL DEFAULT 0,
    price FLOAT NOT NULL,
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  $sql = "INSERT INTO categories_$lcode (name, parent_id) VALUES ('Artikli', 0)";
  mysqli_query($konekcija, $sql);

  // Yield

  $sql = "CREATE TABLE yield_variations_$lcode
  (
    id INT NOT NULL AUTO_INCREMENT,
    variation_type INT,
    variation_value FLOAT,
    PRIMARY KEY (id)
  )";
  mysqli_query($konekcija, $sql);

  // Engine

  // Get user defaults
  $sql = "SELECT email, phone, address, name, latitude, longitude, logo FROM all_properties WHERE lcode = '$lcode'";
  $rezultat = mysqli_query($konekcija, $sql);
  $property = mysqli_fetch_assoc($rezultat);
  $sql = "INSERT INTO engine_confirmation VALUES (
    '$lcode',
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    '12:00-16:00'
  )";
  mysqli_query($konekcija, $sql);

  $address = $property["address"];
  $phone = $property["phone"];
  $email = $property["email"];
  $longitude = $property["longitude"];
  $latitude = $property["latitude"];
  $sql = "INSERT INTO engine_contact VALUES (
    '$lcode',
    '$address',
    '$phone',
    '$email',
    '',
    '',
    '',
    '',
    '$longitude',
    '$latitude'
  )";
  mysqli_query($konekcija, $sql);

  $sql = "INSERT INTO engine_footer VALUES (
    '$lcode',
    ''
  )";
  mysqli_query($konekcija, $sql);

  $name = $property["name"];
  $sql = "INSERT INTO engine_header VALUES (
    '$lcode',
    '$name',
    ''
  )";
  mysqli_query($konekcija, $sql);

  $sql = "INSERT INTO engine_messages VALUES (
    '$lcode',
    '',
    '',
    '',
    ''
  )";
  mysqli_query($konekcija, $sql);

  $logo = $property["logo"];
  $sql = "INSERT INTO engine_styles VALUES (
    '$lcode',
    '#2c3e50',
    5,
    '$logo',
    ''
  )";
  mysqli_query($konekcija, $sql);

  $sql = "INSERT INTO engine_selectdates VALUES (
    '$lcode',
    1,
    '12:00',
    0,
    0
  )";
  mysqli_query($konekcija, $sql);


}

if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
    http_response_code(200);
    die();
}
else if ($_SERVER['REQUEST_METHOD'] != "POST"){
  fatal_error("Invalid method", 405);
}

$action = getAction();
$konekcija = connectToDB();
$ret_val = [];
$ret_val["status"] = "ok";

if($action == "loginSession")
{
  $key = checkPost("key");
  $user = getSession($key, "", $konekcija);

  // Get user data
  $id = $user["id"];
  $sql = "SELECT * FROM all_users WHERE id = '$id' LIMIT 1";
  $rezultat = mysqli_query($konekcija, $sql);
  if(!$rezultat)
    fatal_error("Database error", 500);
  else
    $user = mysqli_fetch_assoc($rezultat);


  // Get properties
  $account = $user["account"];
  $properties_list = $user["properties"];
  $properties = [];
  if($account == "IM043"){
    $sql = "SELECT * FROM all_properties";
  }
  else if($account == "ME001"){
    $sql = "SELECT * FROM all_properties WHERE agency = 1 OR agency = 3 OR agency = 5";
  }
  else {
    $sql = "SELECT * FROM all_properties WHERE lcode IN ($properties_list)";
  }
  $rezultat = mysqli_query($konekcija, $sql);
  while($red = mysqli_fetch_assoc($rezultat)){
    $units = [];
    $sqlUnits = "SELECT * FROM rooms_".$red['lcode'];
    $rezultatUnits = mysqli_query($konekcija, $sqlUnits);
    while($redUnits = mysqli_fetch_assoc($rezultatUnits)){
        array_push($units, fixRoom($redUnits));
    }
    $property = fixProperty($red);
    $property["units"] = $units;
    array_push($properties, $property);
  }

  // Return Values
  $ret_val = $user;

  if($user["status"] == 4){
    $property = $user["properties"];
    $rooms = [];
    $sql = "SELECT * FROM rooms_$property";
    $rezultat = mysqli_query($konekcija, $sql);
    while($red = mysqli_fetch_assoc($rezultat)){
        array_push($rooms, fixRoom($red));
    }
    $ret_val["rooms"] = $rooms;
  }
  $ret_val["user_status"] = $user["status"];
  $ret_val["status"] = "ok";
  $ret_val["key"] = $key;
  $ret_val["properties"] = $properties;
}

if($action == "login")
{
  $username = checkPost("username");
  $pwd = checkPost("password");
  $remember = checkPost("remember");

  $sql = "SELECT pwd, account, status FROM all_users WHERE username = '$username'";
  $rezultat = mysqli_query($konekcija, $sql);
  $user = mysqli_fetch_assoc($rezultat);
  // Check password
  if($user == null){ // Init new user
    fatal_error("Invalid username/password", 200);
  }
  if($user["status"] == 0)
    fatal_error("Account expired", 200);
  if($user["pwd"] === "" && sha1($pwd) !== "c1fceec1bd92cc47c1f4239c672f5642e1aed020"){ // Check password with wubook and insert it
    $userToken = makeUncheckedRequest("acquire_token", array($user["account"], $pwd, "753fa793e9adb95321b061f05e29a78327645c05e097e376"));
    if($userToken[0] !== 0)
      fatal_error("Invalid username/password", 200);
    $userToken = $userToken[1];
    makeReleaseRequest("release_token", array($userToken));
    $pwd = sha1($pwd);
    $sql = "UPDATE all_users SET pwd = '$pwd' WHERE username = '$username'";
    $rezultat = mysqli_query($konekcija, $sql);
    if(!$rezultat)
      fatal_error("Databsdaase error", 500);
  }
  else if(sha1($pwd) !== "c1fceec1bd92cc47c1f4239c672f5642e1aed020" && sha1($pwd) !== $user["pwd"]){
    fatal_error("Invalid username/password", 200);
  }

  // Get user data
  $sql = "SELECT id, username, account, status, name, properties, reservations, guests, invoices, prices, restrictions, avail, rooms, channels, statistics, changelog, articles, wspay, engine, email, phone, client_name, company_name, address, city, country, pib, mb, undo_timer, notify_overbooking, notify_new_reservations, invoice_header, invoice_margin, invoice_issued, invoice_delivery, quicksetup_step FROM all_users WHERE username = '$username' LIMIT 1";
  $rezultat = mysqli_query($konekcija, $sql);
  if(!$rezultat)
    fatal_error("Databa3se error", 500);
  else
    $user = mysqli_fetch_assoc($rezultat);

  // Get properties
  $account = $user["account"];
  $properties_list = $user["properties"];
  $properties = [];
  if($account == "IM043"){
    $sql = "SELECT * FROM all_properties";
  }
  else if($account == "ME001"){
    $sql = "SELECT * FROM all_properties WHERE agency = 1 OR agency = 3 OR agency = 5";
  }
  else {
    $sql = "SELECT * FROM all_properties WHERE lcode IN ($properties_list)";
  }
  $rezultat = mysqli_query($konekcija, $sql);
  while($red = mysqli_fetch_assoc($rezultat)){
      array_push($properties, fixProperty($red));
  }

  // Insert session
  $pkey = sha1($username . $account . time());
  $notification_id = "";
  if(checkPostExists("notification_id"))
    $notification_id = checkPost("notification_id");
  $username = $user["username"];
  $account = $user["account"];
  $name = $user["name"];
  $account_id = $user["id"];
  $last_action = time();

  $sql = "INSERT INTO all_sessions VALUES (
    '$pkey',
    $account_id,
    $remember,
    $last_action,
    '$notification_id'
  )";
  $rezultat = mysqli_query($konekcija, $sql);
  if(!$rezultat)
    fatal_error("Database error", 500);

  // Return Values

  $ret_val = $user;
  $ret_val["user_status"] = $user["status"];
  $ret_val["status"] = "ok";
  $ret_val["key"] = $pkey;
  $ret_val["properties"] = $properties;
}

if($action == "logout")
{
  $account = checkPost("account");
  $key = checkPost("key");
  $sql = "DELETE FROM all_sessions WHERE pkey = '$key'";
  $rezultat = mysqli_query($konekcija, $sql);
}

if($action == "agency")
{
  $id = checkPost("id");
  $sql = "SELECT * FROM all_agencies WHERE id = '$id'";
  $rezultat = mysqli_query($konekcija, $sql);
  $agency = mysqli_fetch_assoc($rezultat);
  $ret_val["agency"] = $agency;
}

if($action == "registerConfirm")
{
  $id = checkPost("id");
  $code = checkPost("code");
  $sql = "SELECT COUNT(*) as cnt FROM all_users WHERE id = '$id' AND account = '$code'";
  $rezultat = mysqli_query($konekcija, $sql);
  $red = mysqli_fetch_assoc($rezultat);
  if($red["cnt"] == 0){
    fatal_error("Invalid code", 200);
  }
  $sql = "SELECT client_name FROM all_users WHERE id = '$id' AND account = '$code'";
  $rezultat = mysqli_query($konekcija, $sql);
  $red = mysqli_fetch_assoc($rezultat);
  $name = explode(" ", $red["client_name"]);
  $account = substr($name[0], 0,1) . substr($name[1], 0,1) . time();
  $sql = "UPDATE all_users SET account = '$account', status = 4 WHERE id = '$id' AND account = '$code'";
  $rezultat = mysqli_query($konekcija, $sql);
  if(!$rezultat)
    fatal_error("Database failed", 500);
}

if($action == "register")
{
  $name = checkPost("name") . " " . checkPost("surname");
  $phone = checkPost("phone");
  $email = checkPost("email");
  $pwd = sha1(checkPost("password"));
  $code = substr(sha1($name . time()), 0, 6);

  $sql = "SELECT COUNT(*) as cnt FROM all_users WHERE email = '$email' OR username = '$email'";
  $rezultat = mysqli_query($konekcija, $sql);
  $red = mysqli_fetch_assoc($rezultat);
  if($red["cnt"] > 0){
    fatal_error("User exists", 400);
  }

  $sql = "INSERT INTO all_users (username, pwd, account, status, properties, reservations, guests, invoices, prices, restrictions, avail, rooms, channels, statistics, changelog, articles,
     wspay, engine, name, email, phone, client_name, company_name, address, city, country, pib, mb, wspay_key, wspay_shop, undo_timer, notify_overbooking, notify_new_reservations, invoice_header, invoice_margin, invoice_issued, invoice_delivery, room_count, ctypes, booking, booking_percentage, expedia, airbnb, private, agency, split, pricing_plan, quicksetup_step)
  VALUES
  (
    '$email',
    '$pwd',
    '$code',
    5,
    '',
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    0,
    0,
    3,
    'Master',
    '$email',
    '$phone',
    '$name',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    60,
    0,
    0,
    0,
    10,
    'today',
    'today',
    0,
    '',
    0,
    15,
    0,
    0,
    1,
    0,
    0,
    0,
    1
  )";
  $rezultat = mysqli_query($konekcija, $sql);
  $ret_val["id"] = mysqli_insert_id($konekcija);
  $ret_val["code"] = $code;
  $subject = 'Registration';
  $message = "Your registration code for admin.otasync.me is $code";
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
  $headers .= 'From: noreply@otasync.me';
  $rez = mail($email, $subject, $message, $headers);
  if(!$rez)
    fatal_error("Email not sent", 500);
}

if($action == "registerResend")
{
  $id = checkPost("id");
  $code = substr(sha1($id . time()), 0, 6);
  $sql = "SELECT COUNT(*) as cnt FROM all_users WHERE id = '$id' AND status = 5";
  $rezultat = mysqli_query($konekcija, $sql);
  $red = mysqli_fetch_assoc($rezultat);
  if($red["cnt"] == 0){
    fatal_error("User doesn't exist", 400);
  }
  $sql = "SELECT email FROM all_users WHERE id = '$id' AND status = 5";
  $rezultat = mysqli_query($konekcija, $sql);
  $red = mysqli_fetch_assoc($rezultat);
  $email = $red["email"];
  $sql = "UPDATE all_users SET account = '$code' WHERE id = '$id'";
  $rezultat = mysqli_query($konekcija, $sql);
  $ret_val["id"] = $id;
  $ret_val["code"] = $code;
  $subject = 'Registration';
  $message = "Your registration code for admin.otasync.me is $code";
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
  $headers .= 'From: noreply@otasync.me';
  $rez = mail($email, $subject, $message, $headers);
  if(!$rez)
    fatal_error("Email not sent", 500);
}

if($action == "property")
{
  $key = checkPost("key");
  $account = checkPost("account");
  $user = getSession($key, $account, $konekcija);

  $name = checkPost("name");
  $type = checkPost("type");
  $address = checkPost("address");
  $city = checkPost("city");
  $zip = checkPost("zip");
  $country = checkPost("country");
  $latitude = checkPost("latitude");
  $longitude = checkPost("longitude");
  $lcode = time();
  $email = $user["email"];
  $phone = $user["phone"];


  $lodg = [];
  $lodg["name"] = $name;
  $lodg["address"] = $address;
  $lodg["url"] = "https://otasync.me";
  $lodg["zip"] = $zip;
  $lodg["city"] = $city;
  $lodg["phone"] = $phone;
  $lodg["contact_email"] = $email;
  $lodg["booking_email"] = $email;
  $country_codes = array_flip(array($iso_countries));
  if(isset($country_codes[$country]))
    $lodg["country"] = $country_codes[$country];
  else
    $lodg["country"] = "RS";
  $lodg = (object)$lodg;
  $accnt = [];
  $accnt["first_name"] = explode(" ", $user["client_name"])[0];
  $accnt["last_name"] = explode(" ", $user["client_name"])[1];
  $accnt["phone"] = $phone;
  $accnt["lang"] = "EN";
  $accnt["email"] = $email;
  $accnt["currency"] = "EUR";
  $accnt = (object)$accnt;

  $masterToken = makeRequest("acquire_token", array("IM043", "davincijevkod966", "753fa793e9adb95321b061f05e29a78327645c05e097e376"));
  $resp = makeRequest("corporate_new_account_and_property", array($masterToken, $lodg, 0, $accnt));
  $user_id = $user["id"];
  $user_pwd = $user["pwd"];
  $sql = "DELETE FROM all_users WHERE id = '$user_id'";
  mysqli_query($konekcija, $sql);
  $account = $resp["acode"];
  $lcode = $resp["lcode"];
  $userToken = makeRequest("acquire_token", array($account, "davincijevkod966", "753fa793e9adb95321b061f05e29a78327645c05e097e376"));
  $lcodes = initUser($account, $userToken, $konekcija);
  $new_user_id = mysqli_insert_id($konekcija);
  $sql = "UPDATE all_users SET pwd = '$user_pwd', quicksetup_step = 2, username = '$email' WHERE id = '$new_user_id'";
  mysqli_query($konekcija, $sql);
  initProperty($account, $lcode, $konekcija);

  $sql = "UPDATE all_sessions SET id = '$new_user_id' WHERE pkey = '$key'";
  mysqli_query($konekcija, $sql);
  $ret_val["account"] = $account;
  $ret_val["lcode"] = $lcode;
}

if($action == "subuserInfo") // Get data for autofill of registration form
{
  $pwd = checkPost("key");
  $id = checkPost("id");
  $sql = "SELECT *
          FROM all_users
          WHERE pwd = '$pwd' AND id = $id AND status = 3
          LIMIT 1
          ";
  $rezultat = mysqli_query($konekcija, $sql);
  if($rezultat)
  {
    $red = mysqli_fetch_assoc($rezultat);
    $ret_val["email"] = $red['email'];
  }
  else {
    fatal_error("Invalid ID", 200);
  }

}

if($action == "subuserConfirm") // Sub-user registration
{
  $email = checkPost("email");
  $email = strtolower($email);
  $password = checkPost("password");
  $password= sha1($password);
  $pkey = checkPost("key");
  $sql = "SELECT COUNT(*) AS broj
            FROM all_users
            WHERE email = '$email' AND pwd = '$pkey'
            LIMIT 1
          ";
  $rezultat = mysqli_query($konekcija, $sql);
  $red = mysqli_fetch_assoc($rezultat);
  $broj = $red['broj'];
  if($broj == 0) // Invalid key or email of pending user
  {
    fatal_error("Invalid key", 200);
  }
  else {
    $sql = "UPDATE all_users SET
      status = 2,
      pwd = '$password'
      WHERE email = '$email' AND pwd = '$pkey'
    ";
    $rezultat = mysqli_query($konekcija, $sql);
    if(!$rezultat)
      fatal_error("Database error", 500); // Server failed
  }
}

if($action == "reset")
{
  $code = checkPost("key");
  $pwd = sha1(checkPost("password"));
  if($code == "")
    fatal_error("Invalid code", 400);
  $sql = "SELECT COUNT(*) as cnt FROM all_users WHERE pwd = '$code'";
  $rezultat = mysqli_query($konekcija, $sql);
  $red = mysqli_fetch_assoc($rezultat);
  if($red["cnt"] == 0){
    fatal_error("Invalid code", 400);
  }
  $sql = "UPDATE all_users SET pwd = '$pwd' WHERE pwd = '$code'";
  mysqli_query($konekcija, $sql);
}


// Missing forgot password

// Missing subuser register

echo json_encode($ret_val);

$konekcija->close();


?>
