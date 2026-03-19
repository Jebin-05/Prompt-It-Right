import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Card = ({ className, children, title, description }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-6 space-y-1">
          {title && <h3 className="text-xl font-semibold text-zinc-100">{title}</h3>}
          {description && <p className="text-sm text-zinc-400">{description}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
};
