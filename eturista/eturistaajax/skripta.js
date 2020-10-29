function FormDataGatherer(identificator, url){

    let form = document.querySelector(identificator);
    let formData = $(form).serializeArray();

    let keyNames = [];

    let arr = formData.map((item, i) => {

        keyNames[i] = item.name;
        
        return JSON.parse('{"'+item.name+'": "'+item.value+'"}');

    });
    
    let IfGetTokenVar = IfGetToken(keyNames, url);
    let IfUserCheckedInVar  = IfUserCheckedIn(keyNames, url);
    let IfUserCheckedOutVar = IfUserCheckedOut(keyNames, url);
    
    if(IfGetTokenVar){

        let myUrl = url;
        let myMethod = "POST";
        let myHeader = {};
        let myData = Object.assign({}, ...arr);
        
        postData(myUrl, myMethod, myHeader, myData);

    }

    if(IfUserCheckedInVar){

        let myUrl = url;
        let myMethod = "POST";
        let myHeader = {
            "Authorization" : "Bearer " + token
        };

        let OsnovniPodaci = Object.assign({}, ...arr.slice(0,17));
        let IdentifikacioniDokumentStranogLica = Object.assign({}, ...arr.slice(18,10));
        let PodaciOBoravku = Object.assign({}, ...arr.slice(27,10));

        let myData = {
            OsnovniPodaci: OsnovniPodaci,
            IdentifikacioniDokumentStranogLica: IdentifikacioniDokumentStranogLica,
            PodaciOBoravku: PodaciOBoravku
        };
        
        postData(myUrl, myMethod, myHeader, myData);

    }

    if(IfUserCheckedOutVar){

        let myUrl = url;
        let myMethod = "POST";
        let myHeader = {
            "Authorization" : "Bearer " + token
        };
        let myData = Object.assign({}, ...arr);
        
        postData(myUrl, myMethod, myHeader, myData);

    }

}

function IfGetToken(keyNames, url){

    let arr1 = ["korisnickoIme", "lozinka"];
    let urlToCompare = "https://www.portal.eturista.gov.rs/eturistwebapi/api/Autentifikacija/PrijavaKorisnickoImeLozinka";
    let data = $(arr1).not(keyNames).length === 0 && $(keyNames).not(arr1).length === 0;
    
    return (url === urlToCompare && data === true) ? true : false;
    
}

function IfUserCheckedIn(keyNames, url){

    let arr1 = ["ExternalId", "Izmena", "DaLiJeLiceDomace", "DaLiJeLiceRodjenoUInostranstvu", 
    "Ime", "Prezime", "DatumRodjenja", "PolSifra", "Jmbg", "MestoRodjenjaNaziv", "DrzavaRodjenjaAlfa2", 
    "DrzavaRodjenjaAlfa3", "DrzavljanstvoAlfa2", "DrzavljanstvoAlfa3", "MestoPrebivalistaNaziv", 
    "DrzavaPrebivalistaAlfa2", "DrzavaPrebivalistaAlfa3", 
    
    "VrstaPutneIspraveSifra", "BrojPutneIsprave", "DatumIzdavanjaPutneIsprave", "VrstaVizeSifra", 
    "BrojVize", "MestoIzdavanjaVize", "DatumUlaskaURepublikuSrbiju", "MestoUlaskaURepublikuSrbijuSifra", 
    "MestoUlaskaURepublikuSrbiju", "DatumDoKadaJeOdobrenBoravakURepubliciSrbiji", 
    
    "UgostiteljskiObjekatJedinstveniIdentifikator", "VrstaPruzenihUslugaSifra", "NacinDolaskaSifra", 
    "NazivAgencije", "BrojSmestajneJedinice", "SpratSmestajneJedinice", "DatumICasDolaska", 
    "PlaniraniDatumOdlaska", "UslovZaUmanjenjeBoravisneTakseSifra", "RazlogBoravkaSifra"];

    let urlToCompare = "https://www.portal.eturista.gov.rs/eturistwebapi/api/hoteliimport/checkin";
    let data = $(arr1).not(keyNames).length === 0 && $(keyNames).not(arr1).length === 0;  
    
    return (url === urlToCompare && data === true) ? true : false;
    
}

function IfUserCheckedOut(keyNames, url){

    let arr1 = ["Izmena", "DatumICasOdjave", "UgostiteljskiObjekatJedinstveniIdentifikator", "ExternalId"];

    let urlToCompare = "https://www.portal.eturista.gov.rs/eturistwebapi/api/hoteliimport/checkout";
    let data = $(arr1).not(keyNames).length === 0 && $(keyNames).not(arr1).length === 0; 

    return (url === urlToCompare && data === true) ? true : false;

}

async function postData(url = '', method = "", header = {}, data = {}){

    const result = await fetch(url, {
        method: method,
        headers: header,
        body: JSON.stringify(data)
    })
    .then((response) => {

        return response.json();

    })
    .then((data) => {

        //Do stuff with it.

    })
    .catch((error) => {
        console.error('Error:', error);
    });
    
    return result;
      
}