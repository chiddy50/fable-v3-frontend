// import { Id } from '@/convex/_generated/dataModel'

export type Article = {
  id: string
  coverImageId?: string
  articleTags?: []
  coverImageUrl?: string | null
  title: string
  slug: string
  excerpt: string
  content: string
  authorId: string
  coverImage: string
  likes: number
}
