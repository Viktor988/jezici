$(document).ready(function(){
  $("#morealanguage").select2({
    placeholder: "Select amenities",
    tags: true,
    width: 'resolve',
    closeOnSelect: false
  });
  $("#amenitesanotherlanguage").select2({
    placeholder: "Select amenities",
    tags: true,
    width: 'resolve',
    closeOnSelect: false
  });
  $("#room_settings_amenities_moree").select2({
    placeholder: "Select amenities",
    tags: true,
    width: 'resolve',
    closeOnSelect: false
  });


// var api_link="http://localhost/otasync-v3-Za-Jezike/EN/"


  


  $("#lan").change(function(){
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
     
       
        $("#addanotherroom").css('display','none');
        $("#room_settings_inputs").css("display",'none')
        $("#room_settings_header").css("display",'flex');
        $("#new_room").css("display",'block');
        $("#delete_room").css("display",'none');
        $("#updatedForm").css("display",'none');
        
      
      },
     error:function(xhr,status,error){
        console.log(xhr,status,error)
      }}
      
      
      )}
)

function showRoomsInDropDownList(){
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



}})}

// show rooms on another language
$("#lan").change(function(){

    if($(this).val()==1 || $(this).val()==-1){
      $("#selectrooms1").css('display','block');
      $("#selectrooms2").css('display','none');
    display_rooms()
    
    }
    else{
      displayRoomNew();
 }})

 function displayRoomNew(){
  $.ajax({
    url: api_link + 'data/getRoomsOnChange',
    method: 'POST',
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      id:$("#lan").val()
    },
    success: function(rezultat){

      var sve = check_json(rezultat);
      console.log(sve)
      let ispis=` <option value=-1> Select room </option>`
      for(var a of sve.rooms){
        ispis+=`<option value='${a.idRL}'>${a.nameSpecRoom}</option>`
      }
      
      $("#selectrooms1").css('display','none');
      $("#selectrooms2").css('display','block');
      $("#room_settings_activeAnotherLanguage").html(ispis);

},
error:function(xhr,status,error){
  console.log(xhr,status)
}})
 }
    $("#room_settings_activeAnotherLanguage").change(function(){
      if($(this).val()=='-1'){
        $("#delete_room").css('display','block');
        $("#updatedForm").css('display','none');
        $("#new_room").css('display','block');
        $("#delete_room").css('display','none');
      
      }
      else{
    var idroom=$(this).val();
    var idlan=$("#lan").val();
    $.ajax({
      url: api_link + 'data/getOneRoom',
      method: 'POST',
      data: {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        idroom:idroom,
        id:idlan
      },
      success: function(rezultat){
        var sve = check_json(rezultat);
  
        $("#updatedForm").css('display','block');
         $("#room_settings_nameMore").val(sve.oneRoom.nameSpecRoom)
         $("#room_description_more").val(sve.oneRoom.descriptionSpecRoom)
        //  let ispis=""
        //  for(var a of sve.typeroom){
        //   if(a.value==sve.oneRoom.typeroom){
        //     ispis+=`<option value='${a.value}' selected>${a.nameType}</option>`
        //   }
        //   else{
        //   ispis+=`<option value='${a.value}'>${a.nameType}</option>`
        //   }}
        //   $("#room_settings_type_moree").html(ispis)
        //   let ispis2=``;
        //   for(var a of sve.amenities){
        //     ispis2+=`<option value="${a.valueamenities}">${a.textamenities}</option>`
        //   }
        //   $("#room_settings_amenities_moree").html(ispis2);
         
          $("#new_room").css('display','none');
          
          $("#delete_room").css('display','block');
        
          $('#delete_room').attr('data-myval', idroom); 
          


    }})
    }})

    //delete rooms more labguage
    $('#delete_room').click(function(){
      let idroomm=$("#delete_room").data('myval');
    
      $.ajax({
        url: api_link + 'delete/deleteAnotherRoom',
        method: 'POST',
        data: {
          key: main_key,
          account: account_name,
          lcode: main_lcode,
          idroom:idroomm,
          id:id
        },
        success: function(rezultat){
     
         $("#updatedForm").css('display','none');
         $("#room_settings_header").css('display','flex');
         $("#room_settings_activeAnotherLanguage").val(-1).change();
         $("#delete_room").hide();
         $("#new_room").css('display','block');
         showRoomsInDropDownList();
         displayRoomNew();
         add_change(`Deleted room`, idroomm);
         document.location.reload(); // Refresh everything because of calendar rooms
        }

    })
  })

  $("#add_more_room_cencel").click(function(){
    $("#updatedForm").css('display','none');
    $("#room_settings_activeAnotherLanguage").val(-1).change();
    $("#delete_room").hide();
    $("#new_room").css('display','block');

  })
  //update more room
  $("#add_more_room_confirm").click(function(){
    var name=$("#room_settings_nameMore").val();
    var desc=$("#room_description_more").val();
    var idrl=$("#room_settings_activeAnotherLanguage").val();
    var greske=0;


    if(name==""){
      greske=1
    }
    if(greske==1){
      alert("Name is required!")
    }
    else{
    $.ajax({
      url: api_link + 'edit/editMoreRoom',
      method: 'POST',
      data: {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        name:name,
        desc:desc,
        idrl:idrl
      },
      success: function(rezultat){
        var sve = check_json(rezultat);
        add_change(`Edited room  ${name}`, sve.data.id); // Add changelog
        $("#updatedForm").css('display','none');
        $("#room_settings_header").css('display','flex');
        $("#room_settings_activeAnotherLanguage").val(-1).change();
        $("#delete_room").hide();
        $("#new_room").css('display','block');
        displayRoomNew();
      

      },
    error:function(xhr,status,error){
      console.log(xhr,status)
    }
    
  })

    }

  })

    $("#addmoreroom").click(function(){
      var id=$("#lan").val();
      var roomsid=$("#roomsmore").val();
      var name=$("#newname").val();
      var description=$("#newdesc").val();
     
    
      let greske=0;
      if(lan==1 || lan==-1){
        greske=1;
      }
      if(name==""){
        greske=1;
      }
      if(greske==1){
        alert("Name is required!")
      }
      else{
      $.ajax({
        url:api_link + "insert/AddRooms",
        method: 'POST',
        data:{
          key: main_key,
          lcode: main_lcode,
          account: account_name,
          id:id,
          roomsid:roomsid,
          name:name,
          description:description,
         

        },
        success:function(x){
          var sve=check_json(x);
          add_change(`Added room ${name}`, sve.data.id); // Add changelog
          showRoomsInDropDownList();
          displayRoomNew();
         
          $("#addanotherroom").css('display','none')
          $("#newname").val('');
          $("#newdesc").val('')
          $("#amenitesanotherlanguage").val('');
          $("#room_settings_header").css('display','flex')
          $("#new_room").show();
          $("#delete_room").hide();
         
        }, error:function(xhr,status,error){
          console.log(xhr,status)
        }
      })
      }
    }) 

  //   //get room type
    function getRoomType(id){
    $.ajax({
      url: api_link + "data/getRoomType",
      method: 'POST',
      data:{
        key: main_key,
        lcode: main_lcode,
        account: account_name,
        id:id
        
      },
      success:function(b){
        var x = check_json(b);
        let ispis=`<option value='-1'>Izaberite..</option>`;
    
        for(var a of x.typeroom){
          ispis+=`<option value='${a.value}'>${a.nameType}</option>`
        }

        // $("#room_settings_type").html(ispis)
        $("#room_settings_anorther_type").html(ispis)
       
   
      },
      error:function(xhr,status,error){
        console.log(xhr,status,error)
      }

    })
  }
  $(document).ready(function() {
    $('.js-example-basic-single').select2();
});
    

    $("#addroom").click(function(){
      
      $.ajax({
        url: api_link + "data/getallroom",
        method: 'POST',
        data:{
          key: main_key,
          lcode: main_lcode,
          account: account_name,
          
        },
        success:function(c){
          var x = check_json(c);
          ispisiSobe(x);
          $("#addanotherroom").slideToggle()
            
            
        
        },
        error:function(xhr,status,error){
          console.log(xhr,status,error)
        }
      }) 
    })
    function ispisiSobe(x){
      // var br=1;
      // let ispis=`<table class="table">
      // <thead>
      //   <tr>
      //     <th scope="col">#</th>
      //     <th scope="col">Name</th>
      //     <th scope="col">Language</th>
      //     <th scope="col">Obrisi</th>
      //   </tr>
      // </thead>
      // <tbody>`
      // for(var a of x.rooms){
      //   ispis+=`<tr>
      //   <th scope="row">${br++}</th>
      //   <td>${a.nameSpecRoom}</td>
      //   <td>${a.language}</td>
      //   <td><button type="button" id="obrisi" class="btn btn-primary mb-2">Obrisi</button></td>
      // </tr>
      // <tr>`
      // }
      // ispis+=`</tbody></table>`
      
      // $("#tableroom").html(ispis);
    }


   
// menjanje jezika tipova za ubacivanje novih
$("#lan").change(function(){
  getRoomType(id=$($(this)).val())
$("#addanotherroom").css('display','none');
})

 $("#lan").change(function(){
  showPoliciesInDropDownList();
})


  function showPoliciesInDropDownList(){

  $("#addpolicies").slideToggle();
var id=$("#lan").val();
//policies  
$.ajax({
  url: api_link+"data/showPolicies",
  method: 'POST',
  data:{
    key: main_key,
    lcode: main_lcode,
    account: account_name,
    id:id
  },
  success:function(b){
    var x = check_json(b);
    var ispis=""
    for(var a of x.policies){
      ispis+=` <option value="${a.id}">${a.name}</option>`
    }

    $("#policiesmore").html(ispis);
    $("#new_policy_container").hide();
    $("#new_policy").show();
    $("#addpolicies").css('display','none');
    
  },
  error:function(xhr,status,error){
    console.log(xhr,status,error)
  }
})}


//ubacivanje politike 

  $("#addmorepoliciesanotherlanguage").click(function(){
  var jezik=$("#lan");
  var politike=$("#policiesmore");
  var name=$("#newnamepolicies");
  var newdescpolicies=$("#newdescpolicies");
  let greske=0;

  if(name.val()==""){
    greske=1;
  }
  if(greske==1){
    alert("Name is required!")
  }
  else{

  
  $.ajax({
  url: api_link + "insert/addpolicies",
  method: 'POST',
  data:{
    key: main_key,
    lcode: main_lcode,
    account: account_name,
    jezik:jezik.val(),
    politike:politike.val(),
    name:name.val(),
    newdescpolicies:newdescpolicies.val()
  },
  success:function(x){
    var sve=check_json(x);
    add_change(`Added policy ${name.val()}`, sve.data.id);
    ispisiBezOsvezenja();
    showPoliciesInDropDownList();

  },
  error:function(xhr,status,error){
    console.log(xhr,status,error)
   
  
  }})}
    
})

$(".addprice").click(function(){
$("#pricemore").slideToggle();

})
// pricing
$("#lan").change(function(){
  showPriceAndBoardInDropDownList();
})
  function showPriceAndBoardInDropDownList(){
var id=$("#lan").val();

  $.ajax({
  url: api_link + "data/getprice",
  method: 'POST',
  data:{
    id:id,
    key:main_key,
    lcode: main_lcode,
    account: account_name,
  },
  success:function(b){
    var x = check_json(b);

    let ispis2=``;
    for(var c of x.price){
      ispis2+=`<option value="${c.id}">${c.name}</option>`
    }
   
    
    $("#pricelistmore").html(ispis2)
    $("#new_price_container").hide();
    $("#new_price").show();
    $("#pricemore").css('display','none');
    

  },
  error:function(xhr,status,error){
    console.log(xhr,status,error)}
})
  }


$("#addnewprice").click(function(){

  var jezik=$("#lan");
  var price=$("#pricelistmore");
  var nameprice=$("#nameprice");
  var pricedescription=$("#pricedescription");

  let greske=0;

  if(nameprice.val()==""){
    greske=1;
  }
  if(greske==1){
    alert("Name is required !")
  }
  else{

  $.ajax({
  url: api_link + "insert/addpricelist",
  method: 'POST',
  data:{
    key: main_key,
    lcode: main_lcode,
    account: account_name,
    jezik:jezik.val(),
    price:price.val(),
    nameprice:nameprice.val(),
    pricedescription:pricedescription.val()
  },
  success:function(x){
   var sve=check_json(x);
    add_change(`Added price ${nameprice.val()}`, sve.data.id);
ispisiBezOsvezenja()
showPriceAndBoardInDropDownList();
  },
  error:function(xhr,status,error){
    console.log(xhr,status,error)}


  })
}
})



// extras

  function showExtrasInDropDownList(){
var id=$("#lan").val();
  
    $.ajax({
    url: api_link + "data/getExtras",
    method: 'POST',
    data:{
      key:main_key,
      lcode: main_lcode,
      account: account_name,
      id:id
    },
    success:function(b){
      var x = check_json(b);
      let ispis=""
      for(var a of x.extras){
        ispis+=`<option value="${a.id}">${a.name}</option>`
      }
     
      $("#extrasmore").html(ispis)
      $("#new_extra_container").hide();
      $("#new_extra").show();
      $("#addanotheextras").css('display','none');
    
    },
    error:function(xhr,status,error){
      console.log(xhr,status,error)}
  })}
  $("#lan").change(function(){
    showExtrasInDropDownList();
})



  $("#addmoreextras").click(function(){
    var jezik=$("#lan");
    var extras=$("#extrasmore");
    var nameextras=$("#newnameextras");
    var descriptionextras=$("#newdescextras");
    let greske=0;
   
    if(nameextras.val()==""){
      greske=1;
    }
    if(greske==1){
      alert("Name is required !")
    }
    else{
    $.ajax({
    url: api_link + "insert/addemorextras",
    method: 'POST',
    data:{
      key: main_key,
      lcode: main_lcode,
      account: account_name,
      jezik:jezik.val(),
      extras:extras.val(),
      nameextras:nameextras.val(),
      descriptionextras:descriptionextras.val(),
    },
    success:function(x){
      var sve=check_json(x);
      add_change(`Insert extras ${nameextras.val()}`, sve.data.id);
  ispisiBezOsvezenja();
  showExtrasInDropDownList();

    },
    error:function(xhr,status,error){
      console.log(xhr,status,error)}
  })}
  })
  $("#lan").change(function(){
    showPromoCodeInDropDownList();
  })

  //change placeholder on change select list
$("#new_promocode").click(function(){
  let promocodename=$("#promocodemore option:selected").text();
  console.log(promocodename)
  $("#newnamepromocode").attr("placeholder", promocodename);
  $("#promocodemore").change(function(){
    let pr=$("#promocodemore option:selected").text();
    console.log(pr)
    $("#newnamepromocode").attr("placeholder", pr);
  })
})
$("#new_policy").click(function(){
  let policyname=$("#policiesmore option:selected").text();
  $("#newnamepolicies").attr("placeholder", policyname);
  $("#policiesmore").change(function(){
    let pr=$("#policiesmore option:selected").text();
   
    $("#newnamepolicies").attr("placeholder", pr);
  })
})
$("#new_price").click(function(){
  let pricename=$("#pricelistmore option:selected").text();
  $("#nameprice").attr("placeholder", pricename);
  $("#pricelistmore").change(function(){
    let pr=$("#pricelistmore option:selected").text();
    $("#nameprice").attr("placeholder", pr);
  })
})

$("#new_extra").click(function(){
  let extrasname=$("#extrasmore option:selected").text();
  $("#newnameextras").attr("placeholder", extrasname);
  $("#extrasmore").change(function(){
    let pr=$("#extrasmore option:selected").text();
    $("#newnameextras").attr("placeholder", pr);
  })
})
$("#new_room").click(function(){
  let roomaname=$("#roomsmore option:selected").text();
  $("#newname").attr("placeholder", roomaname);
  $("#roomsmore").change(function(){
    let pr=$("#roomsmore option:selected").text();
    $("#newname").attr("placeholder", pr);
  })
})
////

    function showPromoCodeInDropDownList(){
  $("#addanotherpromocode").slideToggle();
     var id=$("#lan").val();
       $.ajax({
       url: api_link + "data/getPromoCode",
       method: 'POST',
       dataType:'json',
   
       data:{
         key:main_key,
         lcode: main_lcode,
         account: account_name,
         id:id
       },
       success:function(x){
        console.log(x);
         let ispis=''
         for(var a of x.pr){
           ispis+=`<option value="${a.id}">${a.name}</option>`
         }
        
         $("#promocodemore").html(ispis)
         $("#new_promocode_container").hide();
         $("#new_promocode").show();
         $("#addanotherpromocode").css('display','none');
        
        },
       error:function(xhr,status,error){
         console.log(xhr,status,error)}
     })
    }
    
    


// insert promocode
$("#addmorepromocode").click(function(){
  var jezik=$("#lan");
  var promocode=$("#promocodemore");
  var promocodename=$("#newnamepromocode");
  var promocodedesc=$("#newdescpromocode");
  let greske=0;
 
  if(promocodename.val()==""){
    greske=1;
  }
  if(greske==1){
    alert("Name is required !")
  }
  else{

  $.ajax({
  url: api_link + "insert/addMorePromoCode",
  method: 'POST',
  data:{
    key: main_key,
    lcode: main_lcode,
    account: account_name,
    jezik:jezik.val(),
    promocode:promocode.val(),
    promocodename:promocodename.val(),
    promocodedesc:promocodedesc.val(),
  },
  success:function(x){
    var sve=check_json(x);
    add_change(`Added PromoCode ${promocodename.val()}`, sve.data.id);
ispisiBezOsvezenja();
showPromoCodeInDropDownList();
  },
  error:function(xhr,status,error){
    console.log(xhr,status,error)}
})}
})

// insert message
$("#insertmessage").click(function(){
  var welcome=$("#welcome");
  var noAvail=$("#noAvail");
  var voucher=$("#voucher");
  var book=$("#book");
  var jezik=$("#lan");
  $.ajax({
    url: api_link + "insert/addMoreMessage",
    method: 'POST',
    data:{
      key: main_key,
      lcode: main_lcode,
      account: account_name,
      welcome:welcome.val(),
      noAvail:noAvail.val(),
      voucher:voucher.val(),
      book:book.val(),
      jezik:jezik.val()
  
    },
    success:function(x){
      var sve=check_json(x);
      add_change(`Added message`, sve.data.id);
  $("#insertmessage").css("display",'none')
  $("#updatemessage").css("display",'block')
    },
    error:function(xhr,status,error){
     
      console.log(xhr,status,error)}
  })}
)



//insert name and description
$("#lanbutton").click(function(){
  var jezik=$("#lan");
  var name=$("#name");
  var description=$("#description");
  var property_select=$("#property_select");

  var greske=[];
  if(jezik.val()=="-1"){
    greske.push("Language is required");
  }
  if(name.val()==""){
    greske.push("Name is required");
  }
  if(greske.length>0){
    for(var a of greske){
      alert(a);}}
  else{
  $.ajax({
  url: api_link + "insert/addMoreNameAndDescription",
  method: 'POST',
  data:{
    key: main_key,
    lcode: main_lcode,
    account: account_name,
    jezik:jezik.val(),
    name:name.val(),
    description:description.val(),
    property_select:property_select.val()
 

  },
  success:function(x){
    var sve=check_json(x);
    add_change(`Added name and description`, sve.data.id);
$("#lanbutton").css("display",'none');
$("#updatenameanddesc").css("display",'block');

  },
  error:function(xhr,status,error){
    alert("Name on this language already exsist!")
    console.log(xhr,status,error)}
})}
})

// menjanje name poljima kao i prikaz na razlicitim jezicima 

$("#lan").change(function(){
  var vrednost=$("#select2-lan-container").attr("title");
  $(this).attr("name",'language'+"_"+vrednost)
  $("#name").attr("name",'name'+"_"+vrednost)
  $("#description").attr("name",'description'+"_"+vrednost)
  $("#promocodeName").attr("name",'promocodeName'+"_"+vrednost)
  $("#promocodeDescription").attr("name",'promocodeDescription'+"_"+vrednost)
  $("#policyName").attr("name",'policyName'+"_"+vrednost)
  $("#policyDescription").attr("name",'policyDescription'+"_"+vrednost)
  $("#welcome").attr("name",'welcome'+"_"+vrednost)
  $("#noAvail").attr("name",'noAvail'+"_"+vrednost)
  $("#voucher").attr("name",'voucher'+"_"+vrednost)
  $("#book").attr("name",'book'+"_"+vrednost)
  $("#new_price_name").attr("name",'new_price_name'+"_"+vrednost)
  $("#new_price_description").attr("name",'new_price_description'+"_"+vrednost)
  $("#room_settings_name").attr("name",'room_settings_name'+"_"+vrednost)
  $("#room_settings_description").attr("name",'room_settings_description'+"_"+vrednost)
  $("#new_extra_name").attr("name",'new_extra_name'+"_"+vrednost)
  $("#new_extra_description").attr("name",'new_extra_description'+"_"+vrednost)
  $("#room_settings_type").attr("name",'room_settings_type'+"_"+vrednost)
  $("#policyType").attr("name",'policyType'+"_"+vrednost)
  $("#new_price_board").attr("name",'new_price_board'+"_"+vrednost)
  $("#room_settings_amenities").attr("name",'room_settings_amenities'+"_"+vrednost);
  ispisiBezOsvezenja()

  $("#pricemore").css("display",'none');
})

function ispisiBezOsvezenja(){
let id=$("#lan").val();


  $.ajax({
  url: api_link + "data/showFieldOnAnotherLanguage",
  method: 'POST',
  data:{
    key: main_key,
    lcode: main_lcode,
    account: account_name,
    id:id
  },
  success:function(b){
    var x = check_json(b);
    
    if(x.name.length==0){
      if(id==-1 || id==1){
  
      $("#lanbutton").css("display",'none')
      $("#updatenameanddesc").css("display",'block')
    }
    else{
      alert("Name on this language not added")
      $("#lanbutton").css("display",'block')
      $("#updatenameanddesc").css("display",'none')
    }
    
      for(var v of x.nameOnEnglish){
        $("#name").val(v.name); }

        
      }
      else{
    for(var a of x.name){
      $("#name").val(a.nameEngine);
      $("#updatenameanddesc").css("display",'block')
      $("#lanbutton").css("display",'none')
      }}

      if(x.desc.length==0){
        for(var v of x.descOnEnglish){
          $("#description").val(v.description); 
        }}
        else{
    for(var g of x.desc){
      $("#description").val(g.descriptionEngineFooter);
    }}

    if(x.message.length==0){
      if(id==-1 || id==1){
  
      $("#insertmessage").css("display",'none')
      $("#updatemessage").css("display",'block')
    }
    else{
      $("#insertmessage").css("display",'block')
      $("#updatemessage").css("display",'none')
    }
    
      for(var m of x.messageOnEnglish){
      $("#welcome").val(m.welcome)
      $("#book").val(m.book)
      $("#noAvail").val(m.noAvail)
      $("#voucher").val(m.voucher)
      
      }
       
        
      }
      else{
    for(var t of x.message){
           $("#welcome").val(t.welcomeMessage)
      $("#book").val(t.bookMessage)
      $("#noAvail").val(t.noAvailMessage)
      $("#voucher").val(t.voucherMessage)
      $("#updatemessage").css("display",'block')
      $("#insertmessage").css("display",'none')
      }}
    // for(var a of x.message){
    //   $("#welcome").val(a.welcomeMessage)
    //   $("#book").val(a.bookMessage)
    //   $("#noAvail").val(a.noAvailMessage)
    //   $("#voucher").val(a.voucherMessage)
    
    // }
    displayExstrasOnAnotherLanguage(x)
    displayPromoCodeOnAnotherLanguage(x)
    displayPoliciesOnAnotherLanguage(x)
    displayPriceOnAnotherLanguage(x)
    
  },
  error:function(xhr,status,error){
    console.log(xhr,status,error)}

    
})

}
function displayExstrasOnAnotherLanguage(x){
  if($("#lan").val()==1 || $("#lan").val()==-1){
    display_extras();
  }
  else{
  let extras=`<div class="list_names">
    <div class='extra_name'> Name </div>
    <div class='extra_type'> Type </div>
    <div class='extra_price'> Price </div>
      <div class='extra_actions'> Actions </div>
    </div>`
    for(var p of x.extras){
      extras+=`
        <div class="list_row extra" id='extras_list_${p.idEL}'>
          <div class='extra_name'> ${p.nameExtras} </div>
          <div class='extra_type'> ${p.type} </div>
          <div class='extra_price'> ${p.price} EUR </div>
          <div class='extra_actions'><div class='list_action updateExtras' data-id="${p.idEL}"><img class='list_action_icon edit' title='Edit' style="pointer-events: none;" > </div> 
          <div class='list_action deleteExtras' data-id="${p.idEL}"><img class='list_action_icon delete' style="pointer-events: none;" title='Delete'> </div></div>
        </div>`
    }
    $("#extras_list").html(extras);}


}

// brisanje extrasa na drugim jezicima
$("#extras_list").on("click",'.deleteExtras',function(){

let id=$(this).data('id');
$.ajax({
  type: 'POST',
  url: api_link + "delete/deleteExtrasOnAnotherLanguage",
  data: {
    key: main_key,
    account: account_name,
    lcode: main_lcode,
    id: id
  },
  success: function(rezultat){
    sve=check_json(rezultat);
    add_change(`Deleted extras ${name}`, sve.data.id);
    ispisiBezOsvezenja();
    showExtrasInDropDownList();
  },

    error:function(xhr,status,error){
      console.log(xhr,status,error)
    }})})  




    // edit extras on anotherlanguage
    $("#extras_list").on("click",'.updateExtras',function(){

    let row_id = $(this).closest(".extra")[0].id;
  if($("#edit_extra_container").length && $(`#${row_id}`).hasClass("selected")){ // This plan edit is open
    return;
  }
  else {
    $("#edit_extra_container").remove();
    $(".extra.selected").removeClass("selected");
    $(`#${row_id}`).addClass("selected");
    let id=$(this).data('id');
    let idlanguage=$("#lan").val();
    $.ajax({
      type: 'POST',
      url: api_link + "data/getExtrasForUpdate",
      data: {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        id: id,
        idlanguage:idlanguage
      },
      success: function(b){
        var rezultat = check_json(b);
        let id = row_id.split("_");
        id = id[id.length - 1];
        for(var a of rezultat.onextras){
          
        $(`#${row_id}`).after(`
          <div id='edit_extra_container'>
            <input type='hidden' id='edit_extra_id_more' value='${a.idEL}'>
            <div class='flex_between'>
              <div class="vert_center">
                <div>Name</div>
                <input type='text' class='text_input' id='edit_extra_name_more' value='${a.nameExtras}'>
              </div>
            </div>
    
            <div class='flex_between'>
              <div>Description</div>
              <textarea class='textarea_input' id='edit_extra_description_more'>
              ${a.descriptionExtras}
              </textarea>
            </div>
            <div class='flex_center'>
              <button class='cancel_button' id='edit_extra_cancel'> CANCEL </button>
              <button class='confirm_button' id='edit_extra_confirm_more'> SAVE </button>
            </div>
          </div>`);
         
        }
    
      },error:function(xhr,status,error){
        console.log(xhr,status,error)
      }})}})

      //

    $("#extras_list").on('click','#edit_extra_confirm_more',function(){ 
      let idlanguage=$("#lan").val();
      let hidden=$("#edit_extra_id_more").val();
      let name=$("#edit_extra_name_more").val();
      let desc=$("#edit_extra_description_more").val();
      $.ajax({
        type: 'POST',
        url:api_link + "edit/updateMoreLanguageExtras",
        data: {
          key: main_key,
          account: account_name,
          lcode: main_lcode,
          hidden:hidden,
          name:name,
          desc:desc,
          idlanguage:idlanguage
        },
        success: function(rezultat){
          sve=check_json(rezultat);
          ispisiBezOsvezenja()
          add_change(`Edited extras ${name}`, sve.data.id);
        }
        ,error:function(xhr,status,error){
          console.log(xhr,status)
        }})})
      
      
function displayPromoCodeOnAnotherLanguage(x){
  if($("#lan").val()==1 || $("#lan").val()==-1){
    get_promocodes();}
    else{
    let promo=`<div class="list_names">
    <div class='promocode_name'> Name </div>
    <div class='promocode_code'> Code </div>
    <div class='promocode_target'> Type </div>
    <div class='promocode_actions'> Actions </div>
    </div>`
    for(var a of x.promocode){
      promo+=`<div class="list_row promocode" id='promocodes_list_${a.idPCL}'>
      <div class='promocode_name'> ${a.namePromoCode} </div>
      <div class='promocode_code'> ${a.code} </div>
      <div class='promocode_target'> ${a.target} </div>
      <div class='promocode_actions'> 
      <div class='list_action editPromoCode' data-id="${a.idPCL}"><img class='list_action_icon edit' style="pointer-events: none;" title='Edit'> </div>
      <div class='list_action deletePromoCode' data-id="${a.idPCL}"><img class='list_action_icon delete' style="pointer-events: none;" title='Delete'> </div>
     </div>
    </div>`
    }
    $("#promocodes_list").html(promo);}}

    // brisanje promocode na drugim jezicima
$("#promocodes_list").on("click",'.deletePromoCode',function(){

  let id=$(this).data('id');
  $.ajax({
    type: 'POST',
    url:api_link + "delete/deletePromoCodeOnAnotherLanguage",
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      id: id
    },
    success: function(rezultat){
      var sve=check_json(rezultat);
      add_change(`Deleted PromoCode`, sve.data.id);
      ispisiBezOsvezenja();
      showPromoCodeInDropDownList();
    },
  
      error:function(xhr,status,error){
        console.log(xhr,status,error)
      }})})
      
      
      // edit extras on anotherlanguage
      $("#promocodes_list").on("click",'.editPromoCode',function(){

        let row_id = $(this).closest(".promocode")[0].id;
      if($("#edit_extra_container").length && $(`#${row_id}`).hasClass("selected")){ // This plan edit is open
        return;
      }
      else {
        $("#edit_extra_container").remove();
        $(".extra.selected").removeClass("selected");
        $(`#${row_id}`).addClass("selected");
        let id=$(this).data('id');
        let idlanguage=$("#lan").val();
        $.ajax({
          type: 'POST',
          url:api_link + "data/getPromoCodeForUpdate",
          data: {
            key: main_key,
            account: account_name,
            lcode: main_lcode,
            id: id,
            idlanguage:idlanguage
          },
          success: function(b){
            var rezultat = check_json(b);
            let id = row_id.split("_");
            id = id[id.length - 1];
            for(var a of rezultat.onepromocode){
              
            $(`#${row_id}`).after(`
              <div id='edit_extra_container'>
                <input type='hidden' id='edit_promocode_id_more' value='${a.idPCL}'>
                <div class='flex_between'>
                  <div class="vert_center">
                    <div>Name</div>
                    <input type='text' class='text_input' id='edit_promocode_name_more' value='${a.namePromoCode}'>
                  </div>
                </div>
        
                <div class='flex_between'>
                  <div>Description</div>
                  <textarea class='textarea_input' id='edit_promocode_description_more'>
                  ${a.DescriptionPromoCode}
                  </textarea>
                </div>
                <div class='flex_center'>
                  <button class='cancel_button' id='edit_extra_cancel'> CANCEL </button>
                  <button class='confirm_button' id='edit_promocode_confirm_more'> SAVE </button>
                </div>
              </div>`);
             
            }
        
          },error:function(xhr,status,error){
            console.log(xhr,status,error)
          }})}})
  // update promocode
  $("#promocodes_list").on('click','#edit_promocode_confirm_more',function(){ 
    let idlanguage=$("#lan").val();
    let hidden=$("#edit_promocode_id_more").val();
    let name=$("#edit_promocode_name_more").val();
    let desc=$("#edit_promocode_description_more").val();
    $.ajax({
      type: 'POST',
      url:api_link + "edit/updateMoreLanguagePromoCode",
      data: {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        hidden:hidden,
        name:name,
        desc:desc,
        idlanguage:idlanguage
      },
      success: function(rezultat){
        var sve=check_json(rezultat);
        add_change(`Updated PromoCode ${name}`, sve.data.id);
        ispisiBezOsvezenja()
      }
      ,error:function(xhr,status,error){
        console.log(xhr,status)
      }})})


function displayPoliciesOnAnotherLanguage(x){
  if($("#lan").val()==1 || $("#lan").val()==-1){
    display_policies()
  }
  else{
    let policy=`<div class="list_names">
    <div class='policy_name'> Name </div>
    <div class='policy_type'> Type </div>
    <div class='policy_description'> Description </div>
    <div class='policy_actions'> Actions </div>
  </div>`
  for(var a of x.policies){
    policy+=`<div class="list_row policy" id='policies_list_${a.idPL}'>
    <div class='policy_name'> ${a.namePolicies} </div>
    <div class='policy_type'> ${a.type} </div>
    <div class='policy_description'> ${a.descriptionPolicies} </div>
    <div class='policy_actions'> 
    <div class='list_action editPolicies'  data-id="${a.idPL}"><img class='list_action_icon edit' style="pointer-events: none;" title='Edit'> </div>
    <div class='list_action deletePolicies'  data-id="${a.idPL}"><img class='list_action_icon delete' style="pointer-events: none;" title='Delete'> </div> </div>
  </div>`
  }
  $("#policies_list").html(policy);
  }}

  $("#policies_list").on("click",'.deletePolicies',function(){

    let id=$(this).data('id');
    $.ajax({
      type: 'POST',
      url:api_link + "delete/deletePoliciesOnAnotherLanguage",
      data: {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        id: id
      },
      success: function(rezultat){
        var sve=check_json(rezultat);
        add_change(`Deleted policy`, sve.data.id);
        ispisiBezOsvezenja();
        showPoliciesInDropDownList();
      },
    
        error:function(xhr,status,error){
          console.log(xhr,status,error)
        }})})  

      // edit policies on anotherlanguage
      $("#policies_list").on("click",'.editPolicies',function(){

        let row_id = $(this).closest(".policy")[0].id;
      if($("#edit_extra_container").length && $(`#${row_id}`).hasClass("selected")){ // This plan edit is open
        return;
      }
      else {
        $("#edit_extra_container").remove();
        $(".extra.selected").removeClass("selected");
        $(`#${row_id}`).addClass("selected");
        let id=$(this).data('id');
        let idlanguage=$("#lan").val();
        $.ajax({
          type: 'POST',
          url:api_link + "data/getPolicyForUpdate",
          data: {
            key: main_key,
            account: account_name,
            lcode: main_lcode,
            id: id,
            idlanguage:idlanguage
          },
          success: function(b){
            var rezultat = check_json(b);
            let id = row_id.split("_");
            id = id[id.length - 1];
            for(var a of rezultat.onepolicies){
              
            $(`#${row_id}`).after(`
              <div id='edit_extra_container'>
                <input type='hidden' id='edit_policies_id_more' value='${a.idPL}'>
                <div class='flex_between'>
                  <div class="vert_center">
                    <div>Name</div>
                    <input type='text' class='text_input' id='edit_policies_name_more' value='${a.namePolicies}'>
                  </div>
                </div>
        
                <div class='flex_between'>
                  <div>Description</div>
                  <textarea class='textarea_input' id='edit_policies_description_more'>
                  ${a.descriptionPolicies}
                  </textarea>
                </div>
                <div class='flex_center'>
                  <button class='cancel_button' id='edit_extra_cancel'> CANCEL </button>
                  <button class='confirm_button' id='edit_policies_confirm_more'> SAVE </button>
                </div>
              </div>`);
             
            }
        
          },error:function(xhr,status,error){
            console.log(xhr,status,error)
          }})}})

// update policies
$("#policies_list").on('click','#edit_policies_confirm_more',function(){ 
  let idlanguage=$("#lan").val();
  let hidden=$("#edit_policies_id_more").val();
  let name=$("#edit_policies_name_more").val();
  let desc=$("#edit_policies_description_more").val();
  $.ajax({
    type: 'POST',
    url:api_link + "edit/updateMoreLanguagePolicies",
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      hidden:hidden,
      name:name,
      desc:desc,
      idlanguage:idlanguage
    },
    success: function(rezultat){
      var sve=check_json(rezultat);
      add_change(`Updated policy ${name}`, sve.data.id);
      ispisiBezOsvezenja()
    }
    ,error:function(xhr,status,error){
      console.log(xhr,status)
    }})})


  function displayPriceOnAnotherLanguage(x){
    if($("#lan").val()==1 || $("#lan").val()==-1){
      display_pricing_plans();
    }
    else{
      let price=`<div class="list_names">
      <div class='price_name'> Name </div>
      <div class='price_type'> Type </div>
      <div class='price_actions'> Actions </div>
    </div>`
    for(var a of x.prices){
      price+=`<div class="list_row pricing_plan" id='pricing_plans_list_${a.idPR}'>
      <div class='price_name'> ${a.namePrice} </div>
      <div class='price_type'> ${a.type} </div>
      <div class='price_actions'> 
      <div class='list_action editPrice'  data-id="${a.idPR}"><img class='list_action_icon edit' style="pointer-events: none;" title='Izmeni'> </div>
      <div class='list_action deletePrice'  data-id="${a.idPR}"><img class='list_action_icon delete' style="pointer-events: none;" title='Obriši'> </div> </div>
    </div>`
   
}
    $("#pricing_plans_list").html(price);
}}
$("#pricing_plans_list").on("click",'.deletePrice',function(){

  let id=$(this).data('id');
  $.ajax({
    type: 'POST',
    url:api_link + "delete/deletePriceOnAnotherLanguage",
    data: {
      key: main_key,
      account: account_name,
      lcode: main_lcode,
      id: id
    },
    success: function(rezultat){
      var sve=check_json(rezultat);
      add_change(`Deleted price`, sve.data.id);
      ispisiBezOsvezenja()
      showPriceAndBoardInDropDownList();
    },
  
      error:function(xhr,status,error){
        console.log(xhr,status,error)
      }})})
      
      
      // edit price on another language
      $("#pricing_plans_list").on("click",'.editPrice',function(){

        let row_id = $(this).closest(".pricing_plan")[0].id;
      if($("#edit_extra_container").length && $(`#${row_id}`).hasClass("selected")){ // This plan edit is open
        return;
      }
      else {
        $("#edit_extra_container").remove();
        $(".extra.selected").removeClass("selected");
        $(`#${row_id}`).addClass("selected");
        let id=$(this).data('id');
        let idlanguage=$("#lan").val();
        $.ajax({
          type: 'POST',
          url:api_link + "data/getPriceForUpdate",
          data: {
            key: main_key,
            account: account_name,
            lcode: main_lcode,
            id: id,
            idlanguage:idlanguage
          },
          success: function(b){
            var rezultat = check_json(b);
            let id = row_id.split("_");
            id = id[id.length - 1];
            for(var a of rezultat.oneprice){
              
            $(`#${row_id}`).after(`
              <div id='edit_extra_container'>
                <input type='hidden' id='edit_price_id_more' value='${a.idPR}'>
                <div class='flex_between'>
                  <div class="vert_center">
                    <div>Name</div>
                    <input type='text' class='text_input' id='edit_price_name_more' value='${a.namePrice}'>
                  </div>
                </div>
        
                <div class='flex_between'>
                  <div>Description</div>
                  <textarea class='textarea_input' id='edit_price_description_more'>
                  ${a.descriptionPrice}
                  </textarea>
                </div>
                <div class='flex_center'>
                  <button class='cancel_button' id='edit_extra_cancel'> CANCEL </button>
                  <button class='confirm_button' id='edit_price_confirm_more'> SAVE </button>
                </div>
              </div>`);
             
            }
        
          },error:function(xhr,status,error){
            console.log(xhr,status,error)
          }})}})

          // update price on another language
          $("#pricing_plans_list").on('click','#edit_price_confirm_more',function(){ 
            let idlanguage=$("#lan").val();
            let hidden=$("#edit_price_id_more").val();
            let name=$("#edit_price_name_more").val();
            let desc=$("#edit_price_description_more").val();
            $.ajax({
              type: 'POST',
              url:api_link + "edit/updateMoreLanguagePrice",
              data: {
                key: main_key,
                account: account_name,
                lcode: main_lcode,
                hidden:hidden,
                name:name,
                desc:desc,
                idlanguage:idlanguage
              },
              success: function(rezultat){
                var sve=check_json(rezultat);
                add_change(`Updated price ${name}`, sve.data.id);
                ispisiBezOsvezenja()
              }
              ,error:function(xhr,status,error){
                console.log(xhr,status)
              }})})





})