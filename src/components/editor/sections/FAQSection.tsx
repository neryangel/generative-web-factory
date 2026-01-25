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

export function FAQSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('הכל');
  
  const faqContent = content as FAQContent;
  const items = faqContent.items || defaultItems;
  const categories = faqContent.categories || defaultCategories;

  const filteredItems = activeCategory === 'הכל' 
    ? items 
    : items.filter(item => item.category === activeCategory);

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
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)', opacity: 0.25 }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Floating Orbs */}
      <div className="floating-orb w-[400px] h-[400px] -top-40 left-1/4 bg-orange-500/15" />
      <div className="floating-orb w-[300px] h-[300px] bottom-20 -right-20 bg-yellow-500/10" />
      
      {/* Noise */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-6">
            <HelpCircle className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-white/80">שאלות נפוצות</span>
          </div>
          
          <EditableText
            value={faqContent.title || 'שאלות שנשאלות הרבה'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
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
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
                  : 'glass-dark text-white/70 hover:text-white border border-white/10 hover:border-white/30'
              }`}
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
                className={`rounded-2xl overflow-hidden transition-all duration-500 ${
                  isOpen 
                    ? 'glass-dark border-2 border-orange-500/30 shadow-lg shadow-orange-500/10' 
                    : 'glass-dark border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : realIndex)}
                  className="w-full px-6 py-5 flex items-center justify-between text-right"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isOpen 
                        ? 'bg-gradient-to-br from-orange-500 to-yellow-500' 
                        : 'bg-white/10'
                    }`}>
                      <MessageCircle className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-white/60'}`} />
                    </div>
                    <EditableText
                      value={item.question}
                      onChange={(value) => updateItem(realIndex, 'question', value)}
                      isEditing={isEditing}
                      className={`text-lg font-semibold transition-colors ${
                        isOpen ? 'text-white' : 'text-white/80'
                      }`}
                      as="span"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isEditing && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(realIndex); }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isOpen 
                        ? 'bg-orange-500 rotate-180' 
                        : 'bg-white/10'
                    }`}>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : (
                        <Plus className="w-4 h-4 text-white/60" />
                      )}
                    </div>
                  </div>
                </button>

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
              className="w-full py-5 rounded-2xl border-2 border-dashed border-white/20 hover:border-orange-500/50 text-white/40 hover:text-orange-400 flex items-center justify-center gap-2 transition-all"
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
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-medium">
              צרו קשר
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
