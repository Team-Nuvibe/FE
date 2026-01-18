import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/hooks/useUserStore';
import FolderIcon from '@/assets/icons/icon_folder_vibetone.svg?react';

const RecapSecondSlide = ({ isActive, activeTab }: { isActive: boolean; activeTab: 'weekly' | 'all' }) => {
  const { nickname } = useUserStore();

  // 초기 상태는 false (닫힘)
  const [isOpen, setIsOpen] = useState(false);

  // 테스트용 이미지
  const images = [
    "https://drive.google.com/thumbnail?id=1GSrTDxIbpF51wLBnC54gNDKJs_qf0UOb&sz=w1000", 
    "https://drive.google.com/thumbnail?id=1NiYVh5jdbPlQl_mrXkDS3zH8G1NZBi0Y&sz=w1000", 
    "https://drive.google.com/thumbnail?id=1mcn0PnuftGvBxPqhtizGxQWbJXw1_5j6&sz=w1000", 
  ];
  const [weekDate, setWeekDate] = useState<{ start: string; end: string }>({
    start: '2026.01.05',
    end: '~01.11'
  });
  const [dropCount, setDropCount] = useState<number>(1);

  // 날짜 포맷팅 함수 (7일 범위: 줄바꿈 포함)
  const formatWeekDate = (endDate: Date): { start: string; end: string } => {
    // 종료일 (현재 날짜)
    const endYear = endDate.getFullYear();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
    const endDay = String(endDate.getDate()).padStart(2, '0');
    
    // 시작일 (7일 전 = 종료일 - 6일)
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    const startYear = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
    const startDay = String(startDate.getDate()).padStart(2, '0');
    
    // 연도가 같으면 시작일에는 연도 생략
    if (startYear === endYear) {
      return {
        start: `${startYear}.${startMonth}.${startDay}`,
        end: `~${endMonth}.${endDay}`
      };
    } else {
      // 연도가 다르면 둘 다 표시
      return {
        start: `${startYear}.${startMonth}.${startDay}`,
        end: `~${endYear}.${endMonth}.${endDay}`
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
        console.error('Failed to fetch weekly data:', error);
      }
    };

    fetchWeeklyData();
  }, []);

  // 슬라이드가 활성화되거나 activeTab이 변경될 때 애니메이션 시작
  useEffect(() => {
    if (isActive) {
      // 슬라이드가 활성화되면 애니메이션 리셋 후 시작
      setIsOpen(false);
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300); // 0.3초 후 애니메이션 시작

      return () => clearTimeout(timer);
    } else {
      // 슬라이드가 비활성화되면 닫힌 상태로 리셋
      setIsOpen(false);
    }
  }, [isActive, activeTab]);

  // ===== 이미지 위치 조정 영역 =====
  const CENTER_IMAGE_Y = -25;  // 가운데 이미지 위치 (위로 올릴수록 음수 증가)
  const SIDE_IMAGE_Y = -40;     // 양옆 이미지 위치 (위로 올릴수록 음수 증가)
  // =========================================================

  // 이미지 애니메이션 변수
  const imageVariants = {
    closed: { 
      y: 100, 
      scale: 0.8,
      opacity: 0,
      rotate: 0,
    },
    open: (index: number) => ({
      y: index === 1 ? CENTER_IMAGE_Y : SIDE_IMAGE_Y,  // 상수 사용
      scale: 1,
      opacity: 1,
      rotate: (index - 1) * 20, 
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 18,
        delay: index * 0.1, 
      }
    })
  };

  return (
    <div className="w-full h-full relative flex flex-col rounded-[15px] 
      bg-[radial-gradient(ellipse_at_center,#191A1B_0%,#252729_40%,#353739_70%,#454749_100%)] 
      backdrop-blur-[25px] shadow-[inset_0_0_40px_0_rgba(255,255,255,0.25)]">
      {/* 헤더 영역 */}
      <div className="pl-[25px] pr-[29px] pt-[22px] pb-4 shrink-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="H2 text-gray-100 leading-[150%] tracking-[-0.5px]">
              {activeTab === 'weekly' ? `${nickname}의 이번주 아카이브` : `${nickname}의 아카이브`}
            </h1>
            <p className="B2 text-[#B9BDC2] leading-[150%] tracking-[-0.35px]">
              {activeTab === 'weekly' ? '이번 주 가장 많이 쌓인 보드' : '가장 많이 쌓인 보드'}
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
      
      {/* --- [폴더 애니메이션 본체] --- */}
      <div 
        className="relative w-[280px] h-[220px] mx-auto mt-12 mb-4"
      >
        {/* 배경 광원 효과 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        {/* 1. Folder Back (뒷면) */}
        <div className="absolute bottom-4 w-[215px] h-[195px] left-1/2 -translate-x-1/2 bg-gray-800 opacity-50 rounded-[10px] border-[0.5px] border-solid border-[#36383E]" data-name="퀵드랍4" data-node-id="6895:11830" />

        {/* 2. Images (중간 레이어 - 팝업 애니메이션) */}
        <div className="absolute bottom-4 left-0 w-full h-full flex items-end justify-center z-10 pointer-events-none">
          <AnimatePresence>
            {images.map((src, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={imageVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                className={`absolute rounded-[5px] overflow-hidden border-[3px]shadow-2xl origin-bottom ${
                  index === 1 
                    ? 'w-[149px] h-[198px]' 
                    : 'w-[110px] h-[146px]'
                }`}
                style={{
                    zIndex: index === 1 ? 20 : 10,
                    x: (index - 1) * 50
                }}
              >
                <img src={src} alt="archive" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 3. Folder Front  */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[227px] h-[140px] z-30">
          <div className="absolute inset-[-19.92%_-4.39%_0_-4.39%]">
            <FolderIcon />
          </div>
        </div>

      </div>

      {/* 하단 정보 영역 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isOpen ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full pb-[24.87px] px-[27.5px]"
      >
        <div className="flex justify-between items-end gap-9">
            <div className="flex flex-col">
              <p className="text-gray-600 B2 leading-[150%] tracking-[-0.35px]">13회 드랍</p>
              <h1 className="H2 text-white leading-[150%] tracking-[-0.5px]">
                애나하나다하개아<br/>다고나디아아아
              </h1>
            </div>
            <button className="w-[132px] h-[36px] mx-auto leading-[150%] tracking-[-0.35px] bg-gray-300 text-gray-800 font-medium text-[14px] rounded-[5px] hover:bg-white transition-colors tracking-[-0.35px]">
              보드 방문하기
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecapSecondSlide;
