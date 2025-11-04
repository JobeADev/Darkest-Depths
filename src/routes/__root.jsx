import { useState } from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ScrollToTop from "../components/scrollToTop";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import { CharacterContext, EquipmentContext } from "../components/contexts";
import {
  StartingCharacterStats,
  StartingStatTotals,
  StartingItems,
  StartingEquipment,
  StartingShopInventory,
} from "../components/data";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const characterHook = useState([
    StartingCharacterStats,
    location.pathname === "/" ? 0 : 1,
    StartingItems,
    StartingShopInventory,
    StartingStatTotals,
  ]);
  const equipmentHook = useState(StartingEquipment);

  return (
    <>
      <CharacterContext value={characterHook}>
        <EquipmentContext value={equipmentHook}>
          <ScrollToTop />
          <NavBar />
          <Outlet />
          <Footer />
        </EquipmentContext>
      </CharacterContext>
      {/* <TanStackRouterDevtools /> */}
      {/* <ReactQueryDevtools /> */}
    </>
  );
}
