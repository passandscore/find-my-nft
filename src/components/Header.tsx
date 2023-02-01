import Image from "next/image";
import { Box, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { ComponentStates } from "@/data-schema/enums";

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
        <Text
          fz="xl"
          onClick={handleLogoClick}
          color="yellow"
          style={{ cursor: "pointer" }}
        >
          Find My NFT
        </Text>

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
