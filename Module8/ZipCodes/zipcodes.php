<?php
$file = fopen("Files/ZipCodeList.txt", "r");
$array = [];

while (($line = fgetcsv($file)) !== false) {
    // $line is an array containing the values from the current line
    $zip = $line[0]; // Accessing the ZIP code
    $lat = $line[1]; // Accessing the Latitude
    $lng = $line[2]; // Accessing the Longitude

    $coords = ["Latitude"=>$lat, "Longitude"=>$lng];
    $array[$zip] = $coords;
    
}

fclose($file);

if(isset($_GET['zip1']) && isset($_GET['zip2'])){
    $zip1 = $_GET['zip1'];
    $zip2 = $_GET['zip2'];

    if(isset($array[$zip1]) && isset($array[$zip2])){
        $zip1array = ["Number"=>$zip1, "Latitude"=>$array[$zip1]["Latitude"], "Longitude"=>$array[$zip1]["Longitude"]];
        $zip2array = ["Number"=>$zip2, "Latitude"=>$array[$zip2]["Latitude"], "Longitude"=>$array[$zip2]["Longitude"]];
        $zips = array($zip1array, $zip2array);
        $outputArray["Zips"] = $zips;

        // $outputArray["Info"][$zip1] = $array[$zip1];
        // $outputArray["Info"][$zip2] = $array[$zip2];

        $lat1 = $zip1array["Latitude"];
        $long1 = $zip1array["Longitude"];

        $lat2 = $zip2array["Latitude"];
        $long2 = $zip2array["Longitude"];

        $outputArray["Distance"] = round(calculateDistance($lat1, $long1, $lat2, $long2));
        echo json_encode($outputArray);
    }
    
    if(!isset($array[$zip1])){
        if(!isset($array[$zip2])){
            header("HTTP/1.1 600 Both zip codes not in database");
            exit();
        }
        else{
            header("HTTP/1.1 600 First zip code not in database");
            exit();
        }
    }
    else if(!isset($array[$zip2])){
        header("HTTP/1.1 600 Second zip code not in database");
        exit();
    }
}

function calculateDistance($lat1, $long1, $lat2, $long2){
    $theta = $long1 - $long2;
    $distance = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta)); 
    $distance = acos($distance);
    $distance = rad2deg($distance);
    $miles = $distance * 60 * 1.1515;
    return $miles;
}

?>