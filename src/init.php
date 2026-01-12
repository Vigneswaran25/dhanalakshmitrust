<?php
require_once 'db.php';

function initDatabase() {
    $database = new Database();
    
    // Simple retry loop for Docker startup
    for ($i = 0; $i < 10; $i++) {
        $conn = $database->getConnection();
        if ($conn) break;
        sleep(2);
    }

    if (!$conn) {
        error_log("Failed to connect to MySQL after retries.");
        return;
    }

    $sql = "CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_data LONGTEXT NOT NULL,
        caption VARCHAR(255) DEFAULT 'Uploaded from Device',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if ($conn->query($sql) === TRUE) {
        error_log("Database 'gallery_images' table check/creation success.");
    } else {
        error_log("Error creating table: " . $conn->error);
    }
}

// Auto-run on include
initDatabase();
?>
