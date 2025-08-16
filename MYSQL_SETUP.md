# 🗄️ התקנת מערכת MySQL - StingerClass

## 📋 שלב 1: הקמת מסד הנתונים ב-Plesk

### 1.1 כניסה ל-Plesk
1. היכנס ל-Plesk שלך
2. לך ל-**Databases** → **MySQL Databases**
3. צור מסד נתונים חדש:
   - **Database name**: `stingerisrael_class`
   - **User name**: `stingerisrael_class`
   - **Password**: `RWtj*H6xiq6as~7q`

### 1.2 הרצת SQL Script
1. לך ל-**phpMyAdmin** או **Database Tools**
2. בחר את המסד נתונים `stingerisrael_class`
3. הרץ את הקוד מ-`database_setup.sql`:

```sql
-- הקמת מסד הנתונים StingerClass
-- הרץ את הפקודות האלה ב-Plesk MySQL

-- יצירת טבלת לקוחות
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_name VARCHAR(100) NOT NULL,
    parent_email VARCHAR(100) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    child_name VARCHAR(100) NOT NULL,
    child_age VARCHAR(10) NOT NULL,
    child_gender ENUM('male', 'female', 'other') NOT NULL,
    level VARCHAR(50) NOT NULL,
    knows_now TEXT,
    goals JSON,
    other_goal TEXT,
    notes TEXT,
    agree_contact BOOLEAN DEFAULT FALSE,
    agree_terms BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- אינדקסים לביצועים טובים יותר
    INDEX idx_email_phone (parent_email, parent_phone),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- יצירת טבלת תשלומים
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    plan_key VARCHAR(50) NOT NULL,
    plan_amount DECIMAL(10,2) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    status ENUM('pending', 'paid', 'cancelled', 'failed') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    payment_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- מפתח זר לקישור ללקוח
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    
    -- אינדקסים
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_created_at (created_at)
);

-- יצירת טבלת לוג פעולות (אופציונלי - לניטור)
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

-- הכנסת נתונים לדוגמה (אופציונלי)
INSERT INTO customers (parent_name, parent_email, parent_phone, child_name, child_age, child_gender, level, agree_contact, agree_terms) VALUES
('יוסי כהן', 'yossi@example.com', '050-1234567', 'דניאל כהן', '10', 'male', 'מתחיל', TRUE, TRUE),
('שרה לוי', 'sarah@example.com', '052-9876543', 'מיכל לוי', '12', 'female', 'בינוני', TRUE, TRUE);

-- הצגת הטבלאות שנוצרו
SHOW TABLES;

-- הצגת מבנה הטבלאות
DESCRIBE customers;
DESCRIBE payments;
DESCRIBE activity_log;
```

## 📦 שלב 2: התקנת Dependencies

### 2.1 התקנת Node.js Dependencies
```bash
npm install express mysql2 cors
```

### 2.2 וידוא שהקבצים קיימים
- ✅ `api/server.js` - שרת Node.js
- ✅ `src/data/database.ts` - מערכת API
- ✅ `database_setup.sql` - סקריפט SQL
- ✅ `package.json` - מעודכן עם dependencies

## 🚀 שלב 3: הרצת המערכת

### 3.1 הרצה בפיתוח
```bash
# טרמינל 1 - הרצת שרת API
npm run server

# טרמינל 2 - הרצת React
npm run dev
```

### 3.2 הרצה בייצור
```bash
# בנייה והרצה
npm run start
```

## 🔧 שלב 4: בדיקת המערכת

### 4.1 בדיקת חיבור למסד הנתונים
```bash
curl http://localhost:3001/api/health
```

**תשובה צפויה:**
```json
{
  "status": "OK",
  "message": "מסד הנתונים מחובר"
}
```

### 4.2 בדיקת API Endpoints
```bash
# בדיקת לקוחות
curl http://localhost:3001/api/customers

# בדיקת תשלומים
curl http://localhost:3001/api/payments

# ייצוא נתונים
curl http://localhost:3001/api/export
```

## 🌐 שלב 5: הגדרת ייצור

### 5.1 הגדרת Environment Variables
צור קובץ `.env`:
```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=stingerisrael_class
DB_PASSWORD=RWtj*H6xiq6as~7q
DB_NAME=stingerisrael_class
```

### 5.2 הגדרת Process Manager (PM2)
```bash
# התקנת PM2
npm install -g pm2

# הרצת השרת עם PM2
pm2 start api/server.js --name "stinger-api"

# שמירת הגדרות
pm2 save
pm2 startup
```

### 5.3 הגדרת Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name stingerisrael.co.il;

    # React App
    location / {
        root /path/to/your/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 שלב 6: בדיקות

### 6.1 בדיקת רישום לקוח
1. לך ל-`http://localhost:5173/checkout`
2. מלא טופס רישום
3. בדוק בקונסול שהנתונים נשמרו

### 6.2 בדיקת פאנל ניהול
1. לך ל-`http://localhost:5173/admin`
2. בדוק שהנתונים מוצגים
3. נסה לייצא נתונים

### 6.3 בדיקת Webhook
1. לך ל-`http://localhost:5173/webhook.html`
2. פתח Developer Tools
3. שלח הודעה:
```javascript
window.postMessage({
  type: 'IPN_UPDATE',
  data: {
    paymentId: 1,
    status: 'paid',
    transactionId: 'test-123'
  }
}, '*');
```

## 🛠️ פתרון בעיות

### בעיה: חיבור למסד הנתונים נכשל
```bash
# בדוק שהמסד נתונים קיים
mysql -u stingerisrael_class -p stingerisrael_class

# בדוק הרשאות
SHOW GRANTS FOR 'stingerisrael_class'@'localhost';
```

### בעיה: CORS Error
```javascript
// ב-api/server.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://stingerisrael.co.il'],
  credentials: true
}));
```

### בעיה: Port כבר בשימוש
```bash
# בדוק איזה תהליך משתמש בפורט
lsof -i :3001

# הרוג את התהליך
kill -9 <PID>
```

## 📊 מבנה הנתונים

### טבלת לקוחות (customers)
- `id` - מזהה ייחודי
- `parent_name` - שם ההורה
- `parent_email` - אימייל ההורה
- `parent_phone` - טלפון ההורה
- `child_name` - שם הילד
- `child_age` - גיל הילד
- `child_gender` - מין הילד
- `level` - רמה
- `knows_now` - מה יודע היום
- `goals` - מטרות (JSON)
- `other_goal` - מטרה אחרת
- `notes` - הערות
- `agree_contact` - הסכמה ליצירת קשר
- `agree_terms` - הסכמה לתנאים
- `status` - סטטוס (active/inactive/deleted)
- `created_at` - תאריך יצירה
- `updated_at` - תאריך עדכון

### טבלת תשלומים (payments)
- `id` - מזהה ייחודי
- `customer_id` - מזהה לקוח (מפתח זר)
- `customer_name` - שם הלקוח
- `customer_email` - אימייל הלקוח
- `customer_phone` - טלפון הלקוח
- `plan_key` - מפתח החבילה
- `plan_amount` - סכום החבילה
- `plan_name` - שם החבילה
- `status` - סטטוס התשלום
- `transaction_id` - מזהה עסקה
- `payment_data` - נתוני תשלום (JSON)
- `created_at` - תאריך יצירה
- `updated_at` - תאריך עדכון

## 🎯 סיכום

✅ **מסד נתונים MySQL** - מוכן ומחובר  
✅ **שרת Node.js API** - פועל על פורט 3001  
✅ **מערכת React** - מתחברת ל-API  
✅ **Webhook System** - מעדכן תשלומים  
✅ **Discord Integration** - שולח הודעות  
✅ **Admin Panel** - לניהול נתונים  

המערכת מוכנה לשימוש! 🚀
