import {
  Box,
  Flex,
  HoverCard,
  Menu,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import Link from "next/link";
import { ComponentStates } from "@/data-schema/enums";
import styled from "@emotion/styled";
import { IconMenu2, IconSun, IconMoon } from "@tabler/icons-react";
import { colaventLg, colaventSm } from "./icons";

const StyledLogo = styled.div`
  position: relative;
  width: 112px;
  height: 35px;

  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-bottom: 1px solid orange;
    transition: width 0.3s ease-in-out;
  }

  &:hover:before {
    width: 100%;
  }
`;

export const Header = ({
  width,
  breakpoint,
  changeComponent,
  handleIsError,
  handleIsLoading,
}: {
  width: number;
  breakpoint: number;
  changeComponent: (component: ComponentStates) => void;
  handleIsError: (error: boolean) => void;
  handleIsLoading: (loading: boolean) => void;
}) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const handleLogoClick = () => {
    changeComponent(ComponentStates.INPUTS);
    handleIsError(false);
    handleIsLoading(false);
  };

  return (
    <Box px={50} mt={20}>
      <Flex justify="space-between" align="center" h={75}>
        <StyledLogo>
          <Text
            fz="xl"
            onClick={handleLogoClick}
            color="yellow"
            style={{ cursor: "pointer" }}
          >
            Find My NFT
          </Text>
        </StyledLogo>

        <Flex align="center" style={{ cursor: "pointer" }}>
          {width > breakpoint ? (
            <Link
              href="https://www.covalenthq.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dark
                ? colaventLg(250, 75, "white")
                : colaventLg(250, 75, "black")}
            </Link>
          ) : (
            <Link
              href="https://www.covalenthq.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dark ? colaventSm(75, 75, "white") : colaventSm(75, 75, "black")}
            </Link>
          )}

          <HoverCard width={200} shadow="md">
            <HoverCard.Target>
              <IconMenu2 size={30} color={dark ? "white" : "black"} />
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Menu width={200} shadow="md">
                <Menu.Item
                  icon={dark ? <IconSun size={18} /> : <IconMoon size={18} />}
                  onClick={() => toggleColorScheme()}
                >
                  {dark ? "Light Mode" : "Dark Mode"}
                </Menu.Item>
              </Menu>
            </HoverCard.Dropdown>
          </HoverCard>
        </Flex>
      </Flex>
    </Box>
  );
};
