import { Modal } from "@mantine/core";
import { TokenProfile } from "@/features/Profile/TokenProfile";
import styled from "@emotion/styled";

const StyledModal = styled(Modal)`
  .mantine-Modal-title {
    font-size: 20px;
    color: orange;
  }
`;

export const SelectedTokenCard = ({
  openTokenCard,
  setOpenTokenCard,
  selectedCardTokenData,
  width,
  isLoadingProfile,
}: {
  openTokenCard: boolean;
  setOpenTokenCard: (value: boolean) => void;
  selectedCardTokenData: any;
  width: number;
  isLoadingProfile: boolean;
}) => {
  const { selectedTokenId } = selectedCardTokenData;
  return (
    <>
      <StyledModal
        opened={openTokenCard}
        onClose={() => setOpenTokenCard(false)}
        title={`Token ${selectedTokenId}`}
        size="lg"
        overlayBlur={10}
        overlayOpacity={0.5}
        centered
      >
        <TokenProfile
          nftData={selectedCardTokenData}
          width={width}
          isLoadingProfile={isLoadingProfile}
        />
      </StyledModal>
    </>
  );
};
