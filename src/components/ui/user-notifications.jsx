"use client";
// done

import { Link , useNavigate} from 'react-router-dom';
import {  Bell Cross } from "lucide-react";

import { Button } from "./button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "../../src/@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../src/@/components/ui/dropdown-menu";




import React from 'react';

const UserNotifications = () => {
    const notifications = [
        {
            icon: null,
            title: 'Abdul',
            description: 'some description',
            time: 'Apr 18, 8:37',
            isRead: true,
        },
        {
            icon: null,
            title: 'Abdul',
            description: 'some description',
            time: 'Apr 18, 8:37',
            isRead: true,
        },
        {
            icon: null,
            title: 'Abdul',
            description: 'some description',
            time: 'Apr 18, 8:37',
            isRead: true,
        },
        {
            icon: null,
            title: 'Abdul',
            description: 'some description',
            time: 'Apr 18, 8:37',
            isRead: true,
        },
        {
            icon: null,
            title: 'Abdul',
            description: 'some description',
            time: 'Apr 18, 8:37',
            isRead: true,
        },
        {
            icon: null,
            title: 'Abdul',
            description: 'some description',
            time: 'Apr 18, 8:37',
            isRead: true,
        },
        {
            icon: null,
            title: 'Abdul',
            description: 'some description',
            time: 'Apr 18, 8:37',
            isRead: true,
        },
        {
            icon: null,
            title: 'Inam',
            description: 'some description is here...',
            time: 'Apr 18, 8:37',
            isRead: true,
        },
        {
            icon: null,
            title: 'Sakina Burhan',
            description: 'Lorem ipsum dolor sit amet',
            time: 'Apr 18, 8:37',
            isRead: false,
        },
        {
            icon: null,
            title: 'Sakina Burhan',
            description: 'Lorem ipsum dolor sit amet',
            time: 'Apr 18, 8:37',
            isRead: false,
        },
        {
            icon: null,
            title: 'Sakina Burhan',
            description: 'Lorem ipsum dolor sit amet',
            time: 'Apr 18, 8:37',
            isRead: false,
        },
    ];
  
    return (
      <DropdownMenu>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline" size="icon"
                  className="relative w-10 h-10 rounded-full"
                >
                  <Bell className="text-xl" onClick={handleShowNotifications}/>
          
       
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>
  
        <DropdownMenuContent className="w-56 " align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{employee?.account_title}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {employee?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link to="/" className="flex items-center">
                <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link to="/my-profile" className="flex items-center">
                <User className="w-4 h-4 mr-3 text-muted-foreground" />
                Account
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer"  onClick={handleLogout}
                  >
            <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

export default UserNotifications;
