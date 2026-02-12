import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo } from "react";

// 로고/태그: SVG 파일을 React 컴포넌트로 import
import Nuvibe from "@/assets/logos/Nuvibe.svg?react";
import Tag from "@/assets/logos/Tag.svg?react";

// 도형: raw로 읽어서 path d 추출
import rectRaw from "@/assets/logos/Rectangle.svg?raw";
import circleRaw from "@/assets/logos/Circle.svg?raw";
import subtractRaw from "@/assets/logos/Subtract.svg?raw";

// raw SVG에서 첫 번째 path의 d만 추출
function extractFirstPathD(svgRaw: string) {
  const doc = new DOMParser().parseFromString(svgRaw, "image/svg+xml");
  const path = doc.querySelector("path");

  if (path) {
    const d = path.getAttribute("d");
    if (d) return d;
  }

  // path가 없으면 빈 문자열 반환 (에러 방지)
  return "";
}

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  // 각 Layer별 애니메이션 Controller
  const rectCtrl = useAnimation();
  const circleCtrl = useAnimation();
  const ringCtrl = useAnimation();
  const logoCtrl = useAnimation();

  // Path 데이터 추출
  const rectD = useMemo(() => extractFirstPathD(rectRaw), []);
  const circleD = useMemo(() => extractFirstPathD(circleRaw), []);
  const subtractD = useMemo(() => extractFirstPathD(subtractRaw), []);

  useEffect(() => {
    const run = async () => {
      // 1. 초기 상태 강제 설정 (0.0s)
      rectCtrl.set({ rotate: 0, opacity: 1 });
      circleCtrl.set({ opacity: 0 });
      ringCtrl.set({ opacity: 0, rotate: 0 });
      logoCtrl.set({ opacity: 0 });

      // 2. 스케줄링 (setTimeout으로 디자이너님께서 요청해주신 정확한 시점에 트리거)
      // [0.7s] 사각형 회전 시작 (0 -> 45: 시계 방향)
      setTimeout(() => {
        rectCtrl.start({
          rotate: 45,
          transition: { duration: 0.2, ease: "easeInOut" }
        });
      }, 700);

      // [1.3s] 사각형 퇴장 & 원 등장 (Cross-Fade 효과)
      setTimeout(() => {
        rectCtrl.start({
          opacity: 0,
          transition: { duration: 0.4, ease: "easeInOut" }
        });
        circleCtrl.start({
          opacity: 1,
          transition: { duration: 0.4, ease: "easeInOut" }
        });
      }, 1300);

      // [2.3s] 원 퇴장 & 링 등장 (Cross-Fade 효과)
      setTimeout(() => {
        circleCtrl.start({
          opacity: 0,
          transition: { duration: 0.2, ease: "easeInOut" }
        });
        ringCtrl.start({
          opacity: 1,
          transition: { duration: 0.2, ease: "easeInOut" }
        });
      }, 2300);

      // [3.3s] 링 퇴장 & 로고 등장 (Cross-Fade 효과)
      setTimeout(() => {
        ringCtrl.start({
          opacity: 0,
          transition: { duration: 0.1, ease: "easeInOut" }
        });
        logoCtrl.start({
          opacity: 1,
          transition: { duration: 0.1, ease: "easeInOut" }
        });
      }, 3300);

      // [4.0s] 종료
      setTimeout(() => {
        onFinish();
      }, 4000);
    };

    run();
  }, [rectCtrl, circleCtrl, ringCtrl, logoCtrl, onFinish]);

  return (
    <div className="absolute inset-0 z-9999 flex flex-col items-center justify-center bg-[var(--color-black)]">
      <div className="relative flex flex-col items-center justify-center gap-4 -translate-y-14">

        {/* 도형 영역 */}
        <div className="relative w-[77px] h-[77px] flex items-center justify-center">
          <svg viewBox="0 0 77 77" className="absolute inset-0 w-full h-full overflow-visible">
            {/* 1. Rectangle Layer (사각형 - 다이아몬드) */}
            <motion.path
              d={rectD}
              fill="var(--color-white)"
              initial={{ rotate: 0, opacity: 1 }}
              animate={rectCtrl}
              style={{ originX: 0.5, originY: 0.5 }}
            />

            {/* 2. Circle Layer (원) */}
            <motion.path
              d={circleD}
              fill="var(--color-white)"
              initial={{ opacity: 0 }}
              animate={circleCtrl}
            />

            {/* 3. Subtract Layer (링) */}
            <motion.path
              d={subtractD}
              fill="var(--color-white)"
              initial={{ opacity: 0, rotate: 0 }}
              animate={ringCtrl}
              style={{ originX: 0.5, originY: 0.5 }}
            />
          </svg>
        </div>

        <motion.div
          className="absolute flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={logoCtrl}
        >
          <Nuvibe className="w-[246px] h-auto" />
        </motion.div>
      </div>

      <div
        // Tag는 항상 보이도록 구현 (motion 제거한 일반 div)
        className="absolute bottom-20 w-[278px] h-auto"
        style={{ opacity: 1 }}
      >
        <Tag className="w-full h-full text-[#E2E2E2]" />
      </div>
    </div>
  );
};