<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    if($_SERVER['REQUEST_METHOD'] == "POST"){
        if(isset($_POST["cars"])){
            $_SESSION['cars'] = $_POST['cars'];
            echo "<h2>Response:</h2><br><p>Your submission has been received</p>";
        }
        else{
            $_SESSION['cars'] = null;
            echo '<h2>Response:</h2><br><p>No cars submitted.</p>';
        }
    }
    if($_SERVER['REQUEST_METHOD'] == "GET"){
        if($_GET['function'] == "getCars"){
            getCars();
        }
        if($_GET['function'] == "clearCars"){
            clearCars();
        }
    }

    function getCars(){
        if($_SESSION['cars']==null){
            echo "<p>No Cars Selected</p>";
        }
        else{
            $cars = $_SESSION['cars'];
            $response = "";
            $response.='<table border=1>
                            <tr>
                                <th>Car</th>
                                <th>Image</th>
                            </tr>';
            foreach($cars as $key=>$value){
                $response.='<tr>
                                <td>'.$value.'</td>
                                <td><img src=\'Images/'.$value.'.png\'></td>
                            </tr>';
            }

            $response.="</table>";
            $response.="<br><button onclick=clearCars()>Clear Cars</button>";
            echo $response;
        }
    }

    function clearCars(){
        $_SESSION['cars'] = null;
        echo "<p>Cars have been cleared</p>";
    }


?>