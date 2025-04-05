
import { Superscript, SquareDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FormattingToolsProps = {
  questionId: string;
  showFormatting: boolean;
  isActiveQuestion: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertFormat: (questionId: string, format: string) => void;
};

const FormattingTools = ({ 
  questionId, 
  showFormatting, 
  isActiveQuestion,
  onOpenChange,
  onInsertFormat 
}: FormattingToolsProps) => {
  
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const renderMathExamples = () => {
    return (
      <div className="mb-4 p-3 border rounded-lg bg-muted/30">
        <h4 className="font-medium text-sm mb-2">Examples:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span>x<sup>2</sup> (Superscript)</span>
          </div>
          <div>
            <span>H<sub>2</sub>O (Subscript)</span>
          </div>
          <div>
            <div className="fraction" style={{display: "inline-block"}}>
              <span className="numerator">a</span>
              <span className="denominator">b</span>
            </div>
            <span> (Fraction)</span>
          </div>
          <div>
            <span className="math-root">
              <span className="math-root-symbol">√</span>
              <span>x</span>
            </span>
            <span> (Square Root)</span>
          </div>
          <div>
            <span>
              <span className="math-root">
                <span className="math-root-symbol">√</span>
                <span>
                  <div className="fraction" style={{display: "inline-block"}}>
                    <span className="numerator">a</span>
                    <span className="denominator">b</span>
                  </div>
                </span>
              </span>
            </span>
            <span> (Root of Fraction)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover 
      open={showFormatting && isActiveQuestion} 
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <SquareDot className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-2">
          <h4 className="font-medium text-sm">Math Formatting</h4>
          
          <Tabs defaultValue="basics">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="roots">Roots</TabsTrigger>
              <TabsTrigger value="symbols">Symbols</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'superscript')}
                >
                  Superscript
                  <span className="ml-1">x<sup>2</sup></span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'subscript')}
                >
                  Subscript
                  <span className="ml-1">H<sub>2</sub>O</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'fraction')}
                >
                  Fraction
                  <span className="ml-1">a/b</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'vector')}
                >
                  Vector
                  <span className="ml-1">→</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'degree')}
                >
                  Degree
                  <span className="ml-1">°</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="roots" className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'sqrt')}
                >
                  Square Root
                  <span className="ml-1">√x</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'cbrt')}
                >
                  Cube Root
                  <span className="ml-1">∛x</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'nthroot')}
                >
                  nth Root
                  <span className="ml-1"><sup>n</sup>√x</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'sqrtfraction')}
                >
                  Root of Fraction
                  <span className="ml-1">√(a/b)</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'radical')}
                >
                  Radical
                  <span className="ml-1">√(a+b)</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="symbols" className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'pi')}
                >
                  Pi
                  <span className="ml-1">π</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'theta')}
                >
                  Theta
                  <span className="ml-1">θ</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'delta')}
                >
                  Delta
                  <span className="ml-1">Δ</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onInsertFormat(questionId, 'infinity')}
                >
                  Infinity
                  <span className="ml-1">∞</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {renderMathExamples()}
          
          <p className="text-xs text-muted-foreground">
            Format will be applied at cursor position or end of text
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FormattingTools;
