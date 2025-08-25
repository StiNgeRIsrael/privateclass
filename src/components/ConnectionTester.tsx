import React, { useState } from 'react';
import { checkServerHealth } from '../data/database';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  duration?: number;
}

const ConnectionTester: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const runTest = async (testName: string, testFunction: () => Promise<any>): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      return {
        name: testName,
        status: 'success',
        message: 'עובד בהצלחה',
        details: result,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        name: testName,
        status: 'error',
        message: error.message || 'שגיאה לא ידועה',
        details: error,
        duration
      };
    }
  };

  const testAPIHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.text();
      
      if (response.status !== 200) {
        throw new Error(`סטטוס שגוי: ${response.status}`);
      }
      
      if (data.includes('<!DOCTYPE html>')) {
        throw new Error('השרת מחזיר HTML במקום JSON - API לא מוגדר נכון');
      }
      
      try {
        const json = JSON.parse(data);
        return json;
      } catch (e) {
        throw new Error('התגובה לא JSON תקין');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const testAPICustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.text();
      
      if (response.status !== 200) {
        throw new Error(`סטטוס שגוי: ${response.status}`);
      }
      
      if (data.includes('<!DOCTYPE html>')) {
        throw new Error('השרת מחזיר HTML במקום JSON');
      }
      
      const json = JSON.parse(data);
      return { count: Array.isArray(json) ? json.length : 'לא מערך' };
    } catch (error: any) {
      throw error;
    }
  };

  const testAPIPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      const data = await response.text();
      
      if (response.status !== 200) {
        throw new Error(`סטטוס שגוי: ${response.status}`);
      }
      
      if (data.includes('<!DOCTYPE html>')) {
        throw new Error('השרת מחזיר HTML במקום JSON');
      }
      
      const json = JSON.parse(data);
      return { count: Array.isArray(json) ? json.length : 'לא מערך' };
    } catch (error: any) {
      throw error;
    }
  };

  const testDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.text();
      
      if (data.includes('שגיאה בחיבור למסד הנתונים')) {
        throw new Error('בעיית חיבור למסד הנתונים');
      }
      
      return { status: 'מסד הנתונים מחובר' };
    } catch (error: any) {
      throw error;
    }
  };

  const testCORS = async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      };
      
      return corsHeaders;
    } catch (error: any) {
      throw error;
    }
  };

  const testServerResponse = async () => {
    try {
      const response = await fetch('/api/health');
      const headers = {
        'Content-Type': response.headers.get('Content-Type'),
        'Server': response.headers.get('Server'),
        'Status': response.status,
        'StatusText': response.statusText
      };
      
      return headers;
    } catch (error: any) {
      throw error;
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setResults([]);
    setShowResults(true);

    const testResults: TestResult[] = [];

    // בדיקת חיבור בסיסי
    testResults.push(await runTest('בדיקת חיבור בסיסי', testAPIHealth));
    
    // בדיקת endpoint לקוחות
    testResults.push(await runTest('בדיקת לקוחות', testAPICustomers));
    
    // בדיקת endpoint תשלומים
    testResults.push(await runTest('בדיקת תשלומים', testAPIPayments));
    
    // בדיקת מסד נתונים
    testResults.push(await runTest('בדיקת מסד נתונים', testDatabaseConnection));
    
    // בדיקת CORS
    testResults.push(await runTest('בדיקת CORS', testCORS));
    
    // בדיקת headers
    testResults.push(await runTest('בדיקת Headers', testServerResponse));

    setResults(testResults);
    setIsTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">🔧 בדיקת חיבור לשרת</h3>
        <button
          onClick={runAllTests}
          disabled={isTesting}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isTesting
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isTesting ? 'בודק...' : 'הרץ בדיקות'}
        </button>
      </div>

      {showResults && (
        <div className="space-y-4">
          {results.length === 0 && isTesting && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">מריץ בדיקות...</p>
            </div>
          )}

          {results.map((result, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(result.status)}</span>
                  <span className={`font-medium ${getStatusColor(result.status)}`}>
                    {result.name}
                  </span>
                </div>
                {result.duration && (
                  <span className="text-sm text-gray-400">
                    {result.duration}ms
                  </span>
                )}
              </div>
              
              <p className={`mt-2 ${getStatusColor(result.status)}`}>
                {result.message}
              </p>
              
              {result.details && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                    פרטים נוספים
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-900 p-3 rounded overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}

          {results.length > 0 && !isTesting && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="font-bold text-white mb-2">📊 סיכום:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-500">✅ הצלחות:</span> {results.filter(r => r.status === 'success').length}
                </div>
                <div>
                  <span className="text-red-500">❌ שגיאות:</span> {results.filter(r => r.status === 'error').length}
                </div>
                <div>
                  <span className="text-yellow-500">⚠️ אזהרות:</span> {results.filter(r => r.status === 'warning').length}
                </div>
                <div>
                  <span className="text-gray-400">⏳ ממתינות:</span> {results.filter(r => r.status === 'pending').length}
                </div>
              </div>
              
              {results.some(r => r.status === 'error') && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
                  <h5 className="font-bold text-red-400 mb-2">🔧 פתרונות מוצעים:</h5>
                  <ul className="text-sm text-red-300 space-y-1">
                    <li>• וודא שקובץ api/index.php קיים בשרת</li>
                    <li>• וודא שקובץ api/.htaccess קיים ומוגדר נכון</li>
                    <li>• בדוק שהשרת תומך ב-mod_rewrite</li>
                    <li>• בדוק שהגדרות PHP נכונות</li>
                    <li>• בדוק את לוגי השרת לשגיאות</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionTester;
