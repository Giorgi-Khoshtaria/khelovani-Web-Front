"use client";

import { createContext, useContext } from "react";
import type { MenuItem } from "@/apiCalls/menu/menu.req";

interface MenuCtx {
  menuItems: MenuItem[];
}

const MenuContext = createContext<MenuCtx>({
  menuItems: [],
});

export function MenuProvider({
  initialMenuItems,
  children,
}: {
  initialMenuItems: MenuItem[];
  children: React.ReactNode;
}) {
  return (
    <MenuContext.Provider value={{ menuItems: initialMenuItems }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
