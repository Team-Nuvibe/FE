import NuvibeLogo from "@/assets/logos/Subtract.svg?react";

interface DropVibeButtonProps {
  label: string;
  onClick: () => void;
}

const DropVibeButton = ({ label, onClick }: DropVibeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[84px] bg-[#121212] px-[18px] py-3 transition-opacity hover:opacity-90"
      style={{
        backdropFilter: "blur(5.029px)",
        boxShadow: `
          0px 0px 1.676px 0px rgba(0,0,0,0.1),
          0px 0.838px 6.706px 0px rgba(0,0,0,0.1)
        `,
      }}
      aria-label={label}
    >
      {/* 내부 그림자 효과 레이어 */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: `
            inset 2.515px 2.515px 0.419px -2.934px rgba(255,255,255,0.75),
            inset 2.515px 2.515px 0.419px -2.934px rgba(255,255,255,0.8),
            inset 0.838px 0.838px 0.838px 0.419px rgba(255,255,255,0.75),
            inset -0.838px -0.838px 0.838px 0.419px rgba(255,255,255,0.75),
            inset 0px 0px 0.838px 0.838px rgba(255,255,255,0.15),
            inset 0px 0px 0.838px 0.838px #999,
            inset 0px 0px 13.412px 0px #f2f2f2
          `,
        }}
      />

      {/* 아이콘과 텍스트 */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        <NuvibeLogo className="h-[20.955px] w-[20.956px] shrink-0" />
        <p className="H4 shrink-0 bg-linear-to-r from-[#f7f7f7] from-[35.588%] to-[rgba(40,34,34,0.8)] to-[128.08%] bg-clip-text leading-normal tracking-[-0.4px] text-transparent capitalize">
          {label}
        </p>
      </div>
    </button>
  );
};

export default DropVibeButton;
