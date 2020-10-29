$(document).ready(function(){

// Open New
$("#form_res_guests").on("click", ".edit", function(){
  let field_id = $(this).closest(".form_res_guest")[0].id;
  let id = $(`#${field_id} .form_res_guest_id`).val();
  if(id != ""){ // Open edit form of existing guest
    open_guest_form(guests_map[id]);
    $("#form_guest_res_id").val(field_id);
    $("#form_guest").css("top", "0");
  }
  else {
    // Show form
    $("#form_guest").show();
    // Clear values
    $("#form_guest .title-form").text("Unos novog gosta");
    $("#form_guest_id").val("");
    $("#form_guest_res_id").val(field_id);
    $("#form_guest_name").val( $(`#${field_id} .form_res_guest_name`).val() );
    $("#form_guest_surname").val( $(`#${field_id} .form_res_guest_surname`).val() );
    $("#form_guest_email").val("");
    $("#form_guest_phone").val("");
    $("#form_guest_address").val("");
    $("#form_guest_city").val("");
    $("#form_guest_zip").val("");
    $(`#form_guest_country_ul li[value='--']`).click();
    $("#form_guest_id_number").val("");
    $(`#form_guest_id_type_ul li[value='--']`).click();
    set_switch("form_guest_gender", 1);
    set_switch("form_guest_host_again", 1);
    $("#form_guest_note").val("");
    $("#form_guest").css("top", "0");
  }
});
// Close
$("#form_guest_cancel").click(function(){
    $("#form_guest").hide();
  });

// Open edits
$("#guests_list").on("click", ".edit", function(e){
  e.stopPropagation();
  let id  = $(this).closest(".guest")[0].id.split("_");
  id = id[id.length - 1];
  let guest = guests_map[id];
  click_to_hide();
  scroll_lock();
  open_guest_form(guest);
});
$("body").on("click", "#guest_info_edit", function(){
  let id  = $("#guest_info_edit").attr("data-value");
  let guest = guests_map[id];
  click_to_hide();
  scroll_lock();
  open_guest_form(guest);
});

// Toggle country dropdown
$("body").on("click", "#form_guest_country_button", function(){
  $("#form_guest_country_ul").toggle();
});
// Select country from dropdown
$("body").on('click',"#form_guest_country_ul li", function(){
   //Get the values
   let country_id = $(this).attr("value");
   let country_name = $(this).attr("data-link");
   // Add id
   $("#form_guest_country").val(country_id);
   // Add name
   $("#form_guest_country_button").text(country_name);
   // Hide list
   $("#form_guest_country_ul").hide();
 });
 // Toggle id type dropdown
 $("body").on("click", "#form_guest_id_type_button", function(){
   $("#form_guest_id_type_ul").toggle();
 });
 // Select id type from dropdown
 $("body").on('click',"#form_guest_id_type_ul li", function(){
    //Get the values
    let id_type_id = $(this).attr("value");
    let id_type_name = $(this).attr("data-link");
    // Add id
    $("#form_guest_id_type").val(id_type_id);
    // Add name
    $("#form_guest_id_type_button").text(id_type_name);
    // Hide list
    $("#form_guest_id_type_ul").hide();
  });

// Insert
$("#form_guest_confirm").click(function(){
  // Loaders
  $("#form_guest_confirm, #form_guest_cancel").addClass("button_loader");
  // Parameters
  let id = $("#form_guest_id").val();
  let name = $("#form_guest_name").val();
  let surname = $("#form_guest_surname").val();
  let gender = $("#form_guest_gender").attr("data-value") == 1 ? "M" : "F";
  // Call
  let action = id == "" ? 'insert/guest' : 'edit/guest';
  $.ajax({
    type: 'POST',
    url: api_link + action,
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      id: $("#form_guest_id").val(),
      name: name,
      surname: surname,
      email: $("#form_guest_email").val(),
      phone: $("#form_guest_phone").val(),
      address: $("#form_guest_address").val(),
      city: $("#form_guest_city").val(),
      zip: $("#form_guest_zip").val(),
      country_of_residence: $("#form_guest_country").val(),
      id_type: $("#form_guest_id_type").val(),
      id_number: $("#form_guest_id_number").val(),
      date_of_birth: "0001-01-01",
      gender: gender,
      host_again: $("#form_guest_host_again").attr('data-value'),
      note: $("#form_guest_note").val()
    },
    success: function(rezultat){
      $(".button_loader").removeClass("button_loader");
      var sve = check_json(rezultat);
      if(sve.status !== "ok"){
        add_change_error(sve.status);
        return;
      }
      if(id == "")
        add_change(`Dodat gost ${name} ${surname}`, sve.data.id); // Add changelog
      else
        add_change(`Izmjenjen gost ${name} ${surname}`, sve.data.id); // Add changelog
      $("#form_guest_cancel").click();
      get_guests(); // Refresh data
      let res_guest_id = $("#form_guest_res_id").val();
      if(res_guest_id != ""){
        guests_map[sve.data.new_data.id] = sve.data.new_data;
        $(`#${res_guest_id} .form_res_guest_id`).val(sve.data.new_data.id);
        $(`#${res_guest_id} .form_res_guest_name`).val(sve.data.new_data.name);
        $(`#${res_guest_id} .form_res_guest_surname`).val(sve.data.new_data.surname);
        $(`#${res_guest_id} .form_res_guest_email`).val(sve.data.new_data.email);
        $(`#${res_guest_id} .form_res_guest_phone`).val(sve.data.new_data.phone);
        $(`#${res_guest_id} .form_group_guest_id`).val(sve.data.new_data.id);
        $(`#${res_guest_id} .form_group_guest_name`).val(sve.data.new_data.name);
        $(`#${res_guest_id} .form_group_guest_surname`).val(sve.data.new_data.surname);
        $(`#${res_guest_id} .form_group_guest_email`).val(sve.data.new_data.email);
        $(`#${res_guest_id} .form_group_guest_phone`).val(sve.data.new_data.phone);
      }
      else {
        $("html, body").css("overflow", "");
      }
    },
    error: function(xhr, textStatus, errorThrown){
      $(".button_loader").removeClass("button_loader");
      window.alert("An error occured. " + xhr.responseText);
    }
  });
});

});

function open_guest_form(guest){
  $("#form_guest .title-form").text("Ažuriranje gosta");
  $("#form_guest_id").val(guest.id);
  $("#form_guest_res_id").val("");
  $("#form_guest_name").val(guest.name);
  $("#form_guest_surname").val(guest.surname);
  $("#form_guest_email").val(guest.email);
  $("#form_guest_phone").val(guest.phone);
  $("#form_guest_address").val(guest.address);
  $("#form_guest_city").val(guest.place_of_residence);
  $("#form_guest_zip").val(guest.zip);
  $("#form_guest_country").val(guest.country_of_residence);
  $(`#form_guest_country_ul li[value='${guest.country_of_residence}']`).click();
  $("#form_guest_id_number").val(guest.id_number);
  $("#form_guest_id_type").val(guest.id_type);
  $(`#form_guest_id_type_ul li[value='${guest.id_type}']`).click();
  set_switch("form_guest_gender", guest.gender == "M" ? 1 : 0);
  set_switch("form_guest_host_again", guest.host_again);
  $("#form_guest_note").val(guest.note);
  $("#form_guest_error").text("");
  $("#form_guest").show();
}
