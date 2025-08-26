const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// וובהוק endpoint
app.post('/api/webhook', async (req, res) => {
  try {
    const { customer, payment, timestamp, source } = req.body;
    
    console.log('📨 נתונים התקבלו בוובהוק:', {
      customer: customer.parent_name,
      payment: payment.plan_name,
      timestamp,
      source
    });
    
    // כאן תוכל להוסיף לוגיקה נוספת כמו:
    // - שליחה לאימייל
    // - שמירה לקובץ
    // - שליחה לשירות חיצוני
    
    res.json({
      success: true,
      message: 'הנתונים התקבלו בהצלחה',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('שגיאה בוובהוק:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// בדיקת בריאות
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'השרת פעיל',
    timestamp: new Date().toISOString()
  });
});

// ניתוב כל הבקשות האחרות ל-React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);
  console.log(`📱 האתר: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api/health`);
  console.log(`📨 Webhook: http://localhost:${PORT}/api/webhook`);
});
