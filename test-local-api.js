// בדיקת ה-API מקומית
const http = require('http');
const https = require('https');

// הגדרות
const LOCAL_PORT = 3001;
const PRODUCTION_URL = 'https://stingerisrael.co.il/class/api';

// פונקציה לבדיקת חיבור מקומי
async function testLocalAPI() {
  console.log(`🔍 בודק API מקומי על פורט ${LOCAL_PORT}...`);
  
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${LOCAL_PORT}/api/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   סטטוס: ${res.statusCode}`);
        console.log(`   Content-Type: ${res.headers['content-type'] || 'לא מוגדר'}`);
        
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   ✅ API עובד!`);
            console.log(`   📊 נתונים:`, json);
            resolve(true);
          } catch (e) {
            console.log(`   ❌ לא JSON תקין: ${e.message}`);
            console.log(`   📄 תגובה: ${data}`);
            resolve(false);
          }
        } else {
          console.log(`   ❌ שגיאה ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ שגיאה: ${error.message}`);
      console.log(`   💡 האם השרת המקומי רץ?`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`   ⏰ פסק זמן`);
      req.destroy();
      resolve(false);
    });
  });
}

// פונקציה לבדיקת חיבור לשרת הייצור
async function testProductionAPI() {
  console.log(`\n🌐 בודק API ייצור...`);
  
  return new Promise((resolve) => {
    const req = https.get(`${PRODUCTION_URL}/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   סטטוס: ${res.statusCode}`);
        console.log(`   Content-Type: ${res.headers['content-type'] || 'לא מוגדר'}`);
        
        if (res.statusCode === 200) {
          if (data.includes('<!DOCTYPE html>')) {
            console.log(`   ❌ מחזיר HTML - API לא מוגדר נכון`);
            resolve(false);
          } else {
            try {
              const json = JSON.parse(data);
              console.log(`   ✅ API עובד!`);
              console.log(`   📊 נתונים:`, json);
              resolve(true);
            } catch (e) {
              console.log(`   ❌ לא JSON תקין`);
              resolve(false);
            }
          }
        } else {
          console.log(`   ❌ שגיאה ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ שגיאה: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log(`   ⏰ פסק זמן`);
      req.destroy();
      resolve(false);
    });
  });
}

// פונקציה ראשית
async function runTests() {
  console.log('🚀 מתחיל בדיקות API...\n');
  
  const localWorks = await testLocalAPI();
  const productionWorks = await testProductionAPI();
  
  console.log('\n📋 סיכום:');
  console.log(`💻 API מקומי: ${localWorks ? '✅ עובד' : '❌ לא עובד'}`);
  console.log(`🌐 API ייצור: ${productionWorks ? '✅ עובד' : '❌ לא עובד'}`);
  
  if (!localWorks) {
    console.log('\n💡 כדי להריץ API מקומי:');
    console.log('1. התקן PHP');
    console.log('2. הרץ: php -S localhost:3001 -t api/');
    console.log('3. או השתמש ב-XAMPP/WAMP');
  }
  
  if (!productionWorks) {
    console.log('\n⚠️ בעיות אפשריות בשרת:');
    console.log('1. קובץ .htaccess לא קיים או לא מוגדר נכון');
    console.log('2. mod_rewrite לא מופעל');
    console.log('3. קובץ index.php לא נמצא בנתיב הנכון');
    console.log('4. הגדרות PHP לא נכונות');
  }
}

runTests().catch(console.error);
