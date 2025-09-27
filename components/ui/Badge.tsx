
import React from 'react';
import { BadgeName } from '../../types';
import { BADGE_COLORS } from '../../constants';

interface BadgeProps {
  name: BadgeName;
}

const Badge: React.FC<BadgeProps> = ({ name }) => {
  const colorClass = BADGE_COLORS[name] || 'bg-gray-500 text-white';
  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${colorClass}`}>
      {name}
    </span>
  );
};

export default Badge;
