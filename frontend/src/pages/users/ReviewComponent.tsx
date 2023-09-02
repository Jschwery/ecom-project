import React, { useState } from "react";

function ReviewComponent({
  review,
  correspondingUser,
}: {
  review: any;
  correspondingUser: any;
}) {
  const [isTruncated, setIsTruncated] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const setRef = (node: HTMLDivElement | null) => {
    if (node) {
      if (node.scrollHeight > node.clientHeight) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    }
  };

  return (
    <div className="flex items-center w-[75%] my-3 space-x-5 transition-all duration-500 bg-ca4 rounded-md p-3">
      <img
        className="w-12 h-12 rounded-full"
        src={
          correspondingUser
            ? correspondingUser.profilePicture
            : "/path/to/default/image.jpg"
        }
        alt="Reviewer's profile picture"
      />
      <div className="flex flex-col flex-grow bg-ca3 rounded-md p-1 overflow-hidden">
        <div
          ref={setRef}
          style={{
            transition: "max-height 0.5s ease-in-out",
            overflow: "hidden",
            maxHeight: isTruncated ? "4.7rem" : "1000px",
          }}
        >
          <h3 className={isTruncated ? "line-clamp-3" : ""}>{review.review}</h3>
        </div>
        {showButton && (
          <button
            onClick={() => setIsTruncated(!isTruncated)}
            className="mt-2 text-sm text-blue-500 hover:underline self-end"
          >
            {isTruncated ? "Read more" : "Show less"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewComponent;
