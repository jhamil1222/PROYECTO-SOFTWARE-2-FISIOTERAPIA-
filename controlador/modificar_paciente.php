<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST["nombre"]);
    $apellido = trim($_POST["apellido"]);
    $usuario = trim($_POST["usuario"]);
    $contrasena = trim($_POST["contrasena"]);
    $archivo = $_FILES["foto"]["tmp_name"];

    // Verificar si algún campo está vacío
    if (empty($nombre) || empty($apellido) || empty($usuario) || empty($contrasena)) {
        echo '<div id="alert-danger"class="alert alert-danger">Todos los campos son obligatorios excepto la imagen.</div> 
        <script>
        setTimeout(function(){
            document.getElementById("alert-danger").style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    </script>
    ';
    } else {

        include "modelo/conexion.php";

        // Preparar la declaración SQL
        "UPDATE usuarios SET nombre = 'Nuevo Nombre' WHERE id = 1";
        $stmt = $conexion->prepare("UPDATE PACIENTE SET NOMBRE_PACIENTE='".$nombre."', APELLIDO_PACIENTE, USUARIO_PACIENTE, CONTRASENA_PACIENTE, FOTO_PERFIL");
        $null = NULL; // Variable para el tipo 'b' (blob)
        $stmt->bind_param("ssssb", $nombre, $apellido, $usuario, $contrasena, $null);
        if (!empty($archivo)) {
            $stmt->send_long_data(4, file_get_contents($archivo)); // Envía los datos binarios
        }

        // Ejecutar la declaración
        if ($stmt->execute()) {
            echo '<div id="alert" class="alert alert-success">Los datos han sido correctamente guardados</div>

        <script>
            setTimeout(function(){
                document.getElementById("alert").style.display = "none";
            }, 3000); // 3000 milisegundos = 3 segundos
        </script>';
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    }
}

?>