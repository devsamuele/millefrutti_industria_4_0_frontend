
import Drawer from "./components/ui/Drawer/Drawer";
import Layout from "./components/ui/layout/Layout";
import { Routes, Route, useLocation, Navigate, NavLink } from "react-router-dom";
import Pasteurizer from "./components/app/pages/pasteurizer/List/Home";
import Spindryer from "./components/app/pages/spinDryer/List/Home";
import { AnimatePresence } from "framer-motion"
import { useContext } from "react";
import AppBar from "./components/ui/AppBar/AppBar";
import { MdMenu } from "react-icons/md";
import ThemeContex from "./context/theme";
import { isMobile } from "./utils/utils";
import Main from "./components/ui/Main/Main";

const App = () => {
  const redirect = true
  const location = useLocation()
  const { showDrawer, setShowDrawer, currentBreakpoint } = useContext(ThemeContex)
  const menuClasses = `py-2 px-4 rounded-tr-full rounded-br-full flex items-center gap-4 hover:bg-slate-100 hover: cursor-pointer transition-colors ease-in duration-150`

  return (
    < Layout >
      <AppBar>
        <div className="px-4 py-1 min-h-[49px] bg-white flex items-center justify-between border-b border-slate-300">
          <div className="flex items-center gap-4">
            <button onClick={() => { setShowDrawer((prevState) => !prevState) }} className="flex items-center justify-center text-2xl p-2 hover:bg-black hover:bg-opacity-10 active:bg-opacity-20 transition-colors ease-in duration-150 rounded-full">
              <MdMenu />
            </button>
            <span className="text-2xl">Millefrutti</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-slate-500">v1.0 by Cash srl</span>
          </div>
        </div>
      </AppBar>
      <Drawer show={showDrawer} setShow={setShowDrawer}>
        <div>ok</div>
        <Drawer.Desktop>
          <div className={`w-full h-full bg-white ${!isMobile(currentBreakpoint) ? "border-r border-slate-300" : ""}`}>
            <ul className="pt-2 pr-8 w-full flex flex-col">
              <NavLink to="centrifuga" className={({ isActive }) => {
                return isActive ? `bg-slate-200 hover:bg-slate-200 shadow-sm ${menuClasses}` : menuClasses
              }}>
                <span>Centrifuga</span>
              </NavLink>
              <NavLink to="pastorizzatore" className={({ isActive }) => {
                return isActive ? `bg-slate-200 hover:bg-slate-200 shadow-sm ${menuClasses}` : menuClasses
              }}>
                <span>Pastorizzatore</span>
              </NavLink>
            </ul>
          </div>
        </Drawer.Desktop>
        <Drawer.Mobile>
          <div className={`w-full h-full bg-white ${!isMobile(currentBreakpoint) ? "border-r border-slate-300" : ""}`}>
            <div className="flex items-center px-4 text-xl h-[49px] border-b">Millefrutti</div>
            <ul className="pt-2 pr-8 w-full flex flex-col">
              <NavLink onClick={() => { setShowDrawer(false) }} to="centrifuga" className={({ isActive }) => {
                return isActive ? `bg-slate-200 hover:bg-slate-200 shadow-sm ${menuClasses}` : menuClasses
              }}>
                <span>Centrifuga</span>
              </NavLink>
              <NavLink onClick={() => { setShowDrawer(false) }} to="pastorizzatore" className={({ isActive }) => {
                return isActive ? `bg-slate-200 hover:bg-slate-200 shadow-sm ${menuClasses}` : menuClasses
              }}>
                <span>Pastorizzatore</span>
              </NavLink>
            </ul>
          </div>
        </Drawer.Mobile>
      </Drawer>
      <Main>
        <AnimatePresence exitBeforeEnter initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path={"/centrifuga"} element={<Spindryer />} />
            <Route path={"/pastorizzatore"} element={<Pasteurizer />} />
            <Route path={"*"} element={redirect && <Navigate replace to={"/centrifuga"} />} />
          </Routes>
        </AnimatePresence>
      </Main>
    </Layout >
  );
}
export default App;
