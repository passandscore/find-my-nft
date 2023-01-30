import Image from "next/image";
import { Box, Flex, Text } from "@mantine/core";
import { InputsWithButton } from "@/components/InputFields";
import Link from "next/link";
import { useWindowSize } from "usehooks-ts";

export default function Home() {
  const { width, height } = useWindowSize();
  const breakpoint = 700;
  return (
    <Box>
      <Box px={50} mt={20}>
        <Flex justify="space-between" align="center" h={75}>
          <Text fz="xl">Find My NFT</Text>
          {width > breakpoint && (
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
          )}
        </Flex>
      </Box>

      <Box>
        <InputsWithButton />
      </Box>
    </Box>
  );
}
