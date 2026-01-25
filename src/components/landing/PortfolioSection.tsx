import { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}

const PortfolioSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const projects: Project[] = [
    { id: 1, title: 'Luxury Resort', category: 'Hospitality', image: '/placeholder.svg' },
    { id: 2, title: 'Fashion Brand', category: 'E-Commerce', image: '/placeholder.svg' },
    { id: 3, title: 'Tech Startup', category: 'SaaS', image: '/placeholder.svg' },
    { id: 4, title: 'Restaurant Chain', category: 'Food & Beverage', image: '/placeholder.svg' },
    { id: 5, title: 'Real Estate', category: 'Property', image: '/placeholder.svg' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      
      // Update index for dots
      const newIndex = Math.round(newScrollLeft / scrollAmount);
      setCurrentIndex(Math.max(0, Math.min(newIndex, projects.length - 1)));
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-background relative overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Our Work</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
              Exclusive Portfolio
            </h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-full w-12 h-12"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-full w-12 h-12"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Carousel */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* Spacer for first item */}
        <div className="flex-shrink-0 w-[calc((100vw-1280px)/2)]" />
        
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="flex-shrink-0 w-80 md:w-96 group"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative bg-card border border-primary/10 rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/40">
              {/* Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-muted to-background relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                {/* Project Number */}
                <span className="absolute top-4 left-4 text-xs uppercase tracking-wider text-muted-foreground">
                  0{index + 1}
                </span>
                
                {/* Link Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm">
                  <ExternalLink className="w-4 h-4 text-primary" />
                </div>
              </div>
              
              {/* Info */}
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-primary mb-2">{project.category}</p>
                <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
        
        {/* Spacer for last item */}
        <div className="flex-shrink-0 w-[calc((100vw-1280px)/2)]" />
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-8">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: index * 400, behavior: 'smooth' });
                setCurrentIndex(index);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-primary w-8' : 'bg-primary/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection;
