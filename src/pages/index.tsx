import { useState } from "react";
import { ComponentStates } from "@/data-schema/enums";
import { Header } from "@/features/Header/Header";
import { InputsWithButton } from "@/features/Search/InputFields";
import { TokenCollection } from "@/features/Collection/TokenCollection";
import { TokenProfile } from "@/features/Profile/TokenProfile";
import { useWindowSize } from "usehooks-ts";

export default function Home() {
  const [currentComponent, setCurrentComponent] = useState(
    ComponentStates.INPUTS
  );
  const [nftData, setNftData] = useState<any>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { width } = useWindowSize();
  const breakpoint = 700;

  const changeComponent = (component: ComponentStates) => {
    setCurrentComponent(component);
  };

  const handleNftData = (fetchedData: any) => {
    setNftData(fetchedData);
  };

  const handleIsError = (error: boolean) => {
    setIsError(error);
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
        handleIsError={handleIsError}
        handleIsLoading={handleIsLoading}
      />

      {currentComponent === ComponentStates.INPUTS && (
        <InputsWithButton
          changeComponent={changeComponent}
          handleNftData={handleNftData}
          handleIsError={handleIsError}
          isError={isError}
          handleIsLoading={handleIsLoading}
          isLoading={isLoading}
        />
      )}

      {currentComponent === ComponentStates.TOKEN_PROFILE && (
        <TokenProfile nftData={nftData} width={width} />
      )}

      {currentComponent === ComponentStates.COLLECTION && (
        <TokenCollection nftData={nftData} />
      )}
    </>
  );
}
