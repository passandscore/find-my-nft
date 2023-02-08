import { Accordion, Button, Flex, Input, Select, Text } from "@mantine/core";
import {
  COVALENT_API_SIGNUP,
  SOCIAL_MEDIA,
  GITHUB_PROJECT_URL,
} from "@/web3/constants";
import { IconKey } from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";
import { showNotification } from "@mantine/notifications";
import {
  COVALENT_API,
  API_KEY_VALIDATION,
  COVALENT_API_VERSION,
} from "@/web3/constants";
import { RequestTestTokenId } from "@/BFF";

export const NeedToKnowAccordian = () => {
  const [storedApiKey, setStoredApiKey] = useState<string | null>(null);
  const [storedApiVersion, setStoredApiVersion] = useState<string | null>(null);
  const [selectedApiVersion, setSelectedApiVersion] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const apiKeyRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const RemoveApiKey = () => {
    localStorage.removeItem(COVALENT_API);
    apiKeyRef.current!.value = "";
    setStoredApiKey(null);

    localStorage.removeItem(COVALENT_API_VERSION);
    setStoredApiVersion(null);
    setSelectedApiVersion(null);
  };

  const handleApiKey = async () => {
    const key = apiKeyRef.current?.value;
    const buttonName = buttonRef.current?.innerText;

    if (buttonName === "Remove") {
      RemoveApiKey();
      return;
    }

    if (storedApiKey) {
      localStorage.removeItem(COVALENT_API);
      setStoredApiKey(null);
      apiKeyRef.current!.value = "";
      return;
    }

    if (storedApiVersion) {
      localStorage.removeItem(COVALENT_API_VERSION);
      setStoredApiVersion(null);
      return;
    }

    if (!key) {
      showNotification({
        title: "Error",
        message: "Please enter an API key.",
        color: "red",
      });
      return;
    }

    if (!selectedApiVersion) {
      showNotification({
        title: "Error",
        message: "Please enter an API version.",
        color: "red",
      });
      return;
    }

    // Run a test query to make sure the API key is valid
    setLoading(true);

    const apiKeyTestResponse = await RequestTestTokenId(
      API_KEY_VALIDATION.tokenId,
      API_KEY_VALIDATION.chainId,
      API_KEY_VALIDATION.contractAddress,
      key!,
      selectedApiVersion!
    );

    setLoading(false);

    if (apiKeyTestResponse.networkError) {
      showNotification({
        title: "Error",
        message: "There was an error with the API key.",
        color: "red",
      });
      return;
    }

    localStorage.setItem(COVALENT_API, key!);
    localStorage.setItem(COVALENT_API_VERSION, selectedApiVersion!);

    setStoredApiKey(key!);
    setStoredApiVersion(selectedApiVersion!);
  };

  useEffect(() => {
    const apiKey = localStorage.getItem(COVALENT_API);
    const apiVersion = localStorage.getItem(COVALENT_API_VERSION);
    if (apiKey) {
      console.log("apiKey", apiKey);
      setStoredApiKey(apiKey);
    }
    if (apiVersion) {
      console.log("apiVersion", apiVersion);
      setStoredApiVersion(apiVersion);
    }
  }, []);

  return (
    <Accordion variant="separated" defaultValue="api-key">
      <Accordion.Item value="api-key">
        <Accordion.Control>Api Key</Accordion.Control>
        <Accordion.Panel>
          If you are experiencing issues with the API, you can provide your own
          API key. You can get one from{" "}
          <a
            href={COVALENT_API_SIGNUP}
            target="_blank"
            style={{
              color: "orange",
              textDecoration: "none",
            }}
          >
            Covalent.
          </a>
          <Flex align="center" justify="space-between" mt={20}>
            <Input
              ref={apiKeyRef}
              icon={<IconKey />}
              placeholder="Enter your API key here"
              defaultValue={storedApiKey!}
              style={{
                width: "100%",
                marginRight: 10,
              }}
              disabled={storedApiKey ? true : false}
            />

            {/* API Version */}
            <Select
              placeholder="Version"
              defaultValue={storedApiVersion!}
              data={[
                { label: "V1", value: "v1" },
                { label: "V2", value: "v2" },
                { label: "V3", value: "v3" },
              ]}
              value={selectedApiVersion}
              onChange={setSelectedApiVersion}
              disabled={storedApiVersion ? true : false}
            />

            <Button
              ref={buttonRef}
              color="yellow"
              radius="sm"
              size="sm"
              ml={10}
              loading={loading}
              onClick={handleApiKey}
            >
              {storedApiKey ? "Remove" : "Save"}
            </Button>
          </Flex>
          {storedApiKey && (
            <Text size="xs" color="green">
              Valid API key
            </Text>
          )}
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="flexibility">
        <Accordion.Control>Errors</Accordion.Control>
        <Accordion.Panel>
          <Text size="sm" color="orange" mb={5}>
            NFT NOT FOUND
          </Text>
          <Text>
            This can either mean that the NFT does not exist or that application
            failed to render it correctly. Try toggling the page buttons below
            the collection as a workaround.
          </Text>
          <Text size="sm" color="orange" mb={5} mt={10}>
            METADATA NOT FOUND
          </Text>
          <Text>
            This occurs when the metadata URL is either invalid or not found.
            You can verify this on the block explorer.
          </Text>
          <Text size="sm" color="orange" mb={5} mt={10}>
            NO MINTED TOKENS FOUND
          </Text>
          <Text>
            This occurs when the collection page you are accessing has not
            actually minted the tokens. The collection only has access to the
            total supply of tokens, not the actual tokens that have been minted.
            You can verify this on the block explorer.
          </Text>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="focus-ring">
        <Accordion.Control>About this project</Accordion.Control>
        <Accordion.Panel>
          Find My NFT was built by{" "}
          <a
            href={SOCIAL_MEDIA.twitter}
            target="_blank"
            style={{
              color: "orange",
              textDecoration: "none",
            }}
          >
            Jason Schwarz
          </a>
          . It is open source and you can find the code on{" "}
          <a
            href={GITHUB_PROJECT_URL}
            target="_blank"
            style={{
              color: "orange",
              textDecoration: "none",
            }}
          >
            Github
          </a>
          . This project is not affiliated with Covalent or any other NFT
          project. It is a tool to help people find their NFTs. If you have any
          questions, please reach out to me on{" "}
          <a
            href={SOCIAL_MEDIA.discord}
            target="_blank"
            style={{
              color: "orange",
              textDecoration: "none",
            }}
          >
            Discord
          </a>
          .
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
