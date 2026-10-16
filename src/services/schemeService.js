/**
 * VidyaPath Scheme Service
 * Manages database persistence, CRUD, filtering and search for scholarships.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/schemes.json');

class SchemeService {
  constructor() {
    this.schemes = [];
    this.loadSchemes();
  }

  loadSchemes() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.schemes = JSON.parse(raw);
      } else {
        this.schemes = [];
      }
    } catch (err) {
      console.error('Error loading schemes dataset:', err);
      this.schemes = [];
    }
  }

  saveSchemes() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.schemes, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error saving schemes dataset:', err);
      return false;
    }
  }

  getAll(filters = {}) {
    let result = [...this.schemes];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }

    if (filters.category_type) {
      result = result.filter(s => s.category_type === filters.category_type);
    }

    if (filters.state && filters.state !== 'All India') {
      result = result.filter(s => {
        const states = s.criteria?.states || ['All India'];
        return states.includes('All India') || states.includes(filters.state);
      });
    }

    if (filters.education_level && filters.education_level !== 'All') {
      result = result.filter(s => {
        const levels = s.criteria?.education_levels || ['All'];
        return levels.includes('All') || levels.includes(filters.education_level);
      });
    }

    return result;
  }

  getById(id) {
    return this.schemes.find(s => s.id === id) || null;
  }

  create(schemeData) {
    const newId = schemeData.id || `SCH-${Date.now().toString(36).toUpperCase()}`;
    const newScheme = {
      ...schemeData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    this.schemes.unshift(newScheme);
    this.saveSchemes();
    return newScheme;
  }

  update(id, updatedFields) {
    const idx = this.schemes.findIndex(s => s.id === id);
    if (idx === -1) return null;

    this.schemes[idx] = {
      ...this.schemes[idx],
      ...updatedFields,
      id, // ensure ID cannot be altered
      updatedAt: new Date().toISOString()
    };
    this.saveSchemes();
    return this.schemes[idx];
  }

  delete(id) {
    const idx = this.schemes.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.schemes.splice(idx, 1);
    this.saveSchemes();
    return true;
  }

  getStats() {
    const total = this.schemes.length;
    const centralGov = this.schemes.filter(s => s.category_type === 'Central Government').length;
    const stateGov = this.schemes.filter(s => s.category_type === 'State Government').length;
    const corporateCsr = this.schemes.filter(s => s.category_type === 'Corporate CSR' || s.category_type === 'Private Trust').length;

    const totalAidAvailable = this.schemes.reduce((acc, s) => acc + (s.award_amount_num || 0), 0);
    const avgAid = total > 0 ? Math.round(totalAidAvailable / total) : 0;

    return {
      totalSchemes: total,
      centralGov,
      stateGov,
      corporateCsr,
      totalAidAvailable,
      avgAid
    };
  }
}

module.exports = new SchemeService();
