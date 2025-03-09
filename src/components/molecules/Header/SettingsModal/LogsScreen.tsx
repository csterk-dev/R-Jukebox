import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react"
import { FC } from "react"
import { Placeholder } from "components/atoms/Placeholder"
import dayjs from "dayjs"
import { HiExclamationTriangle, HiInformationCircle, HiMiniCodeBracket, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2"

type LogsScreenProps = {
  entryLogs: EntryLog[];
}

export const LogsScreen: FC<LogsScreenProps> = ({ entryLogs }) => {
  return (
    <Flex flexDirection="column" maxHeight="483px">
      <Heading fontSize={18} px="20px" py="10px">Entry Logs</Heading>
      <VStack
        align="flex-start"
        fontSize="16px"
        gap="10px"
        overflowY="auto"
        pb="10px"
        px="20px"
      >
        {!entryLogs.length ?
          <Placeholder
            alignSelf="center"
            icon={HiMiniCodeBracket}
            mb="20px"
            title="Info & Error logs will appear here"
          /> :
          <>
            <Text
              fontSize="14"
              mt="10px"
              opacity={0.7}
              textTransform="uppercase"
            >
              Entries
            </Text>
            <Accordion width="100%" allowToggle>
              {entryLogs.map(entry => {

                return (
                  <AccordionItem key={entry.id}>
                    <h2>
                      <Flex
                        _hover={{ bgColor: "transparent" }}
                        alignItems="center"
                        as={AccordionButton}
                        gap={2}
                        px={0}
                      >
                        <Icon as={entry.type === "error" ? HiExclamationTriangle : HiInformationCircle} color="red.500" mt="6px" />
                        <Text as="span" textAlign="start" w="100%">{dayjs(entry.dateTime).format("DD/MM/YYYY - HH:mm:ss")}</Text>
                        <AccordionIcon />
                      </Flex>
                    </h2>
                    <AccordionPanel p={0}>
                      <Flex
                        align="center"
                        as="h4"
                        fontSize={16}
                        fontWeight={600}
                        gap={2}
                      >
                        Type
                      </Flex>
                      <Text mb="10px">{entry.type}</Text>
                      <Flex
                        align="center"
                        as="h4"
                        fontSize={16}
                        fontWeight={600}
                        gap={2}
                      >
                        Occured at:
                      </Flex>
                      <Text mb="10px">{dayjs(entry.dateTime).format("ddd DD/MM/YYYY - HH:mm:ss")}</Text>
                      <Flex
                        align="center"
                        as="h4"
                        fontSize={16}
                        fontWeight={600}
                        gap={2}
                      >
                        Calling function:
                      </Flex>
                      <Text mb="10px">{entry.callingFunction}</Text>
                      <Text as="h4" fontSize={16} fontWeight={600}>Stack trace:</Text>
                      <Text
                        alignItems="center"
                        as="button"
                        color="brand.500"
                        display="flex"
                        gap={2}
                        mb="10px"
                        variant="link"
                        onClick={() => openEntryLogStackTrace(entry)}
                      >
                        Click here to view
                        <Icon as={HiOutlineArrowTopRightOnSquare} />
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </>
        }
      </VStack>
    </Flex>
  )
}
LogsScreen.displayName = "LogsScreen";


/** Function to render the full stack trace in a new browser window. */
function openEntryLogStackTrace(entry: EntryLog) {
  if (!window) return;

  const logWindow = window.open("", "_blank");
  if (logWindow) {
    const date = dayjs(entry.dateTime).format("DD/MM/YYYY - HH:mm:ss");

    logWindow.document.write(`
      <html>
        <head>
          <title>${date}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1>Log ${date}</h1>
          <h2>Stack trace:</h2>
          <div class="preContainer">
            <pre>${entry.stackTrace}</pre>
          </div>
        </body>
      </html>
    `);

    // Close document writing to prevent further modifications
    logWindow.document.close();

    // Add styles dynamically after page load
    const styleTag = logWindow.document.createElement("style");
    styleTag.textContent = `
      body {
        margin: 0;
        font-size: 1em;
        font-family: monospace;
        padding: 20px;
        white-space: pre-wrap;
        word-break: break-word;
        max-width: 100dvw;
      }
      h1 {
        color: #8659EF;
        margin: 0;
        font-weight: 600;
      }
      .preContainer {
        border: 1px solid;
        border-color: #e0e0e0;
        border-radius: 8px;
        padding: 0 10px;
        overflow-x: auto;
      }
      pre {
        margin: 0;
        padding: 0;
      }
      @media (max-width: 768px) {
        body {
          font-size: 1.2em;
        }
      }
    `;
    logWindow.document.head.appendChild(styleTag);
  }
}
