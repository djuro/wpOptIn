<?php
session_start();

// Create a 100*30 image
$im = imagecreate(80, 30);

// White background and blue text
$bg = imagecolorallocate($im, 255, 255, 255);
$textcolor = imagecolorallocate($im, 200, 0, 255);

$text = $_SESSION['num1'] .' + '.$_SESSION['num2'].' =';
// Write the string at the top left
imagestring($im, 6, 10, 10, $text, $textcolor);

// Output the image
header('Content-type: image/png');

imagepng($im);
imagedestroy($im);

?>