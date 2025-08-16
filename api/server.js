const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// הגדרות חיבור למסד הנתונים
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'stingerisrael_class',
  password: 'RWtj*H6xiq6as~7q',
  database: 'stingerisrael_class',
  charset: 'utf8mb4',
  timezone: '+02:00'
};

// יצירת pool חיבורים
const pool = mysql.createPool({
  ...dbConfig,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// בדיקת חיבור למסד הנתונים
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ חיבור למסד הנתונים הצליח!');
    connection.release();
  } catch (error) {
    console.error('❌ שגיאה בחיבור למסד הנתונים:', error);
    process.exit(1);
  }
}

// פונקציה ללוג פעולות
async function logActivity(action, tableName, recordId, details, req) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO activity_log (action, table_name, record_id, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [action, tableName, recordId, JSON.stringify(details), req.ip, req.get('User-Agent')]
    );
    return result.insertId;
  } catch (error) {
    console.error('שגיאה ברישום פעולה:', error);
  }
}

// API Routes

// בדיקת חיבור
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'OK', message: 'מסד הנתונים מחובר' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// בדיקת לקוח קיים
app.post('/api/customers/check', async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE parent_email = ? AND parent_phone = ? AND status = "active"',
      [email, phone]
    );
    
    await logActivity('CHECK_CUSTOMER', 'customers', null, { email, phone, found: rows.length > 0 }, req);
    
    if (rows.length > 0) {
      res.json({ exists: true, customer: rows[0] });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('שגיאה בבדיקת לקוח:', error);
    res.status(500).json({ error: error.message });
  }
});

// שמירת לקוח חדש
app.post('/api/customers', async (req, res) => {
  try {
    const customerData = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO customers (
        parent_name, parent_email, parent_phone, child_name, child_age, 
        child_gender, level, knows_now, goals, other_goal, notes, 
        agree_contact, agree_terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerData.parentName,
        customerData.parentEmail,
        customerData.parentPhone,
        customerData.childName,
        customerData.childAge,
        customerData.childGender,
        customerData.level,
        customerData.knowsNow || null,
        JSON.stringify(customerData.goals || []),
        customerData.otherGoal || null,
        customerData.notes || null,
        customerData.agreeContact,
        customerData.agreeTerms
      ]
    );
    
    await logActivity('CREATE_CUSTOMER', 'customers', result.insertId, customerData, req);
    
    res.json({ 
      success: true, 
      customerId: result.insertId,
      message: 'הלקוח נשמר בהצלחה'
    });
  } catch (error) {
    console.error('שגיאה בשמירת לקוח:', error);
    res.status(500).json({ error: error.message });
  }
});

// שמירת תשלום
app.post('/api/payments', async (req, res) => {
  try {
    const paymentData = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO payments (
        customer_id, customer_name, customer_email, customer_phone,
        plan_key, plan_amount, plan_name, payment_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        paymentData.customerId,
        paymentData.customerName,
        paymentData.customerEmail,
        paymentData.customerPhone,
        paymentData.planKey,
        paymentData.planAmount,
        paymentData.planName,
        JSON.stringify(paymentData.paymentData || {})
      ]
    );
    
    await logActivity('CREATE_PAYMENT', 'payments', result.insertId, paymentData, req);
    
    res.json({ 
      success: true, 
      paymentId: result.insertId,
      message: 'התשלום נשמר בהצלחה'
    });
  } catch (error) {
    console.error('שגיאה בשמירת תשלום:', error);
    res.status(500).json({ error: error.message });
  }
});

// עדכון סטטוס תשלום
app.put('/api/payments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionId } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE payments SET status = ?, transaction_id = ? WHERE id = ?',
      [status, transactionId, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'תשלום לא נמצא' });
    }
    
    await logActivity('UPDATE_PAYMENT_STATUS', 'payments', id, { status, transactionId }, req);
    
    res.json({ 
      success: true, 
      message: 'סטטוס התשלום עודכן בהצלחה'
    });
  } catch (error) {
    console.error('שגיאה בעדכון סטטוס תשלום:', error);
    res.status(500).json({ error: error.message });
  }
});

// קבלת כל הלקוחות
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE status = "active" ORDER BY created_at DESC'
    );
    
    await logActivity('GET_ALL_CUSTOMERS', 'customers', null, { count: rows.length }, req);
    
    res.json(rows);
  } catch (error) {
    console.error('שגיאה בקבלת לקוחות:', error);
    res.status(500).json({ error: error.message });
  }
});

// קבלת כל התשלומים
app.get('/api/payments', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM payments ORDER BY created_at DESC'
    );
    
    await logActivity('GET_ALL_PAYMENTS', 'payments', null, { count: rows.length }, req);
    
    res.json(rows);
  } catch (error) {
    console.error('שגיאה בקבלת תשלומים:', error);
    res.status(500).json({ error: error.message });
  }
});

// קבלת לקוח לפי ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE id = ? AND status = "active"',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'לקוח לא נמצא' });
    }
    
    await logActivity('GET_CUSTOMER', 'customers', id, {}, req);
    
    res.json(rows[0]);
  } catch (error) {
    console.error('שגיאה בקבלת לקוח:', error);
    res.status(500).json({ error: error.message });
  }
});

// קבלת תשלום לפי ID
app.get('/api/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'תשלום לא נמצא' });
    }
    
    await logActivity('GET_PAYMENT', 'payments', id, {}, req);
    
    res.json(rows[0]);
  } catch (error) {
    console.error('שגיאה בקבלת תשלום:', error);
    res.status(500).json({ error: error.message });
  }
});

// ייצוא נתונים
app.get('/api/export', async (req, res) => {
  try {
    const [customers] = await pool.execute(
      'SELECT * FROM customers WHERE status = "active" ORDER BY created_at DESC'
    );
    
    const [payments] = await pool.execute(
      'SELECT * FROM payments ORDER BY created_at DESC'
    );
    
    const exportData = {
      customers,
      payments,
      exportDate: new Date().toISOString(),
      totalCustomers: customers.length,
      totalPayments: payments.length,
      paidPayments: payments.filter(p => p.status === 'paid').length
    };
    
    await logActivity('EXPORT_DATA', 'export', null, { 
      customersCount: customers.length, 
      paymentsCount: payments.length 
    }, req);
    
    res.json(exportData);
  } catch (error) {
    console.error('שגיאה בייצוא נתונים:', error);
    res.status(500).json({ error: error.message });
  }
});

// מחיקת כל הנתונים (רק לפיתוח!)
app.delete('/api/clear-all', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'לא ניתן למחוק נתונים בסביבת ייצור' });
    }
    
    await pool.execute('DELETE FROM payments');
    await pool.execute('DELETE FROM customers');
    await pool.execute('DELETE FROM activity_log');
    
    await logActivity('CLEAR_ALL_DATA', 'all', null, {}, req);
    
    res.json({ success: true, message: 'כל הנתונים נמחקו' });
  } catch (error) {
    console.error('שגיאה במחיקת נתונים:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 שרת API פועל על פורט ${PORT}`);
  await testConnection();
});

module.exports = app;
