import { useEffect, useRef, useState } from "react";
import { Text } from "@chakra-ui/react";
interface UploadFile {
  maxFileSize?: number;
  fileCallback?: (fileString: string) => void;
}

const FileUpload = ({
  maxFileSize = 5 * (1024 * 1024),
  fileCallback,
}: UploadFile) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userImage, setUserImage] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [closeUser, setCloseUser] = useState(false);

  function isValidFile(file: File) {
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    return validTypes.includes(file.type) && file.size <= maxFileSize;
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = function () {
        setUserImage(reader.result as string);
        setCloseUser(true);
      };
      reader.readAsDataURL(file);
    } else {
      alert(
        "Invalid file. Please upload a jpeg, png, or svg image and ensure it's under 5MB."
      );
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];

    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setCloseUser(true);

      const reader = new FileReader();
      reader.onloadend = function () {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert(
        "Invalid file. Please upload a jpeg, png, or svg image and ensure it's under 2MB."
      );
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  useEffect(() => {
    setCloseUser(userImage !== "");
  }, [userImage]);

  useEffect(() => {
    if (userImage && fileCallback) {
      fileCallback(userImage);
    }
  }, [userImage]);

  return (
    <div
      className={`w-full rounded-md py-7 flex justify-center items-center ${
        isDragOver ? "bg-ca7" : "bg-ca6"
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div>
        <div className="w-full flex">
          <div className="w-full flex flex-col justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>

            <Text
              fontSize="md"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer text-white"
              textAlign={"center"}
            >
              <span className="font-bold text-white">Choose a file</span>
              <br /> or <br /> drag it here
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
