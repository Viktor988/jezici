//var api_link="http://localhost/otasync-v3-Za-Jezike/EN/"
// File select Init
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileEncode
);
const pond = FilePond.create(
  document.querySelector('#room_settings_images')
);
// Select2 Init
$("#room_settings_amenities").select2({
  placeholder: "Select amenities",
  tags: true,
  width: 'resolve',
  closeOnSelect: false
});

// Displays room numbers inputs
function showUnitNums(){
  let roomNum = $("#room_settings_availability").val();
  if(isNaN(roomNum) || roomNum == '' || roomNum < 0){
    $("#room_settings_availability").addClass("is-invalid");
    roomNum=0;
  } else {
    $("#room_settings_availability").removeClass("is-invalid");
  }
  $("#roomNumbers").empty();
  if(roomNum > 0){
    $("#roomNumbers").append(`<div class="col-md-12" style="padding:5px;"><p>Room numbers:</p></div>`).hide().show('fast');
  }
  for(let i = 1; i <= roomNum; i++){
    $("#roomNumbers").append(`<div class="col-md-2"><input type=number id="unitNum-${i}" style="margin-bottom: 10px;" class="form-control rounded" value="${i}"></div>`).hide().show('fast');
  }
  //$('[data-toggle="tooltip"]').tooltip()
}
// Displays houserooms inputs
function showRoomInfo(){
  let roomNum = $("#room_settings_houserooms").val();
  if(isNaN(roomNum) || roomNum == '' || roomNum < 0){
    $("#room_settings_houserooms").addClass("is-invalid");
    roomNum=0;
  } else {
    $("#room_settings_houserooms").removeClass("is-invalid");
  }
  $("#roomDesc").hide('slow').empty();
  if(roomNum > 0){
    $("#roomDesc").append(`<div class="col-md-12" style="padding:5px;"><p>Houserooms info:</p></div>`).hide().show('fast');
  }
  for(let i = 1; i <= roomNum; i++){
    $("#roomDesc").append(`<div class="col-md-6"><div class="form-group">
    <label class="has-float-label"><select class="form-control rounded" id="roomType-${i}">
    <option value="Bedroom" selected>Bedroom</option>
    <option value="Living Area">Living Area</option>
  </select><span>Room Type</span></label></div></div>`).hide().show('fast');
    $("#roomDesc").append(`<div class="col-md-6"><div class="form-group">
    <label class="has-float-label"><input type=number id="bedNum-${i}" style="margin-bottom: 10px;" class="form-control rounded" placeholder="&nbsp" onchange="showBedDesc(${i})"><span>Number of beds</span></label></div>
    </div>`).hide().show('fast');
    $("#roomDesc").append(`<div class="col-md-1"></div><div class="col-md-10"><div class="row" id="bedDesc-${i}" ></div></div>`).hide().show('fast');
  }
  //$('[data-toggle="tooltip"]').tooltip()
}
// Displays beds inputs per houseroom
function showBedDesc(id){
  let bedDesc = "#bedDesc-" + id;
  let bedNum = $("#bedNum-"+id).val();
  if(isNaN(bedNum) || bedNum == '' || bedNum < 0){
    $("#bedNum-"+id).addClass("is-invalid");
    bedNum=0;
  } else {
    $("#bedNum-"+id).removeClass("is-invalid");
  }
  $(bedDesc).empty();
  if(bedNum > 0){
    $(bedDesc).append(`<div class="col-md-12" style="padding:5px;"><p>Beds Info:</p></div>`).hide().show('fast');

  }
  for(let i = 1; i <= bedNum; i++){
    $(bedDesc).append(`<div class="col-md-4"><div class="form-group">
    <label class="has-float-label"><select class="form-control rounded" id="bedType-${id}-${i}" style="margin-bottom: 10px;">
    <option value="Queen Bed" selected>Queen Bed</option>
    <option value="Double Bed">Double Bed</option>
    <option value="Single Bed">Single Bed</option>
    <option value="Bunk Bed">Bunk Bed</option>
    <option value="Single Sofa Bed">Single Sofa Bed</option>
    <option value="Double Sofa Bed">Double Sofa Bed</option>
  </select><span>Bed Type</span></label></div></div>`).hide().show('fast');
  }
}
// Displays price per person inputs
function showPricePerPerson() {
  if($("#room_settings_variations").is(":checked")) {
    $("#pricePerPerson").show("slow");
  } else {
    $("#pricePerPerson").hide("slow");
  }
}
// Updates price per person info on occupancy change
function handleOccupancyChange() {
  numOfGuests = $("#room_settings_occupancy").val();
  if(isNaN(numOfGuests) || numOfGuests == '' || numOfGuests < 0){
    $("#room_settings_occupancy").addClass("is-invalid");
    numOfGuests=0;
  } else {
    $("#room_settings_occupancy").removeClass("is-invalid");
  }
  $("#per-person-price option:eq(1)").text(numOfGuests + " people")
}


function checkAlpha(str) {
  return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-_]+$/u.test(str);
}
function checkAlphaNum(str) {
  return /^[a-z0-9A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-_]+$/u.test(str);
}
function checkFloat(str) {
  return /^[+-]?\d+(\.\d+)?$/.test(str);
}


$(document).ready(function(){

  // New
  $("#new_room").click(function(){ // Clear values and show form
    var idlan=$("#lan").val();
    $("#room_settings_header").hide(); // Hide edit select
    $("#new_room").hide(); // Hide button
    $("#delete_room").show();
    if(idlan==1 || idlan=='-1'){
    $("#room_settings_inputs").fadeIn(200);
    pond.removeFiles();
    pond.addFiles([]);
    var elements = document.getElementsByTagName("input");
    for (let i=0; i < elements.length; i++) {
        elements[i].value = "";
    }
    $( "#room_settings_engine" ).prop( "checked", false );
    $( "#room_settings_variations" ).prop( "checked", false );
    $("#pricePerPerson").hide();
    $("#room_settings_amenities").val([]).change();
    $("#room_settings_description").val('');
  }
  else{
    $("#addanotherroom").css('display','block');
    $("#updatedForm").css('display','none');
    var id=$("#lan").val();
  $.ajax({
    url: api_link + "data/showinsertform",
    method: 'POST',
    data:{
      key: main_key,
      lcode: main_lcode,
      account: account_name,
      id:id
    },
    success:function(c){
      var x=check_json(c);
   
      let ispisSobe=``
      for(var a of x.language){
        ispisSobe+=`<option value='${a.id}'>${a.name}</option>`
      }
      $("#roomsmore").html(ispisSobe);



}})
   
    
   
  }
  });




             
            
            
          



  
  // Edit
  $("#room_settings_active").change(function(){
    let id = $(this).val();
    if(id == -1){ // Hide form and show new room button
      $("#room_settings_header").show();
      $("#room_settings_inputs").hide();
      $("#new_room").fadeIn(200);
      $("#delete_room").hide();
    }
    else {
      $("#new_room").hide();
      $("#delete_room").show();
      $("#room_settings_inputs").fadeIn(200);

      let room = rooms_map[id];


      $("#room_settings_name").val(room.name);
      $("#room_settings_shortname").val(room.shortname);
      $("#room_settings_type").val(room.type).change();
      $("#room_settings_price").val(room.price);
      $("#room_settings_availability").val(room.availability).change();
      $("#room_settings_occupancy").val(room.occupancy).change();
      $("#room_settings_area").val(room.area);
      $("#room_settings_bathrooms").val(room.bathrooms);
      $( "#room_settings_engine" ).prop( "checked", room.booking_engine == 1 );
      $("#room_settings_houserooms").val(room.houserooms.length == 0 ? 0 : room.houserooms.length).change();
      $("#room_settings_description").val(room.description);
      $("#room_settings_amenities").val(room.amenities).change();

      for(let i = 0 ;i < room.houserooms.length; i++){
        $(`#bedNum-${i+1}`).val(room.houserooms[i].beds.length)
        $(`#roomType-${i}`).val(room.houserooms[i].name);
        showBedDesc(i+1);
        let beds = room.houserooms[i].beds.length;
        for(let j = 0 ;j < beds; j++){
          $(`#bedType-${i+1}-${j+1}`).val(room.houserooms[i].beds[j]);
        }
      }
      for(let i = 0; i < room.room_numbers.length; i++){
        $(`#unitNum-${i+1}`).val(room.room_numbers[i]);
      }
      if(parseInt(room.additional_prices['active'])){
        $( "#room_settings_variations" ).prop( "checked", true );
        if(parseFloat(room.additional_prices['variation']) < 0){
          $("#per-person-price-value").val(-parseFloat(room.additional_prices['variation']));
          $("#per-person-price-sign").val("-");
          console.log(parseFloat(room.additional_prices['variation']))
        }
        else{
          $("#per-person-price-value").val(parseFloat(room.additional_prices['variation']));
          $("#per-person-price-sign").val("+");
          console.log(parseFloat(room.additional_prices['variation']))

        }
        if(parseInt(room.additional_prices['default']) > 1){
          $("#per-person-price").val("n-person");
        }
        else{
          $("#per-person-price").val("one-person");
        }
       }
       else {
         $( "#room_settings_variations" ).prop( "checked", false );
       }
       showPricePerPerson();

       pond.removeFiles();
       pond.addFiles([]);
      if(room.images) {
        pond.addFiles(room.images);
      }
    }
  });


  // Cancel
  $("#room_settings_cancel").click(function(){
    $("#room_settings_inputs").hide();
    $("#room_settings_active").val(-1).change();
    $("#room_settings_header").css("display",'flex')
    $("#delete_room").css("display",'none')
    $("#new_room").css("display",'block')

  });

  $("#roommore_settings_cancel").click(function(){
    $("#room_settings_inputs").hide();
    $("#addanotherroom").css('display','none');
    $("#room_settings_active").val(-1).change();
  });
  // Update
  $("#room_settings_confirm").click(function(){
    // Loaders
    $("#room_settings_confirm, #room_settings_cancel").addClass("button_loader");
    // Parameters
    let id = $("#room_settings_active").val();

    formValid = true;

    let name = $("#room_settings_name").val();
    if (name == "" || !checkAlphaNum(name)) {
      $("#room_settings_name").addClass("is-invalid");
      formValid = false;
    }
    else {
      $("#room_settings_name").removeClass("is-invalid");
    }

    let shortname = $("#room_settings_shortname").val();
    if (shortname == "" || !checkAlphaNum(shortname)) {
      $("#room_settings_shortname").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_shortname").removeClass("is-invalid");
    }

    let type = $("#room_settings_type").val();
    if (type == "" || !checkAlpha(type)) {
      $("#room_settings_type").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_type").removeClass("is-invalid");
    }

    let price = $("#room_settings_price").val();
    if (price == "" || !checkFloat(price)) {
      $("#room_settings_price").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_price").removeClass("is-invalid");
    }

    let availability = $("#room_settings_availability").val();
    if (availability == "" || !checkFloat(availability)) {
      $("#room_settings_availability").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_availability").removeClass("is-invalid");
    }

    let booking_engine = $("#room_settings_engine").is(":checked") ? 1 : 0;

    let occupancy = $("#room_settings_occupancy").val();
    if (occupancy == "" || !checkFloat(occupancy)) {
      $("#room_settings_occupancy").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_occupancy").removeClass("is-invalid");
    }

    let area = $("#room_settings_area").val();
    if (area == "" || !checkFloat(area)) {
      $("#room_settings_area").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_area").removeClass("is-invalid");
    }

    let bathrooms = $("#room_settings_bathrooms").val();
    if (bathrooms == "" || !checkFloat(bathrooms)) {
      $("#room_settings_bathrooms").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_bathrooms").removeClass("is-invalid");
    }

    let houserooms = $("#room_settings_houserooms").val();
    if (houserooms == "" || !checkFloat(houserooms)) {
      $("#room_settings_houserooms").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_houserooms").removeClass("is-invalid");
    }

    let houserooms_struct = [];
    for(let i = 1 ;i <= houserooms; i++){
      let houseroom_struct = {};
      houseroom_struct.name = $(`#roomType-${i}`).val();
      let beds = $(`#bedNum-${i}`).val();
      if(isNaN(beds) || beds == "" || beds < 0)
        beds = 0;
      let beds_struct = [];
      for(let j = 1 ;j <= beds; j++){
        beds_struct.push($(`#bedType-${i}-${j}`).val());
      }
      houseroom_struct.beds = beds_struct;
      houserooms_struct.push(houseroom_struct);
    }

    let pricePerPerson = $("#room_settings_variations").is(":checked");
    let additional_prices = {};
    if(pricePerPerson) {
        let variation = $("#per-person-price-value").val();
        if (variation == "" || !checkFloat(variation)) {
          $("#per-person-price-value").addClass("is-invalid");
          formValid = false;
        } else {
          $("#per-person-price-value").removeClass("is-invalid");
        }
        if($("#per-person-price-sign").val() == '-') {
          variation = -1*variation;
        }
        let defaultOccupancy = 1;
        if($("#per-person-price").val() == 'n-person'){
          defaultOccupancy = occupancy
        }
        additional_prices = {
          active: 1,
          default: defaultOccupancy,
          variation: variation,
          variation_type: $("#per-person-price-type").val()
        }
    } else {
      additional_prices = {
        active: 0,
        default: occupancy,
        variation: 0,
        variation_type: 'fixed'
      }
    }


    let room_numbers = [];
    for(let i = 1; i <= availability; i++){
      room_numbers.push($(`#unitNum-${i}`).val());
    }
    room_numbers = room_numbers.join(",");

    let description = $("#room_settings_description").val();
    if (description == "" || !checkAlphaNum(description)) {
      $("#room_settings_description").addClass("is-invalid");
      formValid = false;
    } else {
      $("#room_settings_description").removeClass("is-invalid");
    }

    let amenities = $("#room_settings_amenities").val();

    let images = pond.getFiles();
    for(let i=0;i<images.length;i++){
      images[i] = images[i].getFileEncodeDataURL();
    }

    if(!formValid){
      $(".button_loader").removeClass("button_loader");
      return;
    }

    // Formating and adding images
    let formData = new FormData();
    formData.append("key", main_key);
    formData.append("account", account_name);
    formData.append("lcode", main_lcode);
    formData.append("id", id);
    formData.append("name", name);
    formData.append("shortname", shortname);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("availability", availability);
    formData.append("booking_engine", booking_engine);
    formData.append("occupancy", occupancy);
    formData.append("area", area);
    formData.append("bathrooms", bathrooms);
    formData.append("houserooms", JSON.stringify(houserooms_struct));
    formData.append("additional_prices", JSON.stringify(additional_prices));
    formData.append("room_numbers", room_numbers);
    formData.append("description", description);
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("images", JSON.stringify(images));

    let action = id == -1 ? "insert" : "edit"; // Edit or insert
    $.ajax({
      type: 'POST',
      url: api_link + `${action}/room`,
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
        let change_text = id == -1 ? `Inserted room ${name} ` : `Edited room ${name}`; // Edit or insert
        add_change(change_text, sve.data.id); // Add changelog
        get_rooms(); // Refresh data
        if(action == "insert"){
          properties_map[main_lcode].custom_calendar.room_types.push(sve.data.new_data.id);
          for(let i=0;i<availability;i++){
            properties_map[main_lcode].custom_calendar.single_rooms.push(sve.data.new_data.id + "_" + i);
          }
        }
      },
      error: function(xhr, textStatus, errorThrown){
        $(".button_loader").removeClass("button_loader");
        window.alert("An error occured. " + xhr.responseText);
      }
    });
  });
  // Delete
  $("#delete_room").on("click", function(){ // Show dialog and delete
    let id = $("#room_settings_active").val();
    let room = rooms_map[id];
    if(confirm(`Are you sure you want to delete room ${room.name}`)){;
      $.ajax({
        type: 'POST',
        url: api_link + 'delete/room',
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
          add_change(`Deleted room ${room.name}`, sve.data.id); // Add changelog
          $("#room_settings_cancel").click();
          document.location.reload(); // Refresh everything because of calendar rooms

        },
        error: function(xhr, textStatus, errorThrown){
          window.alert("An error occured. " + xhr.responseText);
        }
      });
    }
  });
});
