import styled from "@emotion/styled";
import { Box, Flex, Text, Badge } from "@mantine/core";

const ContractDataContainer = styled.div`
  margin-bottom: 5px;
  margin-left: 40px;
`;

interface ContractData {
  label: string;
  value: string;
  badge: boolean;
  badgeUrl: string;
}

export const ContractDetails = ({
  contractData,
  contractName,
  width,
}: {
  contractData: any;
  contractName: string;
  width: number;
}) => {
  return (
    <ContractDataContainer>
      {contractName ? (
        contractData.map(
          ({ label, value, badge, badgeUrl }: ContractData, index: number) =>
            value && (
              <Box key={index}>
                <Flex align="center">
                  <Text fz="sm" fw="bold">
                    {label}
                  </Text>
                  {badge && (
                    <Badge
                      sx={{
                        cursor: "pointer",
                        marginLeft: 10,
                      }}
                      size="sm"
                      variant="gradient"
                      gradient={{ from: "yellow", to: "orange" }}
                      onClick={() => window.open(badgeUrl, "_blank")}
                    >
                      VIEW
                    </Badge>
                  )}
                </Flex>
                <Text fz={`${width > 600 ? "xl" : "lg"}`} mb={50}>
                  {value}
                </Text>
              </Box>
            )
        )
      ) : (
        <Text fz="xl">No contract data available</Text>
      )}
    </ContractDataContainer>
  );
};
