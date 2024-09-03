"use client"

import React from "react"
import { Link } from "react-router-dom"
import { Ellipsis } from "lucide-react"

import { cn } from "../../src/@/lib/utils"
import getMenuList from "../../src/@/lib/menu-list"
import { Button } from "./button"
import { ScrollArea } from "../../src/@/components/ui/scroll-area"
import { CollapseMenuButton } from "../../components/ui/collapse-menu-button"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "../../src/@/components/ui/tooltip"

const Menu = ({ isOpen, userRole }) => {

  const pathname = window.location.pathname; // Get the current pathname
  const menuList = getMenuList(pathname, userRole?.userRole) || [];

  console.log(menuList, "MENU LIST IS THIS")

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="w-full h-full ">
      <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 ">
        {menuList?.map(({groupLabel, menus}, index)=> console.log(menus, "MENUS YE HAI"))}
    {menuList.map(({ groupLabel, menus }, index) => (
      <li className={cn("w-full", groupLabel ? "" : "")} key={index}>
        {(isOpen && groupLabel) || isOpen === undefined ? (
          <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
            {groupLabel}
          </p>
        ) : !isOpen && isOpen !== undefined && groupLabel ? (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger className="w-full">
                <div className="flex items-center justify-center w-full">
                  <Ellipsis className="w-5 h-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{groupLabel}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p className="pb-2"></p>
        )}
        {menus && menus.map(({to, label, icon: Icon, active, submenus}, index)=> console.log(label, submenus, "LABEL SUBMENUS"))}
        {menus &&
          menus.map(({ to, label, icon: Icon, active, submenus }, index) =>
            submenus && submenus.length > 0 ? (
              <div className="w-full " key={index}>
                <CollapseMenuButton
                  icon={Icon}
                  label={label}
                  active={active}
                  submenus={submenus}
                  isOpen={isOpen}
                  userRole={userRole}
                />
              </div>
            ) : (
              <div className="w-full" key={index}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        className={cn(
                          "justify-start w-full h-10 mb-1  hover:bg-plum-500 hover:text-plum-900",
                          active ? "bg-[#fdf7fd] text-plum-1100 rounded-full" : "",
                         
                            isOpen
                            ? "w-full" : "w-[75%]"
                         
                        )}
                        asChild
                      >
                        <Link to={to} className="px-2 hover:bg-plum-500">
                          <span className={cn(isOpen === false ? "" : "mr-4")}>
                            <Icon size={18} />
                          </span>
                          <p
                            className={cn(
                              "max-w-[200px] truncate",
                              isOpen === false
                                ? "-translate-x-96 opacity-0"
                                : "translate-x-0 opacity-100"
                            )}
                          >
                            {label}
                          </p>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    {isOpen === false && (
                      <TooltipContent side="right">{label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            )
          )}
       
      </li>
    ))}
  </ul>
      </nav>
    </ScrollArea>
  )
}

export default Menu;

