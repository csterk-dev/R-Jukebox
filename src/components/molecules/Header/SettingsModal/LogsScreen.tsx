import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, HStack, Icon, IconButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Tag, TagCloseButton, TagLabel, Text, VStack } from "@chakra-ui/react";
import { FC, useCallback, useMemo, useState } from "react";
import { Placeholder } from "components/atoms/Placeholder";
import dayjs, { ManipulateType } from "dayjs";
import { HiCalendarDays, HiCodeBracket, HiExclamationTriangle, HiFunnel, HiInformationCircle, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

type LogsScreenProps = {
  entryLogs: EntryLog[];
};

type FilterByTypeOptions = EntryLog["type"] | "none";
type FilterByDateOptions = "7_days" | "1_month" | "3_months" | "6_months" | "12_months";

const FILTER_BY_TYPE_OPTIONS: { label: string; value: FilterByTypeOptions }[] = [
  {
    label: "Info",
    value: "info"
  },
  {
    label: "Error",
    value: "error"
  }
]

const FILTER_BY_DATE_OPTIONS: { label: string; value: FilterByDateOptions }[] = [
  {
    label: "Last 7 days",
    value: "7_days"
  },
  {
    label: "Last 30 days",
    value: "1_month"
  },
  {
    label: "Last 3 months",
    value: "3_months"
  },
  {
    label: "Last 6 months",
    value: "6_months"
  },
  {
    label: "Last 12 months",
    value: "12_months"
  }
]


export const LogsScreen: FC<LogsScreenProps> = ({ entryLogs }) => {
  const [typeFilter, setTypeFilter] = useState<FilterByTypeOptions>("none");
  const [dateFilter, setDateFilter] = useState<FilterByDateOptions>("3_months");
  const filterByDateObj = useMemo(() => dayjs().subtract(+dateFilter.split("_")[0], dateFilter.split("_")[1] as ManipulateType), [dateFilter]);

  const clearFilter = useCallback(() => setTypeFilter("none"), []);

  const groupedLogs = useMemo(() => {
    const parsedLogs = entryLogs
      .filter(entry => typeFilter === "none" ? true : entry.type === typeFilter)
      .filter(entry => dayjs(entry.dateTime).isAfter(filterByDateObj));


    return parsedLogs.reduce<Record<string, EntryLog[]>>((acc, log) => {
      const dateKey = dayjs(log.dateTime).format("DD/MM/YYYY");

      acc[dateKey] = acc[dateKey] ? [...acc[dateKey], log] : [log];

      return acc;
    }, {});
  }, [entryLogs, filterByDateObj, typeFilter]);


  const logElements: JSX.Element[] = useMemo(() => {
    return Object.entries(groupedLogs).map(([date, logs]) => (
      <VStack key={date} align="flex-start" w="100%">
        {/* Date Group Title */}
        <Text
          as="h2" fontSize="14px"
          opacity={0.7} textTransform="uppercase">
          {date}
        </Text>

        {/* Accordion for Logs */}
        <Accordion width="100%" allowToggle>
          {logs.map(entry => (
            <AccordionItem key={entry.id}>
              <h3>
                <Flex
                  _hover={{ bgColor: "transparent" }} alignItems="center" as={AccordionButton}
                  gap={2} px={0}>
                  <Icon
                    as={entry.type === "error" ? HiExclamationTriangle : HiInformationCircle}
                    color={entry.type === "error" ? "red.500" : "brand.500"}
                    my="2px"
                  />
                  <Text as="span" textAlign="start" w="100%">
                    {dayjs(entry.dateTime).format("HH:mm:ss")}
                  </Text>
                  <AccordionIcon />
                </Flex>
              </h3>

              <AccordionPanel p={0}>
                <Flex
                  align="center" as="h4" fontSize={16}
                  fontWeight={600} gap={2}>
                  Type
                </Flex>
                <Text mb="10px">{entry.type}</Text>

                <Flex
                  align="center" as="h4" fontSize={16}
                  fontWeight={600} gap={2}>
                  Occurred at:
                </Flex>
                <Text mb="10px">{dayjs(entry.dateTime).format("ddd DD/MM/YYYY - HH:mm:ss")}</Text>

                <Flex
                  align="center" as="h4" fontSize={16}
                  fontWeight={600} gap={2}>
                  Calling function:
                </Flex>
                <Text mb="10px">{entry.callingFunction}</Text>

                <Text as="h4" fontSize={16} fontWeight={600}>
                  Stack trace:
                </Text>
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
          ))}
        </Accordion>
      </VStack>
    ))
  }, [groupedLogs]);


  return (
    <Flex flexDirection="column" h="448px">
      <Flex align="center" px="10px" py="10px">
        <Text
          as="h1"
          fontSize={18}
          fontWeight="semibold"
          pl="10px"
        >
          Player Logs
        </Text>

        <HStack ml="auto">
          {typeFilter !== "none" ?
            <Tag colorScheme={typeFilter == "error" ? "red" : "brand"} role="button" onClick={clearFilter}>
              <TagLabel textTransform="capitalize">{typeFilter}</TagLabel>
              <TagCloseButton pointerEvents="none" role="none" />
            </Tag> :
            null
          }
          <HStack gap={0}>
            <Menu variant="logFilters">
              <MenuButton
                aria-label="Show filters"
                as={IconButton}
                icon={<HiFunnel />}
              />
              <MenuList>
                <MenuOptionGroup
                  title="Filter by type"
                  type="radio"
                  value={typeFilter}
                  onChange={val => setTypeFilter(val as FilterByTypeOptions)}
                >
                  {FILTER_BY_TYPE_OPTIONS.map(opt => <MenuItemOption key={opt.value} value={opt.value}>{opt.label}</MenuItemOption>)}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Menu variant="logFilters">
              <MenuButton
                aria-label="Show sort options"
                as={IconButton}
                fontSize={18}
                icon={<HiCalendarDays />}
              />
              <MenuList>
                <MenuOptionGroup
                  title="Filter by date"
                  type="radio"
                  value={dateFilter}
                  onChange={val => setDateFilter(val as FilterByDateOptions)}
                >
                  {FILTER_BY_DATE_OPTIONS.map(opt => <MenuItemOption key={opt.value} value={opt.value}>{opt.label}</MenuItemOption>)}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Flex>

      <VStack
        align="flex-start" fontSize="16px" gap="10px"
        overflowY="auto" pb="10px" px="20px">
        {!entryLogs.length ? (
          <Placeholder
            alignSelf="center" icon={HiCodeBracket} mb="20px"
            title="Log entries will appear here" />
        ) : (
          !logElements.length ?
            <Text>
              {`No ${typeFilter} logs in the last ${+dateFilter.split("_")[0]} ${dateFilter.split("_")[1]}`}
            </Text> :
            logElements
        )}
      </VStack>
    </Flex>
  );
};

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

    logWindow.document.close();

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
          font-size: 0.825em;
        }
      }
    `;
    logWindow.document.head.appendChild(styleTag);
  }
}
