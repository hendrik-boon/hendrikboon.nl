<?php
require_once 'includes/Strava.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$athlete_id = '74736765';

try {
    echo Strava::get("https://www.strava.com/api/v3/athletes/{$athlete_id}/stats");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}