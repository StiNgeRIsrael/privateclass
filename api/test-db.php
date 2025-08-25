<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// טיפול ב-OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// הגדרות מסד הנתונים
$dbConfig = [
    'host' => 'localhost',
    'port' => 3306,
    'user' => 'stingerisrael_class',
    'password' => 'RWtj*H6xiq6as~7q',
    'database' => 'stingerisrael_class',
    'charset' => 'utf8mb4'
];

$result = [
    'timestamp' => date('c'),
    'server_info' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown'
    ],
    'database_test' => null,
    'tables_check' => null,
    'permissions_check' => null
];

// בדיקת חיבור למסד הנתונים
try {
    $dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['database']};charset={$dbConfig['charset']}";
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
    $result['database_test'] = [
        'status' => 'SUCCESS',
        'message' => 'מסד הנתונים מחובר בהצלחה',
        'connection_info' => [
            'host' => $dbConfig['host'],
            'port' => $dbConfig['port'],
            'database' => $dbConfig['database'],
            'charset' => $dbConfig['charset']
        ]
    ];
    
    // בדיקת טבלאות
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $result['tables_check'] = [
        'status' => 'SUCCESS',
        'tables_found' => count($tables),
        'tables' => $tables
    ];
    
    // בדיקת הרשאות
    $permissions = [];
    
    // בדיקת SELECT
    try {
        $stmt = $pdo->query("SELECT 1");
        $permissions['SELECT'] = 'OK';
    } catch (Exception $e) {
        $permissions['SELECT'] = 'ERROR: ' . $e->getMessage();
    }
    
    // בדיקת INSERT
    try {
        $stmt = $pdo->prepare("INSERT INTO customers (parent_name, parent_email, parent_phone, child_name, child_age, child_gender, level, agree_contact, agree_terms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $permissions['INSERT'] = 'OK';
    } catch (Exception $e) {
        $permissions['INSERT'] = 'ERROR: ' . $e->getMessage();
    }
    
    // בדיקת UPDATE
    try {
        $stmt = $pdo->prepare("UPDATE customers SET parent_name = ? WHERE id = 999999");
        $permissions['UPDATE'] = 'OK';
    } catch (Exception $e) {
        $permissions['UPDATE'] = 'ERROR: ' . $e->getMessage();
    }
    
    // בדיקת DELETE
    try {
        $stmt = $pdo->prepare("DELETE FROM customers WHERE id = 999999");
        $permissions['DELETE'] = 'OK';
    } catch (Exception $e) {
        $permissions['DELETE'] = 'ERROR: ' . $e->getMessage();
    }
    
    $result['permissions_check'] = [
        'status' => 'SUCCESS',
        'permissions' => $permissions
    ];
    
} catch (PDOException $e) {
    $result['database_test'] = [
        'status' => 'ERROR',
        'message' => 'שגיאה בחיבור למסד הנתונים: ' . $e->getMessage(),
        'error_code' => $e->getCode(),
        'connection_info' => [
            'host' => $dbConfig['host'],
            'port' => $dbConfig['port'],
            'database' => $dbConfig['database'],
            'charset' => $dbConfig['charset']
        ]
    ];
    
    $result['tables_check'] = [
        'status' => 'ERROR',
        'message' => 'לא ניתן לבדוק טבלאות - בעיית חיבור'
    ];
    
    $result['permissions_check'] = [
        'status' => 'ERROR',
        'message' => 'לא ניתן לבדוק הרשאות - בעיית חיבור'
    ];
}

// בדיקת מודולים PHP
$result['php_modules'] = [
    'pdo' => extension_loaded('pdo') ? 'LOADED' : 'NOT_LOADED',
    'pdo_mysql' => extension_loaded('pdo_mysql') ? 'LOADED' : 'NOT_LOADED',
    'json' => extension_loaded('json') ? 'LOADED' : 'NOT_LOADED'
];

// בדיקת הגדרות PHP
$result['php_settings'] = [
    'display_errors' => ini_get('display_errors'),
    'error_reporting' => ini_get('error_reporting'),
    'max_execution_time' => ini_get('max_execution_time'),
    'memory_limit' => ini_get('memory_limit')
];

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
