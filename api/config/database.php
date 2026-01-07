<?php
$servername = "localhost";
$username = "id18888766_nick";
$password = "Niketan@12345";
$dbname = "id18888766_demo";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if($conn === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

?>