import * as LucideIcons from 'lucide-react';

export default function Ic({ name, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  const Icon = LucideIcons[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
