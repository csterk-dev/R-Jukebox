import { useMediaQuery, useToast, UseToastOptions } from "@chakra-ui/react";
import { MOBILE_BREAKPOINT } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDebuggingStateFromStorage, getThemeSeason } from "../utils/misc";
import dayjs from "dayjs";

const themeSeason = getThemeSeason(dayjs());

const infoToastProps = {
  status: "info" as UseToastOptions["status"],
  variant: "info",
  duration: 7000,
  isClosable: true
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
  const toast = useToast();
  const [isMobile] = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
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

    if (!toast.isActive(toastIds.bgAnimatedTrue) && isBgAnimated) {
      toast({
        id: toastIds.bgAnimatedTrue,
        title: "Animations disabled",
        description: "Battery life and performance may increase.",
        ...infoToastProps
      });

    } else if (!toast.isActive(toastIds.bgAnimatedFalse) && !isBgAnimated) {
      toast({
        id: toastIds.bgAnimatedFalse,
        title: "Animations enabled",
        description: "This may affect your battery life and performance",
        ...infoToastProps
      });
    }
  }, [isBgAnimated, toast]);


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