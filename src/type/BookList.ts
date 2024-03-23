export interface Book {
  bookId?: number;
  bookName: string;
  author: string;
  cover: string;
  introduction: string;
  publisher: string;
  publishDate: string;
  isbn: string;
  categoryName?: string;
  categoryId?: number;
  isBorrowable: number;
  copiesNumber?: number
}

export interface BookCountData {
  count: number;
  data: Book[];
}
