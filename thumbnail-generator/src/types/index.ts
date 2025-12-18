export interface ThumbnailTemplate {
  id: string;
  name: string;
  category: 'tech' | 'business' | 'tutorial' | 'news' | 'comparison' | 'infographic';
  description: string;
}

export interface ThumbnailData {
  title: string;
  subtitle?: string;
  category?: string;
  numbers?: string[];
  icon?: string;
  accentColor?: string;
}

export interface InfographicData {
  type: 'comparison' | 'flowchart' | 'stats' | 'timeline' | 'list';
  title: string;
  items: InfographicItem[];
}

export interface InfographicItem {
  label: string;
  value?: string | number;
  description?: string;
  icon?: string;
  color?: string;
}

export interface ComparisonData {
  title: string;
  items: {
    name: string;
    pros: string[];
    cons: string[];
    score?: number;
  }[];
}

export interface ArticleData {
  title: string;
  content: string;
  hashtags: string[];
}
