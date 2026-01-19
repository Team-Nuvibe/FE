import DefaultProfileImage from '@/assets/images/Default_profile_logo.svg';

interface ProfileImageDisplayProps {
    src?: string;
    alt?: string;
    className?: string; // Expecting width/height classes here (e.g., w-[76px] h-[76px])
}

export const ProfileImageDisplay = ({ src, alt = "profile", className = "" }: ProfileImageDisplayProps) => {
    const isDefault = !src || src === DefaultProfileImage;

    // If it's the default image, just render the original SVG (or img tag pointing to it)
    if (isDefault) {
        return (
            <div className={`${className} overflow-visible`}>
                <img src={DefaultProfileImage} alt={alt} className="w-full h-full object-cover" />
            </div>
        );
    }

    // Geometry derived directly from Default_profile_logo.svg
    // ViewBox: 0 0 77 77
    const viewBoxSize = 77;

    return (
        <div className={`${className} relative`}>
            <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* 1. Define the mask using the exact inner rect from the default logo */}
                <defs>
                    <clipPath id="innerDiamondMask">
                        {/* 
                            Original SVG Inner Rect:
                            <rect y="38.0391" width="53.7867" height="53.7867" rx="18.8765" transform="rotate(-45 0 38.0391)" fill="#D9D9D9"/>
                            
                            In SVG clipPath, transforms on the element inside apply to the clip area.
                         */}
                        <rect
                            y="38.0391"
                            width="53.7867"
                            height="53.7867"
                            rx="18.8765"
                            transform="rotate(-45 0 38.0391)"
                        />
                    </clipPath>
                </defs>

                {/* 2. Background Circle (Outer part of the default logo) */}
                {/* <rect width="76.1582" height="76.1582" rx="38.0791" fill="#212224"/> */}
                <circle cx="38.0791" cy="38.0791" r="38.0791" fill="#FFFFFF" />


                {/* 3. The User's Image, masked by the inner diamond */}
                {/* 
                    We need to position the image to cover the mask area. 
                    Since the mask rotates, covering the whole 77x77 area is safest.
                */}
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
