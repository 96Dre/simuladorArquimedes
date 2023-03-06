/* 
Autor: Dre (2023)

Resumen de este módulo:
Este módulo se encarga de servir de interfaz para el tratamiento de los 
elementos HTML dentro de Javascript
*/

class baseDeDatos {

  constructor(evt) {
    /*  Esta función se encarga de tomar el texto de la base de preguntas 
    y convertirlo a un objeto JSON */  
    this.cantidadPreguntas = 0; 
    ExcelToJSON;
  }
  
}

/* 
Este es un modelo de objeto que sirve para leer 
*/
function pregunta(arr) {
  this.categoria = arr[0];
  this.pregunta = arr[1];
  this.respuesta = arr[2];
  this.distractor1 = arr[3];
  this.distractor2 = arr[4];
  this.distractor3 = arr[5];
  this.imagen = arr[6];
  this.objectFit = arr[7];
}

//Instancia el objeto
_baseDeDatos = new baseDeDatos();

var ExcelToJSON = function() {

  this.parseExcel = function(file) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        var json = XL_row_object;
        // Llenado del objeto _baseDeDatos con el JSON (conviertiendo cada pregunta en array)
        /************************************************************************************************ */
        _baseDeDatos.cantidadPreguntas = json.length-1;
        _baseDeDatos.categorias = [];
        let arr = [];
        for (const renglon of json) {

          for(var i in renglon){
            arr.push(renglon[i]);
          }

          if (!_baseDeDatos.categorias[arr[0]]) {
            _baseDeDatos.categorias[arr[0]] = [];
          }
          if (arr[0].trim() == "") {
            continue;
          }
          _baseDeDatos.categorias[arr[0]].push(new pregunta(arr));
          arr = [];
        }
        for (const i in _baseDeDatos.categorias) {
          _baseDeDatos.categorias[i].sort(() => Math.random() - 0.5);
        }
        /************************************************************************************************* */
        jQuery('#xlx_json').val(json_object);
        // Inicializa el juego
        iniciarJuego();
        // Cambia de pantalla
        _puntaje_historial.actualizarPuntaje();
        _controlHTML.cambiarPantalla('juego');
      })
    };

    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function handleFileSelect(evt) {

  var files = evt.target.files; // FileList object
  var xl2json = new ExcelToJSON();
  xl2json.parseExcel(files[0]);
} 

//Asigna un Listener al campo upload para seleccionar la pregunta
document.getElementById('upload').addEventListener('change', handleFileSelect, false);

