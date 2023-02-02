import { Modal } from "@mantine/core";
import { TokenProfile } from "@/features/Profile/TokenProfile";

export const SelectedTokenCard = ({
  openTokenCard,
  setOpenTokenCard,
  selectedCardTokenData,
  width,
}: {
  openTokenCard: boolean;
  setOpenTokenCard: (value: boolean) => void;
  selectedCardTokenData: any;
  width: number;
}) => {
  const { selectedTokenId } = selectedCardTokenData;
  const { contract_name } = selectedCardTokenData?.contractData || "";
  return (
    <>
      <Modal
        opened={openTokenCard}
        onClose={() => setOpenTokenCard(false)}
        title={`${contract_name}: Token ${selectedTokenId}`}
        size="lg"
        overlayBlur={10}
        overlayOpacity={0.5}
      >
        <TokenProfile nftData={selectedCardTokenData} width={width} />
      </Modal>
    </>
  );
};
