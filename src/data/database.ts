// מערכת API לחיבור ל-MySQL
// זה יעבוד עם השרת Node.js שיצרנו

export interface Customer {
  id?: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  child_name: string;
  child_age: string;
  child_gender: string;
  level: string;
  knows_now?: string;
  goals?: string[];
  other_goal?: string;
  notes?: string;
  agree_contact: boolean;
  agree_terms: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id?: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  plan_key: string;
  plan_amount: number;
  plan_name: string;
  status: string;
  transaction_id?: string;
  payment_data?: any;
  created_at: string;
  updated_at: string;
}

// הגדרות API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://stingerisrael.co.il/class/api' 
  : 'http://localhost:3001/api';

// פונקציה לשליחת בקשות API
async function apiRequest(endpoint: string, options: RequestInit = {}) {
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
    alert(`שגיאה: ${error.message}`);
    throw error;
  }
}

// פונקציות לקוחות
export const saveNewCustomer = async (customerData: Customer) => {
  try {
    const result = await apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const checkExistingCustomer = async (email: string, phone: string) => {
  try {
    const result = await apiRequest('/customers/check', {
      method: 'POST',
      body: JSON.stringify({ email, phone }),
    });
    return result;
  } catch (error: any) {
    return { exists: false, error: error.message };
  }
};

export const getAllCustomers = async () => {
  try {
    return await apiRequest('/customers');
  } catch (error: any) {
    console.error('שגיאה בקבלת לקוחות:', error);
    return [];
  }
};

export const getCustomerById = async (customerId: number) => {
  try {
    return await apiRequest(`/customers/${customerId}`);
  } catch (error: any) {
    console.error('שגיאה בקבלת לקוח:', error);
    return null;
  }
};

// פונקציות תשלומים
export const savePayment = async (paymentData: Payment) => {
  try {
    const result = await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updatePaymentStatus = async (paymentId: number, status: string, transactionId?: string) => {
  try {
    const result = await apiRequest(`/payments/${paymentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, transactionId }),
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getAllPayments = async () => {
  try {
    return await apiRequest('/payments');
  } catch (error: any) {
    console.error('שגיאה בקבלת תשלומים:', error);
    return [];
  }
};

export const getPaymentById = async (paymentId: number) => {
  try {
    return await apiRequest(`/payments/${paymentId}`);
  } catch (error: any) {
    console.error('שגיאה בקבלת תשלום:', error);
    return null;
  }
};

// ייצוא נתונים
export const exportData = async () => {
  try {
    return await apiRequest('/export');
  } catch (error: any) {
    console.error('שגיאה בייצוא נתונים:', error);
    return { customers: [], payments: [] };
  }
};

// מחיקת כל הנתונים (רק לפיתוח!)
export const clearAllData = async () => {
  try {
    const result = await apiRequest('/clear-all', {
      method: 'DELETE',
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// בדיקת חיבור לשרת
export const checkServerHealth = async () => {
  try {
    const result = await apiRequest('/health');
    return result;
  } catch (error: any) {
    return { status: 'ERROR', message: error.message };
  }
};

// יצוא ברירת מחדל
const database = {
  saveNewCustomer,
  checkExistingCustomer,
  savePayment,
  updatePaymentStatus,
  getAllCustomers,
  getAllPayments,
  getCustomerById,
  getPaymentById,
  exportData,
  clearAllData,
  checkServerHealth,
};

export default database;
