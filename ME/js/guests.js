let guests_page = 1;
let total_guests_pages = 1;
let guests_registration = false;
let guests_map = {};

$(document).ready(function(){

// Requests on order change
$("#guests_order_type").click(function(){
  if($(this).hasClass("asc")){
    $(this).removeClass("asc");
    $(this).addClass("desc");
    $(this).attr("data-value", "desc");
  }
  else {
    $(this).removeClass("desc");
    $(this).addClass("asc");
    $(this).attr("data-value", "asc");
  }
  guests_page = 1;
  get_guests();
});
$("#guests_order_by").change(function(){
  guests_page = 1;
  get_guests();
});

// Filter
$("#guests_filter_clear").click(function(){
  $("#guests_filter_dfrom").datepicker().data('datepicker').clear();
  $("#guests_filter_dto").datepicker().data('datepicker').clear();
  set_checkbox("guests_filter_arrivals", 0);
  set_checkbox("guests_filter_departures", 0);
  $("#guests_filter_rooms").val([]).change();
  $('#guests_filter_price').jRange('updateRange', 0 + ',' + Number.MAX_SAFE_INTEGER);
  $('#guests_filter_nights').jRange('updateRange', 0 + ',' + Number.MAX_SAFE_INTEGER);
  $('#guests_filter_price').jRange('setValue', 0 + ',' + Number.MAX_SAFE_INTEGER);
  $('#guests_filter_nights').jRange('setValue', 0 + ',' + Number.MAX_SAFE_INTEGER);
  $("#guests_filter_channels").val([]).change();
  $("#guests_filter_countries").val([]).change();
  hide_modals();
});

// Registration (currently not active)
$("#guests_registration").click(function(){
  if(guests_registration){
    $(".guest_number").removeClass("selectable");
    $(".guest").removeClass("selected");
    $(".guest_number .custom_checkbox").attr("data-value", 0);
    $(".guest_number .checkbox_value").removeClass("checked");
    $("#guests_register").hide();
    $("#guests_select_all").hide();
    guests_registration = false;
    $(this).text("Register guests");
  }
  else {
    $("#guests_register").show();
    $("#guests_select_all").show();
    $(".guest_number").addClass("selectable");
    guests_registration = true;
    $(this).text("Cancel");
  }
});
$("body").on("click", ".guest_number .custom_checkbox", function(e){
  e.stopPropagation();
  let val = $(this).attr("data-value");
  if(val == 1){
    $(this).closest(".guest").addClass("selected");
  }
  else {
    $(this).closest(".guest").removeClass("selected");
  }
});
$("#guests_select_all").click(function(){
  let val = 0;
  $("#guests_list .custom_checkbox").each(function(){
    if($(this).attr("data-value") == 0)
      val = 1;
  });
  if(val){
    $(".guest_number .custom_checkbox").attr("data-value", 1);
    $(".guest_number .checkbox_value").addClass("checked");
    $(".guest").addClass("selected");
  }
  else {
    $(".guest_number .custom_checkbox").attr("data-value", 0);
    $(".guest_number .checkbox_value").removeClass("checked");
    $(".guest").removeClass("selected");
  }
});

// Host again update
$("body").on("click", "#guests_list .switch_button", function(e){
  e.stopPropagation();
  let row_id = $(this).closest(".guest")[0].id.split("_");
  let id = row_id[row_id.length - 1];
  let status = $(this).attr('data-value');
  $.ajax({
    type: 'POST',
    url: api_link + "edit/guestStatus",
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      id: id,
      status: status
    },
    success: function(rezultat){
      var sve = check_json(rezultat);
      if(sve.status !== "ok"){
        add_change_error(sve.status);
        return;
      }
      guests_map[id].host_again = status;
      add_change(`Edited guest ${guests_map[id].name}`, sve.data.id); // Add changelog
    },
    error: function(xhr, textStatus, errorThrown){
      $(".button_loader").removeClass("button_loader");
      window.alert("An error occured. " + xhr.responseText);
    }
  });
});

// Show dialog and delete guest
$("#guests_list").on("click", ".delete", function(e){
  e.stopPropagation();
  let row_id = $(this).closest(".guest")[0].id;
  let id = row_id.split("_");
  id = id[id.length - 1];
  let guest = guests_map[id];
  if(confirm(`Da li želite da obrišete gosta ${guest.name + " " + guest.surname}`)){
    $.ajax({
      type: 'POST',
      url: api_link + 'delete/guest',
      data: {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        id: id
      },
      success: function(rezultat){
        var sve = check_json(rezultat);
        if(sve.status !== "ok"){
          add_change_error(sve.status);
          return;
        }
        add_change(`Deleted guest ${guest.name + " " + guest.surname}`, sve.data.id); // Add changelog
        guests_page = 1;
        get_guests(); // Refresh data
      },
      error: function(xhr, textStatus, errorThrown){
        window.alert("An error occured. " + xhr.responseText);
      }
    });
  }
});

// Export

$("#guests_export").click(function(){
  let $list = $("#guests_list");
  let reservations = [];
  $list.find(".guest").each(function(){
    let id = $(this)[0].id.split("_");
    id = id[id.length - 1];
    reservations.push(id);
  });
  if(reservations.length){
    reservations.join(",");
    $("#guests_export_key").val(main_key);
    $("#guests_export_account").val(account_name);
    $("#guests_export_lcode").val(main_lcode);
    $("#guests_export_ids").val(reservations);
    $("#guests_export_form").submit();
  }
});

});

// Get's all guest data from server, using filters
function get_guests()
{
  // Clear list
  if(guests_page == 1)
    $("#guests_list").html("<div class='loader'><div class='loader_icon'></div></div>");
  else
    $("#guests_list").append("<div class='loader'><div class='loader_icon'></div></div>");
  // Parameters
  let prices = $("#guests_filter_price").val().split(",");
  let min_price = prices[0];
  let max_price = prices[1];
  let nights = $("#guests_filter_nights").val().split(",");
  let min_nights = nights[0];
  let max_nights = nights[1];
  $.ajax({
    url: api_link + 'data/guests',
    method: 'POST',
    data: {
            key: main_key,
            account: account_name,
            lcode: main_lcode,
            dfrom: date_to_iso($("#guests_filter_dfrom").datepicker().data('datepicker').selectedDates[0]),
            dto: date_to_iso($("#guests_filter_dto").datepicker().data('datepicker').selectedDates[0]),
            arrivals: $("#guests_filter_arrivals").attr("data-value"),
            departures: $("#guests_filter_departures").attr("data-value"),
            rooms: JSON.stringify($("#guests_filter_rooms").val()),
            min_price: min_price,
            max_price: max_price,
            min_nights: min_nights,
            max_nights: max_nights,
            channels: JSON.stringify($("#guests_filter_channels").val()),
            countries: JSON.stringify($("#guests_filter_countries").val()),
            order_type: $("#guests_order_type").attr("data-value"),
            order_by: $("#guests_order_by").val(),
            page: guests_page
          },
    success: function(rezultat){
      var sve = check_json(rezultat);
      if(sve.status !== "ok") {
        add_change_error(sve.status);
        return;
      }
      console.log(sve);
      display_guests(sve);
    },
    error: function(xhr, textStatus, errorThrown){
      window.alert("An error occured. " + xhr.responseText);
    }
  });
};

// Displays data fetched by get_guests(), in guests tab
function display_guests(data){
  let guests_list = data.guests;
  let min_price = 0;
  let max_price = parseFloat(data.max_price) + 1;
  let min_nights = 0;
  let max_nights = parseFloat(data.max_nights) + 1;
  guests_page = parseInt(data.page);
  total_guests_pages = parseInt(data.total_pages_number);
  // Clear list
  if(guests_page == 1)
    $("#guests_list").empty();
  else
    $("#guests_list").find(".loader").remove();
  // Set min / max values
  $('#guests_filter_price').jRange('updateRange', min_price + ',' + max_price);
  let vals = $('#guests_filter_price').val().split(",");
  vals[0] = min_price > vals[0] ? min_price : vals[0];
  vals[1] = max_price < vals[1] ? max_price : vals[1];
  vals = vals.join(",");
  $('#guests_filter_price').jRange('setValue', vals);
  $('#guests_filter_nights').jRange('updateRange', min_nights + ',' + max_nights);
  vals = $('#guests_filter_nights').val().split(",");
  vals[0] = min_nights > vals[0] ? min_nights : vals[0];
  vals[1] = max_nights < vals[1] ? max_nights : vals[1];
  vals = vals.join(",");
  $('#guests_filter_nights').jRange('setValue', vals);
  // Display data
  for(let i=0;i<guests_list.length;i++){
    guests_map[guests_list[i].id] = guests_list[i];
    $("#guests_list").append(guest_html("guests_list", guests_list[i], (guests_page - 1) * 20 + i+1));
  }
  if(guests_list.length == 0 && guests_page == 1)
    $("#guests_list").append(empty_html("Nema gostiju"));
  else if(guests_page == 1)
    $("#guests_list").prepend(`
      <div class="list_names">
        <div class='guest_number'> # </div>
        <div class='guest_info'> Guest </div>
        <div class='guest_contact'> Contact </div>
        <div class='guest_paid'> Paid </div>
        <div class='guest_host_again'> Host again </div>
        <div class='guest_note'> Note </div>
        <div class='guest_actions'> Actions </div>
      </div>`);
  // Disable registration
  if(guests_registration)
    $("#guests_registration").click();
}

// Returns html of a single guest from the list, used in guests tab
function guest_html(loc, guest, row_number) {
  var id = guest.id;
  var name = guest.name + " " + guest.surname;
  var country_img = guest.country_of_residence == "--" ? "" : `<img class='country_flag' src='https://www.countryflags.io/${guest.country_of_residence}/shiny/16.png'>`;
  var total_arrivals = guest.total_arrivals;
  var total_nights = guest.total_nights;
  var email = guest.email;
  var phone = guest.phone;
  var total_paid = guest.total_paid;
  var avg_paid = (parseFloat(guest.total_paid) / parseFloat(guest.total_nights)).toFixed(2);
  avg_paid = isNaN(avg_paid) ? 0 : avg_paid;
  var host_again = guest.host_again;
  var note = guest.note;
  if(note.length > 70)
    note = note.substring(0,70) + "...";

  let guest_edit = "";
  let guest_reservation = "";
  let guest_delete = "";
  if(account_access.guests == 3 || (account_access.guests == 2 && guest.created_by == user_id)){
    guest_edit = `<div class='list_action'><img class='list_action_icon edit' title='Izmjeni'> </div>`;
    guest_delete = `<div class='list_action'><img class='list_action_icon delete' title='Obriši'> </div>`;
  }
  if(account_access.reservations >= 2){
    guest_reservation = `<div class='list_action'><img class='list_action_icon reservation' title='Rezervacija'> </div>`;
  }
  var ret_val = `
    <div class="list_row guest" id='${loc}_${id}'>
      <div class='guest_number'>
        <div class='number'>
        ${row_number}
        </div>
        <div class='select'>
        ${create_checkbox(`guest_select_${id}`, 0, '')}
        </div>
      </div>
      <div class='guest_info'>
        <div class='guest_name'>${name} ${country_img}</div>
        <div class='guest_arrivals'>${total_arrivals} dolazaka, ${total_nights} noćenja</div>
      </div>
      <div class='guest_contact'>
        <div class='guest_email' href='mailto:${email}'>${email}</div>
        <div class='guest_phone'>${phone}</div>
      </div>
      <div class='guest_paid'>
       <div class='guest_total_paid'>${total_paid} ${currency}</div>
       <div class='guest_avg_paid'>${avg_paid} ${currency} p/n</div>
      </div>
      <div class='guest_host_again'>
        ${create_switch_button("guest_host_" + id, host_again, "DA", "NE", true)}
      </div>
      <div class='guest_note'>
        ${note}
      </div>
      <div class='guest_actions'>
        ${guest_edit} ${guest_reservation} ${guest_delete}
      </div>
    </div>`;
  return ret_val;
}

// Compact version of guest_html, used for search results
function compact_guest_html(loc, guest, row_number) {
  var id = guest.id;
  var name = guest.name + " " + guest.surname;
  var country_img = guest.country_of_residence == "--" ? "" : `<img class='country_flag' src='https://www.countryflags.io/${guest.country_of_residence}/shiny/16.png'>`;
  var total_arrivals = guest.total_arrivals;
  var total_nights = guest.total_nights;
  var email = guest.email;
  var phone = guest.phone;
  var total_paid = guest.total_paid;
  var avg_paid = (parseFloat(guest.total_paid) / parseFloat(guest.total_nights)).toFixed(2);
  avg_paid = isNaN(avg_paid) ? 0 : avg_paid;
  var ret_val = `
    <div class="list_row guest" id='${loc}_${id}'>
      <div class='guest_info'>
        <div class='guest_name'>${name} ${country_img}</div>
        <div class='guest_arrivals'>${total_arrivals} dolazaka, ${total_nights} noćenja</div>
      </div>
      <div class='guest_contact'>
        <div class='guest_email' href='mailto:${email}'>${email}</div>
        <div class='guest_phone'>${phone}</div>
      </div>
      <div class='guest_paid'>
       <div class='guest_total_paid'>${total_paid} ${currency}</div>
       <div class='guest_avg_paid'>${avg_paid} ${currency} p/n</div>
      </div>
    </div>`;
  return ret_val;
}
