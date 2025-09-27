const YOUTUBE_API_KEY = 'AIzaSyCS0MLMnTs22Fc_oiJ65-CavCZ0WpJtTYM';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export interface YouTubeSearchResponse {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }[];
}

export class YouTubeService {
  static async searchVideos(query: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
    try {
      const searchParams = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults.toString(),
        key: YOUTUBE_API_KEY,
        videoCategoryId: '10', // Music category
        order: 'relevance'
      });

      const url = `${YOUTUBE_API_BASE_URL}/search?${searchParams}`;
      console.log('Making YouTube API request to:', url.replace(YOUTUBE_API_KEY, 'API_KEY_HIDDEN'));
      
      const response = await fetch(url);
      
      console.log('YouTube API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('YouTube API error response:', errorText);
        throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
      }

      const data: YouTubeSearchResponse = await response.json();
      console.log('YouTube API response data:', data);
      
      if (!data.items || data.items.length === 0) {
        console.warn('No items returned from YouTube API');
        return [];
      }
      
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      throw error;
    }
  }

  static async getVideoDetails(videoId: string) {
    try {
      const searchParams = new URLSearchParams({
        part: 'snippet,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY
      });

      const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items[0];
    } catch (error) {
      console.error('Error getting video details:', error);
      throw error;
    }
  }
}

export default YouTubeService;