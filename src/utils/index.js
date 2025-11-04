export function createPageUrl(pageName) {
  const routes = {
    Dashboard: '/dashboard',
    Invoices: '/invoices',
    DeliveryNotes: '/delivery-notes',
  };
  return routes[pageName] || '/';
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
