import IconRectangleGray3 from "@/assets/icons/icon_rectangle_gray3.svg?react";

interface VibeDropModalProps {
  tag: string;
  onClose?: () => void;
  onClick: () => void;
  imageUrl: string;
}

export const VibeDropModal = ({
  tag,
  onClose,
  onClick,
  imageUrl,
}: VibeDropModalProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[15px] border-[1px] border-gray-800 bg-gray-900 px-[20px] py-[27px]">
      <IconRectangleGray3 className="w-[18px]" />
      <div className="flex flex-col items-center gap-2">
        <p className="H4 tracking-tight text-white">
          #{tag[0] + tag.slice(1).toLowerCase()} 트라이브챗
        </p>
        <p className="text-center text-[12px] font-normal tracking-tight text-gray-300">
          더 많은 사람들과 바이브를 나눌 수 있어요.
          <br />
          입장해볼까요?
        </p>
      </div>
      <div className="relative mt-4 mb-8">
        <div className="aspect-3/4 w-[96px] -rotate-[20deg] rounded-[5px] bg-gray-300/60 blur-[1px]"></div>
        <div className="absolute top-0 aspect-3/4 w-[96px] -rotate-[10deg] rounded-[5px] bg-gray-200 blur-[1px]"></div>
        <div
          className="absolute top-0 aspect-3/4 w-[96px] rotate-0 rounded-[5px]"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
      <div className="flex justify-between gap-2">
        <button
          className="flex w-[120px] items-center justify-center rounded-[5px] bg-gray-800 py-[6px]"
          onClick={onClose}
        >
          <p className="text-[14px] font-medium tracking-tight text-gray-300">
            돌아가기
          </p>
        </button>
        <button
          className="flex w-[120px] items-center justify-center rounded-[5px] bg-gray-300 py-[6px]"
          onClick={onClick}
        >
          <p className="text-[14px] font-medium tracking-tight text-gray-800">
            바이브 드랍하기
          </p>
        </button>
      </div>
    </div>
  );
};
