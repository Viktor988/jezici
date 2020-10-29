<?php

$testUrl1 = "http://localhost/xmlovi/responsePost.php";//Test lokacija za response na osnovu request-a.
$testUrl2 = "http://localhost/xmlovi/responseGet.php";//Test lokacija za response na osnovu request-a.

$url = "https://rb90.dokumenta.me/publicws/mup/MupImpl?wsdl";//Pravi url iz dokumentacije.

/*

Function here are displayed and named by order and by convention in it's respective document.

*/
/*-------------------------------------------------------------------------*/

//Method GET.
//Prepping mock url and mock get parameters.

$object1 = new stdClass();
$object1->authenticateRequest = "123@CAnaziv";

function authenticate($url, $object){

    $params = http_build_query([$object->authenticateRequest]);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url."?".$params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    $response = curl_exec($ch);

    if($response  === false){
        echo "cURL error: " . curl_error($ch).". <br>Error NO: ".curl_errno($ch).".<br>";
    }
    else{
        echo "Success.<br>";
    }
    curl_close($ch);

    return $response;  

}
//print_r(authenticate($testUrl2,$object1));

/*-------------------------------------------------------------------------*/

//Method POST.
//Prepping mock url and mock post parameters.
$object2 = new stdClass();

$tipGosta = new stdClass();
$tipGosta->id = 1;
$tipGosta->naziv = "strani";

$drzava = new stdClass();
$drzava->kod = "USA";
$drzava->naziv = "USA";

$vrstaJavneIsprave = new stdClass();
$vrstaJavneIsprave->id = 1;
$vrstaJavneIsprave->naziv = "pasos";

$granicniPrelaz = new stdClass();
$granicniPrelaz->id = 1;
$granicniPrelaz->naziv = "pasos";

$opstina = new stdClass();
$opstina->kod = "KOT";
$opstina->naziv = "KOTOR";

$mjesto = new stdClass();
$mjesto->kod = "KOT";
$mjesto->naziv = "KOTOR";

$smjestajniObjekat = new stdClass();
$smjestajniObjekat->id = 1;
$smjestajniObjekat->naziv = "apartman";

$user = new stdClass();
$user->id = 1;
$user->imePrezime = "apartman";
$user->idUloge = 1;
$user->nazivUloge = "sef";

$object2->addPersonRequest = new stdClass();
$object2->addPersonRequest->stranac = new stdClass();
$object2->addPersonRequest->stranac->id = 1;
$object2->addPersonRequest->stranac->tipGosta = $tipGosta;
$object2->addPersonRequest->stranac->maticniBroj = "2203963";
$object2->addPersonRequest->stranac->prezime = "Doe";
$object2->addPersonRequest->stranac->ime = "John";
$object2->addPersonRequest->stranac->pol ="m";
$object2->addPersonRequest->stranac->datumRodjenja = "01/01/1970/";
$object2->addPersonRequest->stranac->drzavaRodjenja = $drzava;
$object2->addPersonRequest->stranac->gradRodjenja = "New Jersey";
$object2->addPersonRequest->stranac->drzavljanstvo = $drzava;
$object2->addPersonRequest->stranac->drzavaIzdavanjaDokumenta = $drzava;
$object2->addPersonRequest->stranac->vrstaJavneIsprave = $vrstaJavneIsprave;
$object2->addPersonRequest->stranac->brojJavneIsprave = "12345";
$object2->addPersonRequest->stranac->izdavaocJavneIsprave = "mup";
$object2->addPersonRequest->stranac->rokVazenjaIsprave = "01/01/1970/";
$object2->addPersonRequest->stranac->vrstaVize = "A";
$object2->addPersonRequest->stranac->brojVize = "12345";
$object2->addPersonRequest->stranac->mjestoIzdavanjaVize = "USA";
$object2->addPersonRequest->stranac->rokVazenjaVizeOd = "01/01/1970/";
$object2->addPersonRequest->stranac->rokVazenjaVizeDo = "01/01/1970/";
$object2->addPersonRequest->stranac->datumUlaskaUCG = "01/01/1970/"; 
$object2->addPersonRequest->stranac->mjestoUlaskaUCG = $granicniPrelaz;
$object2->addPersonRequest->stranac->opstinaBoravka = $opstina;
$object2->addPersonRequest->stranac->mjestoBoravka = $mjesto;
$object2->addPersonRequest->stranac->adresaBoravkaiKucniBroj = "Njegoseva 4/8";
$object2->addPersonRequest->stranac->prezimeKorisnikaObjekta = "Doe";
$object2->addPersonRequest->stranac->imeKorisnikaObjekta = "John";
$object2->addPersonRequest->stranac->jmbgKorisnikaObjekta = "12345";
$object2->addPersonRequest->stranac->datumPrijave = "01/01/1970/";
$object2->addPersonRequest->stranac->datumOdjave = "01/01/1970/";
$object2->addPersonRequest->stranac->drzavaPrebivalista = $drzava;
$object2->addPersonRequest->stranac->gradPrebivalista =" New Jersey";
$object2->addPersonRequest->stranac->adresaiBrojPrebivalista = "Tulip Street";
$object2->addPersonRequest->stranac->davaocSmjestaja = $smjestajniObjekat;
$object2->addPersonRequest->stranac->azurirao = $user;
$object2->addPersonRequest->stranac->obrisan = false;
$object2->addPersonRequest->azurirao = $user->id;
$object2->addPersonRequest->potpisani_zahtjev = $object1->authenticateRequest;
$object2->addPersonRequest->podaci = "1,1,2203963,Doe,John,m,01/01/1970/,1,New Jersey,USA,USA,1,12345,mup,01/01/2022/,A,12345,USA,01/01/2019/,01/01/2022/,01/03/2019/,1,KOT,KOT,Njegoseva 4/14,Markovic,Marko,12345,01/04/2019/,02/04/2019/,MNE,Kotor,Njegoseva 4/14,1,1,0,";

function addPerson($url, $addPersonRequest){

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($addPersonRequest));
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
//print_r(addPerson($testUrl1,$object2));

/*-------------------------------------------------------------------------*/

//Method POST.
//Prepping mock url and mock post parameters.
$object3 = new stdClass();
$object3->searchPersonRequest = new stdClass();
$object3->searchPersonRequest->searchPersonParams = new stdClass();
$object3->searchPersonRequest->searchPersonParams->ime = "John";
$object3->searchPersonRequest->searchPersonParams->prezime = "Doe";
$object3->searchPersonRequest->searchPersonParams->tipDokumenta = 1;
$object3->searchPersonRequest->searchPersonParams->brojDokumenta = "12345";
$object3->searchPersonRequest->searchPersonParams->drzavaIzdavanjaDokumenta = "USA";
$object3->searchPersonRequest->searchPersonParams->datumOd = "01/01/1970/";
$object3->searchPersonRequest->searchPersonParams->datumDo = "01/01/1970/";
$object3->searchPersonRequest->searchPersonParams->smjestajniObjekat = 1;
$object3->searchPersonRequest->potpisani_zahtjev = $object1->authenticateRequest;
$object3->searchPersonRequest->podaci = "1,1,2203963,Doe,John,m,01/01/1970/,1,New Jersey,USA,USA,1,12345,mup,01/01/2022/,A,12345,USA,01/01/2019/,01/01/2022/,01/03/2019/,1,KOT,KOT,Njegoseva 4/14,Markovic,Marko,12345,01/04/2019/,02/04/2019/,MNE,Kotor,Njegoseva 4/14,1,1,0,";
$object3->searchPersonRequest->korisnik_id = 1;

function searchPerson($url, $searchPersonRequest){
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($searchPersonRequest));
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
//print_r(searchPerson($testUrl1,$object3));

/*-------------------------------------------------------------------------*/

//Method POST.
//Prepping mock url and mock post parameters.
$object4 = new stdClass();
$object4->editPersonRequest = new stdClass();

$stranac = $object2->addPersonRequest->stranac;

$object4->editPersonRequest->stranac = $stranac;
$object4->editPersonRequest->potpisani_zahtjev = $object1->authenticateRequest;
$object4->editPersonRequest->podaci = "1,1,2203963,Doe,John,m,01/01/1970/,1,New Jersey,USA,USA,1,12345,mup,01/01/2022/,A,12345,USA,01/01/2019/,01/01/2022/,01/03/2019/,1,KOT,KOT,Njegoseva 4/14,Markovic,Marko,12345,01/04/2019/,02/04/2019/,MNE,Kotor,Njegoseva 4/14,1,1,0,";
$object4->editPersonRequest->azurirao = $user->id;

function editPerson($url, $editPersonRequest){

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($editPersonRequest));
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
//print_r(editPerson($testUrl1,$object4));

/*-------------------------------------------------------------------------*/

//Method POST.
//Prepping mock url and mock post parameters.

$object5 = new stdClass();
$object5->smjestajniObjektiListRequest = new stdClass();
$object5->smjestajniObjektiListRequest->kodOpstine = "KOT";
$object5->smjestajniObjektiListRequest->korisnik_id = 1;
$object5->smjestajniObjektiListRequest->potpisani_zahtjev = $object1->authenticateRequest;
$object5->smjestajniObjektiListRequest->podaci = "1,1,2203963,Doe,John,m,01/01/1970/,1,New Jersey,USA,USA,1,12345,mup,01/01/2022/,A,12345,USA,01/01/2019/,01/01/2022/,01/03/2019/,1,KOT,KOT,Njegoseva 4/14,Markovic,Marko,12345,01/04/2019/,02/04/2019/,MNE,Kotor,Njegoseva 4/14,1,1,0,";

function smjestajniObjektiList($url, $smjestajniObjektiListRequest){

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($smjestajniObjektiListRequest));
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
//print_r(smjestajniObjektiList($testUrl1,$object5));

/*-------------------------------------------------------------------------*/

//Method GET.
//Prepping mock url and mock get parameters.
$object6 = new stdClass();
$object6->opstineListRequest = new stdClass(); 

function opstineList($url,$opstineListRequest){

    $params = http_build_query($opstineListRequest);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url."?".$params);
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
//print_r(opstineList($testUrl2,$object6));

/*-------------------------------------------------------------------------*/

//Method GET.
//Prepping mock url and mock get parameters.

$object7 = new stdClass();
$object7->mjestaListRequest = new stdClass();
$object7->mjestaListRequest->opstina = new stdClass();
$object7->mjestaListRequest->opstina->kod = "KOT";
$object7->mjestaListRequest->opstina->Kotor = "Kotor";

function mjestaList($url, $mjestaListRequest){
    
    $params = http_build_query($mjestaListRequest);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url."?".$params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    $response = curl_exec($ch);
    curl_close($ch);

    if($response  === false){
        echo "Curl error: " . curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }
    
    return $response;

}
//print_r(mjestaList($testUrl2,$object7));

/*-------------------------------------------------------------------------*/

//Method GET.
//Prepping mock url and mock get parameters.
$object8 = new stdClass();
$object8->javneIspraveListRequest = new stdClass();

function javneIspraveList($url,$javneIspraveListRequest){

    $params = http_build_query($javneIspraveListRequest);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url."?".$params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "cURL error: ".curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return $response;

}
//print_r(javneIspraveList($testUrl2,$object8));

/*-------------------------------------------------------------------------*/

//Method GET.
//Prepping mock url and mock get parameters.
$object9 = new stdClass();
$object9->tipGostaListRequest = new stdClass();

function tipGostaList($url,$tipGostaListRequest){

    $params = http_build_query($tipGostaListRequest);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url."?".$params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "cURL error: ".curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return $response;

}
//print_r(tipGostaList($testUrl2,$object9));

/*-------------------------------------------------------------------------*/

//Method GET.
//Prepping mock url and mock get parameters.
$object10 = new stdClass();
$object10->drzavaListRequest = new stdClass();

function drzavaList($url,$drzavaListRequest){

    $params = http_build_query($drzavaListRequest);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url."?".$params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "cURL error: ".curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return $response;

}
//print_r(drzavaList($testUrl2,$object10));

/*-------------------------------------------------------------------------*/

//Method GET.
//Prepping mock url and mock get parameters.
$object11 = new stdClass();
$object11->granicniPrelaziListRequest = new stdClass();

function granicniPrelazList($url,$granicniPrelaziListRequest){

    $params = http_build_query($granicniPrelaziListRequest);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url."?".$params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "cURL error: ".curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return $response;

}
//print_r(granicniPrelazList($testUrl2,$object11));

/*-------------------------------------------------------------------------*/

//Method GET.
//Prepping mock url and mock get parameters.
$object12 = new stdClass();
$object12->vrstaVizeListRequest = new stdClass();

function vrstaVizeList($url,$vrstaVizeListRequest){

    $params = http_build_query($vrstaVizeListRequest);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url."?".$params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_HEADER, 1);//Sa ovime vraca response sa header-om.
    $response = curl_exec($ch);
    curl_close($ch);

    if($response === false){
        echo "cURL error: ".curl_error($ch)."<br>";
    }
    else{
        echo "Success.<br>";
    }

    return $response;

}
//print_r(vrstaVizeList($testUrl2,$object12));

/*-------------------------------------------------------------------------*/
?>