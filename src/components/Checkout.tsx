import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { checkExistingCustomer, saveNewCustomer, savePayment } from '../data/database';

type PlanKey = 'single' | 'three' | 'five';
type Step = 'existing' | 'register' | 'plan';

const PLANS: Record<PlanKey, { name: string; amount: number; paymentUrl: string }> = {
  single: { 
    name: 'שיעור 1', 
    amount: 180,
    paymentUrl: 'https://app.upay.co.il/API6/s.php?m=c3JjQXkvTmllRmxtWEd6Y1RManlzUT09'
  },
  three: { 
    name: '3 שיעורים', 
    amount: 480,
    paymentUrl: 'https://app.upay.co.il/API6/s.php?m=VEl1WGdKVEVhK29oRnUwY1N3ZHdqZz09'
  },
  five: { 
    name: '5 שיעורים', 
    amount: 700,
    paymentUrl: 'https://app.upay.co.il/API6/s.php?m=UWJFSmhjZW4xcHFFUzdLWnlBczczQT09'
  },
};

// קומפוננטת התקדמות
function ProgressSteps({ currentStep }: { currentStep: Step }) {
  const steps = [
    { key: 'existing' as Step, title: 'בדיקת לקוח', number: 1 },
    { key: 'register' as Step, title: 'פרטי הרשמה', number: 2 },
    { key: 'plan' as Step, title: 'בחירת מסלול', number: 3 }
  ];

  const getStepIndex = (step: Step) => {
    return steps.findIndex(s => s.key === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                ${index <= currentIndex 
                  ? 'bg-green-500 text-black' 
                  : 'bg-gray-600 text-gray-300'
                }
              `}>
                {step.number}
              </div>
              <span className={`
                mt-2 text-sm font-medium transition-colors duration-300
                ${index <= currentIndex ? 'text-green-400' : 'text-gray-400'}
              `}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-1 transition-colors duration-300
                ${index < currentIndex ? 'bg-green-500' : 'bg-gray-600'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ExistingCustomerStep({ onFound, onNotFound }: { onFound: (cust: any) => void; onNotFound: (email: string, phone: string) => void }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  const handleCheckCustomer = async () => {
    if (!email || !phone) {
      setError('אנא הזינו אימייל וטלפון');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      const result = await checkExistingCustomer(email, phone);
      
      if (result.exists) {
        onFound(result.customer);
      } else {
        onNotFound(email, phone);
      }
    } catch (error) {
      setError('שגיאה בבדיקת לקוח. אנא נסו שוב.');
      console.error('שגיאה בבדיקת לקוח:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div dir="rtl" className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-handjet text-green-500 mb-4">ברוכים הבאים! 🎮</h1>
        <p className="text-xl text-gray-300 mb-6">בואו נתחיל את המסע שלכם בעולם המיינקראפט</p>
      </div>
      
      <div className="bg-[#2a2a2a] rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-handjet text-green-400 mb-6 text-center">האם אתם לקוחות קיימים?</h2>
        <p className="text-gray-300 mb-8 text-center">הזינו את פרטי הקשר שלכם ונבדוק אם אתם כבר רשומים במערכת</p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">אימייל הורה</label>
            <input 
              className="w-full p-4 bg-[#1a1a1a] rounded-lg text-gray-100 border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              placeholder="הזינו את האימייל שלכם" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              disabled={isChecking}
              type="email"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">טלפון הורה</label>
            <input 
              className="w-full p-4 bg-[#1a1a1a] rounded-lg text-gray-100 border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              placeholder="הזינו את הטלפון שלכם" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              disabled={isChecking}
              type="tel"
            />
          </div>
          
          <button 
            className="w-full minecraft-button text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleCheckCustomer}
            disabled={isChecking}
          >
            {isChecking ? 'בודק...' : 'בדוק אם אני לקוח קיים'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RegistrationForm({ defaults, onSubmit }: { defaults: any; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    parentName: '', parentEmail: defaults.parentEmail || '', parentPhone: defaults.parentPhone || '',
    childName: '', childAge: '', childGender: '', level: '', knowsNow: '', goals: [] as string[], otherGoal: '', notes: '',
    agreeContact: false, agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (k: string, v: any) => setForm(s => ({ ...s, [k]: v }));
  const toggleGoal = (g: string) => setForm(s => ({ ...s, goals: s.goals.includes(g) ? s.goals.filter(x => x !== g) : [...s.goals, g] }));
  const canSubmit = form.parentName && form.parentEmail && form.parentPhone && form.childName && form.childAge && form.childGender && form.level && form.agreeContact && form.agreeTerms;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await saveNewCustomer(form);
      
      if (result.success) {
        onSubmit({ ...form, customerId: result.customerId });
      } else {
        setError('שגיאה בשמירת פרטים. אנא נסו שוב.');
      }
    } catch (error) {
      setError('שגיאה בשמירת פרטים. אנא נסו שוב.');
      console.error('שגיאה בשמירת לקוח:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-handjet text-green-500 mb-4">פרטי הרשמה 📝</h1>
        <p className="text-xl text-gray-300">נשמח להכיר אתכם ואת ילדכם</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-[#2a2a2a] rounded-lg p-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* פרטי הורה */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-handjet text-green-400 mb-4">👨‍👩‍👧‍👦 פרטי הורה</h3>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">שם הורה (מלא)</label>
            <input 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              placeholder="הזינו את שמכם המלא"
              onChange={e=>update('parentName', e.target.value)} 
              disabled={isSubmitting} 
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">אימייל הורה</label>
            <input 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              placeholder="הזינו את האימייל שלכם"
              value={form.parentEmail} 
              onChange={e=>update('parentEmail', e.target.value)} 
              disabled={isSubmitting}
              type="email"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">טלפון הורה</label>
            <input 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              placeholder="הזינו את הטלפון שלכם"
              value={form.parentPhone} 
              onChange={e=>update('parentPhone', e.target.value)} 
              disabled={isSubmitting}
              type="tel"
            />
          </div>

          {/* פרטי ילד */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-handjet text-green-400 mb-4 mt-6">👶 פרטי ילד</h3>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">שם ילדכם</label>
            <input 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              placeholder="הזינו את שם ילדכם"
              onChange={e=>update('childName', e.target.value)} 
              disabled={isSubmitting} 
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">גיל</label>
            <input 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              placeholder="הזינו את הגיל"
              onChange={e=>update('childAge', e.target.value)} 
              disabled={isSubmitting}
              type="number"
              min="4"
              max="18"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">מין</label>
            <select 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              onChange={e=>update('childGender', e.target.value)} 
              disabled={isSubmitting}
            >
              <option value="">בחרו מין</option>
              <option value="זכר">זכר</option>
              <option value="נקבה">נקבה</option>
              <option value="לא מצוין">מעדיף לא לענות</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">רמה</label>
            <select 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              onChange={e=>update('level', e.target.value)} 
              disabled={isSubmitting}
            >
              <option value="">בחרו רמה</option>
              <option value="מתחיל">מתחיל</option>
              <option value="בינוני">בינוני</option>
              <option value="מתקדם">מתקדם</option>
            </select>
          </div>

          {/* ידע ומטרות */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2 font-medium">מה ילדכם יודע לעשות היום?</label>
            <input 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
              placeholder="תארו את הידע הנוכחי של ילדכם במיינקראפט"
              onChange={e=>update('knowsNow', e.target.value)} 
              disabled={isSubmitting} 
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2 font-medium">מה המטרה של ילדכם? (בחירה מרובה)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['ריכוז והתמדה','לוגיקה־רדסטון','עבודת צוות','יצירתיות־עיצוב','אנגלית דרך המשחק','אחר'].map(g => (
                <label key={g} className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-lg border border-gray-600 hover:border-green-500 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    onChange={()=>toggleGoal(g)} 
                    disabled={isSubmitting}
                    className="w-4 h-4 text-green-500"
                  />
                  <span className="text-gray-300">{g}</span>
                </label>
              ))}
            </div>
            {form.goals.includes('אחר') && (
              <input 
                className="mt-3 w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors" 
                placeholder="פירוט מטרה נוספת"
                onChange={e=>update('otherGoal', e.target.value)} 
                disabled={isSubmitting} 
              />
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2 font-medium">הערות נוספות (אופציונלי)</label>
            <textarea 
              className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors resize-none" 
              placeholder="הערות נוספות שיכולות לעזור לנו להתאים את השיעור"
              rows={3}
              onChange={e=>update('notes', e.target.value)} 
              disabled={isSubmitting} 
            />
          </div>

          {/* הסכמות */}
          <div className="md:col-span-2 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                onChange={e=>update('agreeContact', e.target.checked)} 
                disabled={isSubmitting}
                className="w-4 h-4 text-green-500"
              />
              <span className="text-gray-300">מסכים/מה ליצירת קשר ושמירת פרטים</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                onChange={e=>update('agreeTerms', e.target.checked)} 
                disabled={isSubmitting}
                className="w-4 h-4 text-green-500"
              />
              <span className="text-gray-300">מסכים/מה לתנאי שימוש/פרטיות</span>
            </label>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button 
            className="minecraft-button text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={!canSubmit || isSubmitting} 
            onClick={handleSubmit}
          >
            {isSubmitting ? 'שומר...' : 'המשך לבחירת מסלול'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanStep({ customer }: { customer: any }) {
  const plans = useMemo(() => ([
    { key: 'single' as PlanKey, ...PLANS.single },
    { key: 'three' as PlanKey, ...PLANS.three },
    { key: 'five' as PlanKey, ...PLANS.five },
  ]), []);

  const start = async (p: { key: PlanKey; name: string; amount: number; paymentUrl: string }) => {
    try {
      // שמירת פרטי התשלום ב-Firebase
      const paymentData = {
        customerId: customer.id || customer.customerId,
        customerName: customer.parentName,
        customerEmail: customer.parentEmail,
        customerPhone: customer.parentPhone,
        planKey: p.key,
        planAmount: p.amount,
        planName: p.name,
        status: 'pending'
      };

      const result = await savePayment(paymentData);
      
      if (result.success) {
        // שמירת פרטי הלקוח ב-localStorage לפני ההפניה לתשלום
        localStorage.setItem('customerData', JSON.stringify({
          ...customer,
          planKey: p.key,
          planAmount: p.amount,
          planName: p.name,
          paymentId: result.paymentId,
          timestamp: new Date().toISOString()
        }));

        // הפניה ישירה לקישור התשלום של UPAY
        window.location.href = p.paymentUrl;
      } else {
        alert('שגיאה בשמירת פרטי התשלום. אנא נסו שוב.');
      }
    } catch (error) {
      console.error('שגיאה בהתחלת תשלום:', error);
      alert('שגיאה בהתחלת תשלום. אנא נסו שוב.');
    }
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-handjet text-green-500 mb-4">בחירת מסלול ותשלום 💰</h1>
        <p className="text-xl text-gray-300">בחרו את המסלול המתאים לכם</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {plans.map(p => (
          <div key={p.key} className="bg-[#2a2a2a] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-500 border border-transparent">
            <div className="text-center">
              <div className="text-3xl text-gray-100 mb-4 font-bold">{p.name}</div>
              <div className="text-green-500 text-2xl font-bold mb-6">{p.amount} ₪</div>
              <button 
                className="w-full minecraft-button text-lg py-3" 
                onClick={()=>start(p)}
              >
                בחר מסלול זה
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">המחירים כוללים מע"מ. החיוב מתבצע אצל חברת הסליקה UPAY.</p>
        <p className="text-xs text-gray-500 mt-2">לאחר התשלום תועברו אוטומטית לדף התודה</p>
      </div>
    </div>
  );
}

export const Checkout: React.FC = () => {
  useSearchParams();
  const [step, setStep] = useState<Step>('existing');
  const [customer, setCustomer] = useState<any>({});

  // פונקציה לבדיקת הנתונים
  const checkStoredData = async () => {
    try {
      const { getAllCustomers, getAllPayments } = await import('../data/database');
      const customers = await getAllCustomers();
      const payments = await getAllPayments();
      
      console.log('=== נתונים שנשמרו ===');
      console.log('לקוחות:', customers);
      console.log('תשלומים:', payments);
      
      alert(`נשמרו ${customers.length} לקוחות ו-${payments.length} תשלומים. ראה בקונסול לפרטים מלאים.`);
    } catch (error) {
      console.error('שגיאה בבדיקת נתונים:', error);
      alert('שגיאה בבדיקת הנתונים');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <ProgressSteps currentStep={step} />
      
      {step === 'existing' && (
        <ExistingCustomerStep
          onFound={(c)=>{ setCustomer((s:any)=>({ ...s, ...c })); setStep('plan'); }}
          onNotFound={(email, phone)=>{ setCustomer((s:any)=>({ ...s, parentEmail: email, parentPhone: phone })); setStep('register'); }}
        />
      )}
      {step === 'register' && (
        <RegistrationForm
          defaults={customer}
          onSubmit={(data)=>{ setCustomer(data); setStep('plan'); }}
        />
      )}
      {step === 'plan' && (
        <PlanStep customer={customer} />
      )}
      
      {/* כפתור בדיקה בסוף הדף */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-500 mb-4">🔍 בדיקת נתונים</h3>
          <p className="text-gray-300 mb-4">לחץ כאן כדי לראות את כל הנתונים שנשמרו במערכת:</p>
          <button
            onClick={checkStoredData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            בדוק נתונים שנשמרו
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


