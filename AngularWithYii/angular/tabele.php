<?php

$data1 =  "[Produktnr,Produktname,Preis,Size,Anzahl,Prodsum],[1,BeispielUni,10€,-,3,30],[-,-,-,-,Summe: ,301]";
//remove last ]
$data1 = substr($data1, 0, -1);
//remove erst [
$data1 = substr($data1, 1);

$data1 = explode( "],[", $data1);
echo "<table>";
foreach ($data1 as $values){
	$values2 =explode(",", $values);
	$line = "";
	$line .="<tr>";
	foreach ($values2 as $value){
		$line .= "<td>" . $value . "</td>";
	}
	$line .= "</tr>";
	echo $line;
}

echo "</table>";




 $data2 = "[Produktnr,Produktname,Preis,Size,Anzahl,Prodsum],[1,BeispielUni,10€,-,3,30],[1,BeispielUni2,10€,-,3,30],[-,-,-,-,Summe: ,331]";

 //remove last ]
 $data2 = substr($data2, 0, -1);
 //remove erst [
 $data2 = substr($data2, 1);
 
 $data2 = explode( "],[", $data2); 
 
 $ersts = 0;
echo "<table>";
foreach ($data2 as $values){
	$values2 =explode(",", $values);
	$line = "";
	$line .="<tr>";
	if ($ersts == 0) {
		$ersts = 1;
		$td = "th";
	} else {
		$td = "td";
	}
	
	foreach ($values2 as $value){
		$line .= "<$td>" . $value . "</$td>";
	}
	$line .= "</tr>";
	echo $line;
}

echo "</table>";

 