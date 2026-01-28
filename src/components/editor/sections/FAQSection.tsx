import { useState } from 'react';
import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, Minus, Trash2, HelpCircle, MessageCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQContent {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
  categories?: string[];
}

const defaultItems: FAQItem[] = [
  {
    question: 'כמה זמן לוקח לבנות אתר?',
    answer: 'זמן הבנייה תלוי במורכבות הפרויקט. אתר תדמית פשוט יכול להיות מוכן תוך 3-5 ימי עבודה, בעוד פרויקטים מורכבים יותר עשויים לקחת 2-4 שבועות.',
    category: 'כללי'
  },
  {
    question: 'האם אני יכול לערוך את האתר בעצמי?',
    answer: 'בהחלט! המערכת שלנו מאפשרת עריכה קלה ואינטואיטיבית של כל התכנים באתר, כולל טקסטים, תמונות ועיצוב. לא נדרש ידע טכני.',
    category: 'כללי'
  },
  {
    question: 'מה כולל המחיר?',
    answer: 'המחיר כולל עיצוב מותאם אישית, פיתוח, אחסון, תעודת SSL, גיבויים אוטומטיים, ותמיכה טכנית. ללא עלויות נסתרות.',
    category: 'תשלומים'
  },
  {
    question: 'האם יש תקופת התחייבות?',
    answer: 'לא, אין תקופת התחייבות. אתם יכולים לבטל את המנוי בכל עת ללא קנסות או עמלות נוספות.',
    category: 'תשלומים'
  },
  {
    question: 'האם האתר מותאם למובייל?',
    answer: 'כן, כל האתרים שלנו בנויים עם עיצוב רספונסיבי מלא ומותאמים לכל סוגי המסכים - מחשב, טאבלט וסמארטפון.',
    category: 'טכני'
  },
  {
    question: 'מה קורה אם יש בעיה טכנית?',
    answer: 'צוות התמיכה שלנו זמין 24/7 לעזור לכם. ניתן לפנות אלינו דרך צ׳אט, טלפון או מייל ונטפל בבעיה במהירות.',
    category: 'טכני'
  }
];

const defaultCategories = ['הכל', 'כללי', 'תשלומים', 'טכני'];

// ─── Shared hook for FAQ logic ───────────────────────────────────────────────

function useFAQLogic(content: Record<string, unknown>, onContentChange?: (content: Record<string, unknown>) => void) {
  const faqContent = content as FAQContent;
  const items = faqContent.items || defaultItems;
  const categories = faqContent.categories || defaultCategories;

  const updateContent = (key: keyof FAQContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateItem = (index: number, key: keyof FAQItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    updateContent('items', newItems);
  };

  const addItem = () => {
    const newItems = [...items, {
      question: 'שאלה חדשה?',
      answer: 'תשובה לשאלה החדשה...',
      category: 'כללי'
    }];
    updateContent('items', newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateContent('items', newItems);
  };

  return { faqContent, items, categories, updateContent, updateItem, addItem, removeItem };
}

// ─── DEFAULT VARIANT (accordion with dark bg, orbs, glass cards) ─────────────

function DefaultVariant({ content, isEditing, onContentChange, onSelect, isSelected }: SectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('הכל');
  const { colors, fonts, getCardRadius } = useTheme();
  const { faqContent, items, categories, updateContent, updateItem, addItem, removeItem } = useFAQLogic(content, onContentChange);

  const filteredItems = activeCategory === 'הכל'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <section
      className={`relative py-24 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-offset-2' : ''
      }`}
      style={{
        fontFamily: fonts.body,
        ...(isSelected ? { ringColor: colors.primary } as React.CSSProperties : {}),
      }}
      onClick={onSelect}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />

      {/* Mesh Gradient */}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)', opacity: 0.25 }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating Orbs */}
      <div
        className="floating-orb w-[400px] h-[400px] -top-40 left-1/4"
        style={{ backgroundColor: `${colors.primary}26` }}
      />
      <div
        className="floating-orb w-[300px] h-[300px] bottom-20 -right-20"
        style={{ backgroundColor: `${colors.accent}1a` }}
      />

      {/* Noise */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-6">
            <HelpCircle className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm text-white/80">שאלות נפוצות</span>
          </div>

          <EditableText
            value={faqContent.title || 'שאלות שנשאלות הרבה'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: fonts.heading }}
            as="h2"
          />

          <EditableText
            value={faqContent.subtitle || 'לא מצאתם תשובה? צרו איתנו קשר ונשמח לעזור'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-white/60 max-w-2xl mx-auto"
            as="p"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'text-white shadow-lg'
                  : 'glass-dark text-white/70 hover:text-white border border-white/10 hover:border-white/30'
              }`}
              style={activeCategory === category
                ? { background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`, boxShadow: `0 10px 25px ${colors.primary}4d` }
                : {}
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const realIndex = items.findIndex(i => i === item);
            const isOpen = openIndex === realIndex;

            return (
              <div
                key={realIndex}
                className={`overflow-hidden transition-all duration-500 ${
                  isOpen
                    ? 'glass-dark shadow-lg'
                    : 'glass-dark border border-white/10 hover:border-white/20'
                }`}
                style={{
                  borderRadius: getCardRadius(),
                  ...(isOpen ? { border: `2px solid ${colors.primary}4d`, boxShadow: `0 10px 25px ${colors.primary}1a` } : {}),
                }}
              >
                <div
                  onClick={() => setOpenIndex(isOpen ? null : realIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenIndex(isOpen ? null : realIndex);
                    }
                  }}
                  className="w-full px-6 py-5 flex items-center justify-between text-right cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                      style={isOpen
                        ? { background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }
                        : { backgroundColor: 'rgba(255,255,255,0.1)' }
                      }
                    >
                      <MessageCircle className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-white/60'}`} />
                    </div>
                    <EditableText
                      value={item.question}
                      onChange={(value) => updateItem(realIndex, 'question', value)}
                      isEditing={isEditing}
                      className={`text-lg font-semibold transition-colors ${
                        isOpen ? 'text-white' : 'text-white/80'
                      }`}
                      as="div"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    {isEditing && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); removeItem(realIndex); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            removeItem(realIndex);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={isOpen
                        ? { backgroundColor: colors.primary, transform: 'rotate(180deg)' }
                        : { backgroundColor: 'rgba(255,255,255,0.1)' }
                      }
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : (
                        <Plus className="w-4 h-4 text-white/60" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 pr-20">
                    <EditableText
                      value={item.answer}
                      onChange={(value) => updateItem(realIndex, 'answer', value)}
                      isEditing={isEditing}
                      className="text-white/70 leading-relaxed"
                      as="p"
                    />

                    {isEditing && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-white/40 text-sm">קטגוריה:</span>
                        <select
                          value={item.category || 'כללי'}
                          onChange={(e) => updateItem(realIndex, 'category', e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {categories.filter(c => c !== 'הכל').map(cat => (
                            <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Item Button */}
          {isEditing && (
            <button
              onClick={(e) => { e.stopPropagation(); addItem(); }}
              className="w-full py-5 border-2 border-dashed border-white/20 text-white/40 flex items-center justify-center gap-2 transition-all"
              style={{
                borderRadius: getCardRadius(),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.primary}80`;
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              }}
            >
              <Plus className="w-5 h-5" />
              הוסף שאלה
            </button>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-3xl glass-dark border border-white/10">
            <div className="text-center sm:text-right">
              <p className="text-white font-semibold mb-1">עדיין יש לכם שאלות?</p>
              <p className="text-white/60 text-sm">צוות התמיכה שלנו ישמח לעזור</p>
            </div>
            <Button
              className="text-white px-6 py-3 font-medium hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                borderRadius: 'var(--theme-radius-button, 12px)',
              }}
            >
              <Sparkles className="w-4 h-4 ml-2" />
              צרו קשר
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── GRID VARIANT (two-column grid, all answers visible) ─────────────────────

function GridVariant({ content, isEditing, onContentChange, onSelect, isSelected }: SectionProps) {
  const { colors, fonts, getCardRadius } = useTheme();
  const { faqContent, items, updateContent, updateItem, addItem, removeItem } = useFAQLogic(content, onContentChange);

  return (
    <section
      className={`relative py-24 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-offset-2' : ''
      }`}
      style={{
        fontFamily: fonts.body,
        ...(isSelected ? { '--tw-ring-color': colors.primary } as React.CSSProperties : {}),
      }}
      onClick={onSelect}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">שאלות ותשובות</span>
          </div>

          <EditableText
            value={faqContent.title || 'שאלות שנשאלות הרבה'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: fonts.heading }}
            as="h2"
          />

          <EditableText
            value={faqContent.subtitle || 'לא מצאתם תשובה? צרו איתנו קשר ונשמח לעזור'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
            as="p"
          />
        </div>

        {/* Grid of Q&A cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative group"
              style={{ borderRadius: getCardRadius() }}
            >
              {/* Delete button */}
              {isEditing && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                  className="absolute top-3 left-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                >
                  <HelpCircle className="w-4 h-4" />
                </div>
                <EditableText
                  value={item.question}
                  onChange={(value) => updateItem(index, 'question', value)}
                  isEditing={isEditing}
                  className="text-lg font-semibold text-gray-900"
                  as="h3"
                />
              </div>

              <div className="pr-11">
                <EditableText
                  value={item.answer}
                  onChange={(value) => updateItem(index, 'answer', value)}
                  isEditing={isEditing}
                  className="text-gray-600 leading-relaxed text-sm"
                  as="p"
                />
              </div>

              {item.category && (
                <div className="mt-4 pr-11">
                  <span
                    className="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
                  >
                    {item.category}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Add item card */}
          {isEditing && (
            <button
              onClick={(e) => { e.stopPropagation(); addItem(); }}
              className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-all min-h-[160px]"
              style={{ borderRadius: getCardRadius() }}
            >
              <Plus className="w-8 h-8" />
              <span className="font-medium">הוסף שאלה</span>
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">עדיין יש לכם שאלות?</p>
          <Button
            className="text-white px-8 py-3 font-medium hover:opacity-90"
            style={{
              backgroundColor: colors.primary,
              borderRadius: 'var(--theme-radius-button, 8px)',
            }}
          >
            <MessageCircle className="w-4 h-4 ml-2" />
            צרו קשר
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── MINIMAL VARIANT (clean accordion, no decorations, plain bg) ─────────────

function MinimalVariant({ content, isEditing, onContentChange, onSelect, isSelected }: SectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { colors, fonts } = useTheme();
  const { faqContent, items, updateContent, updateItem, addItem, removeItem } = useFAQLogic(content, onContentChange);

  return (
    <section
      className={`relative py-20 transition-all bg-white ${
        isSelected ? 'ring-2 ring-offset-2' : ''
      }`}
      style={{
        fontFamily: fonts.body,
        ...(isSelected ? { '--tw-ring-color': colors.primary } as React.CSSProperties : {}),
      }}
      onClick={onSelect}
    >
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <EditableText
            value={faqContent.title || 'שאלות נפוצות'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: fonts.heading }}
            as="h2"
          />

          <EditableText
            value={faqContent.subtitle || 'תשובות לשאלות הנפוצות ביותר'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-base text-gray-400"
            as="p"
          />
        </div>

        {/* Minimal accordion */}
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index}>
                <div
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenIndex(isOpen ? null : index);
                    }
                  }}
                  className="w-full py-5 flex items-center justify-between text-right cursor-pointer group"
                >
                  <EditableText
                    value={item.question}
                    onChange={(value) => updateItem(index, 'question', value)}
                    isEditing={isEditing}
                    className={`text-base font-medium transition-colors flex-1 ${
                      isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                    }`}
                    as="div"
                  />

                  <div className="flex items-center gap-2 flex-shrink-0 mr-4">
                    {isEditing && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            removeItem(index);
                          }
                        }}
                        className="p-1 rounded hover:bg-red-50 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className="transition-transform duration-300"
                      style={isOpen ? { transform: 'rotate(180deg)' } : {}}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 pb-5' : 'max-h-0'
                  }`}
                >
                  <EditableText
                    value={item.answer}
                    onChange={(value) => updateItem(index, 'answer', value)}
                    isEditing={isEditing}
                    className="text-gray-500 leading-relaxed text-sm pr-0"
                    as="p"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Add item */}
        {isEditing && (
          <button
            onClick={(e) => { e.stopPropagation(); addItem(); }}
            className="w-full py-4 mt-4 border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">הוסף שאלה</span>
          </button>
        )}

        {/* Simple CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-3">לא מצאתם תשובה?</p>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-600 hover:text-gray-900 px-6"
            style={{ borderRadius: 'var(--theme-radius-button, 8px)' }}
          >
            <HelpCircle className="w-4 h-4 ml-2" />
            צרו קשר
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── COLUMNS VARIANT (sidebar navigation: questions left, answer right) ──────

function ColumnsVariant({ content, isEditing, onContentChange, onSelect, isSelected }: SectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { colors, fonts, getCardRadius } = useTheme();
  const { faqContent, items, updateContent, updateItem, addItem, removeItem } = useFAQLogic(content, onContentChange);

  const currentItem = items[selectedIndex] || items[0];

  return (
    <section
      className={`relative py-24 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-offset-2' : ''
      }`}
      style={{
        fontFamily: fonts.body,
        backgroundColor: colors.secondary,
        ...(isSelected ? { '--tw-ring-color': colors.primary } as React.CSSProperties : {}),
      }}
      onClick={onSelect}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: colors.accent }}>
              שאלות נפוצות
            </span>
          </div>

          <EditableText
            value={faqContent.title || 'מצאו את התשובה שלכם'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: fonts.heading }}
            as="h2"
          />

          <EditableText
            value={faqContent.subtitle || 'בחרו שאלה מהרשימה וקבלו את התשובה מיד'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-lg text-white/50 max-w-xl mx-auto"
            as="p"
          />
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Questions column (left/right depending on RTL) */}
          <div className="md:col-span-2 space-y-2">
            {items.map((item, index) => {
              const isActive = selectedIndex === index;

              return (
                <div
                  key={index}
                  className="relative group"
                >
                  <div
                    onClick={() => setSelectedIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedIndex(index);
                      }
                    }}
                    className={`w-full text-right px-5 py-4 cursor-pointer transition-all flex items-center gap-3 ${
                      isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                    }`}
                    style={{
                      borderRadius: getCardRadius(),
                      backgroundColor: isActive ? `${colors.primary}20` : 'transparent',
                      borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent',
                    }}
                  >
                    <MessageCircle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isActive ? colors.primary : 'rgba(255,255,255,0.3)' }}
                    />
                    <EditableText
                      value={item.question}
                      onChange={(value) => updateItem(index, 'question', value)}
                      isEditing={isEditing}
                      className={`text-sm font-medium flex-1 ${isActive ? 'text-white' : 'text-white/50'}`}
                      as="div"
                    />
                    {isEditing && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(index);
                          if (selectedIndex >= items.length - 1) {
                            setSelectedIndex(Math.max(0, items.length - 2));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            removeItem(index);
                          }
                        }}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 cursor-pointer transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isEditing && (
              <button
                onClick={(e) => { e.stopPropagation(); addItem(); }}
                className="w-full py-3 border border-dashed border-white/20 text-white/30 hover:text-white/60 hover:border-white/40 flex items-center justify-center gap-2 transition-all text-sm"
                style={{ borderRadius: getCardRadius() }}
              >
                <Plus className="w-4 h-4" />
                הוסף שאלה
              </button>
            )}
          </div>

          {/* Answer column */}
          <div className="md:col-span-3">
            {currentItem && (
              <div
                className="p-8 md:p-10 h-full min-h-[300px] flex flex-col"
                style={{
                  borderRadius: getCardRadius(),
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: `1px solid rgba(255,255,255,0.1)`,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
                  >
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <EditableText
                    value={currentItem.question}
                    onChange={(value) => updateItem(selectedIndex, 'question', value)}
                    isEditing={isEditing}
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: fonts.heading }}
                    as="h3"
                  />
                </div>

                <EditableText
                  value={currentItem.answer}
                  onChange={(value) => updateItem(selectedIndex, 'answer', value)}
                  isEditing={isEditing}
                  className="text-white/70 leading-loose text-base flex-1"
                  as="p"
                />

                {currentItem.category && (
                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2">
                    <span className="text-white/30 text-xs">קטגוריה:</span>
                    {isEditing ? (
                      <select
                        value={currentItem.category}
                        onChange={(e) => updateItem(selectedIndex, 'category', e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {(faqContent.categories || defaultCategories).filter(c => c !== 'הכל').map(cat => (
                          <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                      >
                        {currentItem.category}
                      </span>
                    )}
                  </div>
                )}

                {/* Navigation hint */}
                <div className="mt-6 flex items-center justify-between text-white/20 text-xs">
                  <span>{selectedIndex + 1} / {items.length}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedIndex(Math.max(0, selectedIndex - 1)); }}
                      disabled={selectedIndex === 0}
                      className="px-3 py-1 rounded border border-white/10 hover:border-white/30 disabled:opacity-30 transition-all"
                    >
                      הקודם
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedIndex(Math.min(items.length - 1, selectedIndex + 1)); }}
                      disabled={selectedIndex === items.length - 1}
                      className="px-3 py-1 rounded border border-white/10 hover:border-white/30 disabled:opacity-30 transition-all"
                    >
                      הבא
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function FAQSection(props: SectionProps) {
  const variant = props.variant || 'default';

  switch (variant) {
    case 'grid':
      return <GridVariant {...props} />;
    case 'minimal':
      return <MinimalVariant {...props} />;
    case 'columns':
      return <ColumnsVariant {...props} />;
    default:
      return <DefaultVariant {...props} />;
  }
}
