import { useLocation, useNavigate } from "react-router";
import { ImageEditor } from "../../components/features/ImageEditor";
import { useState } from "react";
import { TagSelector } from "../../components/features/TagSelector";

export const QuickdropPage = () => {
  const location = useLocation();
  const { file } = location.state || {};

  const [step, setStep] = useState<"edit" | "tag" | "board">("edit");
  const [imageData, setImageData] = useState<{
    image: Blob | null;
    tag: string;
    board: number | null;
  }>({
    image: null,
    tag: "",
    board: null,
  });

  return (
    <div className="flex flex-col w-full h-dvh">
      {step === "edit" && (
        <ImageEditor
          file={file}
          onNext={(blob) => {
            setImageData((prev) => ({ ...prev, image: blob }));
            setStep("tag");
          }}
        />
      )}
      {step === "tag" && (
        <TagSelector
          onNext={(selectedTag) => {
            setImageData((prev) => ({ ...prev, tag: selectedTag }));
            setStep("board");
          }}
        />
      )}
    </div>
  );
};
