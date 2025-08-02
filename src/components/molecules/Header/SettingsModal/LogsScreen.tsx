import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, HStack, Icon, IconButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Stack, Tag, TagCloseButton, TagLabel, Text, VStack } from "@chakra-ui/react";
import { FC, useCallback, useMemo, useState } from "react";
import { Placeholder } from "components/atoms/Placeholder";
import dayjs, { ManipulateType } from "dayjs";
import { HiCalendarDays, HiCodeBracket, HiFunnel, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

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
    const parsedLogs =
      entryLogs
        .filter(entry => typeFilter === "none" ? true : entry.type === typeFilter)
        .filter(entry => dayjs(entry.dateTime).isAfter(filterByDateObj));


    return parsedLogs.reduce<Record<string, EntryLog[]>>((acc, log) => {
      const dateKey = dayjs(log.dateTime).format("ddd DD/MM/YYYY");

      acc[dateKey] = acc[dateKey] ? [...acc[dateKey], log] : [log];

      return acc;
    }, {});
  }, [entryLogs, filterByDateObj, typeFilter]);


  const logElements: JSX.Element[] = useMemo(() => {
    return Object.entries(groupedLogs).map(([date, logs]) => (
      <Stack
        key={date}
        as="ul"
        gap={0}
        listStyleType="none"
        mt={2.5}
        width="100%"
      >
        <Text as="h2" textStyle="heading/sub-section">
          {date}
        </Text>
        {logs.map(entry => (
          <AccordionItem key={entry.id} _first={{ borderTopWidth: 0 }}>
            <h3>
              <Flex
                _hover={{ bgColor: "transparent" }}
                alignItems="center"
                as={AccordionButton}
                justifyContent="space-between"
                px={0}
              >
                <Text textAlign="start">
                  {dayjs(entry.dateTime).format("hh:mm:ss a")}
                </Text>
                <Flex align="center" gap={2}>
                  <Tag colorScheme={entry.type == "error" ? "red" : "brand"}>{entry.type}</Tag>
                  <AccordionIcon />
                </Flex>
              </Flex>
            </h3>

            <AccordionPanel p={0}>
              <Stack>
                <Flex flexDir="column">
                  <Text as="h4" textStyle="body/label">
                    Log Type
                  </Text>
                  <Text>{entry.type}</Text>
                </Flex>

                <Flex flexDir="column">
                  <Text as="h4" textStyle="body/label">
                    Occurred at:
                  </Text>
                  <Text>{dayjs(entry.dateTime).format("ddd DD/MM/YYYY - HH:mm:ss")}</Text>
                </Flex>

                <Flex flexDir="column">
                  <Text as="h4" textStyle="body/label">
                    Calling function:
                  </Text>
                  <Text as="pre" fontSize="sm">{entry.callingFunction}</Text>
                </Flex>

                <Flex flexDir="column">
                  <Text as="h4" textStyle="body/label">
                    Stack trace:
                  </Text>
                  <Text
                    alignItems="center"
                    as="button"
                    color="brand.500"
                    display="flex"
                    gap={2}
                    variant="link"
                    onClick={() => openEntryLogStackTrace(entry)}
                  >
                    Click here to view
                    <Icon as={HiOutlineArrowTopRightOnSquare} />
                  </Text>

                </Flex>

              </Stack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Stack>
    ))
  }, [groupedLogs]);


  return (
    <Flex flexDirection="column" h="448px">
      <Flex align="center" px={2}>
        <Text
          as="h1"
          pl={2}
          textStyle="heading/section"
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
        layerStyle="themed-scroll"
        overflowY="auto"
        pb={2}
        px={5}
      >
        {!entryLogs.length ? (
          <Placeholder
            alignSelf="center"
            icon={HiCodeBracket}
            iconBgOverride="neutral.50"
            mb={5}
            title="Log entries will appear here"
          />
        ) : (
          !logElements.length ?
            <Text>
              {`No ${typeFilter} logs in the last ${+dateFilter.split("_")[0]} ${dateFilter.split("_")[1]}`}
            </Text> :
            <Accordion
              as="li"
              listStyleType="none"
              width="100%"
              allowToggle
            >
              {logElements}
            </Accordion>
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
