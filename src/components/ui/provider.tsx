import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"
import { system } from "theme"


interface ProviderProps {
  children: ReactNode
}

export const Provider = ({ children }: ProviderProps) => {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}

