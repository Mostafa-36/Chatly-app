import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";

import Chat from "../components/Chat";
import useChatStore from "../store/useChatStore";
import { useEffect } from "react";

function HomePage() {
  const { selectedUser, unreadMessages, unreadMessageCounts } = useChatStore();

  useEffect(
    function () {
      unreadMessages();
    },
    [unreadMessages]
  );
  console.log(unreadMessageCounts);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {selectedUser ? (
              <Chat>
                <Chat.Header />
                <Chat.Body />
                <Chat.input />
              </Chat>
            ) : (
              <NoChatSelected />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
