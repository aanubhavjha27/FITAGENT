import { create } from 'zustand'

const useChatStore = create((set) => ({
  messages: [],
  isOpen: false,
  isTyping: false,
  isConnected: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),

  setTyping: (typing) => set({ isTyping: typing }),
  setOpen: (open) => set({ isOpen: open }),
  setConnected: (connected) => set({ isConnected: connected }),
  clearMessages: () => set({ messages: [] }),
}))

export default useChatStore