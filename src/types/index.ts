export interface PoemResponse {
  code: number
  msg: string
  data: {
    id: string
    title: string
    author: string
    content: string
    dynasty: string
  }
}

export interface DailyPoem {
  title: string
  author: string
  content: string[]
  dynasty: string
} 