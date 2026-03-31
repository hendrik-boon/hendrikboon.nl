<?php
require_once 'includes/Strava.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$required = ['before', 'after', 'page', 'per_page'];

foreach ($required as $param) {
    if (!isset($_GET[$param]) || $_GET[$param] === '') {
        http_response_code(400);
        echo json_encode([
            'error' => "Missing required parameter: $param"
        ]);
        exit;
    }
}

$before   = (int)$_GET['before'];
$after    = (int)$_GET['after'];
$page     = (int)$_GET['page'];
$per_page = (int)$_GET['per_page'];

if ($before <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid "before" parameter']);
    exit;
}
if ($after <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid "after" parameter']);
    exit;
}
if ($page < 1) {
    http_response_code(400);
    echo json_encode(['error' => '"page" must be 1 or higher']);
    exit;
}
if ($per_page < 1 || $per_page > 200) {
    http_response_code(400);
    echo json_encode(['error' => '"per_page" must be between 1 and 200']);
    exit;
}

try {
    $url = "https://www.strava.com/api/v3/athlete/activities"
         . "?before="   . $before
         . "&after="    . $after
         . "&page="     . $page
         . "&per_page=" . $per_page;

    echo Strava::get($url);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
