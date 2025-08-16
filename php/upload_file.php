<?php
$targetDir = "../uploads/";
$targetFile = $targetDir . basename($_FILES["file"]["name"]);
$response = [];

if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
    $response['success'] = true;
    $response['file_url'] = $targetFile;
} else {
    $response['success'] = false;
    $response['error'] = "File upload failed";
}

echo json_encode($response);
?>
