import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { Image, Send, X } from "lucide-react";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContext = createContext();

export default function Chat({ children }) {
  const {
    isMessagesLoading,
    messages,
    getMessages,
    selectedUser,
    setSelectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
    markMessagesAsSeen,
    openChat,
    closeChat,
  } = useChatStore();
  const { userAuth } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(
    function () {
      async function fetchMessages() {
        await getMessages();
      }
      openChat();

      fetchMessages();
      subscribeToMessages();
      markMessagesAsSeen();

      return () => {
        unsubscribeFromMessages();
        closeChat();
      };
    },
    [
      getMessages,
      selectedUser,
      subscribeToMessages,
      unsubscribeFromMessages,
      markMessagesAsSeen,
      openChat,
      closeChat,
    ]
  );

  useEffect(
    function () {
      if (messageEndRef.current && messages)
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages]
  );

  return (
    <ChatContext.Provider
      value={{
        isMessagesLoading,
        messages,
        getMessages,
        sendMessage,
        selectedUser,
        setSelectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
        userAuth,
        messageEndRef,
      }}
    >
      <div className="flex-1 flex flex-col overflow-auto">{children}</div>
    </ChatContext.Provider>
  );
}

Chat.Header = function ChatHeader() {
  const { selectedUser, setSelectedUser } = useContext(ChatContext);
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {/* {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} */}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

Chat.Body = function ChatBody() {
  const { isMessagesLoading, messages, selectedUser, userAuth, messageEndRef } =
    useContext(ChatContext);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <MessageSkeleton />
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={` chat ${
            message.senderId === userAuth._id ? "chat-end" : "chat-start"
          }`}
          ref={messageEndRef}
        >
          <div className=" chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={
                  message.senderId === userAuth._id
                    ? userAuth.profilePic || "/avatar.png"
                    : selectedUser.profilePic || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>
          <div
            className={`chat-bubble flex flex-col ${
              message.senderId === userAuth._id
                ? "bg-primary text-black"
                : "bg-base-200 text-black"
            }`}
          >
            {message.image && (
              <img
                src={message.image}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
              />
            )}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

const initialState = {
  messageText: "",
  imagePreview: null,
};

function reduce(state, action) {
  switch (action?.type) {
    case "setImagePreview":
      return { ...state, imagePreview: action.payload };
    case "setMessageText":
      return { ...state, messageText: action.payload };
    default:
      return initialState;
  }
}

Chat.input = function ChatInput() {
  const { sendMessage } = useContext(ChatContext);
  const [state, dispatch] = useReducer(reduce, initialState);

  const message = { text: state.messageText, image: state.imagePreview };

  const fileInputRef = useRef();
  function removeImage() {
    dispatch({ type: "setImagePreview", payload: null });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      dispatch({ type: "setImagePreview", payload: reader.result });
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    await sendMessage(message);

    dispatch();
  }

  return (
    <div className="p-4 w-full">
      {state.imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={state.imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form className="flex items-center gap-2" onSubmit={handleSubmitForm}>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={state.messageText}
            onChange={(e) =>
              dispatch({ type: "setMessageText", payload: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${
                       state.imagePreview ? "text-emerald-500" : "text-zinc-400"
                     }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button type="submit" className="btn btn-sm btn-circle">
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
