import { useParams } from "react-router-dom";
import Img_3 from "@/assets/images/img_3.png";
import Icon_backbutton from "@/assets/icons/icon_backbutton.svg?react";

export const TagDetailPage = () => {
  const { tagid } = useParams<{ tagid: string }>();

  return (
    <div className="flex flex-col w-full min-h-full">
      <section className="relative flex flex-col justify-between h-[50dvh] bg-cover bg-bottom bg-no-repeat shrink-0">
        <div
          className="absolute inset-0 w-full h-full object-cover bg-bottom bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${Img_3})`,
            maskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        />
        <div className="flex justify-end p-6 z-10">
          <div className="w-[35px] h-[35px] rounded-full bg-gray-900 flex justify-center items-center cursor-pointer">
            <Icon_backbutton className="h-[24px] text-gray-100" />
          </div>
        </div>
        <div className="flex justify-between items-end w-full">
          <div className="flex flex-col">
            <div className="ST0 mb-2 px-6 z-10">
              <h1 className="inline-block text-[28px] bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-transparent">
                #{tagid}
              </h1>
            </div>
            <div className="px-6 z-10">
              <p className="B2 text-gray-200">
                설명글 설명글 설명글 설명글 설명글 설명글
              </p>
              <p className="B2 text-gray-200">
                설명글 설명글 설명글 설명글 설명글 설명글
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col px-6 py-6 gap-4">
        <h2 className="H2 text-gray-200">Image in Tribe Chat</h2>
        <div className="flex"></div>
      </section>
    </div>
  );
};
