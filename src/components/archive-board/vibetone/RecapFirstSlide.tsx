import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { useUserStore } from "@/hooks/useUserStore";

// GravityTags 컴포넌트 - 물리 엔진 기반 태그 애니메이션
// ----------------------------------------------------------------------
const GravityTags = ({
  isActive,
  activeTab,
}: {
  isActive: boolean;
  activeTab: "weekly" | "all";
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isReady, setIsReady] = useState(false);

  // 태그 데이터 (외부에서 props로 받을 수도 있지만 일단 내부에 정의)
  const tags = [
    {
      text: "#Minimal",
      h: 105,
      fontSize: 50,
      fontWeight: 500,
      paddingInline: 30,
      paddingBlock: 15,
    },
    {
      text: "#Vintage",
      h: 88,
      fontSize: 44,
      fontWeight: 500,
      paddingInline: 22,
      paddingBlock: 11,
    },
    {
      text: "#Street",
      h: 72,
      fontSize: 33.231,
      fontWeight: 500,
      paddingInline: 16.62,
      paddingBlock: 11.08,
    },
    {
      text: "#Cozy",
      h: 56,
      fontSize: 28,
      fontWeight: 500,
      paddingInline: 14,
      paddingBlock: 7,
    },
    {
      text: "#Modern",
      h: 42,
      fontSize: 20,
      fontWeight: 500,
      paddingInline: 12,
      paddingBlock: 6,
    },
  ];

  // [1단계] DOM 요소의 실제 너비 측정
  useEffect(() => {
    if (!isActive) {
      setIsReady(false);
      return;
    }

    const timer = setTimeout(() => {
      const allMeasured = tagRefs.current.every(
        (ref) => ref !== null && ref.offsetWidth > 0,
      );
      if (allMeasured) {
        setIsReady(true);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isActive, activeTab]);

  // [2단계] 측정 완료 후 물리 엔진 초기화
  useEffect(() => {
    if (!sceneRef.current || !isReady) return;

    const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Events = Matter.Events;

    const engine = Engine.create();
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // 벽과 바닥 생성
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(
      width / 2,
      height + 30,
      width,
      60,
      wallOptions,
    );
    const leftWall = Bodies.rectangle(
      -30,
      height / 2,
      60,
      height * 2,
      wallOptions,
    );
    const rightWall = Bodies.rectangle(
      width + 30,
      height / 2,
      60,
      height * 2,
      wallOptions,
    );

    // 측정된 실제 너비로 물리 바디 생성
    const tagBodies = tags.map((tagData, index) => {
      const domNode = tagRefs.current[index];
      const measuredWidth = domNode?.offsetWidth || 100;
      const x = Math.random() * (width - measuredWidth) + measuredWidth / 2;
      const y = -Math.random() * 500 - 100;

      return Bodies.rectangle(x, y, measuredWidth, tagData.h, {
        restitution: 0.5,
        friction: 0.5,
        angle: (Math.random() - 0.5) * 1,
      });
    });

    Composite.add(engine.world, [ground, leftWall, rightWall, ...tagBodies]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // 렌더링 루프
    const updateLoop = () => {
      tagBodies.forEach((body, index) => {
        const domNode = tagRefs.current[index];

        if (domNode) {
          const { x, y } = body.position;
          const rotation = body.angle;

          const measuredWidth = domNode.offsetWidth;
          const measuredHeight = domNode.offsetHeight;

          const xPos = x - measuredWidth / 2;
          const yPos = y - measuredHeight / 2;

          domNode.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) rotate(${rotation}rad)`;

          if (y > -100) domNode.style.opacity = "1";
        }
      });
    };

    Events.on(engine, "afterUpdate", updateLoop);

    return () => {
      Runner.stop(runner);
      Matter.Engine.clear(engine);
      Composite.clear(engine.world, false);
      Events.off(engine, "afterUpdate", updateLoop);
    };
  }, [isReady]);

  return (
    <div ref={sceneRef} className="relative h-full w-full overflow-hidden px-4">
      {tags.map((tag, index) => (
        <div
          key={index}
          ref={(el) => {
            tagRefs.current[index] = el;
          }}
          className="absolute top-0 left-0 flex items-center justify-center rounded-[10px] border border-solid border-[#36383e] bg-[rgba(71,74,80,0.6)] whitespace-nowrap will-change-transform select-none"
          style={{
            opacity: isReady ? 0 : 1,
            height: `${tag.h}px`,
            fontSize: `${tag.fontSize}px`,
            fontWeight: tag.fontWeight,
            paddingInline: `${tag.paddingInline}px`,
            paddingBlock: `${tag.paddingBlock}px`,
            letterSpacing: `-${tag.fontSize * 0.025}px`,
          }}
        >
          <span
            className="bg-gradient-to-r from-[#f7f7f7] to-[rgba(247,247,247,0.5)] bg-clip-text"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            {tag.text}
          </span>
        </div>
      ))}
    </div>
  );
};

const RecapFirstSlide = ({
  isActive,
  activeTab,
}: {
  isActive: boolean;
  activeTab: "weekly" | "all";
}) => {
  const { nickname } = useUserStore();
  // TODO: API 연동 - 일주일 날짜와 드랍 수 데이터
  const [weekDate, setWeekDate] = useState<{ start: string; end: string }>({
    start: "2026.01.05",
    end: "~01.11",
  });
  const [dropCount, setDropCount] = useState<number>(1);

  // 날짜 포맷팅 함수 (7일 범위: 줄바꿈 포함)
  const formatWeekDate = (endDate: Date): { start: string; end: string } => {
    // 종료일 (현재 날짜)
    const endYear = endDate.getFullYear();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
    const endDay = String(endDate.getDate()).padStart(2, "0");

    // 시작일 (7일 전 = 종료일 - 6일)
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    const startYear = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    const startDay = String(startDate.getDate()).padStart(2, "0");

    // 연도가 같으면 시작일에는 연도 생략
    if (startYear === endYear) {
      return {
        start: `${startYear}.${startMonth}.${startDay}`,
        end: `~${endMonth}.${endDay}`,
      };
    } else {
      // 연도가 다르면 둘 다 표시
      return {
        start: `${startYear}.${startMonth}.${startDay}`,
        end: `~${endYear}.${endMonth}.${endDay}`,
      };
    }
  };

  // TODO: API 호출 - 일주일 데이터 가져오기
  useEffect(() => {
    // 추후 API 엔드포인트 연동
    const fetchWeeklyData = async () => {
      try {
        // TODO: 실제 API 호출로 교체
        // const response = await fetch('/api/vibetone/weekly-recap');
        // const data = await response.json();
        // setWeekDate(formatWeekDate(new Date(data.weekStartDate)));
        // setDropCount(data.dropCount);

        // 현재는 임시 데이터 사용
        // 예시: 현재 날짜 기반으로 설정
        const currentDate = new Date();
        setWeekDate(formatWeekDate(currentDate));
        setDropCount(1);
      } catch (error) {
        console.error("Failed to fetch weekly data:", error);
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col rounded-[15px] bg-[radial-gradient(ellipse_at_center,#191A1B_0%,#252729_40%,#353739_70%,#454749_100%)] shadow-[inset_0_0_40px_0_rgba(255,255,255,0.25)] backdrop-blur-[25px]">
      {/* 헤더 영역 */}
      <div className="z-10 shrink-0 pt-[22px] pr-[29px] pb-4 pl-[25px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="H2 leading-[150%] tracking-[-0.5px] text-gray-100">
              {activeTab === "weekly"
                ? `${nickname}의 이번주 바이브 태그`
                : `${nickname}의 바이브 태그`}
            </h1>
            <p className="B2 leading-[150%] tracking-[-0.35px] text-[#B9BDC2]">
              {activeTab === "weekly"
                ? "이번 주 가장 많이 쌓인 보드"
                : `총 드랍 ${dropCount}개`}
            </p>
          </div>
          {activeTab === "weekly" && (
            <span className="text-right text-[10px] leading-[150%] font-light text-gray-100">
              {weekDate.start}
              <br />
              {weekDate.end}
            </span>
          )}
        </div>
      </div>

      {/* 물리 엔진 영역 */}
      <div className="relative flex-1">
        <GravityTags
          key={activeTab}
          isActive={isActive}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default RecapFirstSlide;
