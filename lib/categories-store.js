// Shared in-memory store for categories (replace with actual database later)
let categories = [
  { _id: '1', name: 'Technology', slug: 'technology', createdAt: new Date('2024-01-01') },
  { _id: '2', name: 'Sports', slug: 'sports', createdAt: new Date('2024-01-02') },
  { _id: '3', name: 'Politics', slug: 'politics', createdAt: new Date('2024-01-03') },
  { _id: '4', name: 'Entertainment', slug: 'entertainment', createdAt: new Date('2024-01-04') },
];

export const categoriesStore = {
  getAll: () => categories,
  
  findById: (id) => categories.find(cat => cat._id === id),
  
  findByName: (name) => categories.find(cat => 
    cat.name.toLowerCase() === name.toLowerCase()
  ),
  
  create: (categoryData) => {
    const newCategory = {
      _id: Date.now().toString(),
      ...categoryData,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      createdAt: new Date(),
    };
    categories.push(newCategory);
    return newCategory;
  },
  
  update: (id, updateData) => {
    const index = categories.findIndex(cat => cat._id === id);
    if (index === -1) return null;
    
    categories[index] = {
      ...categories[index],
      ...updateData,
      slug: updateData.name ? updateData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : categories[index].slug,
      updatedAt: new Date(),
    };
    return categories[index];
  },
  
  delete: (id) => {
    const index = categories.findIndex(cat => cat._id === id);
    if (index === -1) return null;
    
    return categories.splice(index, 1)[0];
  },
  
  exists: (name, excludeId = null) => {
    return categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && 
      (excludeId ? cat._id !== excludeId : true)
    );
  }
};
