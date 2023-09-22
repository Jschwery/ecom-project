import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tooltip,
  useTheme,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import StarRating from "../StarRating";
import { TAGS_STARTER } from "../../data/tags";
import { MultiSelect } from "react-multi-select-component";
export type Option = {
  value: string | number;
  label: string;
};

interface ProductProps {
  priceFilterCallback?: (priceValue: number) => void;
  tagFilterCallback?: (tags: Option[]) => void;
  starRatingCallback?: (starRating: number) => void;
  isMinimized?: (isMinimized: boolean) => void;
  isEnabled?: (
    filtersEnabled: {
      filterName: string;
      value: boolean;
    }[]
  ) => void;
  price?: number;
}

function ProductFilters({
  priceFilterCallback,
  tagFilterCallback,
  starRatingCallback,
  isMinimized,
  isEnabled,
  price,
}: ProductProps) {
  const [sliderValues, setSliderValues] = useState([5]);
  const [showTooltips, setShowTooltips] = useState([false]);
  const [productRating, setProductRating] = useState<number>(-1);
  const [tags, setTags] = useState<Option[]>([]);
  const [selected, setSelected] = useState([]);
  const { colors } = useTheme();
  const tagObj = { ...TAGS_STARTER };
  const [minimize, setMinimize] = useState(false);
  const [filtersEnabled, setFiltersEnabled] = useState<
    { filterName: string; value: boolean }[]
  >([
    { filterName: "priceFilter", value: false },
    { filterName: "tagFilter", value: false },
    { filterName: "ratingFilter", value: false },
  ]);
  useEffect(() => {
    let tempTags = new Set<string>();

    for (let [key, values] of Object.entries(tagObj)) {
      values.forEach((value) => {
        tempTags.add(value);
      });
    }
    const tagOptions: Option[] = Array.from(tempTags).map((tag) => ({
      value: tag,
      label: tag,
    }));
    setTags(tagOptions);
  }, []);

  useEffect(() => {
    if (!isMinimized) {
      return;
    }
    isMinimized(minimize);
  }, [minimize]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    isEnabled(filtersEnabled);
  }, [filtersEnabled]);

  const handleSliderChange = (index: number, value: number) => {
    const newSliderValues = [...sliderValues];
    newSliderValues[index] = value;
    setSliderValues(newSliderValues);
  };
  const handleMouseEnter = (index: number) => {
    const newShowTooltips = [...showTooltips];
    newShowTooltips[index] = true;
    setShowTooltips(newShowTooltips);
  };

  const handleMouseLeave = (index: number) => {
    const newShowTooltips = [...showTooltips];
    newShowTooltips[index] = false;
    setShowTooltips(newShowTooltips);
  };

  useEffect(() => {
    if (!sliderValues) {
      return;
    }
    if (priceFilterCallback) {
      priceFilterCallback(sliderValues[0]);
    }
  }, [sliderValues]);

  useEffect(() => {
    if (!selected) {
      return;
    }
    if (tagFilterCallback) {
      tagFilterCallback(selected);
    }
  }, [selected]);
  useEffect(() => {
    if (!productRating) {
      return;
    }
    if (starRatingCallback) {
      starRatingCallback(productRating);
    }
  }, [productRating]);

  const toggleFilter = (filterName: string) => {
    setFiltersEnabled((prevFilters) =>
      prevFilters.map((filter) =>
        filter.filterName === filterName
          ? { ...filter, value: !filter.value }
          : filter
      )
    );
  };

  return (
    <div className={`min-h-0 h-auto w-full min-w-0 sticky top-16`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={`w-6 h-6 absolute top-5 cursor-pointer transition-all duration-500 ${
          minimize ? "left-5 rotate-180" : "right-5"
        }`}
        onClick={() => {
          setMinimize((prevState) => {
            return !prevState;
          });
        }}
        style={{ background: "transparent", zIndex: 40 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <div
        className={`wrapper transition-all z-50 duration-500 ${
          minimize ? "" : "is-open"
        }`}
      >
        <div className="inner">
          <div className={`w-full flex grow flex-col space-y-6 p-12`}>
            <h1>Filter By:</h1>
            <div className="flex h-18 flex-col space-y-2 z-50">
              <h3>Tags</h3>
              <div className="flex space-x-2 items-center z-50">
                <p className="pt-0.5"> Enable Tag Filter</p>

                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={
                    filtersEnabled.find(
                      (filter) => filter.filterName === "tagFilter"
                    )?.value || false
                  }
                  onChange={() => toggleFilter("tagFilter")}
                />
              </div>
              <MultiSelect
                options={tags}
                value={selected}
                onChange={setSelected}
                labelledBy="Select"
                className="!z-50"
              />
            </div>

            {sliderValues.map((sliderValue, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <h3>Price</h3>
                <div className="flex space-x-2 items-center">
                  <p className="pt-0.5"> Enable Price Filter</p>

                  <input
                    className="cursor-pointer "
                    type="checkbox"
                    checked={
                      filtersEnabled.find(
                        (filter) => filter.filterName === "priceFilter"
                      )?.value || false
                    }
                    onChange={() => toggleFilter("priceFilter")}
                  />
                </div>
                <Slider
                  id={`slider${index + 1}`}
                  defaultValue={sliderValue}
                  min={0}
                  max={100}
                  colorScheme={colors.ca8}
                  onChange={(v) => handleSliderChange(index, v)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
                    25%
                  </SliderMark>
                  <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
                    50%
                  </SliderMark>
                  <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
                    75%
                  </SliderMark>
                  <SliderTrack>
                    <SliderFilledTrack bg={colors.ca5} />
                  </SliderTrack>

                  <Tooltip
                    hasArrow
                    bg={colors.ca7}
                    color="white"
                    placement="top"
                    isOpen={showTooltips[index]}
                    label={price ? price : ""}
                  >
                    <SliderThumb />
                  </Tooltip>
                </Slider>
              </div>
            ))}

            <div className="flex flex-col space-y-2">
              <h3>Rating</h3>
              <div className="flex space-x-2 items-center">
                <p className="pt-0.5"> Enable Rating Filter</p>

                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={
                    filtersEnabled.find(
                      (filter) => filter.filterName === "ratingFilter"
                    )?.value || false
                  }
                  onChange={() => toggleFilter("ratingFilter")}
                />
              </div>
              <StarRating
                value={productRating || 0}
                onChange={(value: number | null) => {
                  if (productRating === value) {
                    setProductRating((rating) => rating - 1);
                    return;
                  }
                  setProductRating(value || 0);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductFilters;
