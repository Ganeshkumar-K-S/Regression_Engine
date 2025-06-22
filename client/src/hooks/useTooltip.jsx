// hooks/useTooltip.jsx
import { useState, useRef, useCallback } from 'react';

export default function useTooltip() {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null);

  const showTooltip = useCallback((el, content) => {
    if (!el || !content) return;

    // Check if the text is actually truncated (ellipsis)
    const textElement = el.querySelector('span') || el;
    const isTextTruncated = textElement.scrollWidth > textElement.clientWidth;
    
    if (isTextTruncated) {
      const rect = el.getBoundingClientRect();
      
      setTooltipStyle({
        top: `${rect.top - 45}px`,
        left: `${rect.left + rect.width / 2}px`,
      });
      setTooltipContent(content);
      setVisible(true);
    }
  }, []);

  const hideTooltip = useCallback(() => {
    setVisible(false);
    setTooltipContent('');
  }, []);

  const Tooltip = () =>
    visible && tooltipContent && (
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          backgroundColor: '#7c3aed', // Purple-600
          color: 'white',
          pointerEvents: 'none',
          ...tooltipStyle,
        }}
        className="px-3 py-2 text-sm font-medium rounded-lg shadow-lg transition-all duration-200 opacity-100"
        role="tooltip"
      >
        {tooltipContent}
        {/* Arrow pointing down */}
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #7c3aed'
          }}
        />
      </div>
    );

  return { showTooltip, hideTooltip, Tooltip };
}