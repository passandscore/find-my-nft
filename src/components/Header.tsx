import Image from "next/image";
import { Box, Flex, Button, Text } from "@mantine/core";
import Link from "next/link";
import { ComponentStates } from "@/data-schema";

export const Header = ({
  width,
  breakpoint,
  currentComponent,
  changeComponent,
}: {
  width: number;
  breakpoint: number;
  currentComponent: ComponentStates;
  changeComponent: (component: ComponentStates) => void;
}) => {
  return (
    <Box px={50} mt={20}>
      <Flex justify="space-between" align="center" h={75}>
        <Text
          fz="xl"
          onClick={() => changeComponent(ComponentStates.INPUTS)}
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
