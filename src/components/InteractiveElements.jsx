import React, { useState, useRef, useEffect } from 'react';
import styles from './InteractiveElements.module.css';

// Botão com ondas de clique (ripple effect)
export function RippleButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef();

  const createRipple = (e) => {
    if (disabled) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple após animação
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    onClick?.(e);
  };

  const variantClass = {
    primary: styles.primary,
    secondary: styles.secondary,
    accent: styles.accent,
    ghost: styles.ghost
  }[variant];

  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  }[size];

  return (
    <button
      ref={buttonRef}
      className={`${styles.rippleButton} ${variantClass} ${sizeClass} ${disabled ? styles.disabled : ''} ${className}`}
      onMouseDown={createRipple}
      disabled={disabled}
      {...props}
    >
      {children}
      <div className={styles.rippleContainer}>
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size
            }}
          />
        ))}
      </div>
    </button>
  );
}

// Input com animações suaves
export function AnimatedInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  success,
  icon,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''} ${success ? styles.success : ''}`}>
        {icon && <div className={styles.inputIcon}>{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={styles.input}
          {...props}
        />
        {label && (
          <label className={`${styles.label} ${(isFocused || hasValue) ? styles.labelFloating : ''}`}>
            {label}
          </label>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
      {success && <span className={styles.successMessage}>{success}</span>}
    </div>
  );
}

// Toast/Notificação
export function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  isVisible = true 
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeClass = {
    info: styles.toastInfo,
    success: styles.toastSuccess,
    warning: styles.toastWarning,
    error: styles.toastError
  }[type];

  return (
    <div className={`${styles.toast} ${typeClass}`}>
      <div className={styles.toastContent}>
        <span className={styles.toastMessage}>{message}</span>
        <button onClick={onClose} className={styles.toastClose}>×</button>
      </div>
      <div className={styles.toastProgress} style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
}

// Progress Bar animada
export function ProgressBar({ 
  value = 0, 
  max = 100,
  animated = true,
  showLabel = true,
  color = '#4ecdc4',
  className = ''
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`${styles.progressContainer} ${className}`}>
      {showLabel && (
        <div className={styles.progressLabel}>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressBar} ${animated ? styles.animated : ''}`}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}

// Switch/Toggle animado
export function AnimatedSwitch({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  className = ''
}) {
  const sizeClass = {
    small: styles.switchSmall,
    medium: styles.switchMedium,
    large: styles.switchLarge
  }[size];

  return (
    <label className={`${styles.switchContainer} ${disabled ? styles.disabled : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.switchInput}
      />
      <div className={`${styles.switch} ${sizeClass} ${checked ? styles.checked : ''}`}>
        <div className={styles.switchHandle} />
      </div>
      {label && <span className={styles.switchLabel}>{label}</span>}
    </label>
  );
}

export default RippleButton;
