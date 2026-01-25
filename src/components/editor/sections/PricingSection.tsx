import { useState } from 'react';
import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap } from 'lucide-react';

interface PricingPlan {
  name: string;
  price_monthly: string;
  price_yearly: string;
  description: string;
  features: string[];
  cta_text: string;
  is_popular: boolean;
}

interface PricingContent {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
}

const defaultPlans: PricingPlan[] = [
  {
    name: 'בסיסי',
    price_monthly: '49',
    price_yearly: '39',
    description: 'מושלם להתחלה',
    features: ['עד 3 אתרים', '10GB אחסון', 'תמיכה במייל', 'SSL חינם'],
    cta_text: 'התחל עכשיו',
    is_popular: false
  },
  {
    name: 'מקצועי',
    price_monthly: '99',
    price_yearly: '79',
    description: 'הכי פופולרי לעסקים',
    features: ['עד 10 אתרים', '50GB אחסון', 'תמיכה בצ׳אט', 'SSL חינם', 'דומיין מותאם', 'אנליטיקס מתקדם'],
    cta_text: 'התחל עכשיו',
    is_popular: true
  },
  {
    name: 'ארגוני',
    price_monthly: '199',
    price_yearly: '159',
    description: 'לעסקים גדולים',
    features: ['אתרים ללא הגבלה', 'אחסון ללא הגבלה', 'תמיכה 24/7', 'SSL חינם', 'דומיינים מרובים', 'API גישה', 'מנהל חשבון אישי'],
    cta_text: 'צור קשר',
    is_popular: false
  }
];

export function PricingSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const pricingContent = content as PricingContent;
  const plans = pricingContent.plans || defaultPlans;

  const updateContent = (key: keyof PricingContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updatePlan = (index: number, key: keyof PricingPlan, value: unknown) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [key]: value };
    updateContent('plans', newPlans);
  };

  const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = [...plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures[featureIndex] = value;
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures };
    updateContent('plans', newPlans);
  };

  const addFeature = (planIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].features.push('תכונה חדשה');
    updateContent('plans', newPlans);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].features.splice(featureIndex, 1);
    updateContent('plans', newPlans);
  };

  return (
    <section 
      className={`relative py-24 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />
      
      {/* Mesh Gradient */}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)', opacity: 0.3 }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Floating Orbs */}
      <div className="floating-orb w-[400px] h-[400px] -top-20 -right-20 bg-purple-500/20" />
      <div className="floating-orb w-[300px] h-[300px] bottom-20 -left-20 bg-cyan-500/15" />
      
      {/* Noise */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/80">תכניות מחירים</span>
          </div>
          
          <EditableText
            value={pricingContent.title || 'בחרו את התכנית המושלמת עבורכם'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            as="h2"
          />
          
          <EditableText
            value={pricingContent.subtitle || 'ללא התחייבות, בטלו בכל עת'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-white/60 max-w-2xl mx-auto"
            as="p"
          />

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-white/50'}`}>
              חודשי
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                isYearly ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-white/20'
              }`}
            >
              <div 
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${
                  isYearly ? 'right-1' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-white/50'}`}>
              שנתי
              <span className="mr-2 text-xs text-cyan-400">חסכו 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-3xl p-8 transition-all duration-500 ${
                plan.is_popular 
                  ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/10 border-2 border-purple-500/50 scale-105 shadow-2xl shadow-purple-500/20' 
                  : 'glass-dark border border-white/10 hover:border-white/30'
              }`}
            >
              {/* Popular Badge */}
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full text-white text-sm font-bold shadow-lg">
                    <Zap className="w-4 h-4" />
                    מומלץ
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <EditableText
                  value={plan.name}
                  onChange={(value) => updatePlan(index, 'name', value)}
                  isEditing={isEditing}
                  className="text-2xl font-bold text-white mb-2"
                  as="h3"
                />
                <EditableText
                  value={plan.description}
                  onChange={(value) => updatePlan(index, 'description', value)}
                  isEditing={isEditing}
                  className="text-white/60"
                  as="p"
                />
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-white">
                    ₪{isYearly ? (
                      <EditableText
                        value={plan.price_yearly}
                        onChange={(value) => updatePlan(index, 'price_yearly', value)}
                        isEditing={isEditing}
                        as="span"
                      />
                    ) : (
                      <EditableText
                        value={plan.price_monthly}
                        onChange={(value) => updatePlan(index, 'price_monthly', value)}
                        isEditing={isEditing}
                        as="span"
                      />
                    )}
                  </span>
                  <span className="text-white/50">/חודש</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-cyan-400 mt-2">
                    נחסך ₪{(parseInt(plan.price_monthly) - parseInt(plan.price_yearly)) * 12} בשנה
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 group">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <EditableText
                      value={feature}
                      onChange={(value) => updatePlanFeature(index, fIndex, value)}
                      isEditing={isEditing}
                      className="text-white/80"
                      as="span"
                    />
                    {isEditing && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFeature(index, fIndex); }}
                        className="opacity-0 group-hover:opacity-100 text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
                {isEditing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); addFeature(index); }}
                    className="text-cyan-400 text-sm hover:underline"
                  >
                    + הוסף תכונה
                  </button>
                )}
              </ul>

              {/* CTA */}
              <Button 
                className={`w-full py-6 rounded-xl font-bold text-lg transition-all ${
                  plan.is_popular
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <EditableText
                  value={plan.cta_text}
                  onChange={(value) => updatePlan(index, 'cta_text', value)}
                  isEditing={isEditing}
                  as="span"
                />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
