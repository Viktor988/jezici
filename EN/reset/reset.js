function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

$(document).ready(function(){

  var pkey = findGetParameter("key");

  $("#login_confirm").click(function(){
    if ($("#login_password").val() !== $("#login_password_confirm").val()){
      $("#login_error").text("Passwords do not match.");
      return;
    }
    if($("#login_password").val().length < 6){
      $("#login_error").text("Password must contain atleast 6 characters.");
      return;
    }
    $.ajax({
      url: '../api/web/account/reset',
      method: 'POST',
      data: {
              password: $("#login_password").val(),
              key: pkey
            },
      success: function(rezultat){
        console.log(rezultat);
        var url = "https://admin.otasync.me";
        $(location).attr('href',url);
      },
      error: function(rezultat){
        window.alert("An error occured.");
      }
    });
  });
});
