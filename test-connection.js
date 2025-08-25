// סקריפט בדיקת חיבור לשרת
const https = require('https');
const http = require('http');

// הגדרות
const PRODUCTION_URL = 'https://stingerisrael.co.il/class/api';
const LOCAL_URL = 'http://localhost:3001/api';

// פונקציה לבדיקת חיבור
async function testConnection(url, description) {
  console.log(`\n🔍 בודק חיבור ל: ${description}`);
  console.log(`URL: ${url}/health`);
  
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(`${url}/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ סטטוס: ${res.statusCode}`);
        console.log(`📄 תגובה: ${data}`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`📊 נתונים:`, jsonData);
        } catch (e) {
          console.log(`⚠️ לא ניתן לפרסר JSON`);
        }
        
        resolve({
          success: res.statusCode === 200,
          statusCode: res.statusCode,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ שגיאה: ${error.message}`);
      resolve({
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ פסק זמן - החיבור נכשל`);
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout'
      });
    });
  });
}

// פונקציה לבדיקת API endpoints
async function testAPIEndpoints(baseUrl, description) {
  console.log(`\n🧪 בודק endpoints ב: ${description}`);
  
  const endpoints = [
    { path: '/health', method: 'GET', name: 'Health Check' },
    { path: '/customers', method: 'GET', name: 'Get Customers' },
    { path: '/payments', method: 'GET', name: 'Get Payments' }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 בודק: ${endpoint.name}`);
    console.log(`${endpoint.method} ${baseUrl}${endpoint.path}`);
    
    const client = baseUrl.startsWith('https') ? https : http;
    
    const options = {
      method: endpoint.method,
      timeout: 5000
    };
    
    const req = client.request(`${baseUrl}${endpoint.path}`, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   סטטוס: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log(`   ✅ הצלחה`);
        } else {
          console.log(`   ❌ שגיאה`);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ שגיאה: ${error.message}`);
    });
    
    req.end();
    
    // המתנה קצרה בין בקשות
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// פונקציה ראשית
async function runTests() {
  console.log('🚀 מתחיל בדיקות חיבור...\n');
  
  // בדיקת חיבור לשרת הייצור
  const productionResult = await testConnection(PRODUCTION_URL, 'שרת ייצור');
  
  // בדיקת חיבור מקומי (אם יש)
  const localResult = await testConnection(LOCAL_URL, 'שרת מקומי');
  
  // בדיקת endpoints
  if (productionResult.success) {
    await testAPIEndpoints(PRODUCTION_URL, 'שרת ייצור');
  }
  
  if (localResult.success) {
    await testAPIEndpoints(LOCAL_URL, 'שרת מקומי');
  }
  
  // סיכום
  console.log('\n📋 סיכום בדיקות:');
  console.log(`🌐 שרת ייצור: ${productionResult.success ? '✅ מחובר' : '❌ לא מחובר'}`);
  console.log(`💻 שרת מקומי: ${localResult.success ? '✅ מחובר' : '❌ לא מחובר'}`);
  
  if (!productionResult.success && !localResult.success) {
    console.log('\n⚠️ בעיות אפשריות:');
    console.log('1. השרת לא פעיל');
    console.log('2. בעיית רשת');
    console.log('3. הגדרות firewall');
    console.log('4. שגיאה בקוד PHP');
  }
}

// הרצת הבדיקות
runTests().catch(console.error);
