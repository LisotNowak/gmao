// SocketContext.tsx
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getDefaultStore } from "jotai";
import { io, type Socket } from "socket.io-client";
import { serverReachableAtom } from "../stores/networkAtom";

const SocketContext = createContext<Socket | null>(null);
const jotaiStore = getDefaultStore();

export const SocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("/", { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connecté", newSocket.id);
      jotaiStore.set(serverReachableAtom, true);
    });

    newSocket.on("disconnect", () => {
      jotaiStore.set(serverReachableAtom, false);
    });

    newSocket.on("connect_error", () => {
      jotaiStore.set(serverReachableAtom, false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
