import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sendToWebhook } from '../data/database';
import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Heart, Star, Trophy, Users, Clock, Target } from 'lucide-react';

type PlanKey = 'single' | 'three' | 'five';

const PLANS: Record<PlanKey, { name: string; amount: number; paymentUrl: string; features: string[] }> = {
  single: { 
    name: 'שיעור אחד', 
    amount: 180,
    paymentUrl: 'https://app.upay.co.il/API6/s.php?m=c3JjQXkvTmllRmxtWEd6Y1RManlzUT09',
    features: ['שיעור פרטי אחד', '60 דקות', 'התאמה אישית', 'דוח התקדמות']
  },
  three: { 
    name: 'חבילת 3 שיעורים', 
    amount: 480,
    paymentUrl: 'https://app.upay.co.il/API6/s.php?m=VEl1WGdKVEVhK29oRnUwY1N3ZHdqZz09',
    features: ['3 שיעורים פרטיים', 'הנחה של ₪60', 'תוכנית התקדמות', 'מעקב מתמשך']
  },
  five: { 
    name: 'חבילת 5 שיעורים', 
    amount: 700,
    paymentUrl: 'https://app.upay.co.il/API6/s.php?m=UWJFSmhjZW4xcHFFUzdLWnlBczczQT09',
    features: ['5 שיעורים פרטיים', 'הנחה של ₪200', 'תוכנית מקיפה', 'תמיכה מלאה']
  },
};

interface CustomerData {
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
  child_personality?: string;
  child_interests?: string[];
  child_challenges?: string[];
  child_achievements?: string;
  child_schedule?: string;
  child_friends?: string;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'number' | 'multiselect' | 'textarea' | 'checkbox';
  field: keyof CustomerData;
  options?: string[];
  placeholder?: string;
  required: boolean;
  icon?: React.ReactNode;
}

const QUESTIONS: Question[] = [
  {
    id: 'parent_name',
    title: 'מה השם שלך? (ההורה)',
    subtitle: 'נשמח להכיר אותך!',
    type: 'text',
    field: 'parent_name',
    placeholder: 'השם המלא שלך',
    required: true,
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: 'parent_email',
    title: 'מה האימייל שלך? (ההורה)',
    subtitle: 'כדי שנוכל לשלוח לך עדכונים',
    type: 'email',
    field: 'parent_email',
    placeholder: 'example@email.com',
    required: true,
    icon: <Star className="w-6 h-6" />
  },
            {
            id: 'parent_phone',
            title: 'מה הטלפון שלך? (ההורה)',
            subtitle: 'כדי שנוכל ליצור איתך קשר',
            type: 'tel',
            field: 'parent_phone',
            placeholder: 'לדוגמה.. 054-2347000',
            required: true,
            icon: <Users className="w-6 h-6" />
          },
  {
    id: 'child_name',
    title: 'מה השם של הילד/ה שלך?',
    subtitle: 'נשמח להכיר את הילד/ה שלך!',
    type: 'text',
    field: 'child_name',
    placeholder: 'שם הילד/ה',
    required: true,
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: 'child_age',
    title: 'בן/בת כמה הילד/ה שלך?',
    subtitle: 'כדי שנוכל להתאים את השיעור לגיל',
    type: 'number',
    field: 'child_age',
    placeholder: 'גיל',
    required: true,
    icon: <Clock className="w-6 h-6" />
  },
            {
            id: 'child_gender',
            title: 'מה המגדר של הילד/ה שלך?',
            subtitle: 'כדי שנוכל לפנות אליו/אליה נכון',
            type: 'select',
            field: 'child_gender',
            options: ['זכר', 'נקבה', 'מעדיף לא לענות'],
            required: true,
            icon: <Users className="w-6 h-6" />
          },
  {
    id: 'child_personality',
    title: 'איך היית מתאר/ת את האישיות של הילד/ה שלך?',
    subtitle: 'זה יעזור לנו להתאים את סגנון ההוראה',
    type: 'select',
    field: 'child_personality',
    options: ['שקט/ה ומרוכז/ת', 'חברותי/ת ואנרגטי/ת', 'יצירתי/ת ודמיוני/ת', 'לוגי/ת ומסודר/ת', 'סקרן/ית וחקרן/ית'],
    required: false,
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: 'child_interests',
    title: 'במה הילד/ה שלך מתעניין/ת?',
    subtitle: 'בחר/י את כל האפשרויות הרלוונטיות',
    type: 'multiselect',
    field: 'child_interests',
    options: ['משחקי מחשב', 'בנייה ויצירה', 'מדע וטכנולוגיה', 'אמנות ועיצוב', 'טבע ובעלי חיים', 'מוזיקה', 'ספורט', 'קריאה', 'מתמטיקה', 'היסטוריה'],
    required: false,
    icon: <Star className="w-6 h-6" />
  },
  {
    id: 'child_challenges',
    title: 'באיזה תחומים הילד/ה שלך מתקשה?',
    subtitle: 'כדי שנוכל לעזור לו/לה להתקדם',
    type: 'multiselect',
    field: 'child_challenges',
    options: ['ריכוז והתמדה', 'עבודת צוות', 'פתרון בעיות', 'יצירתיות', 'אנגלית', 'מתמטיקה', 'סבלנות', 'אין קשיים מיוחדים'],
    required: false,
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'child_achievements',
    title: 'מה הישגים מיוחדים של הילד/ה שלך?',
    subtitle: 'שתף/י איתנו במה הוא/היא גאה/ה',
    type: 'textarea',
    field: 'child_achievements',
    placeholder: 'למשל: זכה בתחרות, סיים פרויקט מיוחד, עזר לחבר...',
    required: false,
    icon: <Trophy className="w-6 h-6" />
  },
  {
    id: 'child_schedule',
    title: 'מתי הילד/ה שלך פנוי/ה לשיעורים?',
    subtitle: 'כדי שנוכל לתאם זמנים נוחים',
    type: 'select',
    field: 'child_schedule',
    options: ['אחר הצהריים (14:00-17:00)', 'ערב (17:00-20:00)', 'סופי שבוע', 'גמיש - כל זמן', 'אני לא בטוח/ה'],
    required: false,
    icon: <Clock className="w-6 h-6" />
  },
  {
    id: 'child_friends',
    title: 'האם הילד/ה שלך אוהב/ת לשחק עם חברים?',
    subtitle: 'זה יעזור לנו להחליט על שיעורים פרטיים או קבוצתיים',
    type: 'select',
    field: 'child_friends',
    options: ['כן, מאוד חברותי/ת', 'כן, אבל מעדיף/ה קבוצות קטנות', 'לא, מעדיף/ה לשחק לבד', 'תלוי במצב הרוח'],
    required: false,
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'level',
    title: 'מה הרמה של הילד/ה שלך במיינקראפט?',
    subtitle: 'כדי שנוכל להתאים את התוכן',
    type: 'select',
    field: 'level',
    options: ['מתחיל/ה - עוד לא שיחק/ה', 'מתחיל/ה - שיחק/ה קצת', 'בינוני/ת - יודע/ת את הבסיס', 'מתקדם/ת - יודע/ת הרבה', 'מומחה/ית - יודע/ת הכל'],
    required: true,
    icon: <Trophy className="w-6 h-6" />
  },
  {
    id: 'knows_now',
    title: 'מה הילד/ה שלך כבר יודע/ת לעשות במיינקראפט?',
    subtitle: 'תאר/י לנו את היכולות הנוכחיות',
    type: 'textarea',
    field: 'knows_now',
    placeholder: 'למשל: יודע לבנות בית פשוט, מכיר את הבסיס של המשחק...',
    required: false,
    icon: <Star className="w-6 h-6" />
  },
  {
    id: 'goals',
    title: 'מה המטרות שלכם מהשיעורים?',
    subtitle: 'בחר/י את כל המטרות הרלוונטיות',
    type: 'multiselect',
    field: 'goals',
    options: ['שיפור מיומנויות טכניות', 'פיתוח יצירתיות', 'שיפור עבודת צוות', 'לימוד אנגלית', 'פיתוח חשיבה לוגית', 'הכנה לתחרויות', 'בילוי זמן איכות', 'פיתוח ביטחון עצמי'],
    required: false,
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'notes',
    title: 'האם יש משהו נוסף שחשוב לנו לדעת?',
    subtitle: 'כל מידע נוסף יעזור לנו להתאים את השיעור',
    type: 'textarea',
    field: 'notes',
    placeholder: 'הערות נוספות, העדפות מיוחדות, צרכים מיוחדים...',
    required: false,
    icon: <Heart className="w-6 h-6" />
  }
];

const Checkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<'questions' | 'plans' | 'payment' | 'success'>('questions');
  const [customerData, setCustomerData] = useState<CustomerData>({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    child_name: '',
    child_age: '',
    child_gender: '',
    level: '',
    goals: [],
    agree_contact: false,
    agree_terms: false
  });
          const [selectedPlan, setSelectedPlan] = useState<PlanKey>('five');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // בדיקה אם יש פרמטרים ב-URL
  React.useEffect(() => {
    const plan = searchParams.get('plan') as PlanKey;
    if (plan && PLANS[plan]) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  const handleInputChange = (field: keyof CustomerData, value: any) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: keyof CustomerData, value: string) => {
    const currentValues = customerData[field] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleInputChange(field, newValues);
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStepType('plans');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlanSelect = (plan: PlanKey) => {
    setSelectedPlan(plan);
  };

  const validateCurrentQuestion = (): boolean => {
    const question = QUESTIONS[currentStep];
    if (!question.required) return true;
    
    const value = customerData[question.field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return !!value;
  };

  const isCurrentFieldEmpty = () => {
    const currentQuestion = QUESTIONS[currentStep];
    const value = customerData[currentQuestion.field];
    
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return !value || value.toString().trim() === '';
  };

  const getNextButtonText = () => {
    if (currentStep === QUESTIONS.length - 1) {
      return 'המשך לחבילות';
    }
    
    if (isCurrentFieldEmpty() && !QUESTIONS[currentStep].required) {
      return 'דלג';
    }
    
    return 'המשך';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const paymentData = {
        plan_key: selectedPlan,
        plan_name: PLANS[selectedPlan].name,
        plan_amount: PLANS[selectedPlan].amount,
        payment_url: PLANS[selectedPlan].paymentUrl
      };

      // שמירת נתונים ב-localStorage
      localStorage.setItem('customerData', JSON.stringify(customerData));
      localStorage.setItem('paymentData', JSON.stringify(paymentData));

      // מעבר לתשלום
      window.location.href = PLANS[selectedPlan].paymentUrl;
    } catch (error: any) {
      setError('שגיאה בהכנת התשלום: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // טיימר להעברה לדף התוצאה אחרי 20 שניות
  React.useEffect(() => {
    if (currentStepType === 'payment') {
      const timer = setTimeout(() => {
        window.location.href = '/checkout/result?status=success';
      }, 20000); // 20 שניות

      return () => clearTimeout(timer);
    }
  }, [currentStepType]);

  const handlePaymentSuccess = () => {
    setCurrentStepType('success');
  };

  const getProgressPercentage = () => {
    if (currentStepType === 'questions') {
      return ((currentStep + 1) / QUESTIONS.length) * 100;
    }
    if (currentStepType === 'plans') return 100;
    return 100;
  };

  if (currentStepType === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border border-green-500/30">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-white mb-4">ההרשמה הושלמה בהצלחה! 🎉</h2>
          <p className="text-gray-300 mb-6 text-lg">
            תודה על ההרשמה, {customerData.parent_name}! 
            <br />
            נציג יצור איתך קשר בקרוב.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
          >
            חזרה לדף הבית
          </button>
        </div>
      </div>
    );
  }

  if (currentStepType === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border border-green-500/30">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-4">העברת לתשלום 💳</h2>
          <p className="text-gray-300 mb-6 text-lg">
            הנתונים נשלחו בהצלחה! 
            <br />
            כעת תועבר/י לדף התשלום.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.open(PLANS[selectedPlan].paymentUrl, '_blank')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold w-full transition-all transform hover:scale-105"
            >
              המשך לתשלום
            </button>
            <p className="text-sm text-gray-400 mt-4">
              אם התשלום לא נפתח אוטומטית, לחץ על הכפתור למעלה
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStepType === 'plans') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 pt-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8 mt-8">
            <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <p className="text-center text-gray-300 mt-2">100% הושלם! 🎉</p>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">בחר/י את החבילה המתאימה לכם 💎</h1>
            <p className="text-xl text-gray-300">תבסס על המידע שסיפקת, הנה ההמלצות שלנו</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center max-w-2xl mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                  ${selectedPlan === key 
                    ? 'border-green-500 bg-gradient-to-br from-green-900/50 to-blue-900/50 shadow-2xl shadow-green-500/20' 
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }
                `}
              >
                {key === 'five' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      מומלץ
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-green-400 mb-6">₪{plan.amount}</div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handlePlanSelect(key as PlanKey)}
                    className={`
                      w-full py-4 px-6 rounded-xl font-bold transition-all
                      ${selectedPlan === key
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }
                    `}
                  >
                    {selectedPlan === key ? 'נבחר' : 'בחר חבילה'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 
                text-white px-12 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? 'שולח...' : 'המשך לתשלום'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 pt-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8 mt-8">
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-10 border border-gray-600/50 shadow-2xl max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6 shadow-lg">
              {currentQuestion.icon}
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">{currentQuestion.title}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{currentQuestion.subtitle}</p>
          </div>

          {/* Input Field */}
          <div className="mb-10 max-w-2xl mx-auto">
            {(currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'tel') && (
              <div>
                <input
                  type={currentQuestion.type}
                  value={customerData[currentQuestion.field] as string || ''}
                  onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && validateCurrentQuestion()) {
                      handleNext();
                    }
                  }}
                  placeholder={currentQuestion.placeholder}
                  className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-8 py-5 text-white text-xl focus:border-green-500 focus:outline-none transition-all shadow-lg text-center"
                />
              </div>
            )}

            {currentQuestion.type === 'number' && (
              <div>
                <input
                  type="number"
                  value={customerData[currentQuestion.field] as string || ''}
                  onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && validateCurrentQuestion()) {
                      handleNext();
                    }
                  }}
                  placeholder={currentQuestion.placeholder}
                  min="1"
                  max="18"
                  className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-8 py-5 text-white text-xl focus:border-green-500 focus:outline-none transition-all shadow-lg text-center"
                />
              </div>
            )}

            {currentQuestion.type === 'select' && currentQuestion.options && (
              <div>
                <select
                  value={customerData[currentQuestion.field] as string || ''}
                  onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && validateCurrentQuestion()) {
                      handleNext();
                    }
                  }}
                  className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-8 py-5 text-white text-xl focus:border-green-500 focus:outline-none transition-all shadow-lg text-center"
                >
                  <option value="">בחר/י אפשרות</option>
                  {currentQuestion.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}

            {currentQuestion.type === 'multiselect' && currentQuestion.options && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {currentQuestion.options.map((option) => (
                    <label key={option} className="flex items-center p-5 bg-gray-700 rounded-xl border-2 border-gray-600 hover:border-green-500 transition-all cursor-pointer shadow-lg hover:shadow-xl">
                      <input
                        type="checkbox"
                        checked={(customerData[currentQuestion.field] as string[] || []).includes(option)}
                        onChange={() => handleMultiSelectChange(currentQuestion.field, option)}
                        className="w-6 h-6 text-green-500 mr-4"
                      />
                      <span className="text-white text-lg">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === 'textarea' && (
              <div>
                <textarea
                  value={customerData[currentQuestion.field] as string || ''}
                  onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && validateCurrentQuestion()) {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                  placeholder={currentQuestion.placeholder}
                  rows={5}
                  className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-8 py-5 text-white text-lg focus:border-green-500 focus:outline-none transition-all resize-none shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center mt-10 gap-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`
                inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 min-w-[120px]
                ${currentStep === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl'
                }
              `}
            >
              <ChevronRight className="w-4 h-4 ml-1" />
              <span className="mx-1">חזור</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!validateCurrentQuestion()}
              className={`
                inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[120px]
                ${validateCurrentQuestion()
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                }
              `}
            >
              <span className="mx-1">{getNextButtonText()}</span>
              <ChevronLeft className="w-4 h-4 mr-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


