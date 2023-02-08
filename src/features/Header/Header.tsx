import { Box, Flex, Text, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";
import { ComponentStates } from "@/data-schema/enums";
import styled from "@emotion/styled";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { colaventLg, colaventSm } from "./icons";
import { useState } from "react";

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
  const [iconColor, setIconColor] = useState("");

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const StyledThemeLogo = styled.div`
    &:hover {
      color: ${iconColor};
    }
  `;

  const handleColorScheme = () => {
    if (colorScheme === "dark") {
      localStorage.setItem("colorScheme", "light");
    } else {
      localStorage.setItem("colorScheme", "dark");
    }
    toggleColorScheme();
  };

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
          {dark ? (
            <StyledThemeLogo
              onClick={() => handleColorScheme()}
              onMouseOver={() => setIconColor("orange")}
              onMouseOut={() => setIconColor("")}
            >
              <IconSun size={30} />
            </StyledThemeLogo>
          ) : (
            <StyledThemeLogo
              onClick={() => handleColorScheme()}
              onMouseOver={() => setIconColor("orange")}
              onMouseOut={() => setIconColor("")}
            >
              <IconMoon size={30} />
            </StyledThemeLogo>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
