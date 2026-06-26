import { create } from 'zustand';
import tmdbService from '../services/tmdb.service';
import i18n from '../i18n';

const usePersonStore = create((set) => ({
  person: null,
  isLoading: true,
  error: '',

  fetchPerson: async (id) => {
    if (!id) return;
    set({ isLoading: true, error: '' });
    try {
      const data = await tmdbService.fetchPersonDetails(id);
      set({ person: data });
    } catch (err) {
      console.error('[PersonStore] fetchPerson failed:', err);
      set({ error: i18n.t('error.fetch_details') });
    } finally {
      set({ isLoading: false });
    }
  },

  resetPerson: () => set({ person: null, isLoading: true, error: '' }),
}));

export default usePersonStore;
