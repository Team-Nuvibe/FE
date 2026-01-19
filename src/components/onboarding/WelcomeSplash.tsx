import Welcomelogo from "@/assets/logos/Subtract.svg?react";

const WelcomeSplash = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black">
      <Welcomelogo className="h-[53px] w-[53px]" />
      <div className="flex flex-col items-center text-center text-white">
        <p className="H0">Welcome to nuvibe</p>
        <p className="H4">이제 첫 감각을 드롭해보세요!</p>
      </div>
    </div>
  );
};

export default WelcomeSplash;
