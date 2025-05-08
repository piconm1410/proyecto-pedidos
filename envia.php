<?php 
$nombre = $_POST['nombre'];
$apellidos = $_POST['apellidos'];
$telefono = $_POST['telefono'];
$email = $_POST['email'];
$mensaje = $_POST['mensaje'];




$remitente='SUBETENOHAMBAI';

$header = 'From: ' . $remitente . " \r\n";
$header .= "X-Mailer: PHP/" . phpversion() . " \r\n";
$header .= "Mime-Version: 1.0 \r\n";
$header .= "Content-Type: text/html";

$mensaje = "<b>NOMBRE:</b>" . $nombre." <br>";
$mensaje .= "<b>APELLIDOS:</b>" . $apellidos." <br>";
$mensaje .= "<b>TELEFONO</b>: " . $telefonos . " <br>";
$mensaje .= "<b>EMAIL</b>: " . $email . " <br>";
$mensaje .= "<b>MENSAJE</b>: " . $_POST['mensaje'] . " <br>";
$mensaje .= "<b>Enviado el </b>" . date('d/m/Y', time());

$para = "jomy1234567891011121314@gmail.com";
$asunto = 'Contacto de Subete no hambai';

mail($para, $asunto, utf8_decode($mensaje), $header);

?>

<meta charset="utf-8">
<script>

		window.onload = function(){
			
			var conf = confirm("Su mensaje fue enviado con éxito. Nos estaremos comucando con usted lo más pronto posible. Gracias por su visita.");
			
			if(conf)
			{
				document.location="index.html";
			}
			else
			{
				document.location="contacto.html";
			}
			
		}


</script>