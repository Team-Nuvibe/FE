import DefaultProfileImage from '@/assets/images/Default_profile_logo.svg';

interface ProfileImageDisplayProps {
    src?: string;
    alt?: string;
    className?: string; // width/height 클래스가 필요합니다 (예: w-[76px] h-[76px])
}

export const ProfileImageDisplay = ({ src, alt = "profile", className = "" }: ProfileImageDisplayProps) => {
    const isDefault = !src || src === DefaultProfileImage;

    // 기본 이미지인 경우, 원본 SVG를 그대로 렌더링 (또는 img 태그 사용)
    if (isDefault) {
        return (
            <div className={`${className} overflow-visible`}>
                <img src={DefaultProfileImage} alt={alt} className="w-full h-full object-cover" />
            </div>
        );
    }

    // Default_profile_logo.svg에서 직접 가져온 지오메트리 값
    // ViewBox: 0 0 77 77
    const viewBoxSize = 77;

    return (
        <div className={`${className} relative`}>
            <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* 1. 기본 로고의 내부 사각형(Diamond shape)과 정확히 일치하는 마스크 정의 */}
                <defs>
                    <clipPath id="innerDiamondMask">
                        {/* 
                            중앙 기준 회전된 사각형:
                            사각형 너비/높이: 53.7867
                            viewBox 중심: (38.5, 38.5)
                            
                            x = 38.5 - 53.7867 / 2 = 11.60665
                            y = 11.60665
                            
                            중심점(38.5, 38.5)을 기준으로 45도 회전
                         */}
                        <rect
                            x="11.60665"
                            y="11.60665"
                            width="53.7867"
                            height="53.7867"
                            rx="18.8765"
                            transform="rotate(45 38.5 38.5)"
                        />
                    </clipPath>
                </defs>

                {/* 2. 배경 원 (기본 로고의 바깥쪽 부분) */}
                <circle cx="38.5" cy="38.5" r="38.0791" fill="#FFFFFF" />

                {/* 3. 내부 다이아몬드 형태로 마스킹된 사용자 이미지 */}
                <image
                    href={src}
                    x="0"
                    y="0"
                    width="77"
                    height="77"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#innerDiamondMask)"
                />
            </svg>
        </div>
    );
};
