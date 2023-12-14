import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UrlsState {
  urls: string[];
  add: (urls: string[]) => void;
  reset: () => void;
}

export const useUrlStore = create<UrlsState>()(
  devtools(
    persist(
      (set) => ({
        urls: [],
        reset: () => set({ urls: [] }),
        add: (urls) =>
          set((state) => {
            const currentUrls = state.urls;
            return { urls: [...new Set(currentUrls.concat(urls))] };
          }),
      }),
      { name: "url-extractor.urls" }
    )
  )
);
