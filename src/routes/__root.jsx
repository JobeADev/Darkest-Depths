import { useState } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ScrollToTop from "../components/scrollToTop";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import { CharacterContext, EquipmentContext } from "../components/contexts";
import {
  StartingCharacterStats,
  StartingItems,
  StartingEquipment,
  StartingShopInventory,
} from "../components/data";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const characterHook = useState([
    StartingCharacterStats,
    0,
    StartingItems,
    StartingShopInventory,
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
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
