// API Local usando localStorage
class LocalAPI {
  constructor(entityName) {
    this.entityName = entityName;
    this.storageKey = `docu-flow-${entityName}`;
    this.initializeData();
  }

  initializeData() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getAll() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  save(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  async list(orderBy = '-created_date') {
    let items = this.getAll();
    
    // Ordenar por el campo especificado
    const isDescending = orderBy.startsWith('-');
    const field = isDescending ? orderBy.substring(1) : orderBy;
    
    items.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal < bVal) return isDescending ? 1 : -1;
      if (aVal > bVal) return isDescending ? -1 : 1;
      return 0;
    });
    
    return items;
  }

  async create(data) {
    const items = this.getAll();
    const newItem = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_date: new Date().toISOString(),
    };
    items.push(newItem);
    this.save(items);
    return newItem;
  }

  async update(id, data) {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      this.save(items);
      return items[index];
    }
    throw new Error('Item not found');
  }

  async delete(id) {
    let items = this.getAll();
    items = items.filter(item => item.id !== id);
    this.save(items);
    return { success: true };
  }

  async get(id) {
    const items = this.getAll();
    const item = items.find(item => item.id === id);
    if (!item) throw new Error('Item not found');
    return item;
  }
}

// Cliente de API local
export const apiClient = {
  entities: {
    Invoice: new LocalAPI('invoices'),
    DeliveryNote: new LocalAPI('delivery-notes'),
  }
};
