"use client";

import { createContext, useContext, useMemo } from "react";
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
  const value = useMemo<MenuCtx>(
    () => ({ menuItems: initialMenuItems }),
    [initialMenuItems],
  );
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  return useContext(MenuContext);
}
