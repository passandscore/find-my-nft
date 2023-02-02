import Image from "next/image";
import { Box, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { ComponentStates } from "@/data-schema/enums";
import styled from "@emotion/styled";

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
    transition: width 0.6s ease-in-out;
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

        {width > breakpoint ? (
          <Link
            href="https://www.covalenthq.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/imgs/covalent-logo-no-bg.png"
              alt="Covalent Logo"
              width={250}
              height={75}
              priority
            />
          </Link>
        ) : (
          <Link
            href="https://www.covalenthq.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/imgs/covalent-logo-crop-no-bg.png"
              alt="Covalent Logo"
              width={75}
              height={75}
              priority
            />
          </Link>
        )}
      </Flex>
    </Box>
  );
};
