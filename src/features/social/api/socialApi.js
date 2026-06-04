import { apiClient } from "../../../lib/apiClient";

const fallbackSocialStats = {
  youtube: {
    platform: "youtube",
    title: "YouTube Subscribers",
    subtitle: "Official Channel Community",
    supporting_text: "Students, parents, and learners following our long-form learning content.",
    count_value: 0,
    display_count: "25K+",
    url: "https://www.youtube.com/@swadeshacademy2025",
  },
  instagram: {
    platform: "instagram",
    title: "Instagram Followers",
    subtitle: "Daily Social Growth",
    supporting_text: "Learners following updates, short insights, and academy moments from our official profile.",
    count_value: 0,
    display_count: "12K+",
    url: "https://www.instagram.com/swadeshacademy_/",
  },
};

function normalizeSocialPlatform(payload, fallback) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  return {
    ...fallback,
    ...payload,
    platform: payload.platform || fallback.platform,
    url: payload.url || fallback.url,
  };
}

function normalizeSocialStats(payload) {
  return {
    youtube: normalizeSocialPlatform(payload?.youtube, fallbackSocialStats.youtube),
    instagram: normalizeSocialPlatform(payload?.instagram, fallbackSocialStats.instagram),
  };
}

export function getSocialStats() {
  return apiClient("/social/stats").then(normalizeSocialStats);
}
