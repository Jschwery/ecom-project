import { HStack, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";

interface TagProps {
  tagName: string;
  onClose?: () => void;
}

function ITag({ tagName, onClose }: TagProps) {
  return (
    <HStack spacing={4}>
      <Tag
        mb={1}
        size={"md"}
        borderRadius="full"
        variant="solid"
        sx={{ bg: "ca7" }}
      >
        <TagLabel>{tagName}</TagLabel>
        {onClose && <TagCloseButton onClick={onClose} />}
      </Tag>
    </HStack>
  );
}

export default ITag;
