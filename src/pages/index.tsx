import { useState } from "react";
import { ComponentStates } from "@/data-schema/enums";
import { Header } from "@/components/Header";
import { InputsWithButton } from "@/components/InputFields";
import { Gallery } from "@/components/Gallery";
import { Profile } from "@/components/Profile";
import { useWindowSize } from "usehooks-ts";

export default function Home() {
  const [currentComponent, setCurrentComponent] = useState(
    ComponentStates.INPUTS
  );
  const [nftData, setNftData] = useState<any>([]);

  const { width } = useWindowSize();
  const breakpoint = 700;

  const changeComponent = (component: ComponentStates) => {
    setCurrentComponent(component);
  };

  const handleNftData = (fetchedData: any) => {
    setNftData(fetchedData);
  };

  return (
    <>
      <Header
        width={width}
        breakpoint={breakpoint}
        changeComponent={changeComponent}
      />

      {currentComponent === ComponentStates.INPUTS && (
        <InputsWithButton
          changeComponent={changeComponent}
          handleNftData={handleNftData}
        />
      )}

      {currentComponent === ComponentStates.PROFILE && (
        <Profile nftData={nftData} width={width} />
      )}

      {currentComponent === ComponentStates.GALLERY && (
        <Gallery nftData={nftData} />
      )}
    </>
  );
}
