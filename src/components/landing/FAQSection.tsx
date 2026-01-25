import { useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion, useInView } from 'framer-motion';

const FAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: 'אילו שירותים אתם מציעים?',
      answer: 'אנחנו מספקים פתרונות דיגיטליים מקיפים כולל עיצוב אתרים, פיתוח, מיתוג, אופטימיזציית SEO ותחזוקה שוטפת. הצוות שלנו יוצר פתרונות מותאמים אישית לצרכים העסקיים הספציפיים שלכם.',
    },
    {
      question: 'כמה זמן לוקח פרויקט טיפוסי?',
      answer: 'לוחות הזמנים של הפרויקטים משתנים בהתאם להיקף ולמורכבות. אתר סטנדרטי לוקח בדרך כלל 4-8 שבועות, בעוד פרויקטים מורכבים יותר עשויים לדרוש 12-16 שבועות. אנחנו מספקים לוחות זמנים מפורטים בפגישת הייעוץ הראשונית.',
    },
    {
      question: 'מהו מבנה התמחור שלכם?',
      answer: 'התמחור שלנו מבוסס על פרויקט ותלוי בדרישות הספציפיות שלכם. אנחנו מציעים תמחור שקוף ללא עלויות נסתרות. צרו איתנו קשר לקבלת הצעת מחיר מותאמת לצרכים שלכם.',
    },
    {
      question: 'האם אתם מספקים תמיכה שוטפת?',
      answer: 'כן, אנחנו מציעים חבילות תחזוקה ותמיכה מקיפות כדי להבטיח שהנוכחות הדיגיטלית שלכם תישאר מאובטחת, מעודכנת ופועלת בצורה אופטימלית. הצוות שלנו זמין לכל שאלה או עדכון שתצטרכו.',
    },
    {
      question: 'האם אתם יכולים לעבוד עם אתרים קיימים?',
      answer: 'בהחלט. בין אם אתם צריכים עיצוב מחדש מלא או שיפורים הדרגתיים, אנחנו יכולים לעבוד עם הפלטפורמה הקיימת שלכם. אנחנו מעריכים את המצב הנוכחי וממליצים על הדרך הטובה ביותר להתקדם.',
    },
  ];

  return (
    <section ref={sectionRef} id="faq" dir="rtl" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Line */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.8 }}
      />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p 
            className="text-xs tracking-wider text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            תמיכה
          </motion.p>
          <motion.h2 
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            שאלות נפוצות
          </motion.h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-primary/20 rounded-lg px-6 bg-card/30 data-[state=open]:border-primary/40 data-[state=open]:bg-card/50 transition-all duration-300 hover:border-primary/30"
                >
                  <AccordionTrigger className="text-right text-foreground hover:text-primary hover:no-underline py-6 text-base md:text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed text-right">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
