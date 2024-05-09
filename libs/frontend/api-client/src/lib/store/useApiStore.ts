import { create } from 'zustand';
import type { ApiSlice } from './slices/createApiSlice';
import { createApiSlice } from './slices/createApiSlice';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type ApiStoreState = ApiSlice;

export const useApiStore = create<ApiStoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...createApiSlice(...a),
      }),
      {
        name: `${window.location.host}:api-storage`,
        storage: createJSONStorage(() => sessionStorage),
        // persist all data but baseURL
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => !['baseURL'].includes(key))
          ),
      }
    ),
    {
      name: 'API Store',
    }
  )
);

export default useApiStore;
