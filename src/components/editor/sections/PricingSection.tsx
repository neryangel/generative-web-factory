import { useState } from 'react';
import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

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
    name: '\u05D1\u05E1\u05D9\u05E1\u05D9',
    price_monthly: '49',
    price_yearly: '39',
    description: '\u05DE\u05D5\u05E9\u05DC\u05DD \u05DC\u05D4\u05EA\u05D7\u05DC\u05D4',
    features: ['\u05E2\u05D3 3 \u05D0\u05EA\u05E8\u05D9\u05DD', '10GB \u05D0\u05D7\u05E1\u05D5\u05DF', '\u05EA\u05DE\u05D9\u05DB\u05D4 \u05D1\u05DE\u05D9\u05D9\u05DC', 'SSL \u05D7\u05D9\u05E0\u05DD'],
    cta_text: '\u05D4\u05EA\u05D7\u05DC \u05E2\u05DB\u05E9\u05D9\u05D5',
    is_popular: false,
  },
  {
    name: '\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9',
    price_monthly: '99',
    price_yearly: '79',
    description: '\u05D4\u05DB\u05D9 \u05E4\u05D5\u05E4\u05D5\u05DC\u05E8\u05D9 \u05DC\u05E2\u05E1\u05E7\u05D9\u05DD',
    features: [
      '\u05E2\u05D3 10 \u05D0\u05EA\u05E8\u05D9\u05DD',
      '50GB \u05D0\u05D7\u05E1\u05D5\u05DF',
      '\u05EA\u05DE\u05D9\u05DB\u05D4 \u05D1\u05E6\u05F3\u05D0\u05D8',
      'SSL \u05D7\u05D9\u05E0\u05DD',
      '\u05D3\u05D5\u05DE\u05D9\u05D9\u05DF \u05DE\u05D5\u05EA\u05D0\u05DD',
      '\u05D0\u05E0\u05DC\u05D9\u05D8\u05D9\u05E7\u05E1 \u05DE\u05EA\u05E7\u05D3\u05DD',
    ],
    cta_text: '\u05D4\u05EA\u05D7\u05DC \u05E2\u05DB\u05E9\u05D9\u05D5',
    is_popular: true,
  },
  {
    name: '\u05D0\u05E8\u05D2\u05D5\u05E0\u05D9',
    price_monthly: '199',
    price_yearly: '159',
    description: '\u05DC\u05E2\u05E1\u05E7\u05D9\u05DD \u05D2\u05D3\u05D5\u05DC\u05D9\u05DD',
    features: [
      '\u05D0\u05EA\u05E8\u05D9\u05DD \u05DC\u05DC\u05D0 \u05D4\u05D2\u05D1\u05DC\u05D4',
      '\u05D0\u05D7\u05E1\u05D5\u05DF \u05DC\u05DC\u05D0 \u05D4\u05D2\u05D1\u05DC\u05D4',
      '\u05EA\u05DE\u05D9\u05DB\u05D4 24/7',
      'SSL \u05D7\u05D9\u05E0\u05DD',
      '\u05D3\u05D5\u05DE\u05D9\u05D9\u05E0\u05D9\u05DD \u05DE\u05E8\u05D5\u05D1\u05D9\u05DD',
      'API \u05D2\u05D9\u05E9\u05D4',
      '\u05DE\u05E0\u05D4\u05DC \u05D7\u05E9\u05D1\u05D5\u05DF \u05D0\u05D9\u05E9\u05D9',
    ],
    cta_text: '\u05E6\u05D5\u05E8 \u05E7\u05E9\u05E8',
    is_popular: false,
  },
];

export function PricingSection({
  content,
  variant = 'default',
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const { colors, fonts, getButtonRadius, getCardRadius } = useTheme();
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
    newPlans[planIndex] = {
      ...newPlans[planIndex],
      features: [...newPlans[planIndex].features, '\u05EA\u05DB\u05D5\u05E0\u05D4 \u05D7\u05D3\u05E9\u05D4'],
    };
    updateContent('plans', newPlans);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures.splice(featureIndex, 1);
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures };
    updateContent('plans', newPlans);
  };

  const addPlan = () => {
    const newPlans = [
      ...plans,
      {
        name: '\u05EA\u05DB\u05E0\u05D9\u05EA \u05D7\u05D3\u05E9\u05D4',
        price_monthly: '149',
        price_yearly: '119',
        description: '\u05EA\u05D9\u05D0\u05D5\u05E8 \u05D4\u05EA\u05DB\u05E0\u05D9\u05EA',
        features: ['\u05EA\u05DB\u05D5\u05E0\u05D4 \u05E8\u05D0\u05E9\u05D5\u05E0\u05D4'],
        cta_text: '\u05D4\u05EA\u05D7\u05DC \u05E2\u05DB\u05E9\u05D9\u05D5',
        is_popular: false,
      },
    ];
    updateContent('plans', newPlans);
  };

  const removePlan = (index: number) => {
    const newPlans = plans.filter((_, i) => i !== index);
    updateContent('plans', newPlans);
  };

  // Shared billing toggle component
  const BillingToggle = ({ lightMode = false }: { lightMode?: boolean }) => (
    <div className="flex items-center justify-center gap-4 mt-10">
      <span
        className="text-sm font-medium transition-colors"
        style={{
          color: !isYearly
            ? lightMode
              ? '#1f2937'
              : '#ffffff'
            : lightMode
              ? '#9ca3af'
              : 'rgba(255,255,255,0.5)',
        }}
      >
        \u05D7\u05D5\u05D3\u05E9\u05D9
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsYearly(!isYearly);
        }}
        className="relative w-16 h-8 rounded-full transition-colors"
        style={{
          background: isYearly
            ? `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
            : lightMode
              ? '#d1d5db'
              : 'rgba(255,255,255,0.2)',
        }}
      >
        <div
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform"
          style={{
            transform: isYearly ? 'translateX(-4px)' : 'translateX(4px)',
            right: isYearly ? '4px' : 'auto',
            left: isYearly ? 'auto' : '4px',
          }}
        />
      </button>
      <span
        className="text-sm font-medium transition-colors"
        style={{
          color: isYearly
            ? lightMode
              ? '#1f2937'
              : '#ffffff'
            : lightMode
              ? '#9ca3af'
              : 'rgba(255,255,255,0.5)',
        }}
      >
        \u05E9\u05E0\u05EA\u05D9
        <span className="mr-2 text-xs" style={{ color: colors.primary }}>
          \u05D7\u05E1\u05DB\u05D5 20%
        </span>
      </span>
    </div>
  );

  // Shared edit controls for plans
  const PlanEditControls = ({ planIndex }: { planIndex: number }) =>
    isEditing ? (
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newPlans = [...plans];
            newPlans[planIndex] = {
              ...newPlans[planIndex],
              is_popular: !newPlans[planIndex].is_popular,
            };
            updateContent('plans', newPlans);
          }}
          className="text-xs px-2 py-1 rounded border transition-colors"
          style={{
            borderColor: plans[planIndex].is_popular ? colors.primary : '#d1d5db',
            color: plans[planIndex].is_popular ? colors.primary : '#6b7280',
            backgroundColor: plans[planIndex].is_popular ? `${colors.primary}15` : 'transparent',
          }}
        >
          {plans[planIndex].is_popular ? '\u2605 \u05DE\u05D5\u05DE\u05DC\u05E5' : '\u2606 \u05E1\u05DE\u05DF \u05DB\u05DE\u05D5\u05DE\u05DC\u05E5'}
        </button>
        {plans.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removePlan(planIndex);
            }}
            className="text-xs px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
          >
            \u05DE\u05D7\u05E7 \u05EA\u05DB\u05E0\u05D9\u05EA
          </button>
        )}
      </div>
    ) : null;

  // ============================================================
  // VARIANT: SIMPLE - Clean minimal pricing
  // ============================================================
  if (variant === 'simple') {
    return (
      <section
        className={`relative py-24 overflow-hidden transition-all ${
          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body, background: '#f9fafb' }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6">
            <EditableText
              value={pricingContent.title || '\u05EA\u05DB\u05E0\u05D9\u05D5\u05EA \u05DE\u05D7\u05D9\u05E8\u05D9\u05DD \u05E4\u05E9\u05D5\u05D8\u05D5\u05EA'}
              onChange={(value) => updateContent('title', value)}
              isEditing={isEditing}
              className="text-4xl md:text-5xl font-bold mb-4"
              as="h2"
              style={{ fontFamily: fonts.heading, color: '#111827' }}
            />
            <EditableText
              value={pricingContent.subtitle || '\u05D1\u05D7\u05E8\u05D5 \u05D0\u05EA \u05D4\u05EA\u05DB\u05E0\u05D9\u05EA \u05E9\u05DE\u05EA\u05D0\u05D9\u05DE\u05D4 \u05DC\u05E6\u05E8\u05DB\u05D9\u05DD \u05E9\u05DC\u05DB\u05DD'}
              onChange={(value) => updateContent('subtitle', value)}
              isEditing={isEditing}
              className="text-lg max-w-2xl mx-auto"
              as="p"
              style={{ color: '#6b7280' }}
            />
          </div>

          <BillingToggle lightMode />

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="relative flex flex-col bg-white transition-shadow hover:shadow-lg"
                style={{
                  borderRadius: getCardRadius(),
                  border: plan.is_popular ? `2px solid ${colors.primary}` : '1px solid #e5e7eb',
                }}
              >
                {/* Popular label */}
                {plan.is_popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-xs font-bold"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: getButtonRadius(),
                    }}
                  >
                    \u05D4\u05DB\u05D9 \u05E4\u05D5\u05E4\u05D5\u05DC\u05E8\u05D9
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Plan name + description */}
                  <EditableText
                    value={plan.name}
                    onChange={(value) => updatePlan(index, 'name', value)}
                    isEditing={isEditing}
                    className="text-xl font-semibold mb-1"
                    as="h3"
                    style={{ fontFamily: fonts.heading, color: '#111827' }}
                  />
                  <EditableText
                    value={plan.description}
                    onChange={(value) => updatePlan(index, 'description', value)}
                    isEditing={isEditing}
                    className="text-sm mb-6"
                    as="p"
                    style={{ color: '#9ca3af' }}
                  />

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold" style={{ color: '#111827' }}>
                        {'\u20AA'}
                        {isYearly ? (
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
                      <span style={{ color: '#9ca3af' }}>/\u05D7\u05D5\u05D3\u05E9</span>
                    </div>
                    {isYearly && (
                      <p className="text-sm mt-1" style={{ color: colors.primary }}>
                        \u05E0\u05D7\u05E1\u05DA {'\u20AA'}
                        {(parseInt(plan.price_monthly) - parseInt(plan.price_yearly)) * 12} \u05D1\u05E9\u05E0\u05D4
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mb-6" />

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3 group">
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} />
                        <EditableText
                          value={feature}
                          onChange={(value) => updatePlanFeature(index, fIndex, value)}
                          isEditing={isEditing}
                          className="text-sm"
                          as="span"
                          style={{ color: '#374151' }}
                        />
                        {isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFeature(index, fIndex);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-400 text-xs"
                          >
                            \u2715
                          </button>
                        )}
                      </li>
                    ))}
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addFeature(index);
                        }}
                        className="text-sm hover:underline"
                        style={{ color: colors.primary }}
                      >
                        + \u05D4\u05D5\u05E1\u05E3 \u05EA\u05DB\u05D5\u05E0\u05D4
                      </button>
                    )}
                  </ul>

                  {/* CTA */}
                  <Button
                    className="w-full py-6 font-semibold text-base transition-all"
                    style={{
                      borderRadius: getButtonRadius(),
                      backgroundColor: plan.is_popular ? colors.primary : 'transparent',
                      color: plan.is_popular ? '#ffffff' : colors.primary,
                      border: plan.is_popular ? 'none' : `2px solid ${colors.primary}`,
                    }}
                  >
                    <EditableText
                      value={plan.cta_text}
                      onChange={(value) => updatePlan(index, 'cta_text', value)}
                      isEditing={isEditing}
                      as="span"
                    />
                  </Button>

                  <PlanEditControls planIndex={index} />
                </div>
              </div>
            ))}
          </div>

          {/* Add plan button */}
          {isEditing && (
            <div className="flex justify-center mt-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addPlan();
                }}
                className="px-6 py-2 border-2 border-dashed rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                style={{ borderColor: '#d1d5db', color: '#6b7280' }}
              >
                + \u05D4\u05D5\u05E1\u05E3 \u05EA\u05DB\u05E0\u05D9\u05EA
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ============================================================
  // VARIANT: COMPARISON - Feature comparison table
  // ============================================================
  if (variant === 'comparison') {
    // Collect all unique features across plans
    const allFeatures = Array.from(new Set(plans.flatMap((p) => p.features)));

    return (
      <section
        className={`relative py-24 overflow-hidden transition-all ${
          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body, background: '#ffffff' }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mb-6"
              style={{
                backgroundColor: `${colors.primary}10`,
                color: colors.primary,
                borderRadius: getButtonRadius(),
              }}
            >
              <Sparkles className="w-4 h-4" />
              \u05D4\u05E9\u05D5\u05D5\u05D0\u05EA \u05EA\u05DB\u05E0\u05D9\u05D5\u05EA
            </div>

            <EditableText
              value={pricingContent.title || '\u05D4\u05E9\u05D5\u05D5\u05D0\u05D5 \u05D1\u05D9\u05DF \u05D4\u05EA\u05DB\u05E0\u05D9\u05D5\u05EA \u05E9\u05DC\u05E0\u05D5'}
              onChange={(value) => updateContent('title', value)}
              isEditing={isEditing}
              className="text-4xl md:text-5xl font-bold mb-4"
              as="h2"
              style={{ fontFamily: fonts.heading, color: '#111827' }}
            />
            <EditableText
              value={pricingContent.subtitle || '\u05D1\u05D3\u05E7\u05D5 \u05D0\u05D9\u05DC\u05D5 \u05EA\u05DB\u05D5\u05E0\u05D5\u05EA \u05DB\u05DC\u05D5\u05DC\u05D5\u05EA \u05D1\u05DB\u05DC \u05EA\u05DB\u05E0\u05D9\u05EA'}
              onChange={(value) => updateContent('subtitle', value)}
              isEditing={isEditing}
              className="text-lg max-w-2xl mx-auto"
              as="p"
              style={{ color: '#6b7280' }}
            />
          </div>

          <BillingToggle lightMode />

          {/* Comparison Table */}
          <div className="mt-14 overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Plan Headers */}
              <thead>
                <tr>
                  <th
                    className="text-right p-4 text-sm font-medium"
                    style={{ color: '#6b7280', minWidth: '200px' }}
                  >
                    \u05EA\u05DB\u05D5\u05E0\u05D5\u05EA
                  </th>
                  {plans.map((plan, index) => (
                    <th
                      key={index}
                      className="p-4 text-center"
                      style={{
                        minWidth: '180px',
                        backgroundColor: plan.is_popular ? `${colors.primary}08` : 'transparent',
                        borderTop: plan.is_popular ? `3px solid ${colors.primary}` : '3px solid transparent',
                        borderRadius: plan.is_popular ? '12px 12px 0 0' : '0',
                      }}
                    >
                      {plan.is_popular && (
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Zap className="w-3 h-3" style={{ color: colors.primary }} />
                          <span className="text-xs font-bold" style={{ color: colors.primary }}>
                            \u05DE\u05D5\u05DE\u05DC\u05E5
                          </span>
                        </div>
                      )}
                      <EditableText
                        value={plan.name}
                        onChange={(value) => updatePlan(index, 'name', value)}
                        isEditing={isEditing}
                        className="text-lg font-bold block"
                        as="span"
                        style={{ fontFamily: fonts.heading, color: '#111827' }}
                      />
                      <EditableText
                        value={plan.description}
                        onChange={(value) => updatePlan(index, 'description', value)}
                        isEditing={isEditing}
                        className="text-xs block mt-1"
                        as="span"
                        style={{ color: '#9ca3af' }}
                      />
                      <div className="mt-3 mb-2">
                        <span className="text-3xl font-extrabold" style={{ color: '#111827' }}>
                          {'\u20AA'}
                          {isYearly ? (
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
                        <span className="text-sm" style={{ color: '#9ca3af' }}>
                          /\u05D7\u05D5\u05D3\u05E9
                        </span>
                      </div>
                      {isYearly && (
                        <p className="text-xs" style={{ color: colors.primary }}>
                          \u05E0\u05D7\u05E1\u05DA {'\u20AA'}
                          {(parseInt(plan.price_monthly) - parseInt(plan.price_yearly)) * 12} \u05D1\u05E9\u05E0\u05D4
                        </p>
                      )}
                      <PlanEditControls planIndex={index} />
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Feature Rows */}
              <tbody>
                {allFeatures.map((feature, fIndex) => (
                  <tr
                    key={fIndex}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: fIndex % 2 === 0 ? '#fafafa' : '#ffffff',
                    }}
                  >
                    <td className="p-4 text-sm font-medium group" style={{ color: '#374151' }}>
                      <div className="flex items-center gap-2">
                        <span>{feature}</span>
                        {isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Remove this feature from all plans that have it
                              const newPlans = plans.map((p) => ({
                                ...p,
                                features: p.features.filter((f) => f !== feature),
                              }));
                              updateContent('plans', newPlans);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-400 text-xs"
                          >
                            \u2715
                          </button>
                        )}
                      </div>
                    </td>
                    {plans.map((plan, pIndex) => {
                      const hasFeature = plan.features.includes(feature);
                      return (
                        <td
                          key={pIndex}
                          className="p-4 text-center"
                          style={{
                            backgroundColor: plan.is_popular
                              ? `${colors.primary}08`
                              : 'transparent',
                          }}
                        >
                          {hasFeature ? (
                            <div
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                              style={{ backgroundColor: `${colors.primary}15` }}
                            >
                              <Check className="w-4 h-4" style={{ color: colors.primary }} />
                            </div>
                          ) : (
                            <span style={{ color: '#d1d5db' }}>\u2014</span>
                          )}
                          {isEditing && !hasFeature && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newPlans = [...plans];
                                newPlans[pIndex] = {
                                  ...newPlans[pIndex],
                                  features: [...newPlans[pIndex].features, feature],
                                };
                                updateContent('plans', newPlans);
                              }}
                              className="block text-xs mx-auto mt-1 hover:underline"
                              style={{ color: colors.primary }}
                            >
                              \u05D4\u05D5\u05E1\u05E3
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Add feature row (edit mode) */}
                {isEditing && (
                  <tr>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add a new feature to the first plan
                          addFeature(0);
                        }}
                        className="text-sm hover:underline"
                        style={{ color: colors.primary }}
                      >
                        + \u05D4\u05D5\u05E1\u05E3 \u05EA\u05DB\u05D5\u05E0\u05D4
                      </button>
                    </td>
                    {plans.map((_, pIndex) => (
                      <td key={pIndex} />
                    ))}
                  </tr>
                )}
              </tbody>

              {/* CTA Footer Row */}
              <tfoot>
                <tr>
                  <td />
                  {plans.map((plan, index) => (
                    <td
                      key={index}
                      className="p-4 text-center"
                      style={{
                        backgroundColor: plan.is_popular ? `${colors.primary}08` : 'transparent',
                        borderRadius: plan.is_popular ? '0 0 12px 12px' : '0',
                      }}
                    >
                      <Button
                        className="w-full py-5 font-semibold transition-all"
                        style={{
                          borderRadius: getButtonRadius(),
                          backgroundColor: plan.is_popular ? colors.primary : 'transparent',
                          color: plan.is_popular ? '#ffffff' : colors.primary,
                          border: plan.is_popular ? 'none' : `2px solid ${colors.primary}`,
                        }}
                      >
                        <EditableText
                          value={plan.cta_text}
                          onChange={(value) => updatePlan(index, 'cta_text', value)}
                          isEditing={isEditing}
                          as="span"
                        />
                      </Button>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Add plan button */}
          {isEditing && (
            <div className="flex justify-center mt-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addPlan();
                }}
                className="px-6 py-2 border-2 border-dashed rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                style={{ borderColor: '#d1d5db', color: '#6b7280' }}
              >
                + \u05D4\u05D5\u05E1\u05E3 \u05EA\u05DB\u05E0\u05D9\u05EA
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ============================================================
  // VARIANT: DEFAULT - Dark bg, gradient orbs, cards grid
  // ============================================================
  return (
    <section
      className={`relative py-24 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
      style={{ fontFamily: fonts.body }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />

      {/* Mesh Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--gradient-mesh)', opacity: 0.3 }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating Orbs */}
      <div
        className="floating-orb w-[400px] h-[400px] -top-20 -right-20"
        style={{ backgroundColor: `${colors.primary}33` }}
      />
      <div
        className="floating-orb w-[300px] h-[300px] bottom-20 -left-20"
        style={{ backgroundColor: `${colors.accent}26` }}
      />

      {/* Noise */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-6">
            <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
            <span className="text-sm text-white/80">\u05EA\u05DB\u05E0\u05D9\u05D5\u05EA \u05DE\u05D7\u05D9\u05E8\u05D9\u05DD</span>
          </div>

          <EditableText
            value={pricingContent.title || '\u05D1\u05D7\u05E8\u05D5 \u05D0\u05EA \u05D4\u05EA\u05DB\u05E0\u05D9\u05EA \u05D4\u05DE\u05D5\u05E9\u05DC\u05DE\u05EA \u05E2\u05D1\u05D5\u05E8\u05DB\u05DD'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            as="h2"
            style={{ fontFamily: fonts.heading }}
          />

          <EditableText
            value={pricingContent.subtitle || '\u05DC\u05DC\u05D0 \u05D4\u05EA\u05D7\u05D9\u05D9\u05D1\u05D5\u05EA, \u05D1\u05D8\u05DC\u05D5 \u05D1\u05DB\u05DC \u05E2\u05EA'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-white/60 max-w-2xl mx-auto"
            as="p"
          />

          <BillingToggle />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 transition-all duration-500 ${
                plan.is_popular
                  ? 'scale-105 shadow-2xl'
                  : 'glass-dark border border-white/10 hover:border-white/30'
              }`}
              style={{
                borderRadius: getCardRadius(),
                ...(plan.is_popular
                  ? {
                      background: `linear-gradient(to bottom, ${colors.primary}33, ${colors.accent}1A)`,
                      border: `2px solid ${colors.primary}80`,
                      boxShadow: `0 25px 50px -12px ${colors.primary}33`,
                    }
                  : {}),
              }}
            >
              {/* Popular Badge */}
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div
                    className="flex items-center gap-1 px-4 py-1.5 text-white text-sm font-bold shadow-lg"
                    style={{
                      background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                      borderRadius: getButtonRadius(),
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    \u05DE\u05D5\u05DE\u05DC\u05E5
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
                  style={{ fontFamily: fonts.heading }}
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
                    {'\u20AA'}
                    {isYearly ? (
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
                  <span className="text-white/50">/\u05D7\u05D5\u05D3\u05E9</span>
                </div>
                {isYearly && (
                  <p className="text-sm mt-2" style={{ color: colors.accent }}>
                    \u05E0\u05D7\u05E1\u05DA {'\u20AA'}
                    {(parseInt(plan.price_monthly) - parseInt(plan.price_yearly)) * 12} \u05D1\u05E9\u05E0\u05D4
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 group">
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                      }}
                    >
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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFeature(index, fIndex);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-400 text-xs"
                      >
                        \u2715
                      </button>
                    )}
                  </li>
                ))}
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addFeature(index);
                    }}
                    className="text-sm hover:underline"
                    style={{ color: colors.accent }}
                  >
                    + \u05D4\u05D5\u05E1\u05E3 \u05EA\u05DB\u05D5\u05E0\u05D4
                  </button>
                )}
              </ul>

              {/* CTA */}
              <Button
                className="w-full py-6 font-bold text-lg transition-all"
                style={{
                  borderRadius: getButtonRadius(),
                  ...(plan.is_popular
                    ? {
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                        color: '#ffffff',
                        boxShadow: `0 10px 25px -5px ${colors.primary}4D`,
                      }
                    : {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }),
                }}
              >
                <EditableText
                  value={plan.cta_text}
                  onChange={(value) => updatePlan(index, 'cta_text', value)}
                  isEditing={isEditing}
                  as="span"
                />
              </Button>

              <PlanEditControls planIndex={index} />
            </div>
          ))}
        </div>

        {/* Add plan button */}
        {isEditing && (
          <div className="flex justify-center mt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addPlan();
              }}
              className="px-6 py-2 border-2 border-dashed rounded-lg text-sm font-medium text-white/60 border-white/30 hover:border-white/50 hover:text-white/80 transition-colors"
            >
              + \u05D4\u05D5\u05E1\u05E3 \u05EA\u05DB\u05E0\u05D9\u05EA
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
