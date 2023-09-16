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
type Option = {
  value: string | number;
  label: string;
};

interface ProductProps {
  priceFilterCallback?: (priceValue: number) => void;
  dateFilterCallback?: (ascDesc: boolean) => void;
  tagFilterCallback?: (tags: Option[]) => void;
  starRatingCallback?: (starRating: number) => void;
}
function ProductFilters({
  priceFilterCallback,
  dateFilterCallback,
  tagFilterCallback,
  starRatingCallback,
}: ProductProps) {
  const [sliderValues, setSliderValues] = useState([5]);
  const [showTooltips, setShowTooltips] = useState([false]);
  const [productRating, setProductRating] = useState<number>(-1);
  const [ascDesc, setAscDesc] = useState(false);
  const [tags, setTags] = useState<Option[]>([]);
  const [selected, setSelected] = useState([]);
  const { colors } = useTheme();
  const tagObj = { ...TAGS_STARTER };

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
    if (!ascDesc) {
      return;
    }
    if (dateFilterCallback) {
      dateFilterCallback(ascDesc);
    }
  }, [ascDesc]);
  useEffect(() => {
    if (!tags) {
      return;
    }
    if (tagFilterCallback) {
      tagFilterCallback(tags);
    }
  }, [tags]);
  useEffect(() => {
    if (!productRating) {
      return;
    }
    if (starRatingCallback) {
      starRatingCallback(productRating);
    }
  }, [productRating]);

  return (
    <div className="w-full h-screen">
      <div className="w-1/2 mx-auto">
        <div className="w-full flex flex-col space-y-6 p-12">
          {sliderValues.map((sliderValue, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <h3>Price Filter</h3>
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
                  label={`${sliderValue}%`}
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
            </div>
          ))}

          <div className="flex flex-col space-y-2">
            <h3>Filter Date</h3>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
              <h5>Date {ascDesc ? "desc" : "asc"}</h5>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                onClick={() => setAscDesc(!ascDesc)}
                className={`w-5 cursor-pointer h-5 transition-all duration-500 ${
                  !ascDesc ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <h3>Tags</h3>

            <MultiSelect
              options={tags}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </div>
          <StarRating
            value={productRating || 0}
            onChange={function (value: number | null): void {
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
  );
}

export default ProductFilters;
