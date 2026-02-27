export interface NavItem {
  to: string;
  label: string;
  requiredPermissions?: string[];
}

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  {
    to: '/style-guide',
    label: 'Style Guide',
    requiredPermissions: ['view:style-guide', 'admin:access'],
  },
  { to: '/widgets', label: 'Widgets' },
  { to: '/settings', label: 'Settings' },
];
