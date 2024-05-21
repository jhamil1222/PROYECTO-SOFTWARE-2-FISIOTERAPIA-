<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro y Modificación de Datos Pacientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>

<body>
    <div class="container">
        <div class="row  ">
            <div class="col-md-12 text-center ">
                Modificar datos Paciente
            </div>
        </div>
        <?php
        include "modelo/conexion.php";
        include "encripta.php";
        //include "controlador/modificar_paciente.php";
        $id = $_GET['id'];
        $idU = decrypt($id, "fisiopato");
        $sql = $conexion->query("select * from PACIENTE where ID_PACIENTE='" . $idU . "';");
        $fila = $sql->fetch_object();
        $imagenCodificada = base64_encode($fila->FOTO_PERFIL);

        ?>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <form method="POST" action="" enctype="multipart/form-data">
                    <div class="mb-3">
                        <?php if ($imagenCodificada != '') {
                            echo '<img class="mx-auto d-block" width=100 height=100 src="data:image/jpeg;base64,' . $imagenCodificada . '" />';
                        } else {
                            echo "no contiene foto de perfil";
                        }
                        ?>
                    </div>
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" name="nombre" placeholder="Ingrese el nombre" value=<?= $fila->NOMBRE_PACIENTE ?> required>
                    </div>
                    <div class="mb-3">
                        <label for="apellido" class="form-label">Apellido</label>
                        <input type="text" class="form-control" name="apellido" placeholder="Ingrese el apellido" value=<?= $fila->APELLIDO_PACIENTE ?> required>
                    </div>
                    <div class="mb-3">
                        <label for="usuario" class="form-label">Usuario</label>
                        <input type="text" class="form-control" name="usuario" placeholder="Ingrese el usuario" value=<?= $fila->USUARIO_PACIENTE ?> required>
                    </div>
                    <div class="mb-3">
                        <label for="contrasena" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="txtcontraseña" name="contrasena" placeholder="Nueva contraseña" disabled>
                        <button id="botonContra" type="button">modificar la contraseña</button>
                    </div>
                    <div class="mb-3">
                        <label for="foto" class="form-label">Foto de Perfil</label>
                        <input type="file" class="form-control" name="foto">
                    </div>
                    <button type="submit" class="btn btn-primary" name="btnguardar">Guardar</button>
                </form>
            </div>
        </div>
    </div>
    <script>
        let opcion = document.getElementById("botonContra");
        let texto = document.getElementById("txtcontraseña");
        opcion.addEventListener("click", funcion)

        function funcion() {
            if (texto.disabled) {
                texto.disabled = false;
                opcion.textContent = "cancelar modificacion de la contraseña";
            } else {
                texto.value="";
                texto.disabled = true;
                opcion.textContent = "modificar la contraseña";
            }
        }
    </script>
    <script src="https://kit.fontawesome.com/b1f1908e25.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

</body>

</html>