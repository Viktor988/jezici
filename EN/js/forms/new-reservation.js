let res_available_rooms;
let res_available_rooms_map;

$(document).ready(function(){

// Open New
$("#new_reservation").click(function(){
  // Clear values
  $("#form_res main-title-form").text("New reservation");
  // Step 1
  $("#form_res_id").val("");
  $("#form_res_pid").val(properties_map[main_lcode].default_price);
  $('#forms_dates').daterangepicker({
    "alwaysShowCalendars": true,
    "minDate": new Date(),
    "autoApply": true,
    "autoUpdateInput": true,
    "linkedCalendars": false,
    "startDate": new Date(),
    "locale": {
      format: 'YYYY-MM-DD'
    }});
  $('#forms_dates').click();
  $("#res_rooms_list").empty();
  $("#addNewRoom").hide();

  // Step 2
  $("#form_res_guests").empty();
  $("#form_res_adults").val(0);
  $("#form_res_children").val(0);
  $("#form_res_new_guest").click();
  $("#form_res_total_guests").val(1);
  $("#form_res_channel_select").text("Private reservation");
  $("#form_res_channel").val("-1");

  // Show form
  setStep1();
  $("#form_res").show();
  scroll_lock();
});

// STEP 1

// Date select
$('#form_res_cal_container').on('apply.daterangepicker', "#forms_dates", function(ev, picker) {
    if($("#forms_dates").val() !== ""){
      var dolazak_date = $('#forms_dates').data('daterangepicker').startDate;
      var odlazak_date = $('#forms_dates').data('daterangepicker').endDate;
      dolazak_date = date_to_iso(new Date(dolazak_date));
      odlazak_date = date_to_iso(new Date(odlazak_date));
      $("#form_res_nights").val(num_of_nights(dolazak_date, odlazak_date));
      get_res_rooms();
    }
    else {
      // Remove all rooms and hide new room button
      $("#res_rooms_list").empty();
      $("#addNewRoom").hide();
    }
});
// Add new room
$("body").on("click", "#addNewRoom", function(){
    var date = new Date().getTime();
  $("#res_rooms_list").append(`
        <div class="room filter-step1 filter-step1--new room_row" id="form_res_room_${+(date)}">
          <div class="custom-dropdown vert_center">
            <img class="dropdown-icon-left" style="position: absolute; left: 10px;" src="img/new-icons/bed.svg" alt="">
            <button name="form_res_room"
                    class="d-flex align-items-center dropdown-toggle form-item btn-dropdown form_res_room_button"
                    type="submit"
                    data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="true"
                    id="form_res_room_button_${+(date)}">
                    Room Type
            </button>
            <img class="dropdown-icon" src="img/new-icons/dropdown.svg" alt="">
            <ul id="form_res_room_ul_${+(date)}" class="dropdown-menu form_res_rooms open-dropdown" aria-labelledby="form_res_room_button_${+(date)}">
            </ul>
            <input type='hidden' name='form_res_room' class='form_res_room' id="form_res_room_type_${+(date)}">
          </div>
          <div class="custom-dropdown vert_center">
            <img class="dropdown-icon-left" src="img/new-icons/bed.svg" alt="">
            <button name="marka"
                    class="d-flex align-items-center dropdown-toggle form-item form_label btn-dropdown form_res_room_number_button"
                    type="submit" id="form_res_room_number_button_${+(date)}" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="true"> Room number
            </button>
            <img class="dropdown-icon" src="img/new-icons/dropdown.svg" alt="">
            <ul id="form_res_room_numbers_${+(date)}" class="dropdown-menu model open-dropdown short form_res_room_numbers" aria-labelledby="dropdownMenuModel">
              <li data-link="Auto" value="x">Auto</li>
            </ul>
            <input type='hidden' name='model' class='form_res_room_number' id="form_res_room_number_${+(date)}">
          </div>
          <div class="number-rooms number-rooms--night">
            <span class="text-form">Price per night</span>
            <input type="number" name="form_res_room_price" class="input-gray form_res_room_price" id='form_res_room_price_${+(date)}'>
          </div>
          <div class="custom-icons-forms">
            <div class="icons">
              <img class="ml-10 list_action_icon delete" src="img/new-icons/delete-name-surname.svg" alt="">
            </div>
          </div>
        </div>`);
    // Append all available rooms
    for(let i=0;i<res_available_rooms.length;i++){
      $(`#form_res_room_ul_${+(date)}`).append(`<li class='room' data-link='${res_available_rooms[i].name}' data-price='${res_available_rooms[i].price}' value='${res_available_rooms[i].id}'> ${res_available_rooms[i].name} </li>`);
    }

});
// Toggle room type dropdown
$("body").on("click", ".form_res_room_button", function(){
  let id = $(this)[0].id.split("_");
  id = id[id.length - 1];
  $("#form_res_room_ul_" + id).toggle();
});
// Select room type from dropdown
$("body").on('click',".form_res_rooms li", function(){
   //Get the values
   let room_id = $(this).attr("value");
   let room_price = $(this).attr("data-price");
   let room_name = $(this).attr("data-link");

   let container_id = $(this).closest(".room_row")[0].id.split("_");
   container_id = container_id[container_id.length - 1];

   // Add id
   $("#form_res_room_type_" + container_id).val(room_id);
   // Add name
   $("#form_res_room_button_" + container_id).text(room_name);
   // Add price
   $("#form_res_room_price_" + container_id).val(room_price);
   // Hide list
   $("#form_res_room_ul_" + container_id).hide();
   // Add room numbers
   $("#form_res_room_numbers_" + container_id).empty();
   let room_numbers = res_available_rooms_map[room_id].room_numbers;
   // Add auto select
   $("#form_res_room_numbers_" +  container_id).append(`<li data-link="Auto" value="x">Auto</li>`);
   // Add all available numbers
   for(let i=0;i<room_numbers.length;i++){
     $("#form_res_room_numbers_" +  container_id).append(`<li data-link="${room_numbers[i].name}" value="${room_numbers[i].id}">${room_numbers[i].name}</li>`);
   }
   // Select auto as default
   $("#form_res_room_number_" + container_id).val("x");
   $("#form_res_room_number_button_" + container_id).text("Auto");

 });
 // Toggle room number dropdown
 $("body").on("click", ".form_res_room_number_button", function(){
   let id = $(this)[0].id.split("_");
   id = id[id.length - 1];
   $("#form_res_room_numbers_" + id).toggle();
 });
 // Select room number from dropdown
 $("body").on('click',".form_res_room_numbers li", function(){
    //Get the values
    let room_id = $(this).attr("value");
    let room_name = $(this).attr("data-link");

    let container_id = $(this).closest(".room_row")[0].id.split("_");
    container_id = container_id[container_id.length - 1];

    // Add id
    $("#form_res_room_number_" + container_id).val(room_id);
    // Add name
    $("#form_res_room_number_button_" + container_id).text(room_name);
    // Hide list
    $("#form_res_room_numbers_" + container_id).hide();
  });
// Delete room
$("#res_rooms_list").on("click", ".delete", function(){
  $(this).closest(".room").remove();
});

// STEP 2

// Add new guest
$("body").on("click", "#form_res_new_guest", function () {
  $("#form_res_guests").append(`
        <div class="add-name-username flex_around form_res_guest" id='form_res_guest_${+(new Date())}'>
           <input type='hidden' class='form_res_guest_id' value=''>
           <div class='vert_center'>
               <input  class="custom-input form_res_guest_name" type="text" placeholder="Name">
           </div>
           <div class='vert_center'>
               <input  class="custom-input form_res_guest_surname" type="text" placeholder="Last Name">
           </div>
           <div class='vert_center'>
               <input  type="hidden" class="text_input form_res_guest_email">
           </div>
           <div class='vert_center'>
               <input  type="hidden" id="form_res_guest_phone" class="text_input form_res_guest_phone">
           </div>
          <div class='vert_center'>
               <div class='flex_center'>
                <div class='list_action custom-icons-forms'><img  src='img/new-icons/edit-name-surname.svg' class='list_action_icon edit' title='Additional info'> </div>
                <div class='list_action custom-icons-forms'><img src='img/new-icons/delete-name-surname.svg'  class='list_action_icon delete' id="guestdelete" title='Delete'> </div>
              </div>
          </div>
       </div>`);
  // Increase adults and total number
  var adults_value = $("#form_res_adults").val();
  adults_value = isNaN(adults_value) || adults_value == "" ? 0 : adults_value;
  adults_value++;
  var total_value = $("#form_res_total_guests").val();
  total_value = isNaN(total_value) || total_value == "" ? 0 : total_value;
  total_value++;
  $("#form_res_adults").val(adults_value);
  $("#form_res_total_guests").val(total_value);

});
// Delete guest
$("#form_res_guests").on("click", ".delete", function(){
  var adults_value = $("#form_res_adults").val();
  adults_value = isNaN(adults_value) || adults_value == "" ? 0 : adults_value;
  adults_value--;
  adults_value = adults_value < 0 ? 0 : adults_value;
  var total_value = $("#form_res_total_guests").val();
  total_value = isNaN(total_value) || total_value == "" ? 0 : total_value;
  total_value--;
  total_value = total_value < 0 ? 0 : total_value;
  $("#form_res_adults").val(adults_value);
  $("#form_res_total_guests").val(total_value)
  $(this).closest(".form_res_guest").remove();
});
// Plus/Minus
$('.add').click(function () {
  let val = +$(this).prev().val() + 1;
    $(this).prev().val(val);
    $("#form_res_total_guests").val(+$("#form_res_adults").val() + +$("#form_res_children").val());
});
$('.sub').click(function () {
  let val = +$(this).next().val() - 1;
  val = val < 0 ? 0 : val;
  $(this).next().val(val);
  $("#form_res_total_guests").val(+$("#form_res_adults").val() + +$("#form_res_children").val());
});
// Total guests update on manual change
$("#form_res_adults, #form_res_children").keyup(function () {
  $("#form_res_total_guests").val(+$("#form_res_adults").val() + +$("#form_res_children").val());
});
// Toggle channel dropdown
$("body").on("click", "#form_res_channel_select", function(){
  $("#form_res_channel_ul").toggle();
});
// Select channel from dropdown
$("body").on('click',"#form_res_channel_ul li", function(){
   //Get the values
   let channel_id = $(this).attr("value");
   let channel_name = $(this).attr("data-link");

   // Add id
   $("#form_res_channel").val(channel_id);
   // Add name
   $("#form_res_channel_select").text(channel_name);
   // Hide list
   $("#form_res_channel_ul").hide();
 });

// STEP 3

// Add service
$("#form_res_new_service").click(function(){
  $("#form_res_services").append(`
    <div class="additional-services form_res_service" >
      <div class="inputs-additional-services ">
        <input type="text" class="text_input custom-input form_res_service_name" placeholder="Service">
        <input type="text" class="number_input custom-input form_res_service_price" placeholder="Price" >
        <input type="text" class="number_input custom-input form_res_service_amount" placeholder="Quantity" >
        <input type="text" class="number_input custom-input form_res_service_tax" placeholder="Tax (%)" >
        <input id="serviceTotal" type="text" class="number_input custom-input form_res_service_total form_readonly" readonly placeholder="Total price" >
      </div>
      <div class="icons">
        <div class="list_action custom-icons-forms">
          <img id="deleteService" class="ml-10 list_action_icon delete" src="img/new-icons/delete-name-surname.svg" alt="">
        </div>
      </div>
    </div>`);
});
// Delete service
$("#form_res_services").on("click", ".delete", function(){
  $(this).closest(".form_res_service").remove();
});
// Update service
$("#form_res_services").on("change", "input", function(){

  let $container = $(this).closest(".form_res_service");
  let price = $container.find(".form_res_service_price").val();
  price = isNaN(price) || price == "" ? 0 : price;
  let quantity = $container.find(".form_res_service_amount").val();
  quantity = isNaN(quantity) || quantity == "" ? 0 : quantity;
  let tax = $container.find(".form_res_service_tax").val();
  tax = isNaN(tax) || tax == "" ? 0 : tax;
  let total_price = price * quantity;
  total_price = total_price + (total_price*tax/100);
  if(!(isNaN(total_price)) && total_price != "")
    $container.find(".form_res_service_total").val(total_price);
  step3_update();
});
// Update discount/advance
$("#form_res_discount_value, #form_res_avans_value").change(step3_update);

// STEP 4

// Send
$("#form_res_confirm").click(function(){
  // Loaders
  $("#form_res_confirm, #form_res_cancel").addClass("button_loader");
  // Parameters
  var id = $("#form_res_id").val();
  var date_arrival = date_to_iso(new Date($('#forms_dates').data('daterangepicker').startDate));
  var date_departure = date_to_iso(new Date($('#forms_dates').data('daterangepicker').endDate));
  var rooms = [];
  var roomsMap = new Map();
    //   grupne jedinice save
    $("#res_rooms_list .room_row").each(function(){
        let room = {};
        let row_id = $(this)[0].id.split("_");
        row_id = row_id[row_id.length - 1];
        var id = $("#form_res_room_type_" + row_id).val();
        var roomNumber = $("#form_res_room_number_" + row_id).val();
        if(id != ""){
          if(roomsMap.has(id)) {
              roomsMap.get(id).count += 1;
              roomsMap.get(id).room_numbers.push(roomNumber);
          } else {
              room.id = id;
              room.price = $("#form_res_room_price_" + row_id).val();
              room.count = 1;
              room.room_numbers = [];
              room.room_numbers.push(roomNumber);
              roomsMap.set(id, room);
          }
        }
    });
    for (const [key, value] of roomsMap.entries()) {
        rooms.push(value);
    }
  rooms = JSON.stringify(rooms);
  var adults = $("#form_res_adults").val();
  var children = $("#form_res_children").val();
  let channel = $("#form_res_channel").val();
  let guests = [];
  $(".form_res_guest").each(function(){
    let guest = {};
    guest["id"] = $(this).find(".form_res_guest_id")[0].value;
    guest["name"] = $(this).find(".form_res_guest_name")[0].value;
    guest["surname"] = $(this).find(".form_res_guest_surname")[0].value;
    guest["email"] = "";
    guest["phone"] = "";
    guests.push(guest);
  });
  guests = JSON.stringify(guests);
  let discount = {};
  discount["type"] = "percent";
  discount["value"] = $("#form_res_discount_value").val();
  discount = JSON.stringify(discount);
  let avans = {};
  avans["type"] = "percent";
  avans["value"] = $("#form_res_avans_value").val();
  avans = JSON.stringify(avans);
  let services = [];
  $(".form_res_service").each(function(){
    let service = {};
    service["name"] = $(this).find(".form_res_service_name")[0].value;
    service["price"] = parseFloat($(this).find(".form_res_service_price")[0].value);
    service["amount"] = parseFloat($(this).find(".form_res_service_amount")[0].value);
    service["tax"] = parseFloat($(this).find(".form_res_service_tax")[0].value);
    service["price"] = isNaN(service["price"]) || service["price"] == "" ? 0 : service["price"];
    service["amount"] = isNaN(service["amount"]) || service["amount"] == "" ? 0 : service["amount"];
    service["tax"] = isNaN(service["tax"]) || service["tax"] == "" ? 0 : service["tax"];
    services.push(service);
  });
  services = JSON.stringify(services);
  var total_price = $("#form_res_price").val();
  let note = $("#form_res_note").val();
  let send_guest_email = properties_map[main_lcode].notify_guests;
  // Call
  let action = id == "" ? 'insert/reservation' : 'edit/reservation';
  $.ajax({
    type: 'POST',
    url: api_link + action,
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      id: id,
      date_arrival: date_arrival,
      date_departure: date_departure,
      rooms: rooms,
      adults: adults,
      children: children,
      id_woodoo: channel,
      guests: guests,
      discount: discount,
      avans: avans,
      services: services,
      total_price: total_price,
      note: note,
      send_guest_email: send_guest_email
    },
    success: function(rezultat){
      $(".button_loader").removeClass("button_loader");
      var sve = check_json(rezultat);
      if(sve.status !== "ok"){
        add_change_error(sve.status);
        return;
      }
      if(id == "")
        add_change(`Inserted reservation`, sve.data.id); // Add changelog
      else
        add_change(`Edited reservation ${id}`, sve.data.id); // Add changelog
      $("#form_res_cancel").click();
      hash_change();
    },
    error: function(xhr, textStatus, errorThrown){
      $(".button_loader").removeClass("button_loader");
      window.alert("An error occured. " + xhr.responseText);
    }
  });
});

// Open edits
$("#reservations_list").on("click", ".edit", function(e){
  e.stopPropagation();
  let id  = $(this).closest(".reservation")[0].id.split("_");
  id = id[id.length - 1];
  let res = all_reservations[id];
  open_reservation_form(res);
});
$("body").on("click", "#res_info_edit", function(){
  let id  = $("#res_info_invoice").attr("data-value");
  let res = all_reservations[id];
  click_to_hide();
  open_reservation_form(res);
});

// Navigation
$(".form_cancel").click(function(){
    $("html, body").css("overflow", "");
    $(".form_container").hide();
  });
$("#close").click(function () {
  $("html, body").css("overflow", "");
  $(".form_container").hide();
});
$("#close2").click(function () {
  $("html, body").css("overflow", "");
  $(".form_container").hide();
});
$("#step1").click(function () {
    console.log("Step2");
    setStep2();
});
$("#step2").click(function () {
    console.log("Step3");
    setStep3();
});
$("#step3").click(function () {
    console.log("Step4");
    setStep4();
});
$("#step4").click(function () {
    console.log("close");
    close();
});
$("#back1").click(function () {
    console.log("step1");
    setStep1();
});
$("#back2").click(function () {
    console.log("step2");
    setStep2();
});
$("#back3").click(function () {
    console.log("step3");
    setStep3();
});
$("#circle1").click(function () {
    console.log("step1");
    setStep1();
});
$("#circle2").click(function () {
    console.log("step2");
    setStep2();
});
$("#circle3").click(function () {
    console.log("step3");
    setStep3();
});
$("#circle4").click(function () {
    console.log("step4");
    setStep4();
});

// Close all dropdowns
$('body').click(function(event){
    if(event.target.nodeName !== "LI" && event.target.nodeName !== "BUTTON") {

        $(".dropdown-menu.model.open-dropdown.short").each(function(){
            this.style.display = "none";
        });

        $(".dropdown-menu.form_res_room.open-dropdown").each(function(){
            this.style.display = "none";
        });

        $(".dropdown-menu.channel_select2.open-dropdown").each(function(){
            this.style.display = "none";
        });
    }
});

});

function get_res_rooms(){
  $.ajax({
    url: api_link + 'data/groupResRooms',
    method: 'POST',
    data: {
            key: main_key,
            account: account_name,
            lcode: main_lcode,
            dfrom: date_to_iso(new Date($('#forms_dates').data('daterangepicker').startDate)),
            dto: date_to_iso(new Date($('#forms_dates').data('daterangepicker').endDate)),
            pid: $("#form_res_pid").val()
          },
    success: function(rezultat){
      var sve = check_json(rezultat);
      if(sve.status !== "ok") {
        add_change_error(sve.status);
        return;
      }
      res_available_rooms = sve.rooms;
      res_available_rooms_map = {};
      for(let i=0;i<res_available_rooms.length;i++){
        res_available_rooms_map[res_available_rooms[i].id] = res_available_rooms[i];
      }
      // Enable room inputs
      $("#res_rooms_list").empty();
      $("#addNewRoom").click();
      $("#addNewRoom").show();

    },
    error: function(xhr, textStatus, errorThrown){
      window.alert("An error occured. " + xhr.responseText);
    }
  });
}

// Updates values of step 3
function step3_update(){
  var nights = $("#form_res_nights").val();
  if(nights == "")
    nights = 0;
  else
    nights = parseInt(nights);

  rooms_price = 0;
  $(".form_res_room_price").each(function(){
    let price = $(this).val();
    if(price != "" && !(isNaN(price)))
      rooms_price += parseFloat(price);
  });
  rooms_price *= nights;

  services_price = 0;
  $(".form_res_service_total").each(function(){
    let price = $(this).val();
    if(price != "" && !(isNaN(price)))
      services_price += parseFloat(price);
  });
  let total_price = services_price + rooms_price;
  let discount = $("#form_res_discount_value").val();
  discount = isNaN(discount) || discount == "" ? 0 : discount;
  let advance = $("#form_res_avans_value").val();
  advance = isNaN(advance) || advance == "" ? 0 : advance;

  let discounted_price = total_price - (total_price * discount / 100);
  let already_paid = discounted_price * advance / 100;
  let to_pay = discounted_price - already_paid;
  if(discount > 0){
    $("#form_res_non_discounted_price").show();
  }
  else {
    $("#form_res_non_discounted_price").hide();
  }

  $("#form_res_price").val(total_price);
  $("#form_res_services_price").val(services_price);
  $("#form_res_non_discounted_price").val(total_price);
  $("#form_res_discounted_price").val(discounted_price);
  $("#form_res_total_paid").val(already_paid);
  $("#form_res_total_remaining").val(to_pay);
}
// Updates values of step 4
function step4_update(){
  let date_arrival = date_to_iso(new Date($('#forms_dates').data('daterangepicker').startDate));
  let date_departure = date_to_iso(new Date($('#forms_dates').data('daterangepicker').endDate));
  let dates = iso_to_eur(date_arrival) + " - " + iso_to_eur(date_departure);
  $("#confirm_guest_date_from_to").text(dates);

  let channel = $("#form_res_channel_select").text();
  $("#confirm_guest_channel").text(channel);

  let rooms = "";
  $(".room_row").each(function(){
    if($(this).find(".form_res_room").val() != ""){ // Only use rooms that are set
      let room_name = $(this).find(".form_res_room_button").text();
      if($(this).find(".form_res_room_number").val() != "x"){  // Only append room number if it's set
        room_name += ` (${$(this).find(".form_res_room_number_button").text()})`;
      }
      rooms += room_name + "<br>";
    }
  });
  $("#confirm_guest_room").html(rooms);

  let guests_number = $("#form_res_total_guests").val();
  $("#confirm_guest_total_guests").text(guests_number);

  let total_price = $("#form_res_discounted_price").val();
  $("#confirm_guest_total_price").text(total_price + " " + currency);

  let total_remaining = $("#form_res_total_remaining").val();
  $("#confirm_guest_total_remaining").text(total_remaining + " " + currency);

  // Guest data
  let guest_name = "";
  if($(".form_res_guest").length)
    guest_name = $(".form_res_guest").first().find(".form_res_guest_name").val() + " " + $(".form_res_guest").first().find(".form_res_guest_surname").val();
  $("#confirm_guest_first_last_name").text(guest_name);

  let guest_id = $(".form_res_guest").first().find(".form_res_guest_id").val();
  if(guest_id != "" && $(".form_res_guest").length){
    let guest = guests_map[guest_id];
    $("#confirm_guest_phone").text(guest.phone);
    $("#confirm_guest_address").text(guest.address);
    $("#confirm_guest_email").text(guest.email);
    $("#confirm_guest_email2").val(guest.email);
  }
  else {
    $("#confirm_guest_phone").text("");
    $("#confirm_guest_address").text("");
    $("#confirm_guest_email").text("");
    $("#confirm_guest_email2").val("");
  }

}

// Navigation
function setStep1() {
    $(".step1").removeClass("d-none");
    $(".step1").addClass("d-flex");
    $(".step2").removeClass("d-flex");
    $(".step2").addClass("d-none");
    $(".step3").removeClass("d-flex");
    $(".step3").addClass("d-none");
    $(".step4").removeClass("d-flex");
    $(".step4").addClass("d-none");
    $("#circle1").addClass("active-circle");
    $("#circle2").removeClass("active-circle");
    $("#circle3").removeClass("active-circle");
    $("#circle4").removeClass("active-circle");
    $(".daterangepicker.ltr.auto-apply").addClass("show-calendar");
    $(".daterangepicker.ltr.auto-apply").css("display", "block");
}
function setStep2() {
    $(".step1").removeClass("d-flex");
    $(".step1").addClass("d-none");
    $(".step2").removeClass("d-none");
    $(".step2").addClass("d-flex");
    $(".step3").removeClass("d-flex");
    $(".step3").addClass("d-none");
    $(".step4").removeClass("d-flex");
    $(".step4").addClass("d-none");
    $("#circle1").removeClass("active-circle");
    $("#circle2").addClass("active-circle");
    $("#circle3").removeClass("active-circle");
    $("#circle4").removeClass("active-circle");
    $(".daterangepicker.ltr.auto-apply").removeClass("show-calendar");
    $(".daterangepicker.ltr.auto-apply").css("display", "none");
}
function setStep3() {
    $(".step1").removeClass("d-flex");
    $(".step1").addClass("d-none");
    $(".step2").removeClass("d-flex");
    $(".step2").addClass("d-none");
    $(".step3").removeClass("d-none");
    $(".step3").addClass("d-flex").trigger('classChange');
    $(".step4").removeClass("d-flex");
    $(".step4").addClass("d-none");
    $("#circle1").removeClass("active-circle");
    $("#circle2").removeClass("active-circle");
    $("#circle3").addClass("active-circle");
    $("#circle4").removeClass("active-circle");
    $(".daterangepicker.ltr.auto-apply").removeClass("show-calendar");
    $(".daterangepicker.ltr.auto-apply").css("display", "none");

    step3_update();
}
function setStep4() {
    $(".step1").removeClass("d-flex");
    $(".step1").addClass("d-none");
    $(".step2").removeClass("d-flex");
    $(".step2").addClass("d-none");
    $(".step3").removeClass("d-flex");
    $(".step3").addClass("d-none");
    $(".step4").removeClass("d-none");
    $(".step4").addClass("d-flex").trigger('classChange');
    $("#circle1").removeClass("active-circle");
    $("#circle2").removeClass("active-circle");
    $("#circle3").removeClass("active-circle");
    $("#circle4").addClass("active-circle");
    $(".daterangepicker.ltr.auto-apply").removeClass("show-calendar");
    $(".daterangepicker.ltr.auto-apply").css("display", "none");

    step3_update();
    step4_update();
}

// Open edit form
function open_reservation_form(res){
  /* Disclaimer:  Inserting existing rooms and adding as available is completely experimental */
  // Show form
  $("#new_reservation").click();
  // Fill values
  $("#form_res main-title-form").text("Update reservation");
  $("#form_res_id").val(res.reservation_code);
  if(res.pricing_plan == "")
    res.pricing_plan = $("#default_price").val();
  $("#form_res_pid").val(res.pricing_plan);

  // STEP 1
  $('#forms_dates').daterangepicker({
    "alwaysShowCalendars": true,
    "autoApply": true,
    "autoUpdateInput": true,
    "linkedCalendars": false,
    "startDate": new Date(res.date_arrival),
    "endDate": new Date(res.date_departure),
    "locale": {
      format: 'YYYY-MM-DD'
    }});
  $('#forms_dates').click();
  var dolazak_date = $('#forms_dates').data('daterangepicker').startDate;
  var odlazak_date = $('#forms_dates').data('daterangepicker').endDate;
  dolazak_date = date_to_iso(new Date(dolazak_date));
  odlazak_date = date_to_iso(new Date(odlazak_date));
  $("#form_res_nights").val(num_of_nights(dolazak_date, odlazak_date));
  // Get free rooms before filling
  $.ajax({
    url: api_link + 'data/groupResRooms',
    method: 'POST',
    data: {
            key: main_key,
            account: account_name,
            lcode: main_lcode,
            dfrom: date_to_iso(new Date($('#forms_dates').data('daterangepicker').startDate)),
            dto: date_to_iso(new Date($('#forms_dates').data('daterangepicker').endDate)),
            pid: $("#form_res_pid").val()
          },
    success: function(rezultat){
      var sve = check_json(rezultat);
      if(sve.status !== "ok") {
        add_change_error(sve.status);
        return;
      }
      res_available_rooms = sve.rooms;
      res_available_rooms_map = {};
      for(let i=0;i<res_available_rooms.length;i++){
        res_available_rooms_map[res_available_rooms[i].id] = res_available_rooms[i];
      }
      // Enable room inputs
      $("#res_rooms_list").empty();
      $("#addNewRoom").show();
      // Add reservation rooms as available in map
      for(let i=0;i<res.room_data.length;i++){
        let room_id = res.room_data[i].id;
        let room_price = res.room_data[i].price;
        let room_numbers = res.room_data[i].room_numbers;
        if(res_available_rooms_map[room_id] == undefined){ // No other room numbers for this room are available
          res_available_rooms_map[room_id] = {};
          res_available_rooms_map[room_id].id = room_id;
          res_available_rooms_map[room_id].name = rooms_map[room_id].name;
          res_available_rooms_map[room_id].avail = room_numbers.length;
          res_available_rooms_map[room_id].price = room_price;
          res_available_rooms_map[room_id].room_numbers = [];
          for(let j=0;j<room_numbers.length;j++){
            res_available_rooms_map[room_id].room_numbers[j] = {};
            res_available_rooms_map[room_id].room_numbers[j].id = room_numbers[j];
            res_available_rooms_map[room_id].room_numbers[j].name = rooms_map[room_id].room_numbers[room_numbers[j]];
            if(rooms_map[room_id].parent_room != '0'){ // Fix name for virtuals
              res_available_rooms_map[room_id].room_numbers[j].name = rooms_map[rooms_map[room_id].parent_room].room_numbers[room_numbers[j]];
            }
          }
        }
        else { // Some room numbers are already available for this room
          res_available_rooms_map[room_id].avail += room_numbers.length;
          res_available_rooms_map[room_id].price = room_price;
          for(let j=0;j<room_numbers.length;j++){
            new_room_number = {};
            new_room_number.id = room_numbers[j];
            new_room_number.name = rooms_map[room_id].room_numbers[room_numbers[j]];
            res_available_rooms_map[room_id].room_numbers.push(new_room_number);
          }
        }
      }
      // Fixing array from map
      res_available_rooms = Object.values(res_available_rooms_map);

      // Append all reservation rooms
      for(let i=0;i<res.room_data.length;i++){
        let room_id = res.room_data[i].id;
        let room_price = res.room_data[i].price;
        let room_numbers = res.room_data[i].room_numbers;
        for(let j=0;j<room_numbers.length;j++){
          $("#addNewRoom").click();
          // Add room to last row
          $("#res_rooms_list .room_row").last().find(`.form_res_rooms li[value='${room_id}']`).click();
          $("#res_rooms_list .room_row").last().find(`.form_res_room_numbers li[value='${room_numbers[j]}']`).click();
        }
      }

      // STEP 2
      $("#form_res_guests").empty();
      for(let i=0;i<res.guests.length;i++){
        guests_map[res.guests[i].id] = res.guests[i];
        $("#form_res_guests").append(`
              <div class="add-name-username flex_around form_res_guest" id='form_res_guest_${+(new Date()) + Math.floor(Math.random() * 100)}'>
                 <input type='hidden' class='form_res_guest_id' value='${res.guests[i].id}'>
                 <div class='vert_center'>
                     <input  class="custom-input form_res_guest_name" type="text" placeholder="Name" value='${res.guests[i].name}'>
                 </div>
                 <div class='vert_center'>
                     <input  class="custom-input form_res_guest_surname" type="text" placeholder="Last Name" value='${res.guests[i].surname}'>
                 </div>
                 <div class='vert_center'>
                     <input  type="hidden" class="text_input form_res_guest_email">
                 </div>
                 <div class='vert_center'>
                     <input  type="hidden" id="form_res_guest_phone" class="text_input form_res_guest_phone">
                 </div>
                <div class='vert_center'>
                     <div class='flex_center'>
                      <div class='list_action custom-icons-forms'><img  src='img/new-icons/edit-name-surname.svg' class='list_action_icon edit' title='Additional info'> </div>
                      <div class='list_action custom-icons-forms'><img src='img/new-icons/delete-name-surname.svg'  class='list_action_icon delete' id="guestdelete" title='Delete'> </div>
                    </div>
                </div>
             </div>`);
      }
      $("#form_res_adults").val(res.men);
      $("#form_res_children").val(res.children);
      $(`#form_res_channel_ul li[value='${res.id_woodoo}']`).click();
      $("#form_res_total_guests").val(+$("#form_res_adults").val() + +$("#form_res_children").val());

      // STEP 3
      for(let i=0;i<res.services.length;i++){
        $("#form_res_services").append(`
          <div class="additional-services form_res_service" >
            <div class="inputs-additional-services ">
              <input type="text" class="text_input custom-input form_res_service_name" placeholder="Service" value='${res.services[i].name}'>
              <input type="text" class="number_input custom-input form_res_service_price" placeholder="Price" value='${res.services[i].price}'>
              <input type="text" class="number_input custom-input form_res_service_amount" placeholder="Quantity" value='${res.services[i].amount}'>
              <input type="text" class="number_input custom-input form_res_service_tax" placeholder="Tax (%)" value='${res.services[i].tax}'>
              <input id="serviceTotal" type="text" class="number_input custom-input form_res_service_total form_readonly" readonly placeholder="Total price" value='${res.services[i].total_price}'>
            </div>
            <div class="icons">
              <div class="list_action custom-icons-forms">
                <img id="deleteService" class="ml-10 list_action_icon delete" src="img/new-icons/delete-name-surname.svg" alt="">
              </div>
            </div>
          </div>`);
      }
      $("#form_res_discount_value").val(res.discount.value);
      $("#form_res_avans_value").val(res.payment_gateway_fee.value);
      step3_update();

      // STEP 4
      $("#form_res_note").val(res.note);
      step4_update();

    },
    error: function(xhr, textStatus, errorThrown){
      window.alert("An error occured. " + xhr.responseText);
    }
  });
}
