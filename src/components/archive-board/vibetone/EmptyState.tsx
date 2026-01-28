import VibeToneNoDataIcon from "@/assets/icons/icon_vibetone_nodata.svg?react";

interface EmptyStateProps {
  className?: string;
}

const EmptyState = ({ className = "" }: EmptyStateProps) => {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-[15px] bg-[radial-gradient(ellipse_at_center,#121212_0%,#1B1C1D_40%,#1C1C1D_70%,#222223_100%)] shadow-[inset_0_0_40px_0_rgba(255,255,255,0.25)] backdrop-blur-[25px] ${className}`}
    >
      <div className={`flex flex-col items-center justify-center`}> </div>
      <VibeToneNoDataIcon className="mb-4" />
      <p className="H4 leading-[150%] tracking-[-0.4px] text-gray-500">
        아직 쌓인 바이브가 없어요
      </p>
    </div>
  );
};

export default EmptyState;
