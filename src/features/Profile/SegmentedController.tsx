import { Container, Flex, SegmentedControl, createStyles } from "@mantine/core";
import { ProfileButtonOptions } from "@/data-schema/enums";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? `${(theme.colors.gray[6], 0.5)}`
        : theme.white,
    boxShadow: theme.shadows.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    }`,
  },

  active: {
    backgroundImage: theme.fn.gradient({ from: "yellow", to: "orange" }),
  },

  control: {
    border: "0 !important",
  },

  labelActive: {
    color: `${theme.white} !important`,
  },
}));

export const SegmentedController = ({
  handleSelection,
}: {
  handleSelection: (value: ProfileButtonOptions) => void;
}) => {
  const { classes } = useStyles();

  return (
    <Container>
      <Flex justify="center">
        <SegmentedControl
          radius="xl"
          size="lg"
          data={[
            ProfileButtonOptions.NFT_IMAGE,
            ProfileButtonOptions.CONTRACT,
            ProfileButtonOptions.METADATA,
          ]}
          classNames={classes}
          onChange={(value: ProfileButtonOptions) => handleSelection(value)}
        />
      </Flex>
    </Container>
  );
};
