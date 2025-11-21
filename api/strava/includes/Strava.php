<?php

$secretsPath = __DIR__ . '/../../../secrets.php';
if (!file_exists($secretsPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Server configuration error']);
    exit;
}
require_once $secretsPath;

class Strava {

    private const CACHE_FILE = __DIR__ . '/token_cache.php';

    private static ?string $access_token = null;
    private static ?int    $expires_at   = null;

    private static function loadCache(): void {
        if (file_exists(self::CACHE_FILE)) {
            $data = include self::CACHE_FILE;
            if (is_array($data) && isset($data['access_token'], $data['expires_at'])) {
                self::$access_token = $data['access_token'];
                self::$expires_at   = $data['expires_at'];
            }
        }
    }

    private static function saveCache(): void {
        $content = "<?php\n// AUTO-GENERATED Strava token cache — safe to delete\nreturn " . var_export([
            'access_token' => self::$access_token,
            'expires_at'   => self::$expires_at
        ], true) . ";\n?>";

        file_put_contents(self::CACHE_FILE, $content);
    }

    public static function getAccessToken(): string {
        if (self::$access_token === null) {
            self::loadCache();
        }

        if (self::$access_token && self::$expires_at > time() + 300) {
            return self::$access_token;
        }

        $response = file_get_contents('https://www.strava.com/oauth/token', false, stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => 'Content-Type: application/x-www-form-urlencoded',
                'content' => http_build_query([
                    'client_id'     => STRAVA_CLIENT_ID,
                    'client_secret' => STRAVA_CLIENT_SECRET,
                    'grant_type'    => 'refresh_token',
                    'refresh_token' => STRAVA_REFRESH_TOKEN,
                ])
            ]
        ]));

        $data = json_decode($response, true);

        if (empty($data['access_token'])) {
            http_response_code(502);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Strava auth failed', 'details' => $response]);
            exit;
        }

        self::$access_token = $data['access_token'];
        self::$expires_at   = $data['expires_at'] ?? (time() + 3600);

        self::saveCache();
        return self::$access_token;
    }

    public static function get(string $url): string {
        $token = self::getAccessToken();
        $result = file_get_contents($url, false, stream_context_create([
            'http' => ['header' => "Authorization: Bearer {$token}\r\n"]
        ]));

        if ($result === false) {
            throw new Exception("Failed to fetch $url");
        }

        return $result;
    }
}
