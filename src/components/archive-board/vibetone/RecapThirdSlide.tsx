import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Profile from "@/assets/icons/icon_subtract_vibetone.svg?react"
import { useUserStore } from '@/hooks/useUserStore';

// ----------------------------------------------------------------------
// [1] 애니메이션 설정 (Variants)
// ----------------------------------------------------------------------

// 컨테이너: 자식 요소들을 순차적으로 실행
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // 0.3초 간격으로 자식 애니메이션 실행
      delayChildren: 0.2,
    }
  }
};

// 중앙 이미지: 서서히 커지면서 등장
const centerImageVariants = {
  hidden: { scale: 0.5, opacity: 0, filter: "blur(10px)" },
  visible: { 
    scale: 1, 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 100, damping: 20 }
  }
};

// 텍스트 버블: 팝업 + 둥둥 떠다니기 (Floating)
const bubbleVariants = {
  hidden: { 
    y: 20, 
    opacity: 0, 
    scale: 0.5 
  },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring" as const, 
      stiffness: 200, 
      damping: 15 
    }
  }
};

// 둥둥 떠다니는 모션 (Infinite Loop)
const floatingAnimation = {
  y: [0, -8, 0], // 위로 8px 올라갔다 내려옴
  transition: {
    duration: 3, // 3초 동안
    repeat: Infinity, // 무한 반복
    ease: "easeInOut" as const,
    repeatType: "reverse" as const // 왕복
  }
};

const RecapThirdSlide = ({ isActive, activeTab }: { isActive: boolean; activeTab: 'weekly' | 'all' }) => {
  const { nickname, profileImage } = useUserStore();

  // 날짜 및 드롭 카운트 상태
  const [weekDate, setWeekDate] = useState<{ start: string; end: string }>({
    start: '2026.01.05',
    end: '~01.11'
  });

  // 날짜 포맷팅 함수 (7일 범위)
  const formatWeekDate = (endDate: Date): { start: string; end: string } => {
    const endYear = endDate.getFullYear();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
    const endDay = String(endDate.getDate()).padStart(2, '0');
    
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    const startYear = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
    const startDay = String(startDate.getDate()).padStart(2, '0');
    
    if (startYear === endYear) {
      return {
        start: `${startYear}.${startMonth}.${startDay}`,
        end: `~${endMonth}.${endDay}`
      };
    } else {
      return {
        start: `${startYear}.${startMonth}.${startDay}`,
        end: `~${endYear}.${endMonth}.${endDay}`
      };
    }
  };

  // TODO: API 호출 - 일주일 데이터 가져오기
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const currentDate = new Date();
        setWeekDate(formatWeekDate(currentDate));
      } catch (error) {
        console.error('Failed to fetch weekly data:', error);
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col rounded-[15px] 
      bg-[radial-gradient(ellipse_at_center,#191A1B_0%,#252729_40%,#353739_70%,#454749_100%)] 
      backdrop-blur-[25px] shadow-[inset_0_0_40px_0_rgba(255,255,255,0.25)]">
      
      {/* 헤더 영역 */}
      <div className="pl-[25px] pr-[29px] pt-[22px] pb-4 shrink-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="H2 text-gray-100 leading-[150%] tracking-[-0.5px]">
              {activeTab === 'weekly' ? `${nickname}의 이번주 패턴` : `${nickname}의 패턴`}
            </h1>
            <p className="B2 text-[#B9BDC2] leading-[150%] tracking-[-0.35px]">
              {activeTab === 'weekly' ? '이번 주 기록 흐름' : '기록 흐름'}
            </p>
          </div>
          {activeTab === 'weekly' && (
            <span className="text-[10px] font-light text-gray-100 leading-[150%] text-right">
              {weekDate.start}
              <br />
              {weekDate.end}
            </span>
          )}
        </div>
        
      </div>

      {/* --- [메인 애니메이션 영역] --- */}
      <motion.div 
        key={activeTab} // activeTab이 변경되면 컴포넌트 리마운트하여 애니메이션 재실행
        className="flex-1 relative flex items-center justify-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        {/* 1. 중앙 이미지 (Profile SVG + 내부 이미지) */}
        <motion.div 
          className="relative z-10 w-[160px] h-[160px] flex items-center justify-center"
          variants={centerImageVariants}
        >
          {/* Profile SVG (외곽 프레임) */}
          <Profile className="w-full h-full absolute inset-0" />
          
          {/* 중앙 이미지 */}
          <div className="w-[110px] h-[110px] rounded-[40px] overflow-hidden relative z-10">
            <img 
              src={profileImage}
              alt="pattern center"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* 2. 텍스트 버블들 (절대 위치로 배치) */}
        
        {/* 버블 1 */}
        <motion.div
          className="absolute left-4 bottom-[25%] z-20"
          variants={bubbleVariants}
          // 등장 후 둥둥 떠다니기 추가
          animate={isActive ? floatingAnimation : {}} 
        >
          <div className="backdrop-blur-[7.5px] bg-[rgba(54,56,62,0.8)] border-[0.5px] border-[rgba(228,228,228,0.3)] rounded-[5px] p-[8px]">
            <p className="text-[#E2E2E2] text-[12px] font-medium leading-[1.5] tracking-[-0.3px] whitespace-nowrap">
              하루에 두번 올려요
            </p>
          </div>
        </motion.div>

        {/* 버블 2 */}
        <motion.div
          className="absolute right-6 top-[17%] z-20"
          variants={bubbleVariants}
          animate={isActive ? {
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 0.5 } // 엇박자로 움직이게 딜레이
          } : {}}
        >
          <div className="backdrop-blur-[7.5px] bg-[rgba(54,56,62,0.8)] border-[0.5px] border-[rgba(228,228,228,0.3)] rounded-[5px] p-[8px]">
            <p className="text-[#E2E2E2] text-[12px] font-medium leading-[1.5] tracking-[-0.3px] whitespace-nowrap">
              주로 평일에 드랍해요
            </p>
          </div>
        </motion.div>

        {/* 버블 3 */}
        <motion.div
          className="absolute right-5 bottom-[15%] z-20"
          variants={bubbleVariants}
          animate={isActive ? {
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1.0 } // 엇박자
          } : {}}
        >
          <div className="backdrop-blur-[7.5px] bg-[rgba(54,56,62,0.8)] border-[0.5px] border-[rgba(228,228,228,0.3)] rounded-[5px] p-[8px]">
            <p className="text-[#E2E2E2] text-[12px] font-medium leading-[1.5] tracking-[-0.3px] whitespace-nowrap">
              하루를 시작하며 남겨요
            </p>
          </div>
        </motion.div>

      </motion.div>

      {/* 하단 통계 영역 */}
      <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, type: "spring" }}
          className="px-6 pb-12 w-full"
      >
        <div className="flex justify-between items-start pt-6">
            {/* 통계 1 */}
            <div className="flex gap-1.25">
              <div className="w-1 h-4.25 bg-gray-200 mt-1" /> {/* 흰색 바 */}
              <div className="flex flex-col leading-[150%]">
                  <span className="text-gray-200 ST2 tracking-[-0.4px]">아카이브 보드</span>
                  <span className="text-gray-200 B2 tracking-[-0.35px]">3개</span>
              </div>
            </div>

            {/* 통계 2 */}
            <div className="flex gap-1.25">
              <div className="w-1 h-4.25 bg-gray-200 mt-1" /> {/* 흰색 바 */}
              <div className="flex flex-col leading-[150%]">
                  <span className="text-gray-200 ST2 tracking-[-0.4px]">사용한 태그</span>
                  <span className="text-gray-200 B2 tracking-[-0.35px]">4개</span>
              </div>
            </div>

            {/* 통계 3 */}
            <div className="flex gap-1.25">
              <div className="w-1 h-4.25 bg-gray-200 mt-1" /> {/* 흰색 바 */}
              <div className="flex flex-col leading-[150%]">
                  <span className="text-gray-200 ST2 tracking-[-0.4px]">하루 평균 기록</span>
                  <span className="text-gray-200 B2 tracking-[-0.35px]">1일 2회</span>
              </div>
            </div>
        </div>
      </motion.div>

    </div>
  );
};

export default RecapThirdSlide;
