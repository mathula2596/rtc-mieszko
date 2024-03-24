"use client";

import { SidebarProvider, useSidebarContext } from "./context/sidebarContext";
import { twMerge } from "tailwind-merge";
import { DashboardNavbar } from "./components/navbar";
import { DashboardSidebar } from "./components/sidebar";
import { SocketContextProvider } from "./context/socketContext";
import { ProfileContextProvider } from "./context/profileContext";

const DashboardLayout = function ({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
};

const DashboardLayoutContent = function ({ children }) {
  const { isCollapsed } = useSidebarContext();

  return (
    <>
      <ProfileContextProvider>
        <SocketContextProvider>
          <DashboardNavbar />
          <div className="mt-16 flex items-start">
            <DashboardSidebar />
            <div
              id="main-content"
              className={twMerge(
                "relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900",
                isCollapsed ? "lg:ml-[4.5rem]" : "lg:ml-64"
              )}
            >
              {children}
            </div>
          </div>
        </SocketContextProvider>
      </ProfileContextProvider>
    </>
  );
};

export default DashboardLayout;
