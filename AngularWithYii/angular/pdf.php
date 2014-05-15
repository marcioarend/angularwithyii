<?php
define('FPDF_FONTPATH','font/');
require('../lib/fpdf.php');

class PDF extends FPDF
{
function Top($text="Empty")
	{
		// Logo
		$this->Image('ShadowplayLogoVerbessert.png',10,6,30);
		// Arial bold 15
		$this->SetFont('Arial','B',15);
		// Move to the right
		$this->Cell(50);
		// Title
		$this->Write(5,$text);
		// Line break
		$this->Ln(20);
}

// Page footer
function UnterAGB($text)
{
	$this->SetY(-30);
	// Arial italic 8
	$this->SetFont('Arial','I',10);
	// Page number
	$this->Write(0,$text);
}


// Page footer
function Unter()
{
	// Position at 1.5 cm from bottom
	$this->SetY(-25	);
	// Arial italic 8
	$this->SetFont('Arial','I',8);
	// Page number
	$this->Cell(180,4	,'Page '.$this->PageNo(),0,0,'C');
	//$this->Write(5,  );
}

function BasicTable($header, $data)
{
	// Header
	foreach($header as $col)
		$this->Cell(30,7,$col,1);
	$this->Ln();
	// Data
	foreach($data as $row)
	{
		foreach($row as $col)
			$this->Cell(30,6,$col,1);
		$this->Ln();
	}
}

function Trennung(&$head,&$data,$vondatenBank){
	
	$erstMal = true;
	foreach($vondatenBank as $row){
		$row2 =explode(",", $row);
		if ($erstMal == true){
			foreach($row2 as $col){
				$head[] = $col;				
			}
			$erstMal = false;
		} else {
			$dataTemp = array();
			foreach($row2 as $col){
				$dataTemp[] = $col;
			}
			$data[] = $dataTemp;
		}
	}
}


//Colored table
function FancyTable($header,$data)
{
    //Colors, line width and bold font
    $this->SetFillColor(255,0,0);
    $this->SetTextColor(255);
    $this->SetDrawColor(128,0,0);
    $this->SetLineWidth(.2);
    $this->SetFont('','B');
    //Header langer 
    $w=array(30,30,30,25,30,30);
    for($i=0;$i<count($header);$i++)
        $this->Cell($w[$i],7,$header[$i],1,0,'C',1);
    $this->Ln();
    //Color and font restoration
    $this->SetFillColor(224,235,255);
    $this->SetTextColor(0);
    $this->SetFont('');
    //Data
    $fill=0;
    foreach($data as $row)
    {
        $this->Cell($w[0],6,$row[0],'LR',0,'L',$fill);
        $this->Cell($w[1],6,$row[1],'LR',0,'L',$fill);
        $this->Cell($w[2],6,$row[2],'LR',0,'R',$fill);
        $this->Cell($w[3],6,$row[3],'LR',0,'R',$fill);
        $this->Cell($w[4],6,$row[4],'LR',0,'R',$fill);
        $this->Cell($w[5],6,$row[5] ,'LR',0,'R',$fill);
        $this->Ln();
        $fill=!$fill;
    }
    $this->Cell(array_sum($w),0,'','T');
}
}

$fakePost = array();
$fakePost["waren"] = "[Produktnr,Produktname,Preis,Size,Anzahl,Prodsum],[1,BeispielUni,10€,-,011,110],[-,-,-,-,Summe: ,110],[-,-,-,-,Summe: ,110]";
$fakePost["AGB"]   = "Hier stehen bald mal AGBs";
$fakePost["Konto"]["User"] =  "Jochen;...;...;...;lap@top.de";
$user = explode(';', $fakePost["Konto"]["User"]);

//Data loading
$data2 = $fakePost["waren"];//"[Produktnr,Produktname,Preis,Size,Anzahl,Prodsum],[1,BeispielUni,10,-,3,30],[1,BeispielUni2,10,-,3,30],[-,-,-,-,Summe: ,331]";

//remove last ]
$data2 = substr($data2, 0, -1);
//remove erst [
$data2 = substr($data2, 1);

$data2 = explode( "],[", $data2);

$header = array();
$value = array();



$pdf=new PDF();

$pdf->Trennung($header, $value, $data2);

$pdf->AddPage();
$pdf->Top("Ihre Bestellung " . $user[0] . " Mail " . $user[4]);
$pdf->SetFont('Arial','',12);
$pdf->FancyTable($header,$value);
$pdf->UnterAGB($fakePost["AGB"]);
$pdf->Unter();
$pdf->Output();
?> 