
import { ChakraProvider } from "@chakra-ui/react";
import { PageBackground } from "components/atoms/PageBackground";
import { PageHeader } from "components/atoms/PageHeader";
import { theme } from "theme/styles";


export const App = () => {


  return (
    <ChakraProvider theme={theme}>
      <PageBackground>
        <PageHeader />
      </PageBackground>
    </ChakraProvider>
  )
}
