export interface Book {
  book_id?: number;
  book_name: string;
  author: string;
  cover: string;
  introduction: string;
  publisher: string;
  publish_date: string;
  isbn: string;
  category_name?: string;
  category_id?: number;
  status: string;
}

export interface BookCountData {
  count: number;
  data: Book[];
}
