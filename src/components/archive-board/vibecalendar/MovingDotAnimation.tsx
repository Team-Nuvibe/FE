const MovingDotAnimation = () => {
  // [수정 1] 원본 이미지와 유사한 S자(지그재그) 형태의 단일 선 Path
  // Top-Right에서 시작 -> 왼쪽 아래로 -> 오른쪽 아래로 -> 왼쪽 아래로 (S자 흐름)
  const pathData = "M 190 60 C 80 140, 60 180, 100 240 S 180 320, 120 400";

  const DURATION = "4s";
  const REPEAT_COUNT = "indefinite"; 

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none">
      
      {/* 안내 텍스트 */}
      <div className="text-center space-y-1 select-none shrink-0 z-10">
        <p className="text-black H2 leading-[150%]">
          손끝을 따라<br />천천히 쓸어보세요
        </p>
      </div>

      {/* SVG 컨테이너 */}
      <div className="relative w-full h-[300px] flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-90"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#333" stopOpacity="1" />
              <stop offset="100%" stopColor="#999" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* 1. 지워지는 전경 라인 */}
          <path
            d={pathData}
            stroke="url(#lineGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            pathLength="1"
            
            // [수정 2] 선(1)과 공백(1) 패턴
            strokeDasharray="1 1"
            
            // 초기값 0 (선이 꽉 차 있음)
            strokeDashoffset="0" 
          >
            {/* [수정 3] 0 -> -1 로 이동하여 위에서부터 지워지도록 변경 */}
            <animate 
              attributeName="stroke-dashoffset"
              values="0; -1" 
              dur={DURATION}
              repeatCount={REPEAT_COUNT}
              fill="freeze"
              calcMode="linear"
            />
          </path>

          {/* 2. 움직이는 점 (위에서 아래로) */}
          <circle r="8" fill="#1a1a1a">
            <animateMotion 
              dur={DURATION} 
              repeatCount={REPEAT_COUNT} 
              path={pathData} 
              rotate="auto"
              fill="freeze"
              calcMode="linear"
              keyPoints="0;1" 
              keyTimes="0;1"
            />
          </circle>
          
          {/* 3. 점 주변 후광 */}
          <circle r="16" fill="#1a1a1a" opacity="0.2">
            <animateMotion 
              dur={DURATION} 
              repeatCount={REPEAT_COUNT} 
              path={pathData} 
              rotate="auto"
              fill="freeze"
              calcMode="linear"
              keyPoints="0;1"
              keyTimes="0;1"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
};

export default MovingDotAnimation;