import axios from 'axios';

const getTagReqUrl = (locale?: string, slug?: string) =>
  slug !== undefined ? `/${locale}/tag/${slug}` : `/${locale}/tag`;

export const getPostTags = async (locale?: string, slug?: string) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}${getTagReqUrl(
    locale,
    slug
  )}`;
  const res = await axios.get<string[]>(url);
  return res?.data;
};
