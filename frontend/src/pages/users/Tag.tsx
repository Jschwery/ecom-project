import { HStack, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import React from "react";

interface TagProps {
  tagName: string;
  onClose: () => void;
}

function ITag({ tagName, onClose }: TagProps) {
  return (
    <HStack spacing={4}>
      <Tag size={"md"} borderRadius="full" variant="solid" colorScheme="green">
        <TagLabel>{tagName}</TagLabel>
        <TagCloseButton onClick={onClose} />
      </Tag>
    </HStack>
  );
}

export default ITag;
