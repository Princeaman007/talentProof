import api from '../utils/api';

const API_BASE_URL = '/talent-days';

export const talentDayService = {
  // Public endpoints
  getAllTalentDays: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.technologie) params.append('technologie', filters.technologie);
    if (filters.type) params.append('type', filters.type);
    if (filters.date) params.append('date', filters.date);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`${API_BASE_URL}${query}`);
  },

  getUpcomingTalentDays: async () => {
    return api.get(`${API_BASE_URL}/upcoming`);
  },

  getPastTalentDays: async () => {
    return api.get(`${API_BASE_URL}/past`);
  },

  getTalentDayById: async (id) => {
    return api.get(`${API_BASE_URL}/${id}`);
  },

  getStatsGeneral: async () => {
    return api.get(`${API_BASE_URL}/stats/general`);
  },

  registerToTalentDay: async (id, registrationData) => {
    return api.post(`${API_BASE_URL}/${id}/register`, registrationData);
  },

  // Admin endpoints
  getAllTalentDaysAdmin: async () => {
    return api.get(`${API_BASE_URL}/admin/all`);
  },

  createTalentDay: async (data) => {
    return api.post(API_BASE_URL, data);
  },

  updateTalentDay: async (id, data) => {
    return api.put(`${API_BASE_URL}/${id}`, data);
  },

  deleteTalentDay: async (id) => {
    return api.delete(`${API_BASE_URL}/${id}`);
  },

  getTalentDayInscriptions: async (id) => {
    return api.get(`${API_BASE_URL}/${id}/inscriptions`);
  },
};

export default talentDayService;
