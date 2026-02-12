export interface ImageResponse {
  imageURL: string;
  fileName: string;
  imageId: number;
  imageTag: string;
}

// 이미지 상세정보 조회 응답
export interface ImageDetailResponse {
  userName: string;
  boardName: string;
  imageTag: string;
  imageUrl: string;
  createdAt: string;
}
