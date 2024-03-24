import { useSidebarContext } from "../context/sidebarContext";
import { Sidebar } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import {
    HiUser,
    HiViewBoards,
    HiEye
} from "react-icons/hi";
import { usePathname } from 'next/navigation';
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { ProfileContext } from "../context/profileContext";


const SidebarItem  = ({ href, icon, children }) => {
    
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <Sidebar.Item href={href} icon={icon} className={ isActive ? "active-sidebar mb-3":"mb-3"}>
            {children}
        </Sidebar.Item>
    );
};

export const DashboardSidebar  = function () {
    const { isCollapsed } = useSidebarContext();
    const [role,setRole] = useState();
    const {profile} = useContext(ProfileContext);
    useEffect(() => {
        setRole(profile.userType)
      }, []);
    

      
    return (
        <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            collapsed={isCollapsed}
            id="sidebar"
            className={twMerge(
                "fixed inset-y-0 left-0 z-20 mt-16 flex h-full shrink-0 flex-col border-r border-gray-200 duration-75 dark:border-gray-700 lg:flex",
                isCollapsed && "hidden w-16",
            )}
        >
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    {role==="Super"?(
                        <SidebarItem href="/users" icon={HiUser}>
                            Users
                        </SidebarItem>
                    ):(null)}
                    
                    <SidebarItem href="/rtc" icon={HiViewBoards}>
                        RTC
                    </SidebarItem>
                    <SidebarItem href="/users/change-password" icon={HiEye}>
                        Change Password
                    </SidebarItem>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};
