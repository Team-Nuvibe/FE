import { useParams, useNavigate, useLocation } from "react-router-dom";
import Img_3 from "@/assets/images/img_3.png";
import Icon_backbutton from "@/assets/icons/icon_backbutton.svg?react";
import useGetAllCategoriesTags from "@/hooks/queries/useGetAllCategoriesTags";
import useGetTagDetails from "@/hooks/queries/useGetTagDetails";

export const TagDetailPage = () => {
  const { tagid } = useParams<{ tagid: string }>();
  const navigate = useNavigate();

  const location = useLocation();
  const { categories } = useGetAllCategoriesTags();
  const imageUrl =
    location.state?.imageUrl ||
    categories.flatMap((cat) => cat.items).find((item) => item.tag === tagid)
      ?.imageUrl;

  const { data: tagDetails } = useGetTagDetails(tagid || "");

  return (
    <div className="flex min-h-full w-full flex-col">
      <section className="relative flex h-[50dvh] shrink-0 flex-col justify-between bg-cover bg-bottom bg-no-repeat">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-bottom bg-no-repeat object-cover"
          style={{
            backgroundImage: `url(${imageUrl || Img_3})`,
            maskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        />
        <div className="z-10 flex justify-start p-6">
          <div
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full bg-gray-900"
            onClick={() => navigate(-1)}
          >
            <Icon_backbutton className="h-[24px] text-gray-100" />
          </div>
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col px-4">
            <div className="ST0 z-10 mb-2">
              <h1 className="inline-block bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-[28px] text-transparent">
                #{tagDetails?.data.tag}
              </h1>
            </div>
            <div className="z-10">
              <p className="B2 text-gray-200">{tagDetails?.data.description}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 px-4 py-6">
        <h2 className="H2 text-gray-200">Image in Tribe Chat</h2>
        <div className="flex"></div>
      </section>
    </div>
  );
};
