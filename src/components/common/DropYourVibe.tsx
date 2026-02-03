import LogoSubtract from "@/assets/logos/Subtract.svg?react";

export const DropYourVibe = () => {
  return (
    <button className="relative flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black px-[18px] py-[12px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
      <div className="flex items-center justify-center">
        <LogoSubtract className="h-[21px] w-[21px]" />
      </div>
      <span className="H4 bg-gradient-to-r from-white from-60% to-gray-500 bg-clip-text tracking-tight text-transparent">
        Drop Your Vibe
      </span>
    </button>
  );
};
