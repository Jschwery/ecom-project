import { useState, useEffect } from "react";
import { TAGS_STARTER, TagsStarterMap } from "../data/tags";
import { MultiValue } from "../pages/AddItem";
import { ActionMeta } from "react-select/dist/declarations/src";

export default function useCategories() {
  const categories: string[] = Object.keys(TAGS_STARTER);
  const [tags, setTags] = useState<MultiValue[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<MultiValue[]>([]);
  const tagsStarter: TagsStarterMap = TAGS_STARTER;
  function isArrayOfMultiValue(value: any): value is ReadonlyArray<MultiValue> {
    return Array.isArray(value);
  }

  function isMultiValue(value: any): value is MultiValue {
    return value && typeof value === "object" && "value" in value;
  }
  const selectCategory = (category: keyof TagsStarterMap) => {
    setSelectedCategory(category);
    const newTags = tagsStarter[category];
    if (newTags) {
      const formattedTags = newTags.map((tag: string) => ({
        label: tag,
        value: tag,
      }));
      setTags(formattedTags);
    } else {
      setTags([]);
    }
  };

  const isMultiValueArray = (value: any): value is MultiValue[] => {
    return Array.isArray(value);
  };

  const handleTagChange = (newValue: MultiValue | MultiValue[] | null) => {
    if (isMultiValueArray(newValue)) {
      setSelectedTags(newValue);
    } else if (newValue) {
      setSelectedTags([newValue]);
    } else {
      setSelectedTags([]);
    }
  };

  return {
    categories,
    tags,
    selectCategory,
    selectedCategory,
    selectedTags,
    handleTagChange,
  };
}
