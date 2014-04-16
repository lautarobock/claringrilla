var http = require("http");

exports.define = function(word, callback) {
    // console.log("Search: ", word);
	var opt = {
        hostname: 'es.wiktionary.org',
        port: 80,
        path: '/w/api.php?format=json&action=query&titles='+word+'&prop=revisions&rvprop=content',
        method: 'GET'
    };

    var msg = "";

    var iReq = http.request(opt, function(iRes) {
        iRes.setEncoding('utf8');
        iRes.on('data', function(chunk) {
            msg += chunk;
        });
        iRes.on('end', function() {
            // console.log("msg",msg);
            var object = eval("("+msg+")");
            var page = null;
            var pageKey = null;
            for ( var k in object.query.pages ) {
            	pageKey = k;
            	break;
            }

            if ( pageKey == -1 ) {
                callback({
                    code: "NOT_FOUND",
                    message: "No se ha encontrado la palabra"
                })
                return;
            }
            page = object.query.pages[k];
            //Definicion completa en formato wiki
            var def = page.revisions[0]['*'];

            //Solo la primera definicion
            var first = def.match(";1.*:(.*)")[1];

            //le saco un espacio que siempre hay
            first = first.substr(1);
            
            // console.log(word, first);            

            callback(null, first);
        });
    });

    iReq.on('error', function(e) {
        console.log('[Dictionary] problem with the request: ' + e.message);
        callback(e)
    });

    iReq.end();

};

exports.splitSyllables = function( txt_fuente ) {
    var cadena = txt_fuente;
    var temp;
    var s = "";
    var k; //entero
    k = cadena.length;
    temp = cadena;
            
            
        var i = 0;
        while(cadena != "")
        {
            temp = tempSilaba(cadena);
            if(i==0){
                s += temp;
            }else{
                if(haySoloConsonantes(temp)){
                    s += temp;
                }else{
                    if(strVVstr(s,temp)){
                        s +=temp;
                    }else{
                        if(haySoloConsonantes(s)){
                            s += temp;
                        }else{
                            s += "-" + temp;
                        }
                    }
                }
            }
                        i++; //numero de iteraciones
            cadena = cadena.substring( temp.length, cadena.length );
        }
    return s.split("-");
}

/**
        Funcion que retorna "true" o "false"
        si las consonantes como parametros pueden ser separadas o no
        Por ejemplo: br, tr, ch, etc
        parametros:
        c1: consonante 1
        c2: consonante 2
        Sabiendo que c1 y c2 son cadenas de un caracter
    */
    function consonantesNoSeparables( c1, c2 ) {
        /*if ( c1 == 'b' || c1 == 'c' || c1 == 'f' || c1 == 'g' || c1 == 'p' || c1 == 't' ){
            var booleano;
            (c2 == r) ? return true; booleano 
        }*/
        
        if (c1 == 'b' || c1 == 'c' || c1 == 'd' || c1 == 'f' || c1 == 'g' || c1 == 'p' || c1 == 'r' || c1 == 't'){
            if(c2=='r'){
                return true;
            }
        }
        if (c1 == 'b' || c1 == 'c' || c1 == 'f' || c1 == 'g' || c1 == 'p' || c1 == 't' || c1 =='l' || c1 == 'k'){
            if(c2=='l'){
                return true;
            }
        }
        if( c1 == 'c' && c2 == 'h'){
            return true;
        }
        return false;
    }
    
    /** FUNCION tipo_letra
        return@ entero
        
        El tipo de letra
        1 = vocal abierta
        2 = vocal cerrada
        3 = vocal abierta tildada
        4 = vocal cerrada tildada
        5 = consonante
    */
    function tipo_letra( letra ) {
        var i = 5;
        switch(letra){
            case 'a': i = 1; break;
            case 'e': i = 1; break;
            case 'o': i = 1; break;
            //case 'h': i = 6; break;
            case 'i': i = 2; break;
            case 'u': i = 2; break;
            case '\xFC': i = 2; break; //u con dieresis
            
                        //vocales tildadas
            case '\xE1': i = 3; break;
            case '\xE9': i = 3; break;
            case '\xF3': i = 3; break;
            
            case '\xED': i = 4; break;
            case '\xFA': i = 4; break;
        }
        return i;
    }
    
    /*
        VA = vocal abierta
        VC = vocal cerrada
        ? = vocal desconocida
    */
    function hayHiato( vocal1, vocal2 ) {
        var booleano = false;
        
        var tipoVocal1 = tipo_letra(vocal1);
        var tipoVocal2 = tipo_letra(vocal2);
        
        if( tipoVocal1 == 1 || tipoVocal1 == 3){ // VA + ?
            //vocal2 : abierta o abierta tildada
            if( tipoVocal2 == 1 || tipoVocal2 == 3 ){ // VA + VA
                booleano = true;
            }else{ // VA + VC
                ( tipoVocal2 == 4 ) ? booleano = true : booleano = false;
            }
        }else{ // VC + ?
            if( tipoVocal2 == 1 ){ // VC + VA
                var tipoVocal1 = tipo_letra(vocal1);
                ( tipoVocal1 == 4 )? booleano = true : booleano = false;
            }else{
                ( vocal1 == vocal2)? booleano = true: booleano = false;
            }
        }
        return booleano;
    }
    
    /**
        Retorna = true
        Si la cadena tiene solo tiene consonantes
    */
    
    function haySoloConsonantes( cadena ) {
        var nvocales = 0;
        for(i = 0; i < cadena.length && nvocales == 0; i++){
            var letra = cadena.charAt(i);
            if( tipo_letra(letra) != 5 ){
                nvocales++;
            }
        }
        if( nvocales == 0)
            return true;
        return false;
    }
    
    /**
        Toma las tres primeras letras de una cadena
        y las separa retornando una cadena con la silaba 
        separada, solo toma en encuenta las 3 primeras letras
        de "str"
    */
    function tempSilaba( str ) {
        var temp = "";
        var s="";
        
        //las tres primeras letras de 'str'
        var x,y,z;
        
        if( str.length <3){
            if( str.length == 2){
                x = str.charAt(0);
                y = str.charAt(1);
                if ( tipo_letra(x) != 5 && tipo_letra(y) != 5){ //X,Y son vocales
                    ( hayHiato(x,y))?  s = str.substring(0,1) : s = str;
                }else
                    s = str;
            }else
                s = str;
        }else{
            x = str.charAt(0);
            y = str.charAt(1);
            z = str.charAt(2);
            if(tipo_letra(x) != 5 ){ //V ? ?
                if(tipo_letra(y)!= 5 ){  //V V ?
                    if(tipo_letra(z)!= 5 ){  //V V V
                        if(hayHiato(x,y)){
                            s = str.substring(0, 1);
                        }else{
                            if(hayHiato(y,z)){
                                s = str.substring(0,2);
                            }else{
                                s = str.substring(0,3);
                            }
                        }
                    }else{ // V V C
                        if(hayHiato(x,y)){
                            s = str.substring(0,1);
                        }else{
                            s = str.substring(0,2);
                        }
                    }
                }else{ // V C ?
                    if(tipo_letra(z)!= 5 ){  //V C V
                        if( y == 'h'){ // V H C
                            if(hayHiato(x,z)){
                                s = str.substring(0,1);
                            }else{
                                s = str.substring(0,3);
                            }
                        }else{
                            s = str.substring(0,1);
                        }
                    }else{ // V C C
                            if(consonantesNoSeparables(y,z)){
                                s = str.substring(0,1);
                            }else{
                                s = str.substring(0,2);
                            }
                    }
                }
            }else{ // C ??
                if(tipo_letra(y)!= 5 ){ //C V ?
                    if(tipo_letra(z)!= 5 ){ // C V V
                        temp = str.substring(0,3);
                        if(temp == "que" || temp == "qui" || temp == "gue" || temp =="gui" ){
                            s = str.substring(0, 3);
                        }else{
                            if(hayHiato(y,z)){
                                s = str.substring(0, 2);
                            }else{
                                s = str.substring(0, 3);
                            }
                        }
                    }else{ // C V C
                        s = str.substring(0,2);
                    }
                }else{ // C C ?
                    if(tipo_letra(z)!= 5 ){ // C C V
                        if(consonantesNoSeparables(x,y)){
                            s = str.substring(0,3);
                        }else{
                            s = str.substring(0,1);
                        }
                    }else{ // C C C
                        if(consonantesNoSeparables(y,z)){
                            s = str.substring(0,1);
                        }else{
                            s = str.substring(0,1);
                        }
                    }
                }
            }
        }
        return s;
    }
    
    function strVVstr(s1,s2){ //Estable si hay union
        var booleano = false;
        var c1 = s1.charAt(s1.length -1);
        var c2 = s2.charAt(0);
        booleano = false;
        if(tipo_letra(c1) != 5 && tipo_letra(c2) != 5){
            if(hayHiato(c1,c2)){
                booleano = false;
            }else{
                booleano = true;
            }
        }
        return booleano;
    }
    
    function selectText( textField ) {
        textField.focus();
        textField.select();
    }