let changelog_page = 1;
let total_changelog_pages = 1;

let changelog_map = {};

function get_changelog(){

    // No need for array formating, selects already have the value in the right format, just convert it to JSON
    // date_to_iso generates the right format, and returns an empty string if no date is selected
    let data = {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        actions: JSON.stringify($("#actions").val()),
        dfrom: date_to_iso($('#dfrom').datepicker().data('datepicker').selectedDates[0]),
        dto: date_to_iso($('#dto').datepicker().data('datepicker').selectedDates[0]),
        data_types: JSON.stringify($("#data_types").val()),
        page: changelog_page
    };
    $.ajax({
        url: api_link + "data/changelog",
        type: 'POST',
        data: data,
        success: (response) => {
            var sve = check_json(response);
            if(sve.status !== "ok"){
                add_change_error(sve.status);
                return;

            }
            //Resseting markup for new query.

            let changelog = sve.changelog;
            total_changelog_pages = sve.total_pages_number;
            let html = "";
            if(changelog_page == 1){ // Setting header and applying styles only if the first page is being shown
              $("#markup").html("");
              html = "<div class='list_header'><div class=''>Datum</div><div class=''>Akcija</div><div class=''>Tip</div> <div class=''>Oznaka</div> <div class=''>Izvršitelj</div></div>";
            }

            let timePos = null;
            let date = null;
            let hms = null;
            let time = null;

            let dataType = null;
            let akcija = null;
            let oznaka = null;

            console.log(changelog);

            for(item in changelog){
                changelog_map[changelog[item].id] = changelog[item];
                //Splits date-time string value send by server, so it can be displayed separately.
                timePos = changelog[item].created_time.indexOf(" ");
                //Year, month and day string is sent by server with "-", this need to be displayed with dot delimiter. RegEx is used to change "-" with ".". This only applied to date part.
                // iso_to_eur does that
                date = iso_to_eur(changelog[item].created_time.substring(0,timePos));
                //Getting h:m:s part of dateTime, excluding seconds.
                hms = changelog[item].created_time.substring(timePos+1, changelog[item].created_time.length);

                oznaka = changelog[item].name;

                if(changelog[item].action==="edit"){
                    akcija = "Izmena";
                }
                else if(changelog[item].action==="insert"){
                    akcija = "Unos";
                }
                else if(changelog[item].action==="delete"){
                    akcija = "Brisanje";
                }



                if(changelog[item].data_type==="reservation"){
                    dataType = "Rezervacija";
                }
                else if(changelog[item].data_type==="guest"){
                    dataType = "Gost";
                }
                else if(changelog[item].data_type==="invoice"){
                    dataType = "Račun";
                }
                else if(changelog[item].data_type==="room"){
                    dataType = "Jedinica";
                }
                else if(changelog[item].data_type==="extra"){
                    dataType = "Dodatak";
                }
                else if(changelog[item].data_type==="channel"){
                    dataType = "Kanal";
                }
                else if(changelog[item].data_type==="price"){
                    dataType = "Cene";
                }
                else if(changelog[item].data_type==="restriction"){
                    dataType = "Restrikcije";
                }
                else if(changelog[item].data_type==="restrictionCompact"){
                    dataType = "Restrikcije";
                }
                else if(changelog[item].data_type==="avail"){
                    dataType = "Raspoloživost";
                }
                else if(changelog[item].data_type==="pricingPlan"){
                    dataType = "Plan cena";
                }
                else if(changelog[item].data_type==="restrictionPlan"){
                    dataType = "Plan restrikcije";
                }
                else if(changelog[item].data_type==="promocode"){
                    dataType = "Promo kod";
                }
                else if(changelog[item].data_type==="policy"){
                    dataType = "Politika otkazivanja";
                }
                else if(changelog[item].data_type==="user"){
                    dataType = "Korisnik";
                }
                else if(changelog[item].data_type==="reservationGuestStatus"){
                    dataType = "Status gosta";
                }
                else if(changelog[item].data_type==="guestStatus"){
                    dataType = "Status gosta";
                }
                else if(changelog[item].data_type==="roomStatus"){
                    dataType = "Status sobe";
                }
                else if(changelog[item].data_type==="tetris"){
                    dataType = "Rezervacija";
                }
                else {
                  dataType = changelog[item].data_type;
                }

                if(changelog[item].created_by == "")
                  changelog[item].created_by = "Master";

                //Applying all of previously said to each row of data.
                html += `<div class='list_row change_${changelog[item].action}' data-value='` + changelog[item].id + "'><div class='change_date'>"+date+"<div class='hms'>"+hms+"</div></div><div class='change_action'>"+akcija+"</div><div class='change_data_type'>"+dataType+"</div>" + `<div class='change_data_mark'>${oznaka}</div>` +  "<div class='change_created_by'>"+changelog[item].created_by+"</div></div>";
            }

            //If response doesn't contain usefull values i.e. "empty".
            if(changelog.length === 0 && changelog_page == 1){
                html = empty_html("Nema izmena"); // Just using the existing function, to match the style
            }
            //Rendering previously set markup.
            $("#markup").append(html); // Append is used instead of html, since if the results aren't the first page, the previous results shouldn't be deleted, and if it's the first page, #markup got cleared anyway.
            // The function that updates page number is in navigation.js (on scroll)
        },
        error: function(xhr, textStatus, errorThrown){ // Error response returns 3 parameters
          window.alert("Doslo je do greske. " + xhr.responseText);
        }

    });

}

function collapse(event, par){

    $("#"+par).toggle(500);
    console.log("collapsed: "+par);

    if(event.target.className.indexOf("fa-angle-down")!=-1){
        event.target.classList.remove("fa-angle-down");
        event.target.classList.add("fa-angle-up");
        return;
    }

    if(event.target.className.indexOf("fa-angle-up")!=-1){
        event.target.classList.remove("fa-angle-up");
        event.target.classList.add("fa-angle-down");
        return;
    }

}

function occupancy(){

    let dfromOccu = date_to_iso($('#dFromOccu').datepicker().data('datepicker').selectedDates[0]);
    console.log(dfromOccu);
    let dtoOccu = date_to_iso($('#dToOccu').datepicker().data('datepicker').selectedDates[0]);
    if(dtoOccu == "")
      dtoOccu = dfromOccu;
    rooms = $("#tip_sobe").val();
    if(rooms.length == 0)
      rooms = rooms_list; // Global array of all rooms
    rooms = rooms.join(",");
    // Sends all rooms if non are selected
    let data = {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        date: dfromOccu,
        cmp: dtoOccu,
        rooms: rooms,
    };

    $.ajax({
        url: api_link + "data/occupancyReport",
        type: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        data: data,
        dataType: 'JSON',
        success: (response) => {
          console.log(response);
            let res = response.data;
            console.log(res);
            let resLen = Object.keys(res[0]).length;

            let jedinica = "";
            let ukupanKapacitet = "";
            let rezervisanKapacitet = "";
            let raspolozivKapacitet = "";
            let popunjenost = "";
            let prosecnaCena = "";
            let ukupanPrihod = "";
            if(resLen===7){

                jedinica = "<th colspan='1'>Jedinica</th>";
                ukupanKapacitet = "<th colspan='1'>Ukupan kapacitet</th>";
                rezervisanKapacitet = "<th colspan='1'>Rezervisan kapacitet</th>";
                raspolozivKapacitet = "<th colspan='1'>Raspoloživ kapacitet</th>";
                popunjenost = "<th colspan='1'>Popunjenost</th>";
                prosecnaCena = "<th colspan='1'>Prosečna cena</th>";
                ukupanPrihod = "<th colspan='1'>Ukupan prihod</th>";

            }
            if(resLen===13){

                jedinica = "<th colspan='1'>Jedinica</th>";
                ukupanKapacitet = "<th colspan='2'>Ukupan kapacitet</th>";
                rezervisanKapacitet = "<th colspan='2'>Rezervisan kapacitet</th>";
                raspolozivKapacitet = "<th colspan='2'>Raspoloživ kapacitet</th>";
                popunjenost = "<th colspan='2'>Popunjenost</th>";
                prosecnaCena = "<th colspan='2'>Prosečna cena</th>";
                ukupanPrihod = "<th colspan='2'>Ukupan prihod</th>";

            }

            let html = "<table class='table table-bordered' id='myTab'><thead><tr><th><input id='c1' type='checkbox' onchange='checkAll(event, `myTab`)'></th>"+jedinica+ukupanKapacitet+rezervisanKapacitet+raspolozivKapacitet+popunjenost+prosecnaCena+ukupanPrihod+"</tr></thead><tbody>";
            let len = res.length;

            let jedinicaVal = "";
            let ukupanKapacitetVal = "";
            let ukupanKapacitet_cmpVal = "";
            let rezervisanKapacitetVal = "";
            let rezervisanKapacitet_cmpVal = "";
            let raspolozivKapacitetVal = "";
            let raspolozivKapacitet_cmpVal = "";
            let popunjenostVal = "";
            let popunjenost_cmpVal = "";
            let prosecnaCenaVal = "";
            let prosecnaCena_cmpVal = "";
            let ukupanPrihodVal = "";
            let ukupanPrihod_cmpVal = "";

            for(let i=0;i<len;i++){

              // res[i].availabillity (and some others) can be 0, so res[i] && res[i].availability can return false, but the number should still be displayed

                if(resLen===13){

                    jedinicaVal = "<td>"+res[i].name+"</td>";//jedinica
                    ukupanKapacitetVal = "<td>"+res[i].availability+"</td>";//ukupan kapacitet
                    ukupanKapacitet_cmpVal = "<td>"+res[i].availability+"</td>";//ukupan kapacitet
                    rezervisanKapacitetVal = "<td>"+res[i].count+"</td>";//rezervisan kapacitet
                    rezervisanKapacitet_cmpVal = "<td>"+res[i].count_cmp+"</td>";//rezervisan kapacitet
                    raspolozivKapacitetVal = "<td>"+res[i].avail+"</td>";//raspoloziv kapacitet
                    raspolozivKapacitet_cmpVal = "<td>"+res[i].avail_cmp+"</td>";//raspoloziv kapacitet
                    popunjenostVal = "<td>"+res[i].occupancy+"</td>";//popunjenost
                    popunjenost_cmpVal = "<td>"+res[i].occupancy_cmp+"</td>";//popunjenost
                    prosecnaCenaVal = "<td>"+res[i].avg_price+"</td>";//prosecna cena
                    prosecnaCena_cmpVal = "<td>"+res[i].avg_price_cmp+"</td>";//prosecna cena
                    ukupanPrihodVal = "<td>"+res[i].total_price+"</td>";//ukupan prihod
                    ukupanPrihod_cmpVal = "<td>"+res[i].total_price_cmp+"</td>";//ukupan prihod

                    html += "<tr><td><input name='tab1' type='checkbox'></td>"+jedinicaVal+ukupanKapacitetVal+ukupanKapacitet_cmpVal+rezervisanKapacitetVal+rezervisanKapacitet_cmpVal+raspolozivKapacitetVal+raspolozivKapacitet_cmpVal+popunjenostVal+popunjenost_cmpVal+prosecnaCenaVal+prosecnaCena_cmpVal+ukupanPrihodVal+ukupanPrihod_cmpVal+"</tr>";

                }

                if(resLen===7){

                    jedinicaVal = "<td>"+res[i].name+"</td>";//jedinica
                    ukupanKapacitetVal = "<td>"+res[i].availability+"</td>";//ukupan kapacitet
                    rezervisanKapacitetVal = "<td>"+res[i].count+"</td>";//rezervisan kapacitet
                    raspolozivKapacitetVal = "<td>"+res[i].avail+"</td>";//raspoloziv kapacitet
                    popunjenostVal = "<td>"+res[i].occupancy+"</td>";//popunjenost
                    prosecnaCenaVal = "<td>"+res[i].avg_price+"</td>";//prosecna cena
                    ukupanPrihodVal = "<td>"+res[i].total_price+"</td>";//ukupan prihod

                    html += "<tr><td><input name='tab1' type='checkbox'></td>"+jedinicaVal+ukupanKapacitetVal+rezervisanKapacitetVal+raspolozivKapacitetVal+popunjenostVal+prosecnaCenaVal+ukupanPrihodVal+"</tr>";

                }

            }
            $("#Occupancy").html(html);
            html = "";

        },
        error: function(xhr, textStatus, errorThrown){ // Error response returns 3 parameters
          window.alert("Doslo je do greske. " + xhr.responseText);
        }
    });

}

function daily(){

    //Getting form values.
    let elems = $("#forma2").serializeArray();

    let data = {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        number: 0,
        room: 0,
        room_number: 0,
        guest: 0,
        adults: 0,
        children: 0,
        arrival: 0,
        departure: 0,
        note: 0,
        price_per_night: 0,
        total_price: 0,
        channel: 0
    };

    for(let i=0;i<elems.length;i++){

        if(elems[i].name==="number"){
            data.number = 1;
        }

        if(elems[i].name==="room"){
            data.room = 1;
        }

        if(elems[i].name==="room_number"){
            data.room_number = 1;
        }

        if(elems[i].name==="guest"){
            data.guest = 1;
        }

        if(elems[i].name==="adults"){
            data.adults = 1;
        }

        if(elems[i].name==="children"){
            data.children = 1;
        }

        if(elems[i].name==="arrival"){
            data.arrival = 1;
        }

        if(elems[i].name==="departure"){
            data.departure = 1;
        }

        if(elems[i].name==="note"){
            data.note = 1;
        }

        if(elems[i].name==="price_per_night"){
            data.price_per_night = 1;
        }

        if(elems[i].name==="total_price"){
            data.total_price = 1;
        }

        if(elems[i].name==="channel"){
            data.channel = 1;
        }

    }

    $.ajax({
        url: api_link + "data/dailyReport",
        type: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        data: data,
        dataType: 'JSON',
        success: (response) => {

            console.log("success");
            console.log("Received data: ");
            console.log(response);

            let res = response.data;
            let len = res.length;

            if(len>0){

                let number = "";
                let room = "";
                let room_number = "";
                let guest = "";
                let adults = "";
                let children = "";
                let arrival = "";
                let departure = "";
                let note = "";
                let price_per_night = "";
                let total_price = "";
                let channel = "" ;

                let objKeys = Object.keys(res[0]);
                for(let i=0;i<objKeys.length;i++){

                    if(objKeys[i]==="number"){
                        number = "<th>Redni broj</th>";
                    }

                    if(objKeys[i]==="room"){
                        room = "<th>Tip jedinice</th>";
                    }

                    if(objKeys[i]==="room_number"){
                        room_number = "<th>Broj Sobe</th>";
                    }

                    if(objKeys[i]==="guest"){
                        guest = "<th>Nosilac rezervacije</th>";
                    }

                    if(objKeys[i]==="men"){
                        adults = "<th>Broj odraslih</th>";
                    }

                    if(objKeys[i]==="children"){
                        children = "<th>Broj dece</th>";
                    }

                    if(objKeys[i]==="arrival"){
                        arrival = "<th>Datum dolaska</th>";
                    }

                    if(objKeys[i]==="departure"){
                        departure = "<th>Datum odlaska</th>";
                    }

                    if(objKeys[i]==="note"){
                        note = "<th>Napomena</th>";
                    }

                    if(objKeys[i]==="price_per_night"){
                        price_per_night = "<th>Cena noćenja</th>";
                    }

                    if(objKeys[i]==="total_price"){
                        total_price = "<th>Ukupna cena</th>";
                    }

                    if(objKeys[i]==="channel"){
                        channel = "<th>Prodajni kanal</th>" ;
                    }

                }

                let html = "<table class='table table-bordered' id='myTab2'><thead><tr><th><input id='c2' type='checkbox' onchange='checkAll(event, `myTab2`)'></th>"+number+room+room_number+guest+adults+children+arrival+departure+note+price_per_night+total_price+channel+"</tr></thead><tbody>";

                let numberVal = "";
                let roomVal = "";
                let room_numberVal = "";
                let guestVal = "";
                let adultsVal = "";
                let childrenVal = "";
                let arrivalVal = "";
                let departureVal = "";
                let noteVal = "";
                let price_per_nightVal = "";
                let total_priceVal = "";
                let channelVal = "";

                for(let i=0;i<len;i++){
                    //<td> - </td>
                    if(number!=""){
                        numberVal = "<td>"+(res[i].number)+"</td>";
                    }

                    if(room!=""){
                        roomVal = "<td>"+(res[i].room)+"</td>";
                    }

                    if(room_number!=""){
                        room_numberVal = "<td>"+(res[i].room_number)+"</td>";
                    }

                    if(guest!=""){
                        guestVal = "<td>"+(res[i].guest)+"</td>";
                    }

                    if(adults!=""){
                        adultsVal = "<td>"+(res[i].men)+"</td>";
                    }

                    if(children!=""){
                        childrenVal = "<td>"+(res[i].children)+"</td>";
                    }

                    if(arrival!=""){
                        arrivalVal = "<td>"+(res[i].arrival)+"</td>";
                    }

                    if(departure!=""){
                        departureVal = "<td>"+(res[i].departure)+"</td>";
                    }

                    if(note!=""){
                        res[i].note = "";
                        noteVal = "<td>"+(res[i].note)+"</td>";
                    }

                    if(price_per_night!=""){
                        price_per_nightVal = "<td>"+(res[i].price_per_night)+"</td>";
                    }

                    if(total_price!=""){
                        total_priceVal = "<td>"+(res[i].total_price)+"</td>";
                    }

                    if(channel!=""){
                        channelVal = "<td>"+(res[i].channel)+"</td>";
                    }

                    html += "<tr><td><input name='tab2' type='checkbox'></td>"+numberVal+roomVal+room_numberVal+guestVal+adultsVal+childrenVal+arrivalVal+departureVal+noteVal+price_per_nightVal+total_priceVal+channelVal+"</tr>"

                }
                html += "</tbody></table>";
                $("#Daily").html(html);
                html = "";

            }

            if(len==0){

                $("#Daily").html("<h2 class='NoData'>Nema podataka za današnji dan.</h2>");

            }

        },
        error: function(xhr, textStatus, errorThrown){ // Error response returns 3 parameters
          window.alert("Doslo je do greske. " + xhr.responseText);
        }

    });

}

function housekeeping(){

    let data = {
        key: main_key,
        account: account_name,
        lcode: main_lcode,
        rooms: JSON.stringify($("#Rooms").val()),
        room_status: JSON.stringify($("#room_status").val()),
        reservation_status: JSON.stringify($("#reservation_status").val()),
        guest_status: JSON.stringify($("#guest_status").val()),
    };
    $.ajax({
        url: api_link + "data/housekeepingReport",
        type: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        data: data,
        dataType: 'JSON',
        success: (response) => {
            console.log(response);

            let res = response.data;

            let rooms = "";
            let roomStatus = "";
            let guestStatus = "";
            let resStatus = "";
            let nextCheckIn = "";
            let nextCheckOut = "";

            rooms = "<th colspan='1'>Tip sobe</th>";
            roomStatus = "<th colspan='1'>Status sobe</th>";
            resStatus = "<th colspan='1'>Status rezervacije</th>";
            guestStatus = "<th colspan='1'>Status gosta</th>";
            nextCheckIn = "<th colspan='1'>Sledeća prijava</th>";
            nextCheckOut = "<th colspan='1'>Sledeća odjava</th>";


            let html = "<table class='table table-bordered' id='myTab3'><thead><tr><th><input id='c3' type='checkbox' onchange='checkAll(event, `myTab3`)'></th>"+rooms+roomStatus+resStatus+guestStatus+nextCheckIn+nextCheckOut+"</tr></thead><tbody>";
            let len = res.length;
            console.log(len);

            let roomsVal = "";
            let roomStatusVal = "";
            let resStatusVal = "";
            let guestStatusVal = "";
            let nextCheckInVal = "";
            let nextCheckOutVal = "";

            for(let i=0;i<len;i++){

                roomsVal = "<td>"+res[i].name+"</td>";


                let temp1 = res[i].next_checkin == ""  ? "" : iso_to_eur(res[i].next_checkin);
                nextCheckInVal = "<td>"+temp1+"</td>";

                let temp2 = res[i].next_checkout == ""  ? "" : iso_to_eur(res[i].next_checkout);
                nextCheckOutVal = "<td>"+temp2+"</td>";

                if(res[i].status==="clean"){
                    res[i].status = "Čisto";
                }
                else if(res[i].status==="dirty"){
                    res[i].status = "Generalno";
                }
                else if(res[i].status==="inspected"){
                    res[i].status = "Obično";
                }

                if(res[i].reservation_status==="arrival"){
                    res[i].reservation_status = "Dolazak";
                }
                else if(res[i].reservation_status==="departure"){
                    res[i].reservation_status = "Odlazak";
                }
                else if(res[i].reservation_status==="stay"){
                    res[i].reservation_status = "Boravak";
                }
                else if(res[i].reservation_status==="free"){
                    res[i].reservation_status = "Slobodno";
                }

                if(res[i].guest_status==="waiting_arrival"){
                    res[i].guest_status = "Čeka se dolazak";
                }
                else if(res[i].guest_status==="arrived"){
                    res[i].guest_status = "Gost došao";
                }
                else if(res[i].guest_status==="arrived_and_paid"){
                    res[i].guest_status = "Gost došao i platio";
                }
                else if(res[i].guest_status==="left"){
                    res[i].guest_status = "Gost se odjavio";
                }

                roomStatusVal = "<td>"+res[i].status+"</td>";
                resStatusVal = "<td>"+res[i].reservation_status+"</td>";
                guestStatusVal = "<td>"+res[i].guest_status+"</td>";

                html += "<tr><td><input name='tab3' type='checkbox'></td>"+roomsVal+roomStatusVal+resStatusVal+guestStatusVal+nextCheckInVal+nextCheckOutVal+"</tr>";
            }
            $("#HouseKeeping").html(html);
            html = "";

        },
        error: function(xhr, textStatus, errorThrown){ // Error response returns 3 parameters
          window.alert("Doslo je do greske. " + xhr.responseText);
        }

    });

}

function clearSUo(par){
    // Calling the display function of each tab on clear
    if(par === "forma1"){

        $("input[name=dFromOccu]").val("");
        $("input[name=dToOccu]").val("");
        $("#tip_sobe").val(null).trigger("change");
        occupancy();

    }
    else if(par === "forma2"){
        // Couldn't figure out how to change the values of select fields
        $("input[name=dDaily]").val("");
        $("#daily").val(null).trigger("change");
        daily();
    }
    else if(par === "forma3"){

        $("#Rooms").val(null).trigger("change");
        $("#room_status").val(null).trigger("change");
        $("#reservation_status").val(null).trigger("change");
        $("#guest_status").val(null).trigger("change");
        housekeeping();
    }

}

function checkAll(event, par){

    let isCheckedAll = event.target.checked;

    let table = document.getElementById(par);

    let row = table.children[1].children;
    let rowLen = table.children[1].children.length;

    if(isCheckedAll === true){

        for(let i=0;i<rowLen;i++){

            row[i].children[0].children[0].checked = true;

        }

    }

    if(isCheckedAll === false){

        for(let i=0;i<rowLen;i++){

            row[i].children[0].children[0].checked = false;

        }

    }

}

let cnt = true;
let checkedNotChecked = {
    checked: [],
    unChecked: []
};
function getChecked(event, par){

    cnt = !cnt;

    let checkbox = null;
    if(par==="myTab"){

        checkbox = "c1";

    }
    else if(par==="myTab2"){

        checkbox = "c2";

    }
    else if(par==="myTab3"){

        checkbox = "c3";

    }

    let table = document.getElementById(par);

    let row = table.children[1].children;
    let rowLen = table.children[1].children.length;

    for(let i=0;i<rowLen;i++){

        if(row[i].children[0].children[0].checked === true){
            checkedNotChecked.checked.push(i);
            //$(row[i]).show(1000, "linear");
        }

        if(row[i].children[0].children[0].checked === false){
            checkedNotChecked.unChecked.push(i);
            //$(row[i]).hide(1000, "linear");
        }

    }

    /*if(checkedNotChecked.unChecked.length === 0){
        document.getElementById(checkbox).checked = true;
        event.target.innerHTML = "Čekirano";
    }
    else{
        document.getElementById(checkbox).checked = false;
        event.target.innerHTML = "Odčekirano";
    }*/

    /*if(cnt === false){
        for(let i=0;i<checkedNotChecked.unChecked.length;i++){
            $(row[checkedNotChecked.unChecked[i]]).hide(1000, "linear");
        }
    }
    if(cnt === true){
        for(let i=0;i<checkedNotChecked.unChecked.length;i++){
            $(row[checkedNotChecked.unChecked[i]]).show(1000, "linear");
        }
    }*/
    cnt = true;

    console.log(checkedNotChecked);

}

function toExcell(par){

    let table = document.getElementById(par);

    let row = table.children[1].children;
    let rowLen = table.children[1].children.length;

    for(let i=0;i<rowLen;i++){

        if(row[i].children[0].children[0].checked === true){
            checkedNotChecked.checked.push(i);
            $(row[i]).attr("data-exclude", "false");
            //$(row[i]).show(1000, "linear");
        }

        if(row[i].children[0].children[0].checked === false){
            checkedNotChecked.unChecked.push(i);
            $(row[i]).attr("data-exclude", "true");
            //$(row[i]).hide(1000, "linear");
        }

    }

    if(checkedNotChecked.checked.length===0){

        for(let i=0;i<rowLen;i++){
            $(row[i]).attr("data-exclude", "false");
        }

    }

    let len = checkedNotChecked.unChecked.length;
    /*for(let i=len;i>=0;i--){
        $("#"+par+" > tbody > tr").eq(checkedNotChecked.unChecked[i]).remove();

    }*/

    checkedNotChecked = {
        checked: [],
        unChecked: []
    };

    TableToExcel.convert(table);
    console.log("Exported to Excell!");

}

$(document).ready(function(){

  // Most of the selects are automaticly initialized, the special ones that need placeholders are moved here from the <script> tag in index.html

  // Select inits
  $('#data_types').select2({
       dropdownAutoWidth: true,
       multiple: true,
       width: '100%',
       placeholder: "Tip podataka",
       allowClear: true
   });

   $('#actions').select2({
       dropdownAutoWidth: true,
       multiple: true,
       width: '100%',
       placeholder: "Akcije",
       allowClear: true,
   });



   $('#room_status').select2({
       dropdownAutoWidth: true,
       multiple: true,
       width: 'element',
       placeholder: "Status sobe",
       allowClear: true,
   });
   $('#reservation_status').select2({
       dropdownAutoWidth: true,
       multiple: true,
       width: 'element',
       placeholder: "Status rezervacije",
       allowClear: true,
   });
   $('#guest_status').select2({
       dropdownAutoWidth: true,
       multiple: true,
       width: 'element',
       placeholder: "Status gosta",
       allowClear: true,
   });


   //Setting select2 field to 100%, since it isn't by default.
   $('.select2-search__field').css('width', '100%');

  // Changelog

  // Triggering calls without button
  $('#dfrom').datepicker().data('datepicker').update(
    {
      position: "bottom left",
      onHide: function(inst, animationCompleted) {
        if(animationCompleted === false)
        {
          changelog_page = 1; // Reset's pages when filter is changed
          get_changelog();
          if(inst.selectedDates.length){
            $('#dto').datepicker().data('datepicker').show();
          }
        }
      }
    }
  );
  $('#dto').datepicker().data('datepicker').update(
    {
      onHide: function(inst, animationCompleted) {
        if(animationCompleted === false)
        {
          changelog_page = 1; // Reset's pages when filter is changed
          get_changelog();
        }
      }
    }
  );


  $("#actions").change(function(){
    changelog_page = 1; // Reset's pages when filter is changed
    get_changelog();
  });
  $("#data_types").change(function(){
    changelog_page = 1; // Reset's pages when filter is changed
    get_changelog();
  });

  // Occupancy

  // Triggering calls without button

  $("#tip_sobe").change(occupancy);

    // let today = todaysDate(); today is already a global variable defined in global.js
    document.getElementById("today").innerHTML = "Dnevni izveštaj za: "+ iso_to_eur(today);


  // Changelog info
  $("#tab_changelog").on("click", ".list_row", function(){
    if($(this).next().hasClass("changelog_info")){
      $("#changelog_info").remove();
      return;
    }
    $("#changelog_info").remove();
    let change = $(this).attr("data-value");
    change = changelog_map[change];
    let all_data = ["", ""]; // 0 - old, 1 - new
    for(let j=0;j<2;j++){ // Getting both old and new data without copying code
      let data;
      if(j == 0){ // Old data - skip on insert
        if(change.action == "insert")
          continue;
        data = change.old_data;
      }
      if(j == 1){ // New data - skip on delete
        if(change.action == "delete")
          continue;
        data = change.new_data;
      }

      if(change.data_type == "reservation"){
        // Channel
        let channel = "Direktna rezervacija";
        if(channels_map[data.id_woodoo] !== undefined)
          channel = channels_map[data.id_woodoo].name;
        // Guest status
        let guest_status = "";
        if(data.guest_status == "waiting_arrival")
          guest_status = "Čeka se dolazak";
        if(data.guest_status == "arrived")
          guest_status = "Došao";
        if(data.guest_status == "arrived_and_paid")
          guest_status = "Došao i platio";
        if(data.guest_status == "left")
          guest_status = "Otišao";
        // Rooms
        var rooms = JSON.parse(data.room_data);
        var rooms_html = "";
        for(var i=0;i<rooms.length;i++)
        {
          let room_numbers = [];
          for(let j=0;j<rooms[i].room_numbers.length;j++){
            let parent_room = rooms_map[rooms[i].parent_id];
            if(parent_room == undefined)
              parent_room = rooms_map[rooms[i].id];
            room_numbers.push(parent_room.room_numbers[rooms[i].room_numbers[j]]);
          }
          rooms_html = rooms_html + `<div>${rooms[i].count}x ${rooms[i].name} (${room_numbers.join(", ")})</div>`;
        }
        if(rooms.length){
          rooms_html = `<label> Jedinice: </label> ${rooms_html}`;
        }
        else {
          rooms_html = "";
        }
        // Services
        var services_html = "";
        var services = JSON.parse(data.services);
        for(var i=0;i<services.length;i++){
          services_html = services_html + `<div>${services[i].amount}x ${services[i].name}</div>`;
        }
        if(services.length){
          services_html = `<label> Usluge: </label> ${services_html}`;
        }
        else {
          services_html = "";
        }
        // Discount
        let discount = JSON.parse(data.discount);
        discount = discount.value + (discount.type == "fixed" ? ` ${currency}` : `%`);
        // Advance
        let payment_gateway_fee = JSON.parse(data.payment_gateway_fee);
        payment_gateway_fee = payment_gateway_fee.value + (payment_gateway_fee.type == "fixed" ? ` ${currency}` : `%`);
        all_data[j] =
        `
          <label> Datum rezervacije: </label> <span> ${iso_to_eur(data.date_received)} </span> <br>
          <label> Datum dolaska: </label> <span> ${iso_to_eur(data.date_arrival)} </span> <br>
          <label> Datum odlaska: </label> <span> ${iso_to_eur(data.date_departure)} </span> <br>
          <label> Kanal: </label> <span> ${channel} </span> <br>
          <label> Gost: </label> <span> ${data.customer_name} ${data.customer_surname} </span> <br>
          <label> Status gosta: </label> <span> ${guest_status} </span> <br>
          <label> Odrasli: </label> <span> ${data.men} </span> <br>
          <label> Deca: </label> <span> ${data.children} </span> <br>
          ${rooms_html}
          ${services_html}
          <label> Popust: </label> <span> ${discount} </span> <br>
          <label> Avans: </label> <span> ${payment_gateway_fee} </span> <br>
          <label> Ukupna cena: </label> <span> ${data.total_price} ${currency} </span> <br>
          <label> Napomena: </label> <div> ${data.note} </div>
        `;
      }
      if(change.data_type == "guest"){
        let id_type = "";
        if(data.id_type == 1)
          id_type = "ID Card";
        if(data.id_type == 2)
          id_type = "Passport";
        all_data[j] =
        `
          <label> Ime: </label> <span> ${data.name} </span> <br>
          <label> Prezime: </label> <span> ${data.surname} </span> <br>
          <label> Email: </label> <span> ${data.email} </span> <br>
          <label> Telefon: </label> <span> ${data.phone} </span> <br>
          <label> Adresa: </label> <span> ${data.address} </span> <br>
          <label> Grad: </label> <span> ${data.place_of_residence} </span> <br>
          <label> Zip: </label> <span> ${data.zip} </span> <br>
          <label> Država: </label> <span> ${iso_countries[data.country_of_residence]} </span> <br>
          <label> Broj isprave: </label> <span> ${data.id_number} </span> <br>
          <label> Tip isprave: </label> <span> ${id_type} </span> <br>
          <label> Pol: </label> <span> ${data.gender} </span> <br>
          <label> Ugosti opet: </label> <span> ${data.host_again == 1 ? "Da" : "Ne"} </span> <br>
          <label> Napomena: </label> <div> ${data.note} </div>
        `;
      }
      if(change.data_type == "invoice"){
        // Payment type
        let payment_type = "Gotovina";
        if(data.payment_type == 2)
          payment_type = "Kartica";
        if(data.payment_type == 3)
          payment_type = "Ček";
        if(data.payment_type == 4)
          payment_type = "Tekući račun";
        if(data.payment_type == 5)
          payment_type = "Ostalo";
        // Services
        var services_html = "";
        var services = JSON.parse(data.services);
        for(var i=0;i<services.length;i++){
          services_html = services_html + `<div>${services[i].amount}x ${services[i].name} (${services[i].price} + ${services[i].tax})</div>`;
        }
        if(services.length){
          services_html = `<label> Usluge: </label> ${services_html}`;
        }
        else {
          services_html = "";
        }
        all_data[j] =
        `
          <label> Tip: </label> <span> ${data.type == 1 ? "Avans" : "Račun"} </span> <br>
          <label> Status: </label> <span> ${data.status == 1 ? "Plaćen" : "Neplaćen"} </span> <br>
          <label> Datum izdavanja: </label> <span> ${iso_to_eur(data.issued)} </span> <br>
          <label> Datum dospeća: </label> <span> ${iso_to_eur(data.delivery)} </span> <br>
          <label> Način plaćanja: </label> <span> ${payment_type} </span> <br>
          <label> Primalac: </label> <span> ${data.name} </span> <br>
          <label> PIN: </label> <span> ${data.pib} </span> <br>
          <label> MB: </label> <span> ${data.mb} </span> <br>
          <label> Broj dokumenta: </label> <span>  </span> <br>
          <label> Adresa: </label> <span> ${data.address} </span> <br>
          <label> Država: </label> <span> </span> <br>
          <label> Email: </label> <span> ${data.email} </span> <br>
          <label> Telefon: </label> <span> ${data.phone} </span> <br>
          <label> Rezervacija na ime: </label> <span> ${data.reservation_name} </span> <br>
          ${services_html}
          <label> Ukupna cena: </label> <span> ${data.price} </span> <br>
          <label> Napomena: </label> <div> ${data.note} </div>
        `;
      }
      if(change.data_type == "room"){
        all_data[j] =
        `
          <label> Naziv: </label> <span> ${data.name} </span> <br>
          <label> Tip: </label> <span> ${data.type} </span> <br>
          <label> Kratki naziv: </label> <span> ${data.shortname} </span> <br>
          <label> Standardna cena: </label> <span> ${data.price} ${currency} </span> <br>
          <label> Raspoloživost: </label> <span> ${data.availability} </span> <br>
          <label> Brojevi soba: </label> <span> ${data.room_numbers.split(",").join(", ")} </span> <br>
          <label> Broj gostiju: </label> <span> ${data.occupancy} </span> <br>
          <label> Površina: </label> <span> ${data.area} </span> <br>
          <label> Broj kupatila: </label> <span> ${data.bathrooms} </span> <br>
          <label> Broj prostorija: </label> <span> ${JSON.parse(data.houserooms).length} </span> <br>
          <label> Sadržaji: </label> <span> ${JSON.parse(data.amenities).join(", ")} </span> <br>
          <label> Koristi na Booking Engine-u: </label> <span> ${data.booking_engine == 1 ? "Da" : "Ne"} </span> <br>
          <label> Opis: </label> <div> ${data.description} </div>
        `;
      }
      if(change.data_type == "extra"){
        // Type
        let type = "";
        if(data.type == "one")
          type = "Jednokratno";
        if(data.type == "room")
          type = "Po sobi";
        if(data.type == "person")
          type = "Po osobi";
        // Period
        let period = "";
        if(data.restriction_plan != "0")
          period = restriction_plans_map[data.restriction_plan].name;
        else
          period = iso_to_eur(data.dfrom) + " - " + iso_to_eur(data.dto);
        all_data[j] =
        `
          <label> Ime: </label> <span> ${data.name} </span> <br>
          <label> Varijacija: </label> <span> ${data.pricing == 1 ? "Povećanje" : "Popust"} </span> <br>
          <label> Cena: </label> <span> ${data.price} ${currency} </span> <br>
          <label> Porez: </label> <span> ${data.tax}% </span> <br>
          <label> Tip: </label> <span> ${type} </span> <br>
          <label> Dnevno: </label> <span> ${data.daily == 1 ? "Da" : "Ne"} </span> <br>
          <label> Period: </label> <span> ${period} </span> <br>
          <label> Opis: </label> <div> ${data.description} </div>
        `;
      }
      if(change.data_type == "channel"){
        all_data[j] =
        `
          <label> Ime: </label> <span> ${data.name} </span> <br>
          <label> Provizija: </label> <span> ${data.commission}% </span> <br>
        `;
      }
      if(change.data_type == "pricingPlan"){
        // Board
        let board = "";
        if(data.board == "nb")
          board = "Samo soba";
        if(data.board == "bb")
          board = "Doručak";
        if(data.board == "hb")
          board = "Polupansion";
        if(data.board == "fb")
          board = "Pun pansion";
        if(data.board == "ai")
          board = "All inclusive";
        if(data.type == "daily"){
          all_data[j] =
          `
            <label> Ime: </label> <span> ${data.name} </span> <br>
            <label> Politika otkazivanja: </label> <span> ${policies_map[data.policy].name} </span> <br>
            <label> Koristi na Booking Engine-u: </label> <span> ${data.booking_engine == 1 ? "Da" : "Ne"} </span> <br>
            <label> Restrikcije: </label> <span> ${data.restriction_plan == "" ? "Bez restrikcija" : restriction_plans_map[data.restriction_plan].name} </span> <br>
            <label> Obroci: </label> <span> ${board} </span> <br>
            <label> Opis: </label> <div> ${data.description} </div>
          `;
        }
        else {
          // Variation type
          let variation = "";
          if(data.variation_type == "-2")
            variation = "- (EUR)";
          if(data.variation_type == "-1")
            variation = "- (%)";
          if(data.variation_type == "1")
            variation = "+ (%)";
          if(data.variation_type == "2")
            variation = "+ (EUR)";
          all_data[j] =
          `
            <label> Ime: </label> <span> ${data.name} </span> <br>
            <label> Tip varijacije: </label> <span> ${variation} </span> <br>
            <label> Varijacija: </label> <span> ${data.variation} </span> <br>
            <label> Politika otkazivanja: </label> <span> ${policies_map[data.policy].name} </span> <br>
            <label> Koristi na Booking Engine-u: </label> <span> ${data.booking_engine == 1 ? "Da" : "Ne"} </span> <br>
            <label> Restrikcije: </label> <span> ${data.restriction_plan == "" ? "Bez restrikcija" : restriction_plans_map[data.restriction_plan].name} </span> <br>
            <label> Obroci: </label> <span> ${board} </span> <br>
            <label> Opis: </label> <div> ${data.description} </div>
          `;
        }
      }
      if(change.data_type == "restrictionPlan"){
        if(data.type == "daily"){
          all_data[j] =
          `
            <label> Ime: </label> <span> ${data.name} </span> <br>
          `;
        }
        else {
          let rules = JSON.parse(data.rules);
          all_data[j] =
          `
            <label> Ime: </label> <span> ${data.name} </span> <br>
            <label> Zatvoreno: </label> <span> ${rules.closed == 1 ? "Da" : "Ne"} </span> <br>
            <label> Zatvoreno za dolaske: </label> <span> ${rules.closed_arrival == 1 ? "Da" : "Ne"} </span> <br>
            <label> Zatvoreno za odlaske: </label> <span> ${rules.closed_departure == 1 ? "Da" : "Ne"} </span> <br>
            <label> Maksimalni boravak: </label> <span> ${rules.max_stay} </span> <br>
            <label> Minimalni boravak: </label> <span> ${rules.min_stay} </span> <br>
            <label> Minimalni boravak za dolaske: </label> <span> ${rules.min_stay_arrival} </span>
          `;
        }
      }
      if(change.data_type == "promocode"){
        // Type
        let type = "";
        if(data.type == "all")
          type = "Sve";
        if(data.type == "room")
          type = "Sobe";
        if(data.type == "extras")
          type = "Dodaci";
        all_data[j] =
        `
          <label> Ime: </label> <span> ${data.name} </span> <br>
          <label> Kod: </label> <span> ${data.code} </span> <br>
          <label> Tip: </label> <span> ${type} </span> <br>
          <label> Iznos: </label> <span> ${data.value}${data.type == "fixed" ? " EUR" : "%"} </span> <br>
          <label> Opis: </label> <div> ${data.description} </div>
        `;
      }
      if(change.data_type == "policy"){
        // Type
        let type = "";
        if(data.type == "firstNight")
          type = "First Night";
        if(data.type == "amountPercentage")
          type = "Amount Percentage";
        if(data.type == "noPenalty")
          type = "No Penalty";
        if(data.type == "entireAmount")
          type = "Entire Amount";
        if(data.type == "notRefundable")
          type = "Not Refundable";
        if(data.type == "notRefImmediate")
          type = "Not Ref, immediate charge";
        if(data.type == "custom")
          type = "Custom";
        all_data[j] =
        `
          <label> Ime: </label> <span> ${data.name} </span> <br>
          <label> Tip: </label> <span> ${type} </span> <br>
          <label> Besplatno otkazivanje: </label> <span> ${data.enableFreeDays == 1 ? "Da" : "Ne"} </span> <br>
          <label> Broj dana za besplatno otkazivanje: </label> <span> ${data.freeDays} </span> <br>
          <label> Opis: </label> <div> ${data.description} </div>
        `;
      }
      if(change.data_type == "user"){
        let access_names = ["Sakriveno", "Samo prikaz", "Prikaz i unos", "Puna prava"];
        // Properties
        let properties_html = "";
        let lcodes = data.properties.split(",");
        for(let i=0;i<lcodes.length;i++){
          properties_html += `<div>${properties_map[lcodes[i]].name}</div>`;
        }
        if(lcodes.length){
          properties_html = `<label> Properties: </label> ${properties_html} `;
        }
        else {
          properties_html = "";
        }
        all_data[j] =
        `
          <label> Ime: </label> <span> ${data.client_name} </span> <br>
          <label> Email: </label> <span> ${data.username} </span> <br>
          <label> Rezervacije: </label>  <span> ${access_names[parseInt(data.reservations)]} </span> <br>
          <label> Gosti: </label>  <span> ${access_names[parseInt(data.guests)]} </span> <br>
          <label> Računi: </label>  <span> ${access_names[parseInt(data.invoices)]} </span> <br>
          <label> Cene: </label>  <span> ${access_names[parseInt(data.prices)]} </span> <br>
          <label> Restrikcije: </label>  <span> ${access_names[parseInt(data.restrictions)]} </span> <br>
          <label> Raspoloživost: </label>  <span> ${access_names[parseInt(data.avail)]} </span> <br>
          <label> Podešavanja jedinica: </label>  <span> ${access_names[parseInt(data.rooms)]} </span> <br>
          <label> Podešavanja kanala: </label>  <span> ${access_names[parseInt(data.channels)]} </span> <br>
          <label> Statistika: </label>  <span> ${access_names[parseInt(data.statistics)]} </span> <br>
          ${properties_html}
        `;
      }
    }
    // Avail, prices and restrictions will be handled separately
    if(change.data_type == "avail"){
      // Old values
      let old_data = change.old_data;
      let old_rooms = {};
      for(let j=0;j<real_rooms_list.length;j++){
        old_rooms[real_rooms_list[j]] = {};
      }
      for(let i=0;i<old_data.length;i++){
        let cur_date = old_data[i]["avail_date"];
        for(let j=0;j<real_rooms_list.length;j++){
          old_rooms[real_rooms_list[j]][cur_date] = old_data[i]["room_" + real_rooms_list[j]];
        }
      }
      let old_rooms_html = display_rest_details_changelog(old_rooms, "avail", old_data[0]["avail_date"], old_data.length);
      // New values
      let new_data = change.new_data;
      let new_rooms = {};
      for(let j=0;j<real_rooms_list.length;j++){
        new_rooms[real_rooms_list[j]] = {};
      }
      for(let i=0;i<new_data.length;i++){
        let cur_date = new_data[i]["avail_date"];
        for(let j=0;j<real_rooms_list.length;j++){
          new_rooms[real_rooms_list[j]][cur_date] = new_data[i]["room_" + real_rooms_list[j]];
        }
      }
      let new_rooms_html = display_rest_details_changelog(new_rooms, "avail", new_data[0]["avail_date"], new_data.length);
      // Add to changelog info html if old and new are different;
      for(let i=0;i<real_rooms_list.length;i++){
        if(old_rooms_html[real_rooms_list[i]] != new_rooms_html[real_rooms_list[i]]){
          all_data[0] += old_rooms_html[real_rooms_list[i]];
          all_data[1] += new_rooms_html[real_rooms_list[i]];
        }
      }
    }
    if(change.data_type == "price"){
      // Old values
      let old_data = change.old_data;
      let old_rooms = {};
      for(let j=0;j<rooms_list.length;j++){
        old_rooms[rooms_list[j]] = {};
      }
      for(let i=0;i<old_data.length;i++){
        let cur_date = old_data[i]["price_date"];
        for(let j=0;j<rooms_list.length;j++){
          old_rooms[rooms_list[j]][cur_date] = old_data[i]["room_" + rooms_list[j]];
        }
      }
      let old_rooms_html = display_rest_details_changelog(old_rooms, "price", old_data[0]["price_date"], old_data.length);
      // New values
      let new_data = change.new_data;
      let new_rooms = {};
      for(let j=0;j<rooms_list.length;j++){
        new_rooms[rooms_list[j]] = {};
      }
      for(let i=0;i<new_data.length;i++){
        let cur_date = new_data[i]["price_date"];
        for(let j=0;j<rooms_list.length;j++){
          new_rooms[rooms_list[j]][cur_date] = new_data[i]["room_" + rooms_list[j]];
        }
      }
      let new_rooms_html = display_rest_details_changelog(new_rooms, "price", new_data[0]["price_date"], new_data.length);

      // Add to changelog info html if old and new are different;
      for(let i=0;i<rooms_list.length;i++){
        if(old_rooms_html[rooms_list[i]] != new_rooms_html[rooms_list[i]]){
          all_data[0] += old_rooms_html[real_rooms_list[i]];
          all_data[1] += new_rooms_html[real_rooms_list[i]];
        }
      }
    }
    if(change.data_type == "restriction"){
      let old_data = change.old_data;
      let old_rooms = {};
      for(let j=0;j<rooms_list.length;j++){
        old_rooms[rooms_list[j]] = {};
      }
      for(let i=0;i<old_data.length;i++){
        let cur_date = old_data[i]["restriction_date"];
        for(let j=0;j<rooms_list.length;j++){
          old_rooms[rooms_list[j]][cur_date] = {};
          old_rooms[rooms_list[j]][cur_date]["min_stay"] = old_data[i]["min_stay_" + rooms_list[j]];
          old_rooms[rooms_list[j]][cur_date]["max_stay"] = old_data[i]["max_stay_" + rooms_list[j]];
          old_rooms[rooms_list[j]][cur_date]["closed"] = old_data[i]["closed_" + rooms_list[j]];
          old_rooms[rooms_list[j]][cur_date]["no_ota"] = old_data[i]["no_ota_" + rooms_list[j]];
        }
      }

      let new_data = change.new_data;
      let new_rooms = {};
      for(let j=0;j<rooms_list.length;j++){
        new_rooms[rooms_list[j]] = {};
      }
      for(let i=0;i<new_data.length;i++){
        let cur_date = new_data[i]["restriction_date"];
        for(let j=0;j<rooms_list.length;j++){
          new_rooms[rooms_list[j]][cur_date] = {};
          new_rooms[rooms_list[j]][cur_date]["min_stay"] = new_data[i]["min_stay_" + rooms_list[j]];
          new_rooms[rooms_list[j]][cur_date]["max_stay"] = new_data[i]["max_stay_" + rooms_list[j]];
          new_rooms[rooms_list[j]][cur_date]["closed"] = new_data[i]["closed_" + rooms_list[j]];
          new_rooms[rooms_list[j]][cur_date]["no_ota"] = new_data[i]["no_ota_" + rooms_list[j]];
        }
      }

      // Min

      // Old values
      let old_rooms_html = display_rest_details_changelog(old_rooms, "min", old_data[0]["restriction_date"], old_data.length);
      // New values
      let new_rooms_html = display_rest_details_changelog(new_rooms, "min", new_data[0]["restriction_date"], new_data.length);
      // Add to changelog info html if old and new are different;
      for(let i=0;i<rooms_list.length;i++){
        if(old_rooms_html[rooms_list[i]] != new_rooms_html[rooms_list[i]]){
          all_data[0] += old_rooms_html[real_rooms_list[i]];
          all_data[1] += new_rooms_html[real_rooms_list[i]];
        }
      }

      // Max

      // Old values
      old_rooms_html = display_rest_details_changelog(old_rooms, "max", old_data[0]["restriction_date"], old_data.length);
      // New values
      new_rooms_html = display_rest_details_changelog(new_rooms, "max", new_data[0]["restriction_date"], new_data.length);
      // Add to changelog info html if old and new are different;
      for(let i=0;i<rooms_list.length;i++){
        if(old_rooms_html[rooms_list[i]] != new_rooms_html[rooms_list[i]]){
          all_data[0] += old_rooms_html[real_rooms_list[i]];
          all_data[1] += new_rooms_html[real_rooms_list[i]];
        }
      }

      // Closed

      // Old values
      old_rooms_html = display_rest_details_changelog(old_rooms, "closure", old_data[0]["restriction_date"], old_data.length);
      // New values
      new_rooms_html = display_rest_details_changelog(new_rooms, "closure", new_data[0]["restriction_date"], new_data.length);
      // Add to changelog info html if old and new are different;
      for(let i=0;i<rooms_list.length;i++){
        if(old_rooms_html[rooms_list[i]] != new_rooms_html[rooms_list[i]]){
          all_data[0] += old_rooms_html[real_rooms_list[i]];
          all_data[1] += new_rooms_html[real_rooms_list[i]];
        }
      }

      // OTA

      // Old values
      old_rooms_html = display_rest_details_changelog(old_rooms, "ota", old_data[0]["restriction_date"], old_data.length);
      // New values
      new_rooms_html = display_rest_details_changelog(new_rooms, "ota", new_data[0]["restriction_date"], new_data.length);
      // Add to changelog info html if old and new are different;
      for(let i=0;i<rooms_list.length;i++){
        if(old_rooms_html[rooms_list[i]] != new_rooms_html[rooms_list[i]]){
          all_data[0] += old_rooms_html[real_rooms_list[i]];
          all_data[1] += new_rooms_html[real_rooms_list[i]];
        }
      }
    }

    // Setting headers for visible data only
    let old_header = "<div class='section_title'> Stare vrednosti </div>";
    let new_header = "<div class='section_title'> Nove vrednosti </div>";
    if(change.action == "insert"){
      old_header = "";
    }
    if(change.action == "delete"){
      new_header = "";
    }
    $(this).after(`
      <div id='changelog_info' class='changelog_info'>
        <div class='changelog_info_data_container'> ${old_header} ${all_data[0]} </div>
        <div class='changelog_info_data_container'> ${new_header} ${all_data[1]} </div>
      </div>`);
  });

});

function display_rest_details_changelog(data, field, rest_dfrom, length){

  let allData = {};
  let all_details_dates = range_of_dates(rest_dfrom, length);
  let rooms = rooms_list;
  if(field == "avail")
    rooms = real_rooms_list;

  for(let i=0;i<rooms.length;i++){

    var room_id = rooms[i];
    var room_data = []; // All data for one room
    let segment = {}; // A single segment - with same values
    // Getting start value from data based on field
    let cur_val = 0;
    if(field == "avail" || field == "price")
      cur_val = data[room_id][rest_dfrom];
    if(field == "min")
      cur_val = data[room_id][rest_dfrom]["min_stay"];
    if(field == "max")
      cur_val = data[room_id][rest_dfrom]["max_stay"];
    if(field == "closure")
      cur_val = data[room_id][rest_dfrom]["closed"];
    if(field == "ota")
      cur_val = data[room_id][rest_dfrom]["no_ota"];

    // Init segment
    segment["length"] = 0;
    segment["value"] = cur_val;

    for(let j=0;j<all_details_dates.length - 1;j++){
      // Get current value of correct field
      if(data[room_id][all_details_dates[j]] != undefined){
        if(field == "avail" || field == "price")
          cur_val = data[room_id][all_details_dates[j]];
        if(field == "min")
          cur_val = data[room_id][all_details_dates[j]]["min_stay"];
        if(field == "max")
          cur_val = data[room_id][all_details_dates[j]]["max_stay"];
        if(field == "closure")
          cur_val = data[room_id][all_details_dates[j]]["closed"];
        if(field == "ota")
          cur_val = data[room_id][all_details_dates[j]]["no_ota"];
      }
      else { // Use last known value if something fails
        let x = j;
        while(data[room_id][all_details_dates[x]] == undefined && x >= 0){
          x -= 1;
        }
        if(field == "avail" || field == "price")
          cur_val = data[room_id][all_details_dates[x]];
        if(field == "min")
          cur_val = data[room_id][all_details_dates[x]]["min_stay"];
        if(field == "max")
          cur_val = data[room_id][all_details_dates[x]]["max_stay"];
        if(field == "closure")
          cur_val = data[room_id][all_details_dates[x]]["closed"];
        if(field == "ota")
          cur_val = data[room_id][all_details_dates[x]]["no_ota"];
      }

      if(segment.value == cur_val){
        segment.length = segment.length + 1;
      }
      else {
        room_data.push(JSON.parse(JSON.stringify(segment))); // Push old segment
        segment.length = 1;
        segment.value = cur_val;
        // New segment already started, so length is 1 and value is the new value
      }
    }
    room_data.push(JSON.parse(JSON.stringify(segment))); // Insert last segment

    // Adding additional segment info

    var total_length = all_details_dates.length;
    var cur_length = 0;
    // Getting min, max and delta values
    var segmentMin = room_data[0].value;
    var segmentMax = room_data[0].value;
    for(var j=0;j<room_data.length;j++){
      segmentMin = segmentMin < room_data[j].value ?  segmentMin : room_data[j].value;
      segmentMax = segmentMax > room_data[j].value ?  segmentMax : room_data[j].value;
    }
    var segmentDelta = segmentMax - segmentMin;
    if(segmentDelta == 0){ // All values are same
      segmentMin = 0;
      if(segmentMax == 0){ // All values are 0
        segmentMax = 1;
      }
      segmentDelta = segmentMax;
    }

    // Adding width and dates to each segment
    for(var j=0;j<room_data.length;j++)
    {
      room_data[j]["dfrom"] = all_details_dates[cur_length]; // Start date is current length
      cur_length += room_data[j].length; // Add segment length to current
      room_data[j]["dto"] = all_details_dates[cur_length - 1]; // End date is end of segment
      room_data[j]["width"] = (room_data[j].length * 100) / total_length; // % width
      let scaledHeight = (room_data[j].value - segmentMin) / segmentDelta; // Height scaled to 0 - 1
      scaledHeight = (scaledHeight * 0.8) + 0.2; // Height scaled to 0.2 - 1.0
      room_data[j]["height"] = scaledHeight * 100; // Height in %
    }
    allData[room_id] = room_data;
  }

  let action_name = "";
  if(field == "min")
    action_name = " (Min. boravak)";
  if(field == "max")
    action_name = " (Maks. boravak)";
  if(field == "closure")
    action_name = " (Zatvoreno)";
  if(field == "ota")
    action_name = " (No OTA)";

  let rooms_html_map = {};
  for(var i=0;i<rooms.length;i++){
    let graph_html = "";
    let green = "#6cd425";
    let red = "#f0535a";
    if(rooms_map[rooms[i]].parent_room != '0'){
      green = "#4e9f69";
      red = "#905f84";
    }
    rooms_html_map[rooms[i]] = ""
    for(let j=0;j<allData[rooms[i]].length;j++){
      // Different data for closure and no_ota
      if(field == "closure"){
        rooms_html_map[rooms[i]] += `
        <div class='rest_details_data_item' style='width:${allData[rooms[i]][j].width}%;height:100%;'>
          <div style='height:100%;width:100%;background-color:${allData[rooms[i]][j].value == 1 ? red : green};'></div>
          <div class='rest_tooltip'>
            <div>
              ${iso_to_eur(allData[rooms[i]][j].dfrom)} - ${iso_to_eur(allData[rooms[i]][j].dto)}
            </div>
            <div>
              ${allData[rooms[i]][j].value == 1 ? "Closed" : "Opened"}
            </div>
          </div>
        </div>`;
      }
      else if(field == "ota"){
        rooms_html_map[rooms[i]] += `
        <div class='rest_details_data_item' style='width:${allData[rooms[i]][j].width}%;height:100%;'>
          <div style='height:100%;width:100%;background-color:${allData[rooms[i]][j].value == 1 ? red : green};'></div>
          <div class='rest_tooltip'>
            <div>
              ${iso_to_eur(allData[rooms[i]][j].dfrom)} - ${iso_to_eur(allData[rooms[i]][j].dto)}
            </div>
            <div>
              ${allData[rooms[i]][j].value == 1 ? "OTA blocked" : "OTA allowed"}
            </div>
          </div>
        </div>`;
      }
      else {
        rooms_html_map[rooms[i]] += `
        <div class='rest_details_data_item' style='width:${allData[rooms[i]][j].width}%;height:100%;'>
          <div style='height:${allData[rooms[i]][j].height}%;width:100%;background-color:${green};'></div>
          <div class='rest_tooltip'>
            <div>
              ${iso_to_eur(allData[rooms[i]][j].dfrom)} - ${iso_to_eur(allData[rooms[i]][j].dto)}
            </div>
            <div>
              ${allData[rooms[i]][j].value}
            </div>
          </div>
        </div>`;
      }

    }
    rooms_html_map[rooms[i]] = `<div class='rest_details_row'>
      <div class='rest_details_name' style='${action_name == "" ? "" : "width:140px;"}'>
        ${rooms_map[rooms[i]].shortname}${action_name}
      </div>
      <div class='rest_details_data'>
      ${rooms_html_map[rooms[i]]}
      </div>
    </div>`;
  }

  return rooms_html_map;
};
