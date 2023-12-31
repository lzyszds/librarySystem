import { HttpResonse } from "@/http"
export interface LogListType {
  booksBorrowedCount: number,
  booksReturnedCount: number,
  logDate: string,
  log_id: number,
  newBooksCount: number,
  newUsersCount: number,
  visitsCount: number
}
