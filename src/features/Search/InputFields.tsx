import { Flex, Select, Switch, TextInput } from "@mantine/core";
import { Icon123, IconAddressBook, IconLink } from "@tabler/icons-react";
import { NetworkEnviroments } from "@/data-schema/enums";
import { MAINNET_NETWORK_NAMES, TESTNET_NETWORK_NAMES } from "@/web3/constants";

export const InputFields = ({
  findWithTokenId,
  setFindWithTokenId,
  networkType,
  setNetworkType,
  chainId,
  setChainId,
  setAddress,
  setTokenId,
}: {
  findWithTokenId: boolean;
  setFindWithTokenId: (value: boolean) => void;
  networkType: NetworkEnviroments;
  setNetworkType: (value: NetworkEnviroments) => void;
  chainId: string | null;
  setChainId: (value: string | null) => void;
  setAddress: (value: string | null) => void;
  setTokenId: (value: string) => void;
}) => {
  const sortedMainnetNetworkNames = MAINNET_NETWORK_NAMES.sort((a, b) =>
    a.label > b.label ? 1 : -1
  );

  const sortedTestnetNetworkNames = TESTNET_NETWORK_NAMES.sort((a, b) =>
    a.label > b.label ? 1 : -1
  );

  return (
    <>
      {/* Switch - Find by token id */}

      <Flex direction="row-reverse">
        <Switch
          labelPosition="left"
          label="Find by token id"
          color="yellow"
          mt={200}
          defaultChecked={findWithTokenId}
          onChange={() => setFindWithTokenId(!findWithTokenId)}
        />
      </Flex>

      {/* Switch - Enable testnets */}
      <Flex direction="row-reverse">
        <Switch
          labelPosition="left"
          label="Enable Testnets"
          color="yellow"
          my={20}
          defaultChecked={
            networkType === NetworkEnviroments.MAINNET ? false : true
          }
          onChange={() =>
            setNetworkType(
              networkType === NetworkEnviroments.MAINNET
                ? NetworkEnviroments.TESTNET
                : NetworkEnviroments.MAINNET
            )
          }
        />
      </Flex>

      {/* Select - Chain id */}
      <Select
        icon={<IconLink size={18} stroke={1.5} />}
        mb={30}
        radius="xl"
        size="lg"
        data={
          networkType === NetworkEnviroments.MAINNET
            ? sortedMainnetNetworkNames
            : sortedTestnetNetworkNames
        }
        placeholder={
          networkType === NetworkEnviroments.MAINNET
            ? "Select a network"
            : "Select a test network"
        }
        clearable
        value={chainId}
        onChange={setChainId}
      />

      {/* Input - Contract address */}
      <TextInput
        icon={<IconAddressBook size={18} stroke={1.5} />}
        radius="xl"
        size="lg"
        placeholder="Contract address"
        onChange={(e) => setAddress(e.target.value)}
      />

      {/* Input - Token id */}
      {findWithTokenId && (
        <TextInput
          icon={<Icon123 size={18} stroke={1.5} />}
          mt={30}
          radius="xl"
          size="lg"
          placeholder="Token id"
          onChange={(e) => setTokenId(e.target.value)}
        />
      )}
    </>
  );
};

export default InputFields;
