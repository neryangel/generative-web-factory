import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: 'What services do you offer?',
      answer: 'We provide comprehensive digital solutions including web design, development, branding, SEO optimization, and ongoing maintenance. Our team crafts custom solutions tailored to your specific business needs.',
    },
    {
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on scope and complexity. A standard website typically takes 4-8 weeks, while more complex projects may require 12-16 weeks. We provide detailed timelines during our initial consultation.',
    },
    {
      question: 'What is your pricing structure?',
      answer: 'Our pricing is project-based and depends on your specific requirements. We offer transparent pricing with no hidden fees. Contact us for a free quote tailored to your needs.',
    },
    {
      question: 'Do you provide ongoing support?',
      answer: 'Yes, we offer comprehensive maintenance and support packages to ensure your digital presence remains secure, updated, and performing optimally. Our team is available for any questions or updates you may need.',
    },
    {
      question: 'Can you work with existing websites?',
      answer: 'Absolutely. Whether you need a complete redesign or incremental improvements, we can work with your existing platform. We evaluate your current setup and recommend the best path forward.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Support</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-primary/20 rounded-lg px-6 bg-card/30 data-[state=open]:border-primary/40 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-6 text-base md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
