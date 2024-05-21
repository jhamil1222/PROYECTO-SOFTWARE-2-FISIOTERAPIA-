<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro y Modificación de Datos Pacientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>

<body>


    <div class="container-fluid row">
        <div class="col-md-6">
            <?php
            include "controlador/registro_pacientes.php";
            include "encripta.php";
            ?>

            <form method="POST" action="" enctype="multipart/form-data">

                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" name="nombre" placeholder="Ingrese el nombre" required>
                </div>
                <div class="mb-3">
                    <label for="apellido" class="form-label">Apellido</label>
                    <input type="text" class="form-control" name="apellido" placeholder="Ingrese el apellido" required>
                </div>
                <div class="mb-3">
                    <label for="usuario" class="form-label">Usuario</label>
                    <input type="text" class="form-control" name="usuario" placeholder="Ingrese el usuario" required>
                </div>
                <div class="mb-3">
                    <label for="contrasena" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" name="contrasena" placeholder="Ingrese la contraseña" required>
                </div>
                <div class="mb-3">
                    <label for="foto" class="form-label">Foto de Perfil</label>
                    <input type="file" class="form-control" name="foto">
                </div>
                <button type="submit" class="btn btn-primary" name="btnguardar">Guardar</button>
            </form>
        </div>
        <div class="col-md-6">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Usuario</th>
                        <th scope="col">FOTO</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    include "modelo/conexion.php";
                    $sql = $conexion->query("select * from PACIENTE;");
                    while ($datos = $sql->fetch_object()) {
                        $imagenCodificada = base64_encode($datos->FOTO_PERFIL); // Codificar la imagen en base64
                    ?>
                        <tr>
                            <td><?= $datos->ID_PACIENTE ?></td>
                            <td><?= $datos->NOMBRE_PACIENTE ?></td>
                            <td><?= $datos->USUARIO_PACIENTE ?></td>
                            <td><?php if ($imagenCodificada != '') {
                                    echo '<img width=100 height=100 src="data:image/jpeg;base64,' . $imagenCodificada . '" />';
                                } else {
                                    echo "no contiene foto de perfil";
                                }
                                ?></td>


                            <td><a class="btn btn-small btn-warning" href=<?php
                                                                            $dato=encrypt($datos->ID_PACIENTE,"fisiopato");
                                                                            echo "modificarpaciente.php?id=" .$dato; ?>><i class="fa-solid fa-pen-to-square"></i></a>
                                <a class="btn btn-small btn-danger"><i class="fa-solid fa-trash"></i></a>
                                <a class="btn btn-small btn-success"><i class="fa-solid fa-briefcase-medical"></i></a>
                            </td>
                        </tr>
                    <?php
                    }
                    $conexion->close();
                    ?>


                </tbody>
            </table>

        </div>
    </div>

    <script src="https://kit.fontawesome.com/b1f1908e25.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

</body>

</html>