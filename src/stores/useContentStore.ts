import { create } from "@/modules";
import { MainContent } from "@/utils";

export const useContentStore = create<{
  currentContent: MainContent;
  setCurrentContent: (content: MainContent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}>((set) => ({
  currentContent: MainContent.PLAYER,
  setCurrentContent: (content: MainContent) => set({ currentContent: content }),
  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
