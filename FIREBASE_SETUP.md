# הגדרת Firebase למערכת התשלומים

## שלב 1: יצירת פרויקט Firebase

1. לך ל-[Firebase Console](https://console.firebase.google.com/)
2. לחץ על "Create a project" או "Add project"
3. תן שם לפרויקט (למשל: `stinger-minecraft-classes`)
4. עקוב אחר השלבים (אין צורך ב-Google Analytics)

## שלב 2: הגדרת Firestore Database

1. בתפריט הצד, לחץ על "Firestore Database"
2. לחץ על "Create database"
3. בחר "Start in test mode" (למטרות פיתוח)
4. בחר מיקום (למשל: `europe-west1`)

## שלב 3: הגדרת Authentication (חובה!)

1. בתפריט הצד, לחץ על "Authentication"
2. לחץ על "Get started"
3. בחר "Anonymous" authentication
4. לחץ על "Enable"
5. **חשוב**: בלי זה Firebase לא יעבוד!

## שלב 4: הגדרת Web App

1. בתפריט הצד, לחץ על "Project settings" (הגלגל)
2. בחר "General" tab
3. גלול למטה ל-"Your apps"
4. לחץ על האייקון של Web (</>)
5. תן שם לאפליקציה (למשל: `stinger-web`)
6. לחץ על "Register app"
7. העתק את הקונפיגורציה

## שלב 5: עדכון הקונפיגורציה

1. פתח את הקובץ `src/firebase.ts`
2. החלף את הקונפיגורציה עם הפרטים שלך:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. עדכן גם את הקובץ `public/webhook.html` עם אותה קונפיגורציה

## שלב 6: הגדרת Rules ל-Firestore (חשוב!)

1. לך ל-Firestore Database
2. לחץ על "Rules" tab
3. החלף את הכללים עם:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // לקוחות - קריאה וכתיבה לכולם (למטרות פיתוח)
    match /customers/{document} {
      allow read, write: if true;
    }
    
    // תשלומים - קריאה וכתיבה לכולם (למטרות פיתוח)
    match /payments/{document} {
      allow read, write: if true;
    }
  }
}
```

4. לחץ על "Publish"

## שלב 7: הגדרת CORS (למטרות פיתוח)

1. לך ל-Project Settings
2. בחר "General" tab
3. גלול למטה ל-"Authorized domains"
4. הוסף את הדומיין שלך (למטרות פיתוח: `localhost`)

## שלב 8: הגדרת Webhook URL

הקישור ל-webhook שלך יהיה:
```
https://stingerisrael.co.il/class/webhook.html
```

תן את הקישור הזה לחברת הסליקה UPAY כדי שיוכלו לשלוח עדכונים על תשלומים.

## פתרון שגיאות נפוצות:

### שגיאה 400 Bad Request:
- וודא ש-Authentication מוגדר עם Anonymous Auth
- וודא ש-Rules מוגדרות נכון
- וודא שהקונפיגורציה נכונה

### שגיאות CORS:
- הוסף `localhost` ל-Authorized domains
- וודא שהדומיין מוגדר נכון

### שגיאות כתיבה:
- וודא ש-Rules מאפשרות כתיבה
- וודא שהפרויקט מוגדר נכון

## מבנה הנתונים

### Collection: customers
```javascript
{
  parentName: "שם ההורה",
  parentEmail: "email@example.com",
  parentPhone: "050-1234567",
  childName: "שם הילד",
  childAge: "10",
  childGender: "זכר",
  level: "מתחיל",
  knowsNow: "יודע לשחק מיינקראפט",
  goals: ["ריכוז והתמדה", "לוגיקה־רדסטון"],
  otherGoal: "",
  notes: "הערות נוספות",
  agreeContact: true,
  agreeTerms: true,
  createdAt: "2024-01-01T10:00:00.000Z",
  status: "active"
}
```

### Collection: payments
```javascript
{
  customerId: "customer_document_id",
  customerName: "שם ההורה",
  customerEmail: "email@example.com",
  customerPhone: "050-1234567",
  planKey: "single",
  planAmount: 180,
  planName: "שיעור 1",
  status: "pending", // pending, paid, failed, cancelled
  transactionId: "upay_transaction_id",
  createdAt: "2024-01-01T10:00:00.000Z",
  updatedAt: "2024-01-01T10:05:00.000Z"
}
```

## בדיקת המערכת

1. הרץ את האתר: `npm run dev`
2. לך ל-`http://localhost:5173/class/checkout`
3. נסה לרשום לקוח חדש
4. בדוק ב-Firebase Console שהנתונים נשמרו
5. נסה לבחור מסלול ולבדוק שהתשלום נשמר

## הערות חשובות

- **Authentication חובה!** - בלי Anonymous Auth Firebase לא יעבוד
- **Rules חובה!** - וודא שהן מוגדרות נכון
- המערכת כרגע פתוחה לכולם (test mode)
- בפרודקשן תצטרך להגדיר rules מאובטחים
- ה-webhook כרגע פשוט, בפרודקשן תצטרך שרת אמיתי
- שמור על ה-API keys שלך בסוד
