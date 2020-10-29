<?php

/*-----------------------------------Returns user in json format-------------------------------------------------*/

//Method: POST.
//Prepping url, body and header.
$url1 = 'https://www.test.portal.eturista.gov.rs/eturistwebapi/api/Autentifikacija/PrijavaKorisnickoImeLozinka';
$jsonBody1 = '{"korisnickoIme":"milica.bobaraseta@gmail.com","lozinka":"8?1k$K5V"}';
$header1 = ["Accept: application/json","Content-Type:application/json,charset=UTF-8"];

function getUser($url,$data,$headers){//First parameter is url where you submit your query, second is data needed to be passed and third one is json header flag since datas is json.
    
    $ch = curl_init($url);

    $query = $data;

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    curl_setopt($ch,CURLOPT_POST, true);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $query);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "Curl error: " . curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return json_decode(json_decode($response));

}
//print_r(getUser($url1,$jsonBody1,$header1));

/*------------------------------------Function for refreshing user's token------------------------------------------------*/

//Method: GET.
//Prepping data for header. Look above for how to get value of $user variable.
$user = getUser($url1,$jsonBody1,$header1);
$token = $user->token;
$refreshToken = $user->refreshToken;
$url2 = "https://www.test.portal.eturista.gov.rs/eturistwebapi/api/Autentifikacija/OsveziToken";
$header2 = ["Content-Type:application/json", "Authorization: Bearer ".$token, "refreshToken: ".$refreshToken];

function refreshToken($url,$headers){

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "Curl error: " . curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return $response;

}
//print_r(refreshToken($url2,$header2));

/*-------------------------------------Function for registration of particular user-----------------------------------------------*/

//Method: POST.
//Prepping url, body and header.
$url3 = "https://www.test.portal.eturista.gov.rs/eturistwebapi/api/hoteliimport/checkin";
$jsonBody3 = '{ "OsnovniPodaci":{ "ExternalId":"T-100008", "Izmena":"false", "DaLiJeLiceDomace":"false", "DaLiJeLiceRodjenoUInostranstvu":"true", "Ime":"Milica", "Prezime":"Marković", "DatumRodjenja":"1993-02-17", "PolSifra":"Z", "Jmbg":"", "OpstinaRodjenjaMaticniBroj":"", "OpstinaRodjenjaNaziv":"", "MestoRodjenjaMaticniBroj":"", "MestoRodjenjaNaziv":"Sarajevo", "DrzavaRodjenjaAlfa2":"", "DrzavaRodjenjaAlfa3":"BIH", "DrzavljanstvoAlfa2":"BA", "DrzavljanstvoAlfa3":"", "OpstinaPrebivalistaMaticniBroj":"", "OpstinaPrebivalistaNaziv":"", "MestoPrebivalistaMaticniBroj":"", "MestoPrebivalistaNaziv":"", "DrzavaPrebivalistaAlfa2":"", "DrzavaPrebivalistaAlfa3":"" }, "IdentifikacioniDokumentStranogLica":{ "VrstaPutneIspraveSifra":"3", "BrojPutneIsprave":"123", "DatumIzdavanjaPutneIsprave":"2019-02-22", "VrstaVizeSifra":"6", "BrojVize":"228282", "MestoIzdavanjaVize":"Sarajevo", "DatumUlaskaURepublikuSrbiju":"2019-05-06", "MestoUlaskaURepublikuSrbijuSifra":"42", "MestoUlaskaURepublikuSrbiju":"МАЛИ ЗВОРНИК", "DatumDoKadaJeOdobrenBoravakURepubliciSrbiji":"2020-04-04" }, "PodaciOBoravku":{ "UgostiteljskiObjekatJedinstveniIdentifikator":"30000356", "VrstaPruzenihUslugaSifra":"1", "NacinDolaskaSifra":"04", "NazivAgencije":"Moj Turista", "BrojSmestajneJedinice":"9 A", "SpratSmestajneJedinice":"3 B", "DatumICasDolaska":"2019-08-08 11:10", "UslovZaUmanjenjeBoravisneTakseSifra":"3", "RazlogBoravkaSifra":"3" } }';
$header3 = ["Accept: application/json","Content-Type:application/json", "Authorization: Bearer ".$token];

function prijavljivanjeRS($url,$data,$headers){

    $ch = curl_init($url);

    $query = $data;

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    curl_setopt($ch,CURLOPT_POST, true);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $query);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "Curl error: " . curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return $response;

}
//print_r(prijavljivanjeRS($url3,$jsonBody3,$header3));

/*--------------------------------------Function for unregistering of particular user----------------------------------------------*/

//Method: POST.
//Prepping url, body and header.
$url4 = "https://www.test.portal.eturista.gov.rs/eturistwebapi/api/hoteliimport/checkout";
$jsonBody4 = '{"DatumICasOdjave":"2019-08-10 12:35","UgostiteljskiObjekatJedinstveniIdentifikator":"30000356","ExternalId":"T-100008"}';
$header4 = ["Accept: application/json","Content-Type:application/json", "Authorization: Bearer ".$token];

function odjavljivanjeRS($url,$data,$headers){

    $ch = curl_init($url);

    $query = $data;

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    curl_setopt($ch,CURLOPT_POST, true);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $query);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "Curl error: " . curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return $response;

}
//print_r(odjavljivanjeRS($url4,$jsonBody4,$header4))

?>