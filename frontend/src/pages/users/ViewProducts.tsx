import React, { forwardRef, useEffect, useState } from "react";
import Pagination from "../../components/util/Pagination";

interface ViewItemsProps {
  showItemsCallback: (items: any[]) => void;
  itemsList: any[];
}

const ViewItems = forwardRef(
  (props: ViewItemsProps, ref?: React.Ref<HTMLDivElement>) => {
    const { showItemsCallback, itemsList } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [shownItems, setShownItems] = useState<any[]>([]);
    const validItems = React.useMemo(
      () => [...itemsList].filter((item) => item && item._id),
      [itemsList]
    );

    useEffect(() => {
      if (validItems.length) {
        const startIdx = (currentPage - 1) * 4;
        const endIdx = currentPage * 4;
        const newShownItems = validItems.slice(startIdx, endIdx);
        if (JSON.stringify(newShownItems) !== JSON.stringify(shownItems)) {
          setShownItems(newShownItems);
        }
      }
    }, [validItems, currentPage]);

    useEffect(() => {
      if (shownItems.length) {
        showItemsCallback(shownItems);
      }
    }, [shownItems]);

    const totalItems = validItems.length;

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
      <div ref={ref} className="inline-flex">
        {totalItems > 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={4}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    );
  }
);
export default ViewItems;
