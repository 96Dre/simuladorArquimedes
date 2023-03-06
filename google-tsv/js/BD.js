/* 
Autor: Dre (2023)

Resumen de este módulo:
Este módulo se encarga de servir de interfaz para el tratamiento de los 
elementos HTML dentro de Javascript
*/

class baseDeDatos {
  //esta es la dirección de la base de datos de la hoja de cálculo de google
  constructor(evt) {
    /*this.urlBaseDeDatos =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRMlWQTKGpi-nM1T5JHhA6rY1sveZkQ6YU55TbttQSHw-z3_eNyGMmGH38S30KaiQ/pub?gid=956946914&single=true&output=tsv";*/

     /*this.urlBaseDeDatos =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ348T6tl1lu4dl05xLrwxv4XzCb8fZVYyFPDYT7UrpFXRP8MnCS1HrO9iefWeQF9ibJl6KNgrz1Wfc/pub?gid=0&single=true&output=tsv";

    //Se busca si la base de datos ya existe
    this.texto = localStorage.getItem(this.urlBaseDeDatos);*/

    /*if (!this.texto) {
      if (!window.navigator.onLine) {
        swal.fire(
          "Cuidado",
          "El navegador no está en linea, la base de datos no se podrá descargar de Google sheets",
          "warning"
        );
      }
    } else {
      this.interpretadorBaseDatos(this.texto);
    }*/
   // this.actualizarBaseDeDatos();
    ExcelToJSON;
  }

  /* 
  Esta función se encarga de tomar el texto de la base de preguntas 
  y convertirlo a un objeto

  input: data -> es un texto en formato .tsv (valores separados por tabulación)
  */
  interpretadorBaseDatos(data) {
    let renglones = data.split("\n");
    this.cantidadPreguntas = renglones.length - 1;
    this.categorias = [];

    for (const renglon of renglones) {
      let arr = renglon.split("\t");

      if (!this.categorias[arr[0]]) {
        this.categorias[arr[0]] = [];
      }
      if (arr[0].trim() == "") {
        continue;
      }
      this.categorias[arr[0]].push(new pregunta(arr));
    }
    for (const i in this.categorias) {
      this.categorias[i].sort(() => Math.random() - 0.5);
    }
    console.log('****** categoria 1 *********');
        console.log(this.categorias);
  }

  /* 
  Esta es la función raíz, por donde empieza todo, sin esta el programa no puede arrancar
  ya que es la encargada de descargar la base de datos de google calc al localstorage
  */
  actualizarBaseDeDatos() {
    let urlBaseDeDatos = this.urlBaseDeDatos;
    $.ajax({
      //type: "POST",
      //crossDomain: true,
      //dataType: "jsonp",
      url: urlBaseDeDatos,
      success: function (data) {
        localStorage.setItem(urlBaseDeDatos, data);
      },
    });
  }
}


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

        /************************************************************************************************ */
        _baseDeDatos.cantidadPreguntas = json.length;
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
        console.log('****** categoria 2 *********');
        console.log(_baseDeDatos.categorias);
        /************************************************************************************************* */
        jQuery('#xlx_json').val(json_object);
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

document.getElementById('upload').addEventListener('change', handleFileSelect, false);

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

_baseDeDatos = new baseDeDatos();