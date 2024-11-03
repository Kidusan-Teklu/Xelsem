<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "xelsem"; // Updated to your new database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Check if the required POST variables are set
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['title'], $_POST['author'], $_POST['category'])) {
        die(json_encode(["error" => "Missing title, author, or category."]));
    }

    $title = $_POST['title'];
    $author = $_POST['author'];
    $category = $_POST['category'];
    $bookId = isset($_GET['id']) ? $_GET['id'] : null;

    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["file"]["name"]);
    $uploadOk = 1;
    $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Validate file type
    if (!in_array($fileType, ["pdf", "epub", "mobi"])) {
        die(json_encode(["error" => "Only PDF, EPUB & MOBI files are allowed."]));
        $uploadOk = 0;
    }

    if ($uploadOk == 1) {
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            $upload_time = date("Y-m-d H:i:s");
            $last_update = date("Y-m-d H:i:s");

            if ($bookId) {
                // Update existing book
                $stmt = $conn->prepare("UPDATE books SET title=?, author=?, category=?, file=?, upload_time=?, last_update=? WHERE book_id=?");
                $stmt->bind_param("sssssii", $title, $author, $category, $target_file, $upload_time, $last_update, $bookId);
            } else {
                // Insert new book
                $stmt = $conn->prepare("INSERT INTO books (title, author, category, file, upload_time, last_update) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssss", $title, $author, $category, $target_file, $upload_time, $last_update);
            }

            if ($stmt->execute()) {
                echo json_encode(["success" => $bookId ? "Book updated successfully!" : "New book uploaded successfully!"]);
            } else {
                die(json_encode(["error" => "Error executing query: " . $stmt->error]));
            }

            $stmt->close();
        } else {
            die(json_encode(["error" => "Failed to upload file."]));
        }
    }
}

$conn->close();
?>
