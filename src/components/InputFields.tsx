import {
  TextInput,
  TextInputProps,
  Select,
  Button,
  Container,
  Flex,
  Text,
  Switch,
} from "@mantine/core";
import { useState } from "react";
import { IconAddressBook, IconLink, Icon123 } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { ethers } from "ethers";

export function InputsWithButton(props: TextInputProps) {
  const [chainId, setChainId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [findWithTokenId, setFindWithTokenId] = useState<boolean>(false);
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

    if (findWithTokenId && !tokenId) {
      showNotification({
        title: "Error",
        message: "Please enter a token id",
        color: "red",
      });
      return;
    }
    setSuccessMessage("Ready to find your NFTs");
  };

  return (
    <>
      <Container maw={600}>
        <Flex direction="row-reverse">
          <Switch
            labelPosition="left"
            label="Find by token id"
            color="yellow"
            style={{ margin: "200px 0 30px 0" }}
            onChange={() => setFindWithTokenId(!findWithTokenId)}
          />
        </Flex>
        <Select
          icon={<IconLink size={18} stroke={1.5} />}
          mb={30}
          radius="xl"
          size="lg"
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
          placeholder="Contract or wallet address"
          onChange={(e) => setAddress(e.target.value)}
          {...props}
        />

        {findWithTokenId && (
          <TextInput
            icon={<Icon123 size={18} stroke={1.5} />}
            mt={30}
            radius="xl"
            size="lg"
            placeholder="Token id"
            onChange={(e) => setTokenId(e.target.value)}
            {...props}
          />
        )}

        <Flex direction="row-reverse">
          <Button
            color="yellow"
            radius="lg"
            size="lg"
            compact
            mt={30}
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
