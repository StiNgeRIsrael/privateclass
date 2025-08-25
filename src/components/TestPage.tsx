import React from 'react';
import ConnectionTester from './ConnectionTester';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🔧 בדיקת חיבור לשרת</h1>
            <p className="text-gray-400 text-lg">
              בדיקות מקיפות לחיבור ה-API ומסד הנתונים
            </p>
          </div>

          {/* בדיקת חיבור */}
          <ConnectionTester />

          {/* מידע על mod_rewrite */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">📋 מידע על mod_rewrite</h3>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="font-bold text-green-400 mb-2">מה זה mod_rewrite?</h4>
                <p className="text-sm">
                  mod_rewrite הוא מודול של Apache שמאפשר לכתוב מחדש URLs. זה חיוני כדי שה-API יעבוד נכון.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-green-400 mb-2">מה צריך להיות בקובץ .htaccess:</h4>
                <pre className="bg-gray-800 p-4 rounded text-xs overflow-x-auto">
{`# הגדרות API
RewriteEngine On

# הגדרת Content-Type ל-JSON
<Files "*.php">
    Header set Content-Type "application/json; charset=utf-8"
</Files>

# ניתוב כל הבקשות ל-index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# הגדרות CORS
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

# טיפול ב-OPTIONS requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]`}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-green-400 mb-2">איך לבדוק אם mod_rewrite פעיל:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>צור קובץ test.php עם התוכן: <code className="bg-gray-800 px-2 py-1 rounded">phpinfo();</code></li>
                  <li>חפש "mod_rewrite" בדף</li>
                  <li>אם לא מופיע, צריך להפעיל אותו בשרת</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-green-400 mb-2">מיקום הקבצים בשרת:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li><code className="bg-gray-800 px-2 py-1 rounded">/class/api/index.php</code></li>
                  <li><code className="bg-gray-800 px-2 py-1 rounded">/class/api/.htaccess</code></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-green-400 mb-2">בדיקות נוספות:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>וודא שהשרת תומך ב-PHP</li>
                  <li>בדוק שהגדרות MySQL נכונות</li>
                  <li>בדוק את לוגי השרת לשגיאות</li>
                  <li>וודא שהרשאות הקבצים נכונות (644 או 755)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* בדיקות ידניות */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">🔍 בדיקות ידניות</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-yellow-400 mb-2">בדיקת חיבור ישיר:</h4>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-sm text-gray-300 mb-2">פתח בדפדפן ונסה:</p>
                  <code className="text-green-400 text-sm block mb-2">
                    https://stingerisrael.co.il/class/api/health
                  </code>
                  <p className="text-xs text-gray-400">
                    אם אתה מקבל HTML במקום JSON, זה אומר שה-API לא מוגדר נכון
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-yellow-400 mb-2">בדיקת קובץ PHP:</h4>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-sm text-gray-300 mb-2">נסה לגשת ישירות לקובץ:</p>
                  <code className="text-green-400 text-sm block mb-2">
                    https://stingerisrael.co.il/class/api/index.php
                  </code>
                  <p className="text-xs text-gray-400">
                    אם זה עובד, הבעיה היא ב-.htaccess
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-yellow-400 mb-2">בדיקת מסד נתונים:</h4>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-sm text-gray-300 mb-2">צור קובץ test-db.php:</p>
                  <pre className="text-xs text-green-400 overflow-x-auto">
{`<?php
$dbConfig = [
    'host' => 'localhost',
    'port' => 3306,
    'user' => 'stingerisrael_class',
    'password' => 'RWtj*H6xiq6as~7q',
    'database' => 'stingerisrael_class',
    'charset' => 'utf8mb4'
];

try {
    $dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['database']};charset={$dbConfig['charset']}";
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['password']);
    echo json_encode(['status' => 'OK', 'message' => 'מסד הנתונים מחובר']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'ERROR', 'message' => $e->getMessage()]);
}
?>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* פתרונות נפוצים */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">🛠️ פתרונות נפוצים</h3>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="font-bold text-red-400 mb-2">אם השרת מחזיר HTML:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>וודא שקובץ api/index.php קיים</li>
                  <li>וודא שקובץ api/.htaccess קיים</li>
                  <li>בדוק שהשרת תומך ב-mod_rewrite</li>
                  <li>נסה להפעיל מחדש את השרת</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-red-400 mb-2">אם יש שגיאת 404:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>בדוק את הנתיב הנכון</li>
                  <li>וודא שהקבצים הועלו למיקום הנכון</li>
                  <li>בדוק את הגדרות השרת</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-red-400 mb-2">אם יש שגיאת מסד נתונים:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>בדוק את פרטי החיבור למסד הנתונים</li>
                  <li>וודא שמסד הנתונים קיים</li>
                  <li>בדוק שהטבלאות קיימות</li>
                  <li>בדוק את הרשאות המשתמש</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
