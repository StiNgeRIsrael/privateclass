// בדיקת התגובה המלאה מה-API
const https = require('https');

async function testRawResponse() {
  const url = 'https://stingerisrael.co.il/class/api/health';
  
  return new Promise((resolve) => {
    console.log(`🔍 בודק: ${url}\n`);
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 Headers:`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Content-Type: ${res.headers['content-type'] || 'לא מוגדר'}`);
        console.log(`   Server: ${res.headers['server'] || 'לא מוגדר'}`);
        console.log(`   Content-Length: ${res.headers['content-length'] || 'לא מוגדר'}`);
        
        console.log(`\n📄 Response (first 500 chars):`);
        console.log(data.substring(0, 500));
        
        if (data.length > 500) {
          console.log(`\n... (${data.length - 500} more characters)`);
        }
        
        // בדיקה אם זה HTML
        if (data.includes('<!DOCTYPE html>')) {
          console.log(`\n❌ זה HTML - לא API`);
          
          // חיפוש אחר קישורים ל-API
          const apiMatches = data.match(/\/api\/[^"'\s]+/g);
          if (apiMatches) {
            console.log(`\n🔗 נמצאו קישורי API אפשריים:`);
            apiMatches.forEach(match => console.log(`   ${match}`));
          }
        } else if (data.includes('{') && data.includes('}')) {
          console.log(`\n✅ זה נראה כמו JSON`);
          try {
            const json = JSON.parse(data);
            console.log(`📊 JSON parsed:`, json);
          } catch (e) {
            console.log(`⚠️ לא JSON תקין: ${e.message}`);
          }
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ שגיאה: ${error.message}`);
      resolve();
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ פסק זמן`);
      req.destroy();
      resolve();
    });
  });
}

testRawResponse().catch(console.error);
