import BrandingThumbnail from './assets/branding_thumbnail.svg';
import ContentThumbnail from './assets/content_thumbnail.svg';
import GoalsThumbnail from './assets/goals_thumbnail.svg';
import PortfolioThumbnail from './assets/portfolio_thumbnail.svg';

export const VideoEnum = {
  Branding: 'Branding',
  Content: 'Content',
  Goals: 'Goals',
  Portfolio: 'Portfolio',
} as const;

export type VideoType = (typeof VideoEnum)[keyof typeof VideoEnum];

export const VIDEO_THUMBNAIL: Record<VideoType, string> = {
  Branding: BrandingThumbnail,
  Content: ContentThumbnail,
  Goals: GoalsThumbnail,
  Portfolio: PortfolioThumbnail,
};

export const VIDEO_URL: Record<VideoType, string> = {
  Branding: 'https://www.youtube.com/watch?v=4phXzkmuJPM ',
  Content: 'https://www.youtube.com/watch?v=1xGi32vG8AE ',
  Goals: 'https://www.youtube.com/watch?v=KvldGmhb3HY ',
  Portfolio: 'https://www.youtube.com/watch?v=uDfZpQfpK6c',
};
