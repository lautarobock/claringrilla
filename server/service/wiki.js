/*
  @author: remy sharp / http://remysharp.com
  @url: http://remysharp.com/2008/04/01/wiki-to-html-using-javascript/
  @license: Creative Commons License - ShareAlike http://creativecommons.org/licenses/by-sa/3.0/
  @version: 1.0
  
  Can extend String or be used stand alone - just change the flag at the top of the script.
*/

// utility function to check whether it's worth running through the wiki2html
function iswiki(s) {
    return !!(s.match(/^[\s{2} `#\*='{2}]/m));
}

// the regex beast...
function wiki2html(s) {
    
    // lists need to be done using a function to allow for recusive calls
    function list(str) {
        return str.replace(/(?:(?:(?:^|\n)[\*#].*)+)/g, function (m) {  // (?=[\*#])
            var type = m.match(/(^|\n)#/) ? 'OL' : 'UL';
            // strip first layer of list
            m = m.replace(/(^|\n)[\*#][ ]{0,1}/g, "$1");
            m = list(m);
            return '<' + type + '><li>' + m.replace(/^\n/, '').split(/\n/).join('</li><li>') + '</li></' + type + '>';
        });
    }

    /**
    * Aplicacion de templates de wiktionary de reemplazo simple.
    */
    function applySimpleTemplates(value) {

        //Templates simples
        var templates = {};

        templates['participio'] = 'Participio de ';
        templates['sustantivo de verbo'] = 'Acción o efecto de ';
        templates['adverbio de adjetivo'] = 'De un modo ';
        templates['adjetivo de sustantivo'] = 'Que pertenece o concierne a ';
        templates['gentilicio'] = 'Originario, relativo a, o propio de ';
        templates['sustantivo de adjetivo'] = 'Condición o carácter de ';

        for ( var k in templates ) {
            var tmpl = templates[k];
            value = value.replace(new RegExp("\\{\\{"+k+"\\|(.*?)\\}\\}","g"), function(m,l) { //Template 'participio'
                return tmpl + l.split('|')[0];
            });
        }

        //Templates fijos como referencias a diccionarios
        // value = value.replace(new RegExp("\\{\\{DLC1842‎.*}\\}","g"),"<b>segun diccionario 1842</b>");
        // value = value.replace(new RegExp("\\{\\{DLC1914.*}\\}","g"),"<b>segun diccionario 1914</b>");
        value = value.replace(new RegExp("\\{\\{DLC(.*).*}\\}","g"), function(m,l) { //Template 'participio'
                return "<b>segun diccionario "+l+"</b>";
            });


        return value;
    }

    function normalizeParam(value) {
        if ( value.indexOf('=') != -1 ) {
            value = value.split('=')[1];
        }
        return value;
    }
    
    return list(applySimpleTemplates(s
        
        /* BLOCK ELEMENTS */
        .replace(/(?:^|\n+)([^# =\*<].+)(?:\n+|$)/gm, function (m, l) {
            if (l.match(/^\^+$/)) return l;
            return l; //<p>+l+</p>
        })

        .replace(/(?:^|\n)[ ]{2}(.*)+/g, function (m, l) { // blockquotes
            if (l.match(/^\s+$/)) return m;
            return '<blockquote>' + l + '</span>';
        })
        
        .replace(/((?:^|\n)[ ]+.*)+/g, function (m) { // code
            if (m.match(/^\s+$/)) return m;
            return '<span>' + m.replace(/(^|\n)[ ]+/g, "$1") + '</span>';
        })

        .replace(/(?:^|\n)([=]+)(.*)\1/g, function (m, l, t) { // headings
            return '<h' + l.length + '>' + t + '</h' + l.length + '>';
        })
    
        /* INLINE ELEMENTS */
        .replace(/'''(.*?)'''/g, function (m, l) { // bold
            return '<strong>' + l + '</strong>';
        })
    
        .replace(/''(.*?)''/g, function (m, l) { // italic
            return '<em>' + l + '</em>';
        })
    
        .replace(/[^\[](http[^\[\s]*)/g, function (m, l) { // normal link
            return '' + l + '';
        })
    
        .replace(/[\[](http.*)[!\]]/g, function (m, l) { // external link
            var p = l.replace(/[\[\]]/g, '').split(/ /);
            var link = p.shift();
            return '' + (p.length ? p.join(' ') : link) + '';
        })
    
        .replace(/\[\[(.*?)\]\]/g, function (m, l) { // internal link or image
            var p = l.split(/\|/);
            var link = p.shift();

            if (link.match(/^Image:(.*)/)) {
                // no support for images - since it looks up the source from the wiki db :-(
                return m;
            } else {
                return '' + (p.length ? p.join('|') : link) + '';
            }
        })

        .replace(/\{\{ucf\|(.*?)\}\}/g, function(m,l) { //Transclusion of ufc tempalte (Uppercase fist characater)
            return (""+l[0]).toUpperCase() + l.substr(1);
        })

        .replace(/\{\{plm\|(.*?)\}\}/g, function(m,l) { //Transclusion of ufc tempalte (Uppercase fist characater)
            return (""+l[0]).toUpperCase() + l.substr(1);
        })

        .replace(/\{\{forma verbo\|(.*?)\}\}/g, function(m,l) { //Template 'forma verbo'
            var params = l.split('|');
            
            //Vervo
            var verb = params[0];

            //Persona/numero
            var person = params[1];
            //Normalizo la entrada ya que puede ser directamente el valor o si no p=$valor
            person = normalizeParam(person);
            
            if ( ['1s','yo','primera persona singular'].indexOf(person) != -1 ) {
                person = 'Primera persona del singular'
            } else if ( ['2s','tu','tú','segunda persona singular'].indexOf(person) != -1 ) {
                person = 'Segunda persona del singular'
            } else if ( ['3s','el','él','ella','tercera persona singular'].indexOf(person) != -1 ) {
                person = 'Tercera persona del singular'
            } else if ( ['1p','nos','nosotros','primera persona plural'].indexOf(person) != -1 ) {
                person = 'Primera persona del plural'
            } else if ( ['2p','vosotros','ustedes','segunda persona plural'].indexOf(person) != -1 ) {
                person = 'Segunda persona del plural'
            } else if ( ['3p','ellos','ellas','tercera persona plural'].indexOf(person) != -1 ) {
                person = 'Tercera persona del plural'
            }

            //Tiempo
            var temp = params[2];
            temp = normalizeParam(temp);
            
            if ( ['presente','pres'].indexOf(temp) != -1 ) {
                temp = 'del presente';
            } else if ( ['futuro','fut','futuro simple'].indexOf(temp) != -1 ) {
                temp = 'del futuro';
            } else if ( ['pretérito','pret'].indexOf(temp) != -1 ) {
                temp = 'del pasado';
            } else if ( ['pretérito indefinido','pret ind','ind','pretérito perfecto simple','perfecto simple'].indexOf(temp) != -1 ) {
                temp = 'del preterito perfecto simple';
            } else if ( ['pretérito imperfecto','pret imp','imp','imperfecto','copretérito'].indexOf(temp) != -1 ) {
                temp = 'del preterito imperfecto';
            } else if ( ['condicional','cond','condicional simple','pospretérito','pos'].indexOf(temp) != -1 ) {
                temp = 'del condicional';
            } else if ( ['imperativo','imper'].indexOf(temp) != -1 ) {
                temp = 'del imperativo';
            }

            //TODO 'modo verbal' para hacer el indicativo, @see http://es.wiktionary.org/wiki/Plantilla:forma_verbo/doc


            return person + ' ' + temp + ' de ' + verb;
        })

        .replace(/\{\{forma participio\|(.*?)\}\}/g, function(m,l) { //Template 'forma participio' http://es.wiktionary.org/wiki/Plantilla:forma_participio
            var params = l.split('|');
            
            //Vervo
            var participle = params[0];

            var opts = {
                'masc': 'masculino',
                'm': 'masculino',
                'fem': 'femenino',
                'f': 'femenino',
                'pl': 'plural',
                'p': 'plural',
                'sing': 'singular',
                's': 'singular',
                'com': 'comun',
                'c': 'comun',
                'neu': 'neutro',
                'n': 'neutro',
                'du': 'dual',
                'd': 'dual',
                'dim': 'diminutivo',
                'd': 'diminutivo'
            };

            var mods = '';
            for ( var i=1; i<params.length; i++ ) {
                if ( opts[params[i]] ) {
                    mods += opts[params[i]] + " ";
                } else {
                    mods += params[i] + " ";
                }
            }

            return 'Forma del ' + mods + 'de ' + participle;
        })

    )); 
}
    
exports.wiki2html = wiki2html;