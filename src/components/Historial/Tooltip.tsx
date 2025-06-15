import React from 'react';
import { TooltipHost, ICalloutProps } from '@fluentui/react';

const tooltipCalloutProps: ICalloutProps = {
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
      wordBreak: 'break-word'
    }
  }
};

type TooltipProps = {
  content: string;
  children: React.ReactElement;
  show?: boolean; // nuevo: opcional, default true
};

const Tooltip: React.FC<TooltipProps> = ({ content, children, show = true }) => (
  <TooltipHost
    content={show ? content : ''} // el trigger siempre existe, solo el texto cambia
    calloutProps={tooltipCalloutProps}
    styles={{
      root: {
        display: 'inline-block',
        maxWidth: 320
      }
    }}
  >
    {children}
  </TooltipHost>
);

export default Tooltip;
