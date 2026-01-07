<?php
    include_once './config/database.php';
    $sql = "SELECT * FROM `demo` ORDER BY `id` DESC";
    $result = $conn->query($sql);
    
    $response=array();
    header("Content-type: JSON");
    if ($result->num_rows > 0) {
        
      while($row = $result->fetch_assoc()) 
      {
          array_push($response,$row);
      }
     echo json_encode($response, JSON_PRETTY_PRINT);
    } 
    else 
    {
      echo "0 results";
    }
?>