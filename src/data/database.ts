// הגדרות API
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://stingerisrael.co.il/class/api'
  : 'http://localhost:3001/api';

// Mock API לפיתוח
const USE_MOCK_API = process.env.NODE_ENV !== 'production';

// פונקציה לשליחת בקשות API
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Mock API לפיתוח
  if (USE_MOCK_API) {
    console.log('🔧 משתמש ב-Mock API לפיתוח');
    
    // סימולציה של עיכוב
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock responses
    switch (endpoint) {
      case '/webhook':
        return { success: true, message: 'הנתונים נשלחו לוובהוק בהצלחה (Mock)' };
      
      default:
        return { error: 'Mock endpoint לא נמצא' };
    }
  }
  
  // API אמיתי
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

        // פונקציה לשליחת נתונים לוובהוק
        export const sendToWebhook = async (customerData: any, paymentData: any) => {
          try {
            // שליחה לדיסקורד
            const discordWebhookUrl = 'https://discord.com/api/webhooks/1404519345853431962/Z-Q7si_GHrkz5B70UD_0mZ6HfuydH3XHFUB0UyYh0xoxv2Vv5vNq7lQ2VEEAgcGiC6Ke';
            
            const discordMessage = {
              content: '<@145679462585991169>',
              embeds: [{
                title: '🎮 הרשמה חדשה לשיעור פרטי!',
                color: 0x00ff00,
                fields: [
                  {
                    name: '👨‍👩‍👧‍👦 פרטי ההורה',
                    value: `**שם:** ${customerData.parent_name}\n**אימייל:** ${customerData.parent_email}\n**טלפון:** ${customerData.parent_phone}`,
                    inline: true
                  },
                  {
                    name: '👶 פרטי הילד/ה',
                    value: `**שם:** ${customerData.child_name}\n**גיל:** ${customerData.child_age}\n**מגדר:** ${customerData.child_gender}`,
                    inline: true
                  },
                  {
                    name: '🎯 רמה ומטרות',
                    value: `**רמה:** ${customerData.level}\n**מטרות:** ${customerData.goals?.join(', ') || 'לא צוין'}`,
                    inline: false
                  },
                  {
                    name: '💎 חבילה נבחרת',
                    value: `**${paymentData.plan_name}** - ₪${paymentData.amount}`,
                    inline: true
                  },
                  {
                    name: '📝 הערות נוספות',
                    value: customerData.notes || 'אין הערות נוספות',
                    inline: false
                  }
                ],
                footer: {
                  text: `הרשמה מ-${new Date().toLocaleString('he-IL')}`
                }
              }]
            };

            // שליחה לדיסקורד
            await fetch(discordWebhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(discordMessage),
            });

            // שליחה לוובהוק המקומי (אם יש)
            const webhookData = {
              customer: customerData,
              payment: paymentData,
              timestamp: new Date().toISOString(),
              source: 'private-class-website'
            };

            const result = await apiRequest('/webhook', {
              method: 'POST',
              body: JSON.stringify(webhookData),
            });
            
            return result;
          } catch (error: any) {
            return { success: false, error: error.message };
          }
        };

// הודעה למפתחים
if (USE_MOCK_API) {
  console.log('🔧 הערה: האתר משתמש ב-Mock API לפיתוח.');
} else {
  console.log('🔧 הערה: האתר שולח נתונים לוובהוק בשרת.');
}

// יצוא ברירת מחדל
const database = {
  sendToWebhook,
};

export default database;
