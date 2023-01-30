import { Container, Image, Button, Flex } from "@mantine/core";
import { ComponentStates } from "@/data-schema";

export function Profile({
  nftData,
  changeComponent,
}: {
  nftData: any;
  changeComponent: (component: ComponentStates) => void;
}) {
  const handleImageUrl = () => {
    let url = nftData.metadata.image || nftData.metadata.image_url;
    if (url.includes("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url || "";
  };

  const handleImageClick = () => {
    window.open(nftData.token_url, "_blank");
  };

  return (
    <Container
      mt={60}
      mah="50%"
      maw="40%"
      p={0}
      style={{ position: "relative" }}
    >
      {handleImageUrl() ? (
        <>
          <Image src={handleImageUrl()} alt="nft-image" />
          <Flex justify="center">
            <Button
              variant="gradient"
              compact
              onClick={handleImageClick}
              sx={{
                cursor: "pointer",
                marginTop: 20,
              }}
            >
              View metadata
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Image src="/imgs/Image_not_available.png" alt="nft-image" />
          <Button
            variant="gradient"
            style={{ position: "absolute", top: 0, right: 0, borderRadius: 0 }}
            onClick={() => changeComponent(ComponentStates.INPUTS)}
            sx={{ cursor: "pointer" }}
          >
            Try again
          </Button>
        </>
      )}
    </Container>
  );
}
