import React, { useState, useEffect } from 'react';

const AdminPanel: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { getAllCustomers, getAllPayments } = await import('../data/database');
      const storedCustomers = await getAllCustomers();
      const storedPayments = await getAllPayments();
      setCustomers(storedCustomers);
      setPayments(storedPayments);
    } catch (error) {
      console.error('שגיאה בטעינת נתונים:', error);
    }
  };

  const clearAllData = async () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים?')) {
      try {
        const { clearAllData } = await import('../data/database');
        await clearAllData();
        await loadData();
        alert('כל הנתונים נמחקו!');
      } catch (error) {
        console.error('שגיאה במחיקת נתונים:', error);
        alert('שגיאה במחיקת הנתונים');
      }
    }
  };

  const exportData = async () => {
    try {
      const { exportData } = await import('../data/database');
      const data = await exportData();
      const exportDataWithDate = {
        ...data,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportDataWithDate, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stinger-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('שגיאה בייצוא נתונים:', error);
      alert('שגיאה בייצוא הנתונים');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-500 mb-6">🔧 פאנל ניהול</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-blue-400">לקוחות</h3>
              <p className="text-2xl font-bold text-white">{customers.length}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400">תשלומים</h3>
              <p className="text-2xl font-bold text-white">{payments.length}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-green-400">תשלומים מושלמים</h3>
              <p className="text-2xl font-bold text-white">
                {payments.filter(p => p.status === 'paid').length}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={loadData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              🔄 רענן נתונים
            </button>
            <button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              📥 ייצא נתונים
            </button>
            <button
              onClick={clearAllData}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              🗑️ מחק הכל
            </button>
          </div>
        </div>

        {/* לקוחות */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">לקוחות ({customers.length})</h2>
          {customers.length === 0 ? (
            <p className="text-gray-400">אין לקוחות רשומים</p>
          ) : (
            <div className="space-y-4">
              {customers.map((customer, index) => (
                <div key={customer.id || index} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {customer.parentName} - {customer.childName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    <p><strong>טלפון:</strong> {customer.parentPhone}</p>
                    <p><strong>אימייל:</strong> {customer.parentEmail}</p>
                    <p><strong>גיל ילד:</strong> {customer.childAge}</p>
                    <p><strong>רמה:</strong> {customer.level}</p>
                    <p><strong>תאריך רישום:</strong> {new Date(customer.createdAt).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* תשלומים */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">תשלומים ({payments.length})</h2>
          {payments.length === 0 ? (
            <p className="text-gray-400">אין תשלומים רשומים</p>
          ) : (
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div key={payment.id || index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">
                      {payment.customerName} - {payment.planName}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      payment.status === 'paid' ? 'bg-green-600 text-white' :
                      payment.status === 'pending' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {payment.status === 'paid' ? 'שולם' :
                       payment.status === 'pending' ? 'ממתין' : 'בוטל'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    <p><strong>סכום:</strong> {payment.planAmount} ₪</p>
                    <p><strong>תאריך:</strong> {new Date(payment.createdAt).toLocaleDateString('he-IL')}</p>
                    <p><strong>מזהה עסקה:</strong> {payment.transactionId || 'לא זמין'}</p>
                    <p><strong>מזהה לקוח:</strong> {payment.customerId}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
