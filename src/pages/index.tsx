import { useState } from "react";
import { ComponentStates } from "@/data-schema/enums";
import { Header } from "@/features/Header/Header";
import { SocialsMenu } from "@/features/Socials/SocialsMenu";
import { SearchForm } from "@/features/Search";
import { TokenCollection } from "@/features/Collection";
import { TokenProfile } from "@/features/Profile";
import { useWindowSize } from "usehooks-ts";
import { Modal } from "@mantine/core";
import { NeedToKnowAccordian } from "@/features/Search/NeedToKnowAccordian";

export default function FindMyNft() {
  const [currentComponent, setCurrentComponent] = useState(
    ComponentStates.INPUTS
  );
  const [nftData, setNftData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openNeedToKnow, setOpenNeedToKnow] = useState<boolean>(false);

  const { width } = useWindowSize();

  const breakpoint = 700;

  const changeComponent = (component: ComponentStates) => {
    setCurrentComponent(component);
  };

  const handleNftData = (fetchedData: any) => {
    setNftData(fetchedData);
  };

  const handleIsLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <>
      <Header
        width={width}
        breakpoint={breakpoint}
        changeComponent={changeComponent}
        handleIsLoading={handleIsLoading}
      />

      {currentComponent === ComponentStates.INPUTS && (
        <>
          <SearchForm
            changeComponent={changeComponent}
            handleNftData={handleNftData}
            handleIsLoading={handleIsLoading}
            isLoading={isLoading}
            setOpenNeedToKnow={setOpenNeedToKnow}
          />
          {!isLoading && <SocialsMenu openNeedToKnow={openNeedToKnow} />}
        </>
      )}

      {currentComponent === ComponentStates.TOKEN_PROFILE && (
        <TokenProfile nftData={nftData} width={width} />
      )}

      {currentComponent === ComponentStates.COLLECTION && (
        <TokenCollection nftData={nftData} handleIsLoading={handleIsLoading} />
      )}

      <Modal
        opened={openNeedToKnow}
        onClose={() => setOpenNeedToKnow(false)}
        title="Need to know"
        centered
        size="xl"
        closeOnClickOutside={false}
      >
        <NeedToKnowAccordian />
      </Modal>
    </>
  );
}
