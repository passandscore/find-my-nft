import {
  TextInput,
  TextInputProps,
  Select,
  Button,
  Container,
  Flex,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { IconAddressBook, IconLink } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { ethers } from "ethers";

export function InputsWithButton(props: TextInputProps) {
  const [chainId, setChainId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!chainId || !address) {
      showNotification({
        title: "Error",
        message: "Please fill all fields",
        color: "red",
      });
      return;
    }

    if (!ethers.utils.isAddress(address)) {
      showNotification({
        title: "Error",
        message: "Please enter a valid address",
        color: "red",
      });
      return;
    }
    setSuccessMessage("Ready to find your NFTs");
  };

  return (
    <>
      <Container maw={600}>
        <Select
          icon={<IconLink size={18} stroke={1.5} />}
          radius="xl"
          size="lg"
          style={{ margin: "200px 0 30px 0", zIndex: 2 }}
          data={[
            { value: "1", label: "Ethereum" },
            { value: "137", label: "Polygon" },
            { value: "56", label: "Binance Smart Chain" },
          ]}
          placeholder="Chain id"
          clearable
          value={chainId}
          onChange={setChainId}
        />

        <TextInput
          icon={<IconAddressBook size={18} stroke={1.5} />}
          radius="xl"
          size="lg"
          placeholder="contract or wallet address"
          onChange={(e) => setAddress(e.target.value)}
          {...props}
        />

        <Flex direction="row-reverse">
          <Button
            variant="light"
            color="yellow"
            radius="lg"
            size="lg"
            compact
            mt={20}
            onClick={handleSubmit}
          >
            Find My NFTS
          </Button>
        </Flex>
        <Text fz="xl">{successMessage}</Text>
      </Container>
    </>
  );
}
