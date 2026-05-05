import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const styles = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-400">{label}</label>}
      <input className="input-field" {...props} />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const Card = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
