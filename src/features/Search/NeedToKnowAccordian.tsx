import { Accordion, Button, Flex, Input, Text } from "@mantine/core";
import {
  COVALENT_API_SIGNUP,
  SOCIAL_MEDIA,
  GITHUB_PROJECT_URL,
} from "@/web3/constants";
import { IconKey } from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";
import { showNotification } from "@mantine/notifications";
import {
  COVALENT_KEY_LOCAL_STORAGE_TITLE,
  API_KEY_VALIDATION,
} from "@/web3/constants";
import { RequestTestTokenId } from "@/BFF";

export const NeedToKnowAccordian = () => {
  const [storedApiKey, setStoredApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleApiKey = async () => {
    const input = inputRef.current?.value;

    if (storedApiKey) {
      localStorage.removeItem(COVALENT_KEY_LOCAL_STORAGE_TITLE);
      setStoredApiKey(null);
      inputRef.current!.value = "";
      return;
    }
    if (!input) {
      showNotification({
        title: "Error",
        message: "Please enter an API key.",
        color: "red",
      });
      return;
    }

    // Run a test query to make sure the API key is valid
    localStorage.setItem(COVALENT_KEY_LOCAL_STORAGE_TITLE, input!);

    setLoading(true);

    const apiKeyTestResponse = await RequestTestTokenId(
      API_KEY_VALIDATION.tokenId,
      API_KEY_VALIDATION.chainId,
      API_KEY_VALIDATION.contractAddress,
      input!
    );

    setLoading(false);

    if (apiKeyTestResponse.networkError) {
      showNotification({
        title: "Error",
        message: "There was an error with the API key.",
        color: "red",
      });
      localStorage.removeItem(COVALENT_KEY_LOCAL_STORAGE_TITLE);
      return;
    }

    localStorage.setItem(COVALENT_KEY_LOCAL_STORAGE_TITLE, input!);
    setStoredApiKey(input!);
  };

  useEffect(() => {
    const apiKey = localStorage.getItem(COVALENT_KEY_LOCAL_STORAGE_TITLE);
    if (apiKey) {
      setStoredApiKey(apiKey);
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
              ref={inputRef}
              icon={<IconKey />}
              placeholder="Enter your API key here"
              defaultValue={storedApiKey!}
              style={{
                width: "100%",
              }}
            />
            <Button
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
