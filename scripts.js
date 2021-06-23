
var user = "";

var pass = "";

function login() {

    user = document.getElementById("user").value;
    pass = document.getElementById("pass").value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (this.responseText == "208") {
          document.getElementById("main").innerHTML = "<div class='error'>Error 208, usuario o clave inválido</div>";
        } else{
          let response = this.responseText.split(";");
          let name = "<div class='userData'>" + response[0] + "</div>";
          let table = "<table class='IATable'><tr><th>ID de la aplicación</th><th>Nombre de la aplicación</th><th> Descripción</th><th>Tipología</th><th>More info</th></tr>";       
          let back = '<button onclick="backtologin()">Click me</button>';
          for(let i = 1; i < response.length - 1; i++){
            let id = ""
            table += "<tr>";
            let elements = response[i].split(",");            
            for(let j = 0; j < elements.length; j++){                    
              table += "<td>";
              if(j == 0){ //Se guarda el id para poder generar la Query de + info
                id = elements[j]
                table += elements[j];
              }else if(j == 3){
                if(elements[j] == "1"){
                  table += '<img alt="Riesgo intolerable" src="/img/riesg1.png" width=10" height="10">';
                }else if(elements[j] == "2"){
                  table += '<img alt="Riesgo Elevado" src="/img/riesg2.png" width=10" height="10">';
                } else if(elements[j] == "3"){
                  table += '<img alt="Riesgo Medio" src="/img/riesg3.png" width=10" height="10">';
                } else if(elements[j] == "4"){
                  table += '<img alt="Riesgo mínimo" src="/img/riesg4.png" width=10" height="10">';
                }else{
                  table += '<img alt="otros Riesgos" src="/img/riesgother.png" width=10" height="10">';
                }
              }else{
                table += elements[j];
              }
              
              //TO DO, si el elemento es Tipología añadir imágen 
              
              
              table += "</td>";
            }
            table += "<td><button onclick='moreinfo(" + id +")'>+</button></td>";
            table += "</tr>";
          }
          table += "</table>";
          document.getElementById("main").innerHTML = name + table + back;
        }

      }
    };
    xmlhttp.open("GET", "/request.php?t=login&u=" + user + "&p=" + pass, true);
    xmlhttp.send();
}


function backtologin() {
  let login = '<div class="login"><input type="text" id="user"><input type="text" id="pass"><button onclick="login()">Log-In</button"></div>'
  document.getElementById("main").innerHTML = login;
}


function moreinfo(id) {

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText == "208") {
        document.getElementById("main").innerHTML = "<div class='error'>Error 208, usuario o clave inválido</div>";
      } else{
        let response = String(this.responseText).split("|");
        let nombre = response[0].split(";")[0]; //Se seleccionan el nombre del usuario
        let info = response[0].split(";")[1].split(","); //Se selecciona la info relativa a la documentacion
        response = response[1].split(";"); // Se separa el listado de KPIs
        let name = "<div class='userData'>" + nombre + "</div>";
        let table = "<table class='IATable'><tr><th>Tipo de aplicación</th><th>MAE</th><th> RMSE</th><th>RMLSE</th><th>Prec</th><th>Recall</th><th>Acurracy</th><th>Sensitivity</th><th>Specificity</th><th>F_measure</th></tr>";       
        let back = '<button onclick="backtologin()">Click me</button>';
        let confusion = ""; //Direccion a la matriz de confusion
        for(let i = 0; i < response.length; i++){
          table += "<tr>";
          let elements = response[i].split(","); 
          confusion = '<img alt="Matriz de confusión" src="/'+ elements[elements.length - 1]  + '" width=10" height="10">';     
          for(let j = 0; j < elements.length - 1; j++){    
            //TO DO, si el elemento es [0] añadir imágen de tipo de IA
            table += "<td>";
            if(j == 0){
              if(elements[j] == "1"){//Clasificación
                table += '<img alt="Clasificación" src="/img/clasif.png" width=10" height="10">';
              } else if(elements[j] == "2"){//Regresión
                table += '<img alt="Regresión" src="/img/regres.png" width=10" height="10">';
              }else{ //Other
                table += '<img alt="Otros" src="/img/otrot.png" width=10" height="10">';
              }
            }else{
              table += elements[j];
            }          
            table += "</td>";
          }
          table += "</tr>"
        }
        table += "</table>"
        let documentacion = "";
        for(let i = 0; i < info.length; i++){
          if(i == 5){
            if(info[i] == "1"){
              documentacion += '<img alt="Riesgo intolerable" src="/img/riesg1.png" width=10" height="10">';
            }else if(info[i] == "2"){
              documentacion += '<img alt="Riesgo Elevado" src="/img/riesg2.png" width=10" height="10">';
            } else if(info[i] == "3"){
              documentacion += '<img alt="Riesgo Medio" src="/img/riesg3.png" width=10" height="10">';
            } else if(info[i] == "4"){
              documentacion += '<img alt="Riesgo mínimo" src="/img/riesg4.png" width=10" height="10">';
            }else{
              documentacion += '<img alt="otros Riesgos" src="/img/riesgother.png" width=10" height="10">';
            }
          }else if(i == 0){
            documentacion += "<div class=" + i +"> ID: " + info[i] +"</div>"; // ID
          }else if(i == 1){
            documentacion += "<div class=" + i +">" + info[i] +"</div>";//Nombre
          }else if(i == 2){
            documentacion += "<div class=" + i +">" + info[i] +"</div>";//Descripcion
          }else if(i == 3){
            documentacion += "<div class=" + i +">Fecha de creación: " + info[i] +"</div>"; //Fecha de Creación
          }else if(i == 4){
            documentacion += "<div class=" + i +">Documentación general" + '<a href="' + info[i] + '">' + '<img alt="Documentacion General" src="/img/doc.png" width=10" height="10"></a>' +"</div>"; // Documentacion
          }else if(i == 6){
            documentacion += "<div class=" + i +">Documentación de la  Tipología" + '<a href="' + info[i] + '">' + '<img alt="Documentacion Tipología" src="/img/doc.png" width=10" height="10"></a>' +"</div>"; //Doc tipología
          }else if(i == 7){
            documentacion += "<div class=" + i +">Documentación QA" + '<a href="' + info[i] + '">' + '<img alt="Documentacion QA" src="/img/doc.png" width=10" height="10"></a>' +"</div>";//QA
          }else if(i == 8){
            documentacion += "<div class=" + i +">Documentación Sesgos" + '<a href="' + info[i] + '">' + '<img alt="Documentacion Sesgos" src="/img/doc.png" width=10" height="10"></a>' +"</div>"; //Sesgos
          }else if(i == 9){
            documentacion += "<div class=" + i +">Documentación Comité ético" + '<a href="' + info[i] + '">' + '<img alt="Documentacion Comité ético" src="/img/doc.png" width=10" height="10"></a>' +"</div>"; //Sesgos
          }
          else{
            documentacion += "<div class=" + i +">" + info[i] +"</div>";
          }
            
        }
        document.getElementById("main").innerHTML = name + documentacion + table + confusion + back;
      }

    }
  };
  xmlhttp.open("GET", "/request.php?t=info&i=" + id + "&u=" + user + "&p=" + pass, true);
  xmlhttp.send();
}


