
import { Star } from 'lucide-react';

export type TestimonialType = {
  id: string;
  name: string;
  role: string;
  image: string;
  testimonial: string;
  rating: number;
};

interface TestimonialCardProps {
  testimonial: TestimonialType;
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  return (
    <div 
      className="animate-slide-up glass-card p-6 rounded-xl relative"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      <div className="flex gap-4 items-center mb-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/20">
          <img 
            src={testimonial.image}
            alt={testimonial.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{testimonial.name}</h3>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <p className="text-muted-foreground">"{testimonial.testimonial}"</p>
    </div>
  );
};

export default TestimonialCard;
