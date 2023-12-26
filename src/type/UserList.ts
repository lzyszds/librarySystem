// 用户信息类型定义
export interface User {
  username: string;
  password: null;
  role: number;
  email: string;
  phone: string;
  address: string;
  name: string;
  id: number;
  created_at: string;
  token: null;
  sex: string;
}

export interface UserCountData {
  count: number;
  data: User[]
}

export interface SoonReviseUserData {
  id: number,
  name: string,
  phone: string,
  email: string,
  role: number,
  sex: string,
  address: string
}
