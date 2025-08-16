<?php
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data['name'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing name or invalid data"]);
        exit;
    }

    $filename = "../resume_data/" . preg_replace("/[^a-zA-Z0-9]/", "_", $data['name']) . "_resume.json";

    file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));

    echo json_encode(["success" => true, "message" => "Resume saved successfully"]);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method"]);
}
?>
