export interface MirrorDto {
  id: string;
  userSub: string;
  name: string;
  widthCm: number;
  heightCm: number;
  createdAt: string;
}

export interface CreateMirrorRequest {
  name: string;
  widthCm: number;
  heightCm: number;
}

export interface UpdateMirrorRequest {
  name: string;
  widthCm: number;
  heightCm: number;
}
