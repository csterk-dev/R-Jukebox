import { useMediaQuery } from "@chakra-ui/react";
import { MOBILE_BREAKPOINT } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDebuggingStateFromStorage, getThemeSeason } from "@utils";
import dayjs from "dayjs";
import { toaster } from "@ui";

const themeSeason = getThemeSeason(dayjs());

const infoToastProps = {
  type: "info" as const,
  duration: 7000,
  closable: true
};


/** ID's are used to ensure that toasts do not duplicate and visually stack. */
const toastIds = {
  bgAnimatedTrue: "asd28gjaqwdkju2",
  bgAnimatedFalse: "hjk238sdhs83qas"
};

interface AppContextType {
  showDevDebugging: boolean;
  isMobile: boolean;
  isBgAnimated: boolean;
  toggleBgAnimated: () => void;
  themeSeason: ThemeSeason
}

const defaultAppContextVal: AppContextType = {
  showDevDebugging: false,
  isMobile: false,
  isBgAnimated: true,
  toggleBgAnimated: () => void 0,
  themeSeason: "none"
};


const AppContext = createContext<AppContextType>(defaultAppContextVal);

/**
 * Manages the app's context.
 */
export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMobile] = useMediaQuery([`(max-width: ${MOBILE_BREAKPOINT}px)`]);
  const showDevDebugging = useMemo<boolean>(() => getDebuggingStateFromStorage(), []);

  const [isBgAnimated, setIsBgAnimated] = useState<AppContextType["isBgAnimated"]>(() => {
    const storedVal = localStorage.getItem("animated_background");
    const parsed = storedVal ? JSON.parse(storedVal) : true;
    return parsed
  });
  const [manualIsBgAnimated, setManualIsBgAnimated] = useState(isMobile);

  // Disabled animated bg by default when mobile device.
  useEffect(() => {
    if (isMobile && !manualIsBgAnimated) setIsBgAnimated(false);
  }, [isMobile, manualIsBgAnimated]);

  useEffect(() => {
    localStorage.setItem("animated_background", `${isBgAnimated}`);
  }, [isBgAnimated]);


  /** Turns on animations for the background. */
  const toggleBgAnimated = useCallback(() => {
    setManualIsBgAnimated(prev => !prev);
    setIsBgAnimated(prev => !prev);

    if (!toaster.isVisible(toastIds.bgAnimatedTrue) && isBgAnimated) {
      toaster.create({
        id: toastIds.bgAnimatedTrue,
        title: "Animations disabled",
        description: "Battery life and performance may increase.",
        ...infoToastProps
      });

    } else if (!toaster.isVisible(toastIds.bgAnimatedFalse) && !isBgAnimated) {
      toaster.create({
        id: toastIds.bgAnimatedFalse,
        title: "Animations enabled",
        description: "This may affect your battery life and performance",
        ...infoToastProps
      });
    }
  }, [isBgAnimated]);


  const appContext: AppContextType = useMemo(() => {
    return {
      showDevDebugging,
      isMobile,
      isBgAnimated,
      toggleBgAnimated,
      themeSeason
    }
  }, [isBgAnimated, isMobile, showDevDebugging, toggleBgAnimated]);

  return (
    <AppContext.Provider value={appContext}>
      {children}
    </AppContext.Provider>
  )
}

/** Allows access to the current app context values and functions. */
export const useAppState = (): AppContextType => useContext(AppContext);