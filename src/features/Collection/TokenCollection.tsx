import { Container, Text, Pagination, Card, Image } from "@mantine/core";
import { useState } from "react";
import { prepareRequestByTokenId } from "@/BFF/RequestByTokenId";

export function TokenCollection({ nftData }: { nftData: any }) {
  return <Text> TokenCollection</Text>;
  //   const [page, setPage] = useState(1);
  //   // const classes = useStyles();

  const tokenData = async () => {
    const data = Promise.all(
      nftData?.data?.items.map(async (item: any) => {
        const { tokenId } = item?.token_id;

        const tokenData = await prepareRequestByTokenId(
          tokenId,
          chainId,
          address
        );

        return tokenData;
      })
    );
    return data;
  };

  console.log("tokenData", tokenData);

  //   const handleChange = (event, value) => {
  //     setPage(value);
  //   };

  //   const itemsPerPage = 5;
  //   const startIndex = (page - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;

  //   const mappedCards = data
  //     .slice(startIndex, endIndex)
  //     .map((item) => (
  //       <Card
  //       shadow="sm"
  //       p="xl"
  //       component="a"
  //       href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  //       target="_blank"
  //     >
  //       <Card.Section>
  //         <Image
  //           src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
  //           height={160}
  //           alt="No way!"
  //         />
  //       </Card.Section>

  //       {/* <Text weight={500} size="lg" mt="md">
  //         You&apos;ve won a million dollars in cash!
  //       </Text>

  //       <Text mt="xs" color="dimmed" size="sm">
  //         Please click anywhere on this card to claim your reward, this is not a fraud, trust us
  //       </Text> */}
  //     </Card>
  //     ));
  //   return (
  //     <>
  //       <Container maw={600}>

  //   return (
  //     <div>
  //       {mappedCards}
  //       <Pagination
  //         count={Math.ceil(data.length / itemsPerPage)}
  //         page={page}
  //         onChange={handleChange}
  //       />
  //     </div>
  //   );
  // };
  //         {/* <Pagination page={activePage} onChange={setPage} total={10} />; */}
  //       </Container>
  //     </>
  //   );
}
