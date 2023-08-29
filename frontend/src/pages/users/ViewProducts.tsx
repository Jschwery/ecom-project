import React, { useEffect, useState } from "react";
import Pagination from "../../components/util/Pagination";

interface ViewItemsProps {
  showItemsCallback: (items: any[]) => void;
  itemsList: any[];
}

function ViewItems({ showItemsCallback, itemsList }: ViewItemsProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [shownItems, setShownItems] = useState<any[]>([]);

  useEffect(() => {
    if (itemsList) {
      const validItems = itemsList.filter((item) => item && item._id);

      const startIdx = (currentPage - 1) * 4;
      const endIdx = currentPage * 4;
      setShownItems(validItems.slice(startIdx, endIdx));
    }
  }, [itemsList, currentPage]);

  useEffect(() => {
    if (shownItems.length) {
      showItemsCallback(shownItems);
    }
  }, [shownItems]);

  const totalItems = itemsList ? itemsList.filter((p) => p && p._id).length : 0;

  return (
    <div className="inline-flex">
      {totalItems > 0 && (
        <Pagination
          totalItems={totalItems}
          itemsPerPage={4}
          currentPage={currentPage}
          onPageChange={(page: number) => {
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
}

export default ViewItems;
