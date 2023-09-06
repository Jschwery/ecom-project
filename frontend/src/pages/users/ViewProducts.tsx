import React, { Ref, forwardRef, useEffect, useState } from "react";
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
      () => itemsList.filter((item) => item && item._id),
      [itemsList]
    );

    useEffect(() => {
      if (validItems.length) {
        const startIdx = (currentPage - 1) * 4;
        const endIdx = currentPage * 4;
        setShownItems(validItems.slice(startIdx, endIdx));
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
