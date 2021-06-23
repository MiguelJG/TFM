<?php
$servername = "localhost";
$username = "miguel";
$password = "leugim_3";
$dbname = "AI_Governance";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$t = $_REQUEST["t"]; //Se obtiene la tipología de la get request

$response = "";

// lookup all hints from array if $q is different from ""
if ($t == "login") {
    $u = $_REQUEST["u"];
    $p = $_REQUEST["p"];
    $sql = "SELECT * FROM `Usuarios` WHERE ID ='" . $u . "' AND Password ='" . $p . "'"; //Comprobamos el usuarios
    $result = $conn->query($sql);

    if ($result->num_rows == 1) { //Se comprueba que el usuarui existe
        while($row = $result->fetch_assoc()) {
          $response = $response . "User id: ". $row["ID"]. " - Name: " . $row["Nombre"]. ";";
        }

        $sql = "SELECT * FROM ModelosIA WHERE ID_IA IN (SELECT ID_IA FROM Permisos WHERE ID = ". $u .")"; // Extraer IAs con permiso

        $list_IA = $conn->query($sql);

        if ($list_IA->num_rows > 0 ) { //Se imprimen la info de las IA a las que tiene acceso este usuario
             while($row = $list_IA->fetch_assoc()) {
              $response = $response .   $row["ID_IA"] . "," . $row["Nombre"] . "," . $row["Descripcion"]  . "," . $row["Tipologia"] . ";";            
            }
        } else{
            $response = $response . ";";
        }

      } else { //Codigo de usuario no valido
        echo "208"; //Invalid User
      }

} elseif ($t == "info"){ // Obtener información extra de las aplicaciones de IA
    $u = $_REQUEST["u"];
    $p = $_REQUEST["p"];
    $i = $_REQUEST["i"];
    $sql = "SELECT * FROM `Usuarios` WHERE ID ='" . $u . "' AND Password ='" . $p . "'"; //Comprobamos el usuarios
    
    $result = $conn->query($sql);

    if ($result->num_rows == 1) { //Se comprueba que el usuarui existe
        while($row = $result->fetch_assoc()) {
          $response =  "User id: ". $row["ID"]. " - Name: " . $row["Nombre"]. ";";
        }
        $sql = "SELECT * FROM `ModelosIA` NATURAL JOIN `KPIs` WHERE ID_IA = ". $i; //Se extrae la info adicional de la aplicación de IA
        $list_IA = $conn->query($sql);
        if ($list_IA->num_rows > 0 ) { //Se imprimen la info de las IA a las que tiene acceso este usuario
             while($row = $list_IA->fetch_assoc()) {
                $response = $response .   $row["ID_IA"] . "," . $row["Nombre"] . "," . $row["Descripcion"] . "," . $row["Fec_Crea"] . "," . $row["Documentacion"] . "," . $row["Tipologia"] . "," . $row["Doc_Tipologia"] . "," . $row["Doc_QA"] . "," . $row["Doc_Sesgos"] . "," . $row["Doc_c_etico"]  . "|";
                $response = $response  . "," . $row["Clasificacion"] . "," . $row["MSE"] . "," . $row["MAE"] . "," . $row["RMSE"] . "," . $row["RMLSE"] . "," . $row["Prec"] . "," . $row["Recall"] . "," . $row["Acurracy"] . "," . $row["Sensitivity"] . "," . $row["Specificity"] . "," . $row["Enlace_Matrx_Confusion"] . ";";            
            }
        } else{
            $response = $response . ";";
        }

      } else { //Codigo de usuario no valido
        echo "208"; //Invalid User
      }
}

// Output "no suggestion" if no hint was found or output correct values
echo $response;
?>