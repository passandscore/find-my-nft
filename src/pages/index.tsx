import { Text } from "@mantine/core";
import { useState } from "react";
import { ComponentStates } from "@/data-schema";
import { Header } from "@/components/Header";
import { InputsWithButton } from "@/components/InputFields";
import { Gallery } from "@/components/Gallery";
import { Profile } from "@/components/Profile";
import { Metadata } from "@/components/Metadata";
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
    console.log("Covalent Data", fetchedData.data);
    setNftData(fetchedData.data);
  };

  return (
    <>
      <Header
        width={width}
        breakpoint={breakpoint}
        currentComponent={currentComponent}
        changeComponent={changeComponent}
      />
      {currentComponent === ComponentStates.INPUTS && (
        <InputsWithButton
          changeComponent={changeComponent}
          handleNftData={handleNftData}
        />
      )}
      {currentComponent === ComponentStates.PROFILE && (
        <Profile nftData={nftData} />
      )}
      {currentComponent === ComponentStates.METADATA && (
        <Metadata nftData={nftData} />
      )}
      {currentComponent === ComponentStates.GALLERY && (
        <Gallery nftData={nftData} />
      )}
    </>
  );
}
