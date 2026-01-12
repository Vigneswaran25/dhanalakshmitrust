<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

require_once '../src/init.php'; // Ensure DB is init
require_once '../src/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM gallery_images ORDER BY id DESC";
        $result = $conn->query($sql);
        $images = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $images[] = $row;
            }
        }
        echo json_encode($images);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->image)) {
            $image = $conn->real_escape_string($data->image);
            $caption = "Uploaded from Device"; // Default for now
            $sql = "INSERT INTO gallery_images (image_data, caption) VALUES ('$image', '$caption')";

            if ($conn->query($sql) === TRUE) {
                echo json_encode(["status" => "success", "id" => $conn->insert_id]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $conn->error]);
            }
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id)) {
            $id = $conn->real_escape_string($data->id);
            $sql = "DELETE FROM gallery_images WHERE id = $id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["status" => "success"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $conn->error]);
            }
        }
        break;
}
?>