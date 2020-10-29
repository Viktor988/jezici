$(document).ready(function(){

    $("#lan").change(function(){
    let vrednost=$(this).val();
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
    $("#room_settings_amenities").attr("name",'room_settings_amenities'+"_"+vrednost)
    })
    
    
    
    
    })