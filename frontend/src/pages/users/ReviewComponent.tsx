import { useLayoutEffect, useRef, useState } from "react";

export default function ReviewComponent({
  review,
  correspondingUser,
}: {
  review: any;
  correspondingUser: any;
}) {
  const [isTruncated, setIsTruncated] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const checkScrollableContent = () => {
    if (contentRef.current) {
      const node = contentRef.current;
      if (node.scrollHeight > node.clientHeight) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    }
  };

  const handleToggleContent = () => {
    setIsTruncated((prevState) => !prevState);
  };

  useLayoutEffect(() => {
    checkScrollableContent();
  }, [review.review]);

  return (
    <div className="flex flex-col items-center w-[75%] my-3 space-x-5 transition-all duration-500 bg-ca4 rounded-md p-3">
      <div className="flex w-full space-x-5">
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
            ref={contentRef}
            style={{
              transition: "max-height 0.5s ease-in-out",
              overflow: "hidden",
              maxHeight: isTruncated ? "5.5rem" : "1000px",
            }}
          >
            <h3 className={isTruncated ? "line-clamp-3" : ""}>
              {review.review}
            </h3>
          </div>
          {showButton && (
            <button
              onClick={handleToggleContent}
              className="mt-2 text-sm text-blue-500 hover:underline self-end"
            >
              {isTruncated ? "Read more" : "Show less"}
            </button>
          )}
        </div>
      </div>
      <div className="self-start items-center flex !ml-0 ">
        {review.rating && <p className="mt-1 mr-2 font-bold">Rating:</p>}
        {review.rating &&
          Array(review.rating)
            .fill(null)
            .map((_, indx) => (
              <svg
                key={indx}
                xmlns="http://www.w3.org/2000/svg"
                fill="yellow"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="none"
                className="w-6 h-6 my-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            ))}
      </div>
    </div>
  );
}
