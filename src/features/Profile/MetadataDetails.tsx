import { Flex, Text, Badge, Container } from "@mantine/core";

export const MetadataDetails = ({
  tokenUrl,
  handleMetadataViewButton,
}: {
  tokenUrl: string;
  handleMetadataViewButton: () => void;
}) => {
  return (
    <Container mb={100}>
      {tokenUrl ? (
        <>
          <Flex align="center">
            <Text fz="md" fw="bold">
              Metadata
            </Text>
            <Badge
              sx={{
                cursor: "pointer",
                marginLeft: 10,
              }}
              size="md"
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              onClick={handleMetadataViewButton}
            >
              VIEW
            </Badge>
          </Flex>
          <Text fz="xl">
            The metadata of an NFT can describe its characteristics and
            properties, such as its name, description, transaction history,
            traits, link to the hosted image, and more. Additionally, the
            metadata of an NFT can point to the link you use to view the NFT,
            whether it’s a photo or video.
          </Text>
        </>
      ) : (
        <Text fz="xl">No metadata available</Text>
      )}
    </Container>
  );
};
