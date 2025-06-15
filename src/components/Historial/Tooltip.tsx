// import React from 'react';
// import { TooltipHost, ICalloutProps } from '@fluentui/react';

// const tooltipCalloutProps: ICalloutProps = {
//   gapSpace: 8,
//   isBeakVisible: false,
//   setInitialFocus: false,
//   styles: {
//     root: {
//       background: '#fff',
//       borderRadius: 12,
//       boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
//       border: '1px solid #e0e0e0',
//       padding: 12,
//       fontFamily: 'monospace',
//       fontSize: 15,
//       color: '#222',
//       maxWidth: 320,
//       whiteSpace: 'pre-line',
//       wordBreak: 'break-word'
//     }
//   }
// };

// type TooltipProps = {
//   content: string;
//   children: React.ReactElement;
//   show?: boolean; // nuevo: opcional, default true
// };

// const Tooltip: React.FC<TooltipProps> = ({ content, children, show = true }) => (
//   <TooltipHost
//     content={show ? content : ''} // el trigger siempre existe, solo el texto cambia
//     calloutProps={tooltipCalloutProps}
//     styles={{
//       root: {
//         display: 'inline-block',
//         maxWidth: 320
//       }
//     }}
//   >
//     {children}
//   </TooltipHost>
// );

// export default Tooltip;


import React, { useRef, useState } from 'react';
import { Callout, DirectionalHint } from '@fluentui/react';

const tooltipCalloutProps = {
  gapSpace: 8,
  isBeakVisible: false,
  setInitialFocus: false,
  styles: {
    root: {
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      border: '1px solid #e0e0e0',
      padding: 12,
      fontFamily: 'monospace',
      fontSize: 15,
      color: '#222',
      maxWidth: 320,
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      zIndex: 3000,
      userSelect: 'text'
    }
  }
};

type TooltipProps = {
  content: string;
  children: React.ReactElement;
  show?: boolean;
  graciaMs?: number;
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  show = true,
  graciaMs = 500
}) => {
  const [visible, setVisible] = useState(false);
  const [overTooltip, setOverTooltip] = useState(false);
  const [yaEntroTooltip, setYaEntroTooltip] = useState(false);
  const graciaTimeout = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLSpanElement | null>(null);

  const clearGraceTimeout = () => {
    if (graciaTimeout.current) {
      clearTimeout(graciaTimeout.current);
      graciaTimeout.current = null;
    }
  };

  const openTooltip = () => {
    if (show) {
      setVisible(true);
      setYaEntroTooltip(false);
      clearGraceTimeout();
      graciaTimeout.current = setTimeout(() => {
        if (!yaEntroTooltip) setVisible(false);
      }, graciaMs);
    }
  };

  const handleTriggerEnter = () => {
    if (!visible) {
      openTooltip();
    } else {
      clearGraceTimeout();
    }
  };

  const handleTriggerLeave = () => {
    if (!overTooltip && visible) {
      clearGraceTimeout();
      graciaTimeout.current = setTimeout(() => {
        if (!yaEntroTooltip) setVisible(false);
      }, graciaMs);
    }
  };

  const handleTooltipEnter = () => {
    setOverTooltip(true);
    setYaEntroTooltip(true);
    clearGraceTimeout();
  };

  const handleTooltipLeave = () => {
    setOverTooltip(false);
    setVisible(false);
    clearGraceTimeout();
  };

  React.useEffect(() => {
    return () => {
      clearGraceTimeout();
    };
  }, []);

  return (
    <>
      <span
        ref={targetRef}
        style={{ display: 'inline-block', maxWidth: 320, outline: 'none' }}
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={handleTriggerLeave}
        aria-describedby={visible ? 'custom-tooltip' : undefined}
      >
        {children}
      </span>
      {visible && (
        <Callout
          target={targetRef.current}
          {...tooltipCalloutProps}
          directionalHint={DirectionalHint.bottomCenter}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
          setInitialFocus={false}
        >
          <div id='custom-tooltip' style={{ maxWidth: 320, userSelect: 'text' }}>
            {content}
          </div>
        </Callout>
      )}
    </>
  );
};

export default Tooltip;
