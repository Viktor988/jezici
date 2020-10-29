$(document).ready(function(){

//  All amenities
$("#all_rooms_amenities_confirm").click(function(){
  let amenities = $("#all_rooms_amenities").val();
  amenities = JSON.stringify(amenities);
  $("#all_rooms_amenities_confirm").addClass("button_loader");
  $.ajax({
    type: 'POST',
    url: api_link + `edit/amenities`,
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      amenities: amenities
    },
    success: function(rezultat){
      $(".button_loader").removeClass("button_loader");
      $("#all_rooms_amenities").val([]).change();
      var sve = check_json(rezultat);
      if(sve.status !== "ok"){
        add_change_error(sve.status);
        return;
      }
      add_change("Dodati sadržaji za sve jedinice", -1); // Add changelog
      get_rooms(); // Refresh data
    },
    error: function(xhr, textStatus, errorThrown){
      $(".button_loader").removeClass("button_loader");
      window.alert("Doslo je do greske. " + xhr.responseText);
    }
  });
});


// Extras

// New
function extra_period_type_change(){ // Show correct period inputs
  let val = $("#new_extra_period_type").attr("data-value");
  if(val == 1){
    $("#new_extra_dates").hide();
    $("#new_extra_restriction").prop("selectedIndex", 0).change();
    $("#new_extra_restrictions").fadeIn(200);
  }
  else {
    $("#new_extra_restrictions").hide();
    $("#new_extra_dfrom").datepicker().data('datepicker').clear();
    $("#new_extra_dto").datepicker().data('datepicker').clear();
    $("#new_extra_dates").fadeIn(200);
  }
}
$("#new_extra_period_type").click(extra_period_type_change); // On checkbox click
$("#new_extra_type").change(function(){ // Show / Hide daily input
  let val = $(this).val();
  if(val == 'one') {
    $("#new_extra_daily_container").hide();
    set_switch("new_extra_daily", 0);
  }
  else {
    $("#new_extra_daily_container").fadeIn(200);
  }
});
$("#new_extra_predefined").change(function(){ // Add predefined values
  let val = $(this).val();
  if(val == -1){
    $("#new_extra_name").val("");
    $("#new_extra_variation").prop("selectedIndex", 0).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").prop("selectedIndex", 0).change();
    set_checkbox("new_extra_daily", 0);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
  }
  else if(val == 1){ // Dorucak
    $("#new_extra_name").val("Doručak");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("person").change();
    set_checkbox("new_extra_daily", 1);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/Breakfast.jpg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 2){ // Polupansion
    $("#new_extra_name").val("Polupansion");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("person").change();
    set_checkbox("new_extra_daily", 1);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/halfboard.jpg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 3){ // Pun pansion
    $("#new_extra_name").val("Pun pansion");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("person").change();
    set_checkbox("new_extra_daily", 1);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/fullboard.jpg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 4){ // Parking
    $("#new_extra_name").val("Parking");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("one").change();
    set_checkbox("new_extra_daily", 0);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/Parking.jpg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 5){ // Spa centar
    $("#new_extra_name").val("Spa centar");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("one").change();
    set_checkbox("new_extra_daily", 0);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/spacenter.jpg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 6){ // Sauna
    $("#new_extra_name").val("Sauna");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("one").change();
    set_checkbox("new_extra_daily", 0);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/sauna.jpg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 7){ // Prevoz od aerodroma
    $("#new_extra_name").val("Prevoz od aerodroma");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("one").change();
    set_checkbox("new_extra_daily", 0);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/AirportTransfer.jpg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 8){ // Prevoz od aerodroma (povratni)
    $("#new_extra_name").val("Prevoz od aerodroma (povratni)");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("one").change();
    set_checkbox("new_extra_daily", 0);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/AirportTransfer.jpg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 9){ // Prevoz brodom
    $("#new_extra_name").val("Prevoz brodom");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("one").change();
    set_checkbox("new_extra_daily", 0);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/boatTransfer.jpeg");
    $(`#new_extra_image`).hide();
  }
  else if(val == 10){ // Ulaznica u klub
    $("#new_extra_name").val("Ulaznica u klub");
    $("#new_extra_variation").val(1).change();
    $("#new_extra_price").val(0);
    $("#new_extra_tax").val(0);
    $("#new_extra_type").val("one").change();
    set_checkbox("new_extra_daily", 0);
    $("#new_extra_description").val("");
    set_checkbox("new_extra_period_type", 0);
    extra_period_type_change();
    $("#new_extra_rooms").val([]).change();
    $("#new_extra_image_file").val("").change();
    $(`#new_extra_image_container`).show();
    $(`#new_extra_image_container .image_input_image`).attr('src', "https://admin.otasync.me/beta/img/extras/ClubTicket.jpg");
    $(`#new_extra_image`).hide();
  }
});
$("#new_extra").click(function(){ // Clear values and show form

  $("#new_extra_name").val("");
  $("#new_extra_predefined").prop("selectedIndex", 0).change();
  $("#new_extra_variation").prop("selectedIndex", 0).change();
  $("#new_extra_price").val(0);
  $("#new_extra_tax").val(0);
  $("#new_extra_type").prop("selectedIndex", 0).change();
  set_checkbox("new_extra_daily", 0);
  $("#new_extra_description").val("");
  set_checkbox("new_extra_period_type", 0);
  extra_period_type_change();
  $("#new_extra_rooms").val([]).change();
  $("#new_extra_specific_rooms").val([]).change();
  $("#new_extra_image_file").val("").change();

  $("#new_extra_container").show();
  $("#new_extra").hide();

  // Hide open edits
  $("#edit_extra_container").remove();
  $(".extra.selected").removeClass("selected");
});
$("#new_extra_cancel").click(function(){  // Hide form
  $("#new_extra_container").hide();
  $("#new_extra").show();
});
$("body").on("click", "#new_extra_confirm", function(){  // Insert new
  // Loaders
  $("#new_extra_confirm, #new_extra_cancel").addClass("button_loader");
  // Parameters
  let name = $("#new_extra_name").val();
  let variation = $("#new_extra_variation").val();
  let price = $("#new_extra_price").val();
  let tax = $("#new_extra_tax").val();
  let type = $("#new_extra_type").val();
  let daily = $("#new_extra_daily").attr("data-value");
  if(type == 'one')
    daily = 0;
  let description = $("#new_extra_description").val();
  let dfrom = '0001-01-01';
  let dto = '0001-01-01';
  let restriction = '0';
  if($("#new_extra_period_type").attr("data-value") == 1){
    restriction = $("#new_extra_restriction").val();
  }
  else {
    dfrom = date_to_iso($("#new_extra_dfrom").datepicker().data('datepicker').selectedDates[0]);
    dto = date_to_iso($("#new_extra_dto").datepicker().data('datepicker').selectedDates[0]);
  }
  let rooms = $("#new_extra_rooms").val();
  let specific_rooms = $("#new_extra_specific_rooms").val();
  // Form data with image
  var formData = new FormData();
  formData.append("key", main_key);
  formData.append("account", account_name);
  formData.append("lcode", main_lcode);
  formData.append("name", name);
  formData.append("pricing", variation);
  formData.append("price", price);
  formData.append("tax", tax);
  formData.append("type", type);
  formData.append("daily", daily);
  formData.append("description", description);
  formData.append("dfrom", dfrom);
  formData.append("dto", dto);
  formData.append("restriction", restriction);
  formData.append("rooms", JSON.stringify(rooms));
  formData.append("specific_rooms", JSON.stringify(specific_rooms));
  var file = $("#new_extra_image_file")[0].files[0];
  if (!file){
    formData.append("img_link", 1);
    if($("#new_extra_predefined").val() != -1){
      formData.append("image", $("#new_extra_image_container img").attr("src"));
    }
  }
  else {
    formData.append("image", file);
  }
  // Call
  $.ajax({
    type: 'POST',
    url: api_link + 'insert/extra',
    data: formData,
    processData: false,
    contentType: false,
    success: function(rezultat){
      $(".button_loader").removeClass("button_loader");
      var sve = check_json(rezultat);
      if(sve.status !== "ok"){
        add_change_error(sve.status);
        return;
      }
      add_change(`Dodat dodatak ${name}`, sve.data.id); // Add changelog
      get_extras(); // Refresh data
    },
    error: function(xhr, textStatus, errorThrown){
      $(".button_loader").removeClass("button_loader");
      window.alert("Doslo je do greske. " + xhr.responseText);
    }
  });
});
// Edit
function edit_extra_period_type_change(){ // Show correct period inputs without clearing values
  let val = $("#edit_extra_period_type").attr("data-value");
  if(val == 1){
    $("#edit_extra_dates").hide();
    $("#edit_extra_restrictions").fadeIn(200);
  }
  else {
    $("#edit_extra_restrictions").hide();
    $("#edit_extra_dates").fadeIn(200);
  }
}
$("body").on("click", "#edit_extra_period_type", edit_extra_period_type_change); // On checkbox click
$("body").on("change", "#edit_extra_type", function(){ // Show / Hide daily input without clearing
  let val = $(this).val();
  if(val == 'one') {
    $("#edit_extra_daily_container").hide();
  }
  else {
    $("#edit_extra_daily_container").fadeIn(200);
  }
});
$("#extras_list").on("click", ".edit", function(){
  let row_id = $(this).closest(".extra")[0].id;
  if($("#edit_extra_container").length && $(`#${row_id}`).hasClass("selected")){ // This plan edit is open
    return;
  }
  else {
    $("#edit_extra_container").remove();
    $(".extra.selected").removeClass("selected");
    $(`#${row_id}`).addClass("selected");
    // Plan id
    let id = row_id.split("_");
    id = id[id.length - 1];
    let extra = extras_map[id];
    $(`#${row_id}`).after(`
      <div id='edit_extra_container'>
        <input type='hidden' id='edit_extra_id' value='${id}'>
        <div class='flex_between'>
          <div class="vert_center">
            <div>Naziv</div>
            <input type='text' class='text_input' id='edit_extra_name' value='${extra.name}'>
          </div>
        </div>
        <div class='flex_between'>
          <div class="vert_center">
            <div>Varijacija</div>
            <select class='basic_select' id='edit_extra_variation'>
              <option value=-1> Smanjenje </option>
              <option value=1> Povećanje </option>
            </select>
          </div>
          <div class="vert_center">
            <div>Cena</div>
            <input type='number' class='number_input' id='edit_extra_price' value='${extra.price}'>
          </div>
        </div>
        <div class="flex_between">
          <div>Porez (%)</div>
          <input type='number' class='number_input' id='edit_extra_tax' value='${extra.tax}'>
        </div>
        <div class="flex_between">
          <div class="vert_center">
            <div> Tip </div>
            <select class='basic_select' id='edit_extra_type'>
              <option value='room'> Po sobi </option>
              <option value='person'> Po osobi </option>
              <option value='one'> Jednokratno </option>
            </select>
          </div>
          <div class="flex_center" id='edit_extra_daily_container'>
            <div class="custom_checkbox dynamic" id="edit_extra_daily" data-value="0"> <img class="checkbox_value"> </div>
            Dnevno
          </div>
        </div>
        <div class='flex_between'>
          <div>Uključeno u cenu</div>
          <select class='basic_select real_room_select' id='edit_extra_rooms' multiple='multiple'>
          </select>
        </div>
        <div class='flex_between'>
          <div>Samo za određene jedinice</div>
          <select class='basic_select real_room_select' id='edit_extra_specific_rooms' multiple='multiple'>
          </select>
        </div>
        <div class="flex_between">
          <div> Period po planu restrikcija </div>
          <div class='custom_checkbox dynamic' id='edit_extra_period_type' data-value=0> <img class='checkbox_value'> </div>
        </div>
        <div class='flex_between' id='edit_extra_dates'>
          <div>Period</div>
          <div class='flex_end'>
            <input type='text' class='calendar_input filter_dfrom_calendar' readonly id='edit_extra_dfrom'>
            <input type='text' class='calendar_input filter_dto_calendar' readonly id='edit_extra_dto'>
          </div>
        </div>
        <div class='flex_between' id='edit_extra_restrictions'>
          <div>Plan restrikcija</div>
          <select class='basic_select daily_restriction_select' id='edit_extra_restriction'>
          </select>
        </div>
        <div class='flex_between'>
          <div>Slika</div>
          <div class='flex_center'>
            <div class='image_input_container' id='edit_extra_image_container'>
              <img class='image_input_image' src='${extra.image}'>
              <div class='image_input_cancel'>Ukloni</div>
            </div>
            <input type='file' class='image_input_file' id='edit_extra_image_file'>
            <button class='add_button image_input' id='edit_extra_image'> + </button>
          </div>
        </div>
        <div class='flex_between'>
          <div>Opis</div>
          <textarea class='textarea_input' id='edit_extra_description' value='${extra.description}'></textarea>
        </div>
        <div class='flex_center'>
          <button class='cancel_button' id='edit_extra_cancel'> PONIŠTI </button>
          <button class='confirm_button' id='edit_extra_confirm'> SAČUVAJ </button>
        </div>
      </div>`);
      // Add values
      $("#edit_extra_container .basic_select").select2({
          minimumResultsForSearch: Infinity,
          width: "element"
      });
      $("#edit_extra_rooms").select2({
          placeholder: "Izaberi jedinice",
          minimumResultsForSearch: Infinity,
          width: "element",
          allowClear: true,
          templateSelection: function(state){
            if(!state.id || rooms_map[state.id] == undefined){
              return state.text;
            }
            return rooms_map[state.id].shortname;
          }
      });
      $("#edit_extra_specific_rooms").select2({
          placeholder: "Izaberi jedinice",
          minimumResultsForSearch: Infinity,
          width: "element",
          allowClear: true,
          templateSelection: function(state){
            if(!state.id || rooms_map[state.id] == undefined){
              return state.text;
            }
            return rooms_map[state.id].shortname;
          }
      });
      $("#edit_extra_variation").val(extra.pricing).change();
      $("#edit_extra_type").val(extra.type).change();
      set_checkbox("edit_extra_daily", extra.daily);
      $("#edit_extra_description").val(extra.description);
      let period_val = extra.restriction_plan == 0 ? 0 : 1;
      set_checkbox("edit_extra_period_type", period_val);
      edit_extra_period_type_change();
      for(var i=0;i<restriction_plans_list.length;i++){ // Append options

        if(restriction_plans_map[restriction_plans_list[i]]["type"] == "daily")
          $("#edit_extra_restriction").append(`<option value=${restriction_plans_list[i]} class='restriction_option'> ${restriction_plans_map[restriction_plans_list[i]]["name"]} </option>`);
      }
      $("#edit_extra_dfrom").datepicker({
          language: "en",
          dateFormat: "dd-M-yyyy",
          disableNavWhenOutOfRange: true,
          autoClose: true,
          position: "bottom right",
          onShow: function(inst, animationCompleted) {
            if(animationCompleted){
              open_calendar = inst.el.id;
            }
          },
          onHide: function(inst, animationCompleted) {
            if(animationCompleted === false){
              open_calendar = "";
            }
          }
        });
      $("#edit_extra_dto").datepicker({
            language: "en",
            dateFormat: "dd-M-yyyy",
            disableNavWhenOutOfRange: true,
            autoClose: true,
            position: "bottom right",
            onShow: function(inst, animationCompleted) {
              if(animationCompleted){
                open_calendar = inst.el.id;
              }
            },
            onHide: function(inst, animationCompleted) {
              if(animationCompleted === false){
                open_calendar = "";
              }
            }
          });
      if(period_val){
        $("#edit_extra_restriction").val(period_val).change();
      }
      else {
        $("#edit_extra_dfrom").datepicker().data('datepicker').selectDate(new Date(extra.dfrom));
        $("#edit_extra_dto").datepicker().data('datepicker').selectDate(new Date(extra.dto));
      }
      for(var i=0;i<real_rooms_list.length;i++){
        $("#edit_extra_rooms").append(`<option value=${real_rooms_list[i]} class='room_option'> ${rooms_map[real_rooms_list[i]]["name"]} </option>`);
        $("#edit_extra_specific_rooms").append(`<option value=${real_rooms_list[i]} class='room_option'> ${rooms_map[real_rooms_list[i]]["name"]} </option>`);
      }
      if(extra.image == "")
        $("#edit_extra_image_container").hide();
      else
        $("#edit_extra_image").hide();
      $("#edit_extra_rooms").val(extra.rooms).change();
      $("#edit_extra_specific_rooms").val(extra.specific_rooms).change();
  }
  $("#new_extra_cancel").click(); // Hide new extra form
});
$("body").on("click", "#edit_extra_cancel", function(){
  $("#edit_extra_container").remove();
  $(".extra.selected").removeClass("selected");
});
$("body").on("click", "#edit_extra_confirm", function(){
  $("#edit_extra_confirm, #edit_extra_cancel").addClass("button_loader");
  // Parameters
  let id = $("#edit_extra_id").val();
  let name = $("#edit_extra_name").val();
  let variation = $("#edit_extra_variation").val();
  let price = $("#edit_extra_price").val();
  let tax = $("#edit_extra_tax").val();
  let type = $("#edit_extra_type").val();
  let daily = $("#edit_extra_daily").attr("data-value");
  if(type == 'one')
    daily = 0;
  let description = $("#edit_extra_description").val();
  let dfrom = '0001-01-01';
  let dto = '0001-01-01';
  let restriction = '0';
  if($("#edit_extra_period_type").attr("data-value") == 1){
    restriction = $("#edit_extra_restriction").val();
  }
  else {
    dfrom = date_to_iso($("#edit_extra_dfrom").datepicker().data('datepicker').selectedDates[0]);
    dto = date_to_iso($("#edit_extra_dto").datepicker().data('datepicker').selectedDates[0]);
  }
  let rooms = $("#edit_extra_rooms").val();
  let specific_rooms = $("#edit_extra_specific_rooms").val();
  // Form data with image
  var formData = new FormData();
  formData.append("key", main_key);
  formData.append("account", account_name);
  formData.append("lcode", main_lcode);
  formData.append("id", id);
  formData.append("name", name);
  formData.append("pricing", variation);
  formData.append("price", price);
  formData.append("tax", tax);
  formData.append("type", type);
  formData.append("daily", daily);
  formData.append("description", description);
  formData.append("dfrom", dfrom);
  formData.append("dto", dto);
  formData.append("restriction", restriction);
  formData.append("rooms", JSON.stringify(rooms));
  formData.append("specific_rooms", JSON.stringify(specific_rooms));
  var file = $("#edit_extra_image_file")[0].files[0];
  if (!file){
    formData.append("img_link", 1);
    formData.append("image", $("#edit_extra_image_container img").attr("src"));
  }
  else {
    formData.append("image", file);
  }
  // Call
  $.ajax({
    type: 'POST',
    url: api_link + 'edit/extra',
    data: formData,
    processData: false,
    contentType: false,
    success: function(rezultat){
      $(".button_loader").removeClass("button_loader");
      var sve = check_json(rezultat);
      if(sve.status !== "ok"){
        add_change_error(sve.status);
        return;
      }
      add_change(`Izmenjen dodatak ${name}`, sve.data.id); // Add changelog
      get_extras(); // Refresh data
    },
    error: function(xhr, textStatus, errorThrown){
      $(".button_loader").removeClass("button_loader");
      window.alert("Doslo je do greske. " + xhr.responseText);
    }
  });
});
// Delete
$("#extras_list").on("click", ".delete", function(){ // Show dialog and delete
  let row_id = $(this).closest(".extra")[0].id;
  let id = row_id.split("_");
  id = id[id.length - 1];
  let extra = extras_map[id];
  if(confirm(`Da li želite da obrišete dodatak ${extra.name}`)){
    $("#extras_list").html(loader_html()); // Temp loader with JS dialog
    $("#new_extra").hide();
    $("#new_extra_container").hide();
    $.ajax({
      type: 'POST',
      url: api_link + 'delete/extra',
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
        add_change(`Obrisan dodatak ${extra.name}`, sve.data.id); // Add changelog
        get_extras(); // Refresh data
      },
      error: function(xhr, textStatus, errorThrown){
        window.alert("Doslo je do greske. " + xhr.responseText);
      }
    });
  }
});

// Channels

// New

$("#new_channel").click(function(){ // Clear values and show form

  $("#new_channel_commission").val(0);
  $("#new_channel_name").val("");

  $("#new_channel_container").show();
  $("#new_channel").hide();

  $("#edit_channel_container").remove();
  $(".channel.selected").removeClass("selected"); // Hide open edits
});
$("#new_channel_cancel").click(function(){ // Hide form
  $("#new_channel_container").hide();
  $("#new_channel").show();
});
$("#new_channel_confirm").click(function(){
  // Loaders
  $("#new_channel_confirm, #new_channel_cancel").addClass("button_loader");
  // Parameters
  let name = $("#new_channel_name").val();
  let commission = $("#new_channel_commission").val();
  // Call
  $.ajax({
    type: 'POST',
    url: api_link + 'insert/channel',
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      name: name,
      commission: commission
    },
    success: function(rezultat){
      $(".button_loader").removeClass("button_loader");
      var sve = check_json(rezultat);
      if(sve.status !== "ok"){
        add_change_error(sve.status);
        return;
      }
      add_change(`Dodat kanal ${name}`, sve.data.id); // Add changelog
      get_channels(); // Refresh data
    },
    error: function(xhr, textStatus, errorThrown){
      $(".button_loader").removeClass("button_loader");
      window.alert("Doslo je do greske. " + xhr.responseText);
    }
  });
});
// Edit
$("#channels_list").on("click", ".edit", function(){
  let row_id = $(this).closest(".channel")[0].id;
  if($("#edit_channel_container").length && $(`#${row_id}`).hasClass("selected")){ // This plan edit is open
    return;
  }
  else {
    $("#edit_channel_container").remove();
    $(".channel.selected").removeClass("selected");
    $(`#${row_id}`).addClass("selected");
    // Plan id
    let id = row_id.split("_");
    id = id[id.length - 1];
    let channel = channels_map[id];
    $(`#${row_id}`).after(`
      <div id='edit_channel_container'>
        <input type='hidden' id='edit_channel_id' value='${id}'>
        <div class='flex_between'>
          <div>Naziv</div>
          <input type='text' class='text_input' id='edit_channel_name' value='${channel.name}'>
        </div>
        <div class='flex_between'>
          <div>Provizija (%)</div>
          <input type='number' class='number_input' id='edit_channel_commission' value='${channel.commission}'>
        </div>
        <div class='flex_center'>
          <button class='cancel_button' id='edit_channel_cancel'> PONIŠTI </button>
          <button class='confirm_button' id='edit_channel_confirm'> SAČUVAJ </button>
        </div>
      </div>`);
    $("#new_channel_cancel").click(); // Hide new channel form
  }
});
$("body").on("click", "#edit_channel_cancel", function(){ // Hide form
  $("#edit_channel_container").remove();
  $(".channel.selected").removeClass("selected");
});
$("body").on("click", "#edit_channel_confirm", function(){
  $("#edit_channel_confirm, #edit_channel_cancel").addClass("button_loader");
  // Parameters
  let id = $("#edit_channel_id").val();
  let name = $("#edit_channel_name").val();
  let commission = $("#edit_channel_commission").val();
  // Call
  $.ajax({
    type: 'POST',
    url: api_link + 'edit/channel',
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      id: id,
      name: name,
      commission: commission
    },
    success: function(rezultat){
      $(".button_loader").removeClass("button_loader");
      var sve = check_json(rezultat);
      if(sve.status !== "ok"){
        add_change_error(sve.status);
        return;
      }
      add_change(`Izmenjen kanal ${name}`, sve.data.id); // Add changelog
      get_channels(); // Refresh data
    },
    error: function(xhr, textStatus, errorThrown){
      $(".button_loader").removeClass("button_loader");
      window.alert("Doslo je do greske. " + xhr.responseText);
    }
  });
});

// Delete
$("#channels_list").on("click", ".delete", function(){ // Show dialog and delete
  let row_id = $(this).closest(".channel")[0].id;
  let id = row_id.split("_");
  id = id[id.length - 1];
  let channel = channels_map[id];
  if(confirm(`Da li želite da obrišete kanal ${channel.name}`)){
    $("#channels_list").html(loader_html()); // Temp loader with JS dialog
    $("#new_channel").hide();
    $("#new_channel_container").hide();
    $.ajax({
      type: 'POST',
      url: api_link + 'delete/channel',
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
        add_change(`Obrisan kanal ${channel.name}`, sve.data.id); // Add changelog
        get_channels(); // Refresh data
      },
      error: function(xhr, textStatus, errorThrown){
        window.alert("Doslo je do greske. " + xhr.responseText);
      }
    });
  }
});

});

function get_rooms(){
  $.ajax({
    url: api_link + 'data/rooms/',
    method: 'POST',
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode
    },
    success: function(rezultat){
      var sve = check_json(rezultat);
      if(sve.status !== "ok") {
        add_change_error(sve.status);
        return;
      }
      // Clear data
      rooms_list = [];
      real_rooms_list = [];
      rooms_map = {};
      // Save data
      var rooms = sve.rooms;
      for(var i=0;i<rooms.length;i++){
        rooms_list.push(rooms[i].id);
        rooms_map[rooms[i].id] = rooms[i];
        if(rooms_map[rooms[i].id].parent_room == "0")
          real_rooms_list.push(rooms[i].id);
      }
      display_rooms();
    },
    error: function(xhr, textStatus, errorThrown){
      // Loading
      $("#login_confirm").removeClass("button_loader");
      window.alert("Doslo je do greske. " + xhr.responseText);
    }
  });
}

function display_rooms(){
  // Selects
  $(".room_option").remove();
  for(var i=0;i<rooms_list.length;i++){
    $(".room_select").append(`<option value=${rooms_list[i]} class='room_option'> ${rooms_map[rooms_list[i]]["name"]} </option>`);
  }
  for(var i=0;i<real_rooms_list.length;i++){
    $(".real_room_select").append(`<option value=${real_rooms_list[i]} class='room_option'> ${rooms_map[real_rooms_list[i]]["name"]} </option>`);
    // Room numbers selects
    for(let j=0;j<rooms_map[real_rooms_list[i]].room_numbers.length;j++){
      $(".room_numbers_select").append(`<option value=${real_rooms_list[i]}_${j} class='room_option'> ${rooms_map[real_rooms_list[i]].room_numbers[j]} </option>`);
    }
  }
  $("#room_settings_cancel").click(); // Hide form
}

function get_extras(){
  $.ajax({
    url: api_link + 'data/extras/',
    method: 'POST',
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode
    },
    success: function(rezultat){
      var sve = check_json(rezultat);
      if(sve.status !== "ok") {
        add_change_error(sve.status);
        return;
      }
      // Clear data
      extras_list = [];
      extras_map = {};
      var extras = sve.extras;
      for(var i=0;i<extras.length;i++){
        extras_list.push(extras[i].id);
        extras_map[extras[i].id] = extras[i];
      }
      display_extras();
    },
    error: function(xhr, textStatus, errorThrown){
      // Loading
      $("#login_confirm").removeClass("button_loader");
      window.alert("Doslo je do greske. " + xhr.responseText);
    }
  });
}

function display_extras(){
  // List
  $("#edit_extra_cancel").click();
  $("#new_extra_cancel").click(); // Hide forms
  $("#extras_list").empty();
  for(let i=0;i<extras_list.length;i++){
    let extra = extras_map[extras_list[i]];
    // Data
    let id = extra.id;
    let name = extra.name;
    let price = extra.price * extra.pricing;
    let type = extra.type;
    if(type == "room")
      type = "Po sobi";
    else if(type == "person")
      type = "Po osobi";
    else if(type == "one")
      type = "Jednokratno";
    var extra_edit = `<div class='list_action'><img class='list_action_icon edit' title='Izmeni'> </div>`;
    var extra_delete = `<div class='list_action'><img class='list_action_icon delete' title='Obriši'> </div>`;
    $("#extras_list").append(`
      <div class="list_row extra" id='extras_list_${id}'>
        <div class='extra_name'> ${name} </div>
        <div class='extra_type'> ${type} </div>
        <div class='extra_price'> ${price} EUR </div>
        <div class='extra_actions'> ${extra_edit} ${extra_delete} </div>
      </div>`);
  }
  if(extras_list.length > 0)
    $("#extras_list").prepend(`
    <div class="list_names">
    <div class='extra_name'> Naziv </div>
    <div class='extra_type'> Tip </div>
    <div class='extra_price'> Cena </div>
      <div class='extra_actions'> Akcije </div>
    </div>`);
};

function get_channels(){
  $.ajax({
    url: api_link + 'data/channels/',
    method: 'POST',
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode
    },
    success: function(rezultat){
      var sve = check_json(rezultat);
      if(sve.status !== "ok") {
        add_change_error(sve.status);
        return;
      }
      // Clear data
      channels_list = [];
      channels_map = {};
      var channels = sve.channels;
      for(var i=0;i<channels.length;i++){
        channels_list.push(channels[i].id);
        channels_map[channels[i].id] = channels[i];
      }
      display_channels();
    },
    error: function(xhr, textStatus, errorThrown){
      // Loading
      $("#login_confirm").removeClass("button_loader");
      window.alert("Doslo je do greske. " + xhr.responseText);
    }
  });
}

function display_channels(){
  // Select
  $(".channel_option").remove();
  $(".channel_select").append(`<option value='-1' class='channel_option'> <img src='img/ota/youbook.png'> Privatna rezervacija </option>`);
  for(var i=0;i<channels_list.length;i++){
    $(".channel_select").append(`<option value=${channels_list[i]} class='channel_option'> <img src='${channels_map[channels_list[i]]["logo"]}'> ${channels_map[channels_list[i]]["name"]} </option>`);
  }
  // Reservation select
  $("#form_res_channel_ul").empty();
  $("#form_res_channel_ul").append(`<li value="-1" data-link="Private reservation">Privatna rezervacija</li>`);
  for(var i=0;i<channels_list.length;i++){
    $("#form_res_channel_ul").append(`<li value=${channels_list[i]} data-link="${channels_map[channels_list[i]]["name"]}"'> ${channels_map[channels_list[i]]["name"]} </option>`);
  }
  // List
  $("#edit_channel_cancel").click();
  $("#new_channel_cancel").click(); // Hide forms
  $("#channels_list").empty();
  for(let i=0;i<channels_list.length;i++){
    let channel = channels_map[channels_list[i]];
    // Data
    let id = channel.id;
    let channel_logo = channel.logo;
    let name = channel.name;
    let commission = channel.commission;
    var channel_edit = `<div class='list_action'><img class='list_action_icon edit' title='Izmeni'> </div>`;
    var channel_delete = `<div class='list_action'><img class='list_action_icon delete' title='Obriši'> </div>`;
    if(channel.created_by == "Wubook")
      channel_delete = "";
    $("#channels_list").append(`
      <div class="list_row channel" id='channels_list_${id}'>
        <div class='channel_logo'> <img src='${channel_logo}'> </div>
        <div class='channel_name'> ${name} </div>
        <div class='channel_commission'> ${commission}% </div>
        <div class='channel_actions'> ${channel_edit} ${channel_delete} </div>
      </div>`);
  }
  if(channels_list.length == 0)
    $("#channels_list").append(empty_html("Nema prodajnih kanala"));
  else
    $("#channels_list").prepend(`
    <div class="list_names">
      <div class='channel_logo'> </div>
      <div class='channel_name'> Naziv </div>
      <div class='channel_commission'> Provizija </div>
      <div class='channel_actions'> Akcije </div>
    </div>`);
};
