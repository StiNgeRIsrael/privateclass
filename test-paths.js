// בדיקת נתיבים שונים של ה-API
const https = require('https');

const paths = [
  '/class/api/health',
  '/api/health', 
  '/health',
  '/class/health',
  '/api/index.php',
  '/class/api/index.php'
];

async function testPath(path) {
  const url = `https://stingerisrael.co.il${path}`;
  
  return new Promise((resolve) => {
    console.log(`\n🔍 בודק: ${url}`);
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   סטטוס: ${res.statusCode}`);
        console.log(`   Content-Type: ${res.headers['content-type'] || 'לא מוגדר'}`);
        
        if (res.statusCode === 200) {
          if (data.includes('{') && data.includes('}')) {
            console.log(`   ✅ נראה כמו JSON`);
            try {
              const json = JSON.parse(data);
              console.log(`   📊 נתונים:`, json);
            } catch (e) {
              console.log(`   ⚠️ לא JSON תקין`);
            }
          } else if (data.includes('<!DOCTYPE html>')) {
            console.log(`   ❌ HTML - לא API`);
          } else {
            console.log(`   📄 תגובה: ${data.substring(0, 100)}...`);
          }
        } else {
          console.log(`   ❌ שגיאה ${res.statusCode}`);
        }
        
        resolve({
          path,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          isJson: data.includes('{') && data.includes('}'),
          isHtml: data.includes('<!DOCTYPE html>')
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ שגיאה: ${error.message}`);
      resolve({
        path,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      console.log(`   ⏰ פסק זמן`);
      req.destroy();
      resolve({
        path,
        error: 'Timeout'
      });
    });
  });
}

async function runPathTests() {
  console.log('🚀 בודק נתיבים שונים...\n');
  
  const results = [];
  
  for (const path of paths) {
    const result = await testPath(path);
    results.push(result);
    
    // המתנה קצרה בין בקשות
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📋 סיכום:');
  const workingApis = results.filter(r => r.statusCode === 200 && r.isJson);
  
  if (workingApis.length > 0) {
    console.log('✅ נתיבים עובדים:');
    workingApis.forEach(r => console.log(`   ${r.path}`));
  } else {
    console.log('❌ לא נמצאו נתיבי API עובדים');
  }
}

runPathTests().catch(console.error);
