import { useMediaQuery, useToast, UseToastOptions } from "@chakra-ui/react";
import { MOBILE_BREAKPOINT } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";


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

interface PlayerContextType {
  isMobile: boolean;
  isBgAnimated: boolean;
  toggleBgAnimated: () => void;
}

const defaultPlayerContextVal: PlayerContextType = {
  isMobile: false,
  isBgAnimated: false,
  toggleBgAnimated: () => void 0
};


const AppContext = createContext<PlayerContextType>(defaultPlayerContextVal);

/**
 * Manage the app context.
 */
export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const [isMobile] = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const [isBgAnimated, setIsBgAnimated] = useState<PlayerContextType["isBgAnimated"]>(isMobile ? false : true);


  /** Turns on animations for the background. */
  const toggleBgAnimated = useCallback(() => {
    setIsBgAnimated(prev => !prev);
    if (!toast.isActive(toastIds.bgAnimatedTrue) && isBgAnimated) {
      toast({
        id: toastIds.bgAnimatedTrue,
        title: "Animations disabled",
        ...infoToastStyle
      });
     
    } else if (!toast.isActive(toastIds.bgAnimatedFalse) && !isBgAnimated) {
      toast({
        id: toastIds.bgAnimatedFalse,
        title: "Animations enabled",
        description: "This may affect your battery life",
        ...infoToastStyle
      });
    }
  }, [isBgAnimated, toast]);


  const playerContext: PlayerContextType = useMemo(() => {
    return {
      isMobile,
      isBgAnimated,
      toggleBgAnimated
    }
  }, [isBgAnimated, isMobile, toggleBgAnimated]);

  return (
    <AppContext.Provider value={playerContext}>
      {children}
    </AppContext.Provider>
  )
}

/** Allows access to the current app context values and functions. */
export const useAppState = (): PlayerContextType => useContext(AppContext);