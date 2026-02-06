export const tagImages = import.meta.glob(
  "@/assets/images/tag-default-images/**/*.{png,jpg,jpeg}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export const imageMap: Record<string, Record<string, string>> = {};
export const allTagImages: Record<string, string> = {};

Object.entries(tagImages).forEach(([path, imageUrl]) => {
  const parts = path.split("/");
  const category = parts[parts.length - 2].toLowerCase();
  const fileName = parts[parts.length - 1];

  if (fileName.length > 4) {
    const tagNameWithExt = fileName.substring(4);
    const tagName = tagNameWithExt.split(".")[0].toLowerCase();

    if (!imageMap[category]) {
      imageMap[category] = {};
    }
    imageMap[category][tagName] = imageUrl;
    allTagImages[tagName] = imageUrl;
  }
});
