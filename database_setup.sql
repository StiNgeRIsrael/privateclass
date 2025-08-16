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
