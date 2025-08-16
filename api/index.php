<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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

// חיבור למסד הנתונים
function getConnection() {
    global $dbConfig;
    
    try {
        $dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['database']};charset={$dbConfig['charset']}";
        $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'שגיאה בחיבור למסד הנתונים: ' . $e->getMessage()]);
        exit();
    }
}

// פונקציה ללוג פעולות
function logActivity($pdo, $action, $tableName, $recordId, $details) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO activity_log (action, table_name, record_id, details, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $action,
            $tableName,
            $recordId,
            json_encode($details),
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
    } catch (Exception $e) {
        error_log("שגיאה ברישום פעולה: " . $e->getMessage());
    }
}

// קבלת נתונים מה-request
$input = json_decode(file_get_contents('php://input'), true);
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// ניתוב ה-API
try {
    $pdo = getConnection();
    
    // בדיקת חיבור
    if ($path === '/api/health' && $method === 'GET') {
        echo json_encode([
            'status' => 'OK',
            'message' => 'מסד הנתונים מחובר'
        ]);
        exit();
    }
    
    // בדיקת לקוח קיים
    if ($path === '/api/customers/check' && $method === 'POST') {
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        
        $stmt = $pdo->prepare("
            SELECT * FROM customers 
            WHERE parent_email = ? AND parent_phone = ? AND status = 'active'
        ");
        $stmt->execute([$email, $phone]);
        $customer = $stmt->fetch();
        
        logActivity($pdo, 'CHECK_CUSTOMER', 'customers', null, [
            'email' => $email,
            'phone' => $phone,
            'found' => !empty($customer)
        ]);
        
        if ($customer) {
            echo json_encode(['exists' => true, 'customer' => $customer]);
        } else {
            echo json_encode(['exists' => false]);
        }
        exit();
    }
    
    // שמירת לקוח חדש
    if ($path === '/api/customers' && $method === 'POST') {
        $stmt = $pdo->prepare("
            INSERT INTO customers (
                parent_name, parent_email, parent_phone, child_name, child_age,
                child_gender, level, knows_now, goals, other_goal, notes,
                agree_contact, agree_terms
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $input['parentName'],
            $input['parentEmail'],
            $input['parentPhone'],
            $input['childName'],
            $input['childAge'],
            $input['childGender'],
            $input['level'],
            $input['knowsNow'] ?? null,
            json_encode($input['goals'] ?? []),
            $input['otherGoal'] ?? null,
            $input['notes'] ?? null,
            $input['agreeContact'] ? 1 : 0,
            $input['agreeTerms'] ? 1 : 0
        ]);
        
        $customerId = $pdo->lastInsertId();
        
        logActivity($pdo, 'CREATE_CUSTOMER', 'customers', $customerId, $input);
        
        echo json_encode([
            'success' => true,
            'customerId' => $customerId,
            'message' => 'הלקוח נשמר בהצלחה'
        ]);
        exit();
    }
    
    // שמירת תשלום
    if ($path === '/api/payments' && $method === 'POST') {
        $stmt = $pdo->prepare("
            INSERT INTO payments (
                customer_id, customer_name, customer_email, customer_phone,
                plan_key, plan_amount, plan_name, payment_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $input['customerId'],
            $input['customerName'],
            $input['customerEmail'],
            $input['customerPhone'],
            $input['planKey'],
            $input['planAmount'],
            $input['planName'],
            json_encode($input['paymentData'] ?? [])
        ]);
        
        $paymentId = $pdo->lastInsertId();
        
        logActivity($pdo, 'CREATE_PAYMENT', 'payments', $paymentId, $input);
        
        echo json_encode([
            'success' => true,
            'paymentId' => $paymentId,
            'message' => 'התשלום נשמר בהצלחה'
        ]);
        exit();
    }
    
    // עדכון סטטוס תשלום
    if (preg_match('/^\/api\/payments\/(\d+)\/status$/', $path, $matches) && $method === 'PUT') {
        $paymentId = $matches[1];
        $status = $input['status'] ?? '';
        $transactionId = $input['transactionId'] ?? null;
        
        $stmt = $pdo->prepare("
            UPDATE payments 
            SET status = ?, transaction_id = ? 
            WHERE id = ?
        ");
        $stmt->execute([$status, $transactionId, $paymentId]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'תשלום לא נמצא']);
            exit();
        }
        
        logActivity($pdo, 'UPDATE_PAYMENT_STATUS', 'payments', $paymentId, [
            'status' => $status,
            'transactionId' => $transactionId
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'סטטוס התשלום עודכן בהצלחה'
        ]);
        exit();
    }
    
    // קבלת כל הלקוחות
    if ($path === '/api/customers' && $method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT * FROM customers 
            WHERE status = 'active' 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $customers = $stmt->fetchAll();
        
        logActivity($pdo, 'GET_ALL_CUSTOMERS', 'customers', null, [
            'count' => count($customers)
        ]);
        
        echo json_encode($customers);
        exit();
    }
    
    // קבלת כל התשלומים
    if ($path === '/api/payments' && $method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT * FROM payments 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $payments = $stmt->fetchAll();
        
        logActivity($pdo, 'GET_ALL_PAYMENTS', 'payments', null, [
            'count' => count($payments)
        ]);
        
        echo json_encode($payments);
        exit();
    }
    
    // קבלת לקוח לפי ID
    if (preg_match('/^\/api\/customers\/(\d+)$/', $path, $matches) && $method === 'GET') {
        $customerId = $matches[1];
        
        $stmt = $pdo->prepare("
            SELECT * FROM customers 
            WHERE id = ? AND status = 'active'
        ");
        $stmt->execute([$customerId]);
        $customer = $stmt->fetch();
        
        if (!$customer) {
            http_response_code(404);
            echo json_encode(['error' => 'לקוח לא נמצא']);
            exit();
        }
        
        logActivity($pdo, 'GET_CUSTOMER', 'customers', $customerId, []);
        
        echo json_encode($customer);
        exit();
    }
    
    // קבלת תשלום לפי ID
    if (preg_match('/^\/api\/payments\/(\d+)$/', $path, $matches) && $method === 'GET') {
        $paymentId = $matches[1];
        
        $stmt = $pdo->prepare("
            SELECT * FROM payments 
            WHERE id = ?
        ");
        $stmt->execute([$paymentId]);
        $payment = $stmt->fetch();
        
        if (!$payment) {
            http_response_code(404);
            echo json_encode(['error' => 'תשלום לא נמצא']);
            exit();
        }
        
        logActivity($pdo, 'GET_PAYMENT', 'payments', $paymentId, []);
        
        echo json_encode($payment);
        exit();
    }
    
    // ייצוא נתונים
    if ($path === '/api/export' && $method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT * FROM customers 
            WHERE status = 'active' 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $customers = $stmt->fetchAll();
        
        $stmt = $pdo->prepare("
            SELECT * FROM payments 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $payments = $stmt->fetchAll();
        
        $exportData = [
            'customers' => $customers,
            'payments' => $payments,
            'exportDate' => date('c'),
            'totalCustomers' => count($customers),
            'totalPayments' => count($payments),
            'paidPayments' => count(array_filter($payments, fn($p) => $p['status'] === 'paid'))
        ];
        
        logActivity($pdo, 'EXPORT_DATA', 'export', null, [
            'customersCount' => count($customers),
            'paymentsCount' => count($payments)
        ]);
        
        echo json_encode($exportData);
        exit();
    }
    
    // מחיקת כל הנתונים (רק לפיתוח!)
    if ($path === '/api/clear-all' && $method === 'DELETE') {
        if ($_SERVER['SERVER_NAME'] !== 'localhost') {
            http_response_code(403);
            echo json_encode(['error' => 'לא ניתן למחוק נתונים בסביבת ייצור']);
            exit();
        }
        
        $pdo->exec('DELETE FROM payments');
        $pdo->exec('DELETE FROM customers');
        $pdo->exec('DELETE FROM activity_log');
        
        logActivity($pdo, 'CLEAR_ALL_DATA', 'all', null, []);
        
        echo json_encode([
            'success' => true,
            'message' => 'כל הנתונים נמחקו'
        ]);
        exit();
    }
    
    // אם לא נמצא route מתאים
    http_response_code(404);
    echo json_encode(['error' => 'Route לא נמצא']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'שגיאה בשרת: ' . $e->getMessage()]);
}
?>
