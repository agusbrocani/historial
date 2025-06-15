import React, { useRef, useState, useEffect } from 'react';
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
  /** Se disparan tanto al entrar/salir del trigger como del callout */
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const CustomTooltip: React.FC<TooltipProps> = ({
  content,
  children,
  show = true,
  graciaMs = 400,
  onMouseEnter,
  onMouseLeave
}) => {
  const [visible, setVisible] = useState(false);

  // refs para estado real en timeouts
  const overTriggerRef = useRef(false);
  const overTooltipRef = useRef(false);
  const graciaTimeout = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLSpanElement | null>(null);

  const clearGraceTimeout = () => {
    if (graciaTimeout.current) {
      clearTimeout(graciaTimeout.current);
      graciaTimeout.current = null;
    }
  };

  const handleTriggerEnter = () => {
    if (!show) return;
    overTriggerRef.current = true;
    setVisible(true);
    clearGraceTimeout();
    onMouseEnter?.();
  };

  const handleTriggerLeave = () => {
    overTriggerRef.current = false;
    clearGraceTimeout();
    graciaTimeout.current = setTimeout(() => {
      if (!overTooltipRef.current && !overTriggerRef.current) {
        setVisible(false);
        onMouseLeave?.();
      }
    }, graciaMs);
  };

  const handleTooltipEnter = () => {
    overTooltipRef.current = true;
    clearGraceTimeout();
    onMouseEnter?.();
  };

  const handleTooltipLeave = () => {
    overTooltipRef.current = false;
    // cerrar inmediatamente si ya no estamos en trigger
    if (!overTriggerRef.current) {
      setVisible(false);
      onMouseLeave?.();
    }
    clearGraceTimeout();
  };

  // limpiar al desmontar
  useEffect(() => {
    return () => {
      clearGraceTimeout();
    };
  }, []);

  // si visible cambia a false, reseteo refs
  useEffect(() => {
    if (!visible) {
      overTriggerRef.current = false;
      overTooltipRef.current = false;
    }
  }, [visible]);

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
          directionalHint={DirectionalHint.bottomCenter}
          {...tooltipCalloutProps}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
          setInitialFocus={false}
        >
          <div id="custom-tooltip" style={{ maxWidth: 320, userSelect: 'text' }}>
            {content}
          </div>
        </Callout>
      )}
    </>
  );
};

export default CustomTooltip;
