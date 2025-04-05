
import { useEffect } from 'react';

const MathStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .math-root {
        position: relative;
        display: inline-flex;
        align-items: center;
      }
      .math-root:before {
        content: "";
        border-top: 1px solid currentColor;
        position: absolute;
        top: 0;
        left: 0.7em;
        right: 0;
      }
      .math-root-symbol {
        margin-right: 2px;
      }
      .fraction {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        margin: 0 0.2em;
      }
      .numerator, .denominator {
        display: block;
      }
      .numerator {
        border-bottom: 1px solid;
        padding: 0 3px;
      }
      .denominator {
        padding: 0 3px;
      }
      sup {
        vertical-align: super;
        font-size: smaller;
      }
      sub {
        vertical-align: sub;
        font-size: smaller;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default MathStyles;
