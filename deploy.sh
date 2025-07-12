#!/bin/bash

echo "----------------------------"
echo "DEPLOY SCRIPT - סטינגר ישראל"
echo "----------------------------"

echo "נתיב נוכחי: $(pwd)"
echo "מיקום node: $(which node)"
echo "גרסת node: $(node -v 2>/dev/null)"
echo "מיקום npm: $(which npm)"
echo "גרסת npm: $(npm -v 2>/dev/null)"

echo "----------------------------"
echo "התקנת תלויות (npm install)..."
npm install

echo "----------------------------"
echo "בניית הפרויקט (npm run build)..."
npm run build

echo "----------------------------"
echo "תוכן תיקיית dist:"
ls -l dist

echo "----------------------------"
echo "העתקת קבצים ליעד ../class (שנה נתיב לפי הצורך)"
# מחק את השורה הבאה אם לא רוצים למחוק הכל:
# rm -rf ../class/*
cp -r dist/* ../class/

echo "----------------------------"
echo "הפרויקט הועתק בהצלחה!"
echo "סיום." 