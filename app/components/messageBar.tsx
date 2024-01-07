import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/app/hooks/redux';

const MessageBar: React.FC = () => {
  const messages = useAppSelector(state => state.messages.messages);

  return (
    <div>
      {/* Use AnimatePresence for entering and exiting animations */}
      <AnimatePresence>
        {messages.map((msg, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {msg}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageBar;
