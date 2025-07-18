import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  unreadMessageCounts: {},

  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("messages/users");
      set({ users: res.data.data });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    try {
      if (!messageData?.text && !messageData?.image) return;

      const { selectedUser, messages } = get();
      const res = await axiosInstance.post(
        `/messages/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data.data] });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  },

  getMessages: async () => {
    set({ isMessagesLoading: true });

    try {
      const { selectedUser } = get();

      const res = await axiosInstance.get(`/messages/${selectedUser._id}`);

      set({ messages: res.data.data });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),

  subscribeToMessages: () => {
    const { socket } = useAuthStore.getState();
    const { selectedUser } = get();

    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser._id !== newMessage.senderId) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();

    socket.off("newMessage");
  },

  unreadMessages: () => {
    const { socket } = useAuthStore.getState();

    socket.on("unreadMessages", (unreadMessagesMap) => {
      if (!unreadMessagesMap) return;
      set({ unreadMessageCounts: unreadMessagesMap });
    });
  },

  markMessagesAsSeen: () => {
    const { socket, userAuth } = useAuthStore.getState();

    socket.emit("markMessagesAsSeen", {
      senderId: get().selectedUser?._id,
      receiverId: userAuth?._id,
    });

    set((state) => {
      const newCounts = { ...state.unreadMessageCounts };
      delete newCounts[state.selectedUser?._id];
      return { unreadMessageCounts: newCounts };
    });
  },

  openChat: () => {
    const { socket, userAuth } = useAuthStore.getState();
    socket.emit("openChat", {
      userId: userAuth._id,
      withUserId: get().selectedUser?._id,
    });
  },

  closeChat: () => {
    const { socket, userAuth } = useAuthStore.getState();
    if (!userAuth?._id) return;
    socket.emit("closeChat", userAuth?._id);
  },
}));

export default useChatStore;
