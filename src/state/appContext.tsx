import { useMediaQuery, useToast, UseToastOptions } from "@chakra-ui/react";
import { MOBILE_BREAKPOINT } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";


const infoToastStyle = {
  status: "info" as UseToastOptions["status"],
  variant: "unstyled",
  duration: 10000,
  isClosable: true,
  containerStyle: {
    bg: "#8659EF",
    color: "#ffffff",
    borderRadius: 5
  }
};


/** ID's are used to ensure that toasts do not duplicate and visually stack. */
const toastIds = {
  bgAnimatedTrue: "asd28gjaqwdkju2",
  bgAnimatedFalse: "hjk238sdhs83qas"
};

interface AppContextType {
  isMobile: boolean;
  isBgAnimated: boolean;
  toggleBgAnimated: () => void;
}

const defaultAppContextVal: AppContextType = {
  isMobile: false,
  isBgAnimated: true,
  toggleBgAnimated: () => void 0
};


const AppContext = createContext<AppContextType>(defaultAppContextVal);

/**
 * Manages the app's context.
 */
export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const [isMobile] = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const [isBgAnimated, setIsBgAnimated] = useState<AppContextType["isBgAnimated"]>(true);
  const [manualIsBgAnimated, setManualIsBgAnimated] = useState(isMobile);

  /*
   * Save user's batteries by default
   */
  useEffect(() => {
    if (isMobile && !manualIsBgAnimated) setIsBgAnimated(false);

  }, [isMobile, manualIsBgAnimated]);

  /** Turns on animations for the background. */
  const toggleBgAnimated = useCallback(() => {
    setManualIsBgAnimated(prev => !prev);
    setIsBgAnimated(prev => !prev);

    if (!toast.isActive(toastIds.bgAnimatedTrue) && isBgAnimated) {
      toast({
        id: toastIds.bgAnimatedTrue,
        title: "Animations disabled",
        description: "Battery life and performance may increase.",
        ...infoToastStyle
      });
     
    } else if (!toast.isActive(toastIds.bgAnimatedFalse) && !isBgAnimated) {
      toast({
        id: toastIds.bgAnimatedFalse,
        title: "Animations enabled",
        description: "This may affect your battery life and performance",
        ...infoToastStyle
      });
    }
  }, [isBgAnimated, toast]);


  const appContext: AppContextType = useMemo(() => {
    return {
      isMobile,
      isBgAnimated,
      toggleBgAnimated
    }
  }, [isBgAnimated, isMobile, toggleBgAnimated]);

  return (
    <AppContext.Provider value={appContext}>
      {children}
    </AppContext.Provider>
  )
}

/** Allows access to the current app context values and functions. */
export const useAppState = (): AppContextType => useContext(AppContext);