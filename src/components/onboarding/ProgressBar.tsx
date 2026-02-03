interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className="flex w-full items-center gap-0.75">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-[2px] w-full flex-1 rounded-[1px] transition-colors duration-300 ${
            index < currentStep ? "bg-gray-200" : "bg-gray-700"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
