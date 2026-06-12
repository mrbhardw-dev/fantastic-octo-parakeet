export type UserRole = 'resident' | 'business' | 'club' | 'moderator' | 'admin'
export type ContentStatus = 'pending' | 'approved' | 'rejected'
export type PostCategory =
  | 'Alert'
  | 'Recommendation'
  | 'Lost & Found'
  | 'Event'
  | 'Local Business'
  | 'Question'
  | 'Community Help'
export type DirectoryCategory =
  | 'Food & Drink'
  | 'Shops'
  | 'Trades'
  | 'Health'
  | 'Schools & Childcare'
  | 'Clubs & Sports'
  | 'Transport'
  | 'Community Groups'
export type HelpType = 'need' | 'offer'
export type ContentType = 'post' | 'event' | 'directory' | 'help_post'

export interface Profile {
  id: string
  clerk_user_id: string
  display_name: string
  email: string
  town: string
  county: string
  role: UserRole
  avatar_url?: string | null
  created_at: string
}

export interface Post {
  id: string
  title: string
  body: string
  category: PostCategory
  town: string
  county: string
  image_url?: string | null
  status: ContentStatus
  created_by: string
  created_at: string
  stream_activity_id?: string | null
  profiles?: Pick<Profile, 'display_name' | 'avatar_url'> | null
}

export interface Event {
  id: string
  title: string
  description?: string | null
  starts_at: string
  ends_at?: string | null
  venue_name?: string | null
  town: string
  county: string
  source_url?: string | null
  status: ContentStatus
  created_by: string
  created_at: string
  profiles?: Pick<Profile, 'display_name'> | null
}

export interface DirectoryListing {
  id: string
  name: string
  category: DirectoryCategory
  description?: string | null
  website?: string | null
  phone?: string | null
  email?: string | null
  town: string
  county: string
  status: ContentStatus
  created_by: string
  created_at: string
  profiles?: Pick<Profile, 'display_name'> | null
}

export interface HelpPost {
  id: string
  type: HelpType
  title: string
  body: string
  town: string
  county: string
  status: ContentStatus
  created_by: string
  created_at: string
  profiles?: Pick<Profile, 'display_name'> | null
}

export interface Report {
  id: string
  reporter_id: string
  content_type: ContentType
  content_id: string
  reason: string
  created_at: string
}

export const POST_CATEGORIES: PostCategory[] = [
  'Alert',
  'Recommendation',
  'Lost & Found',
  'Event',
  'Local Business',
  'Question',
  'Community Help',
]

export const DIRECTORY_CATEGORIES: DirectoryCategory[] = [
  'Food & Drink',
  'Shops',
  'Trades',
  'Health',
  'Schools & Childcare',
  'Clubs & Sports',
  'Transport',
  'Community Groups',
]

export const CATEGORY_COLORS: Record<PostCategory, string> = {
  Alert: 'bg-red-100 text-red-800 border-red-200',
  Recommendation: 'bg-blue-100 text-blue-800 border-blue-200',
  'Lost & Found': 'bg-amber-100 text-amber-800 border-amber-200',
  Event: 'bg-purple-100 text-purple-800 border-purple-200',
  'Local Business': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Question: 'bg-sky-100 text-sky-800 border-sky-200',
  'Community Help': 'bg-orange-100 text-orange-800 border-orange-200',
}
