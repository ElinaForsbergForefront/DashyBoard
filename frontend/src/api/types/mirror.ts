export interface WidgetDto {
  id: string;
  type: string;
  x: number;
  y: number;
}

export interface MirrorDto {
  id: string;
  userSub: string;
  name: string;
  widthCm: number;
  heightCm: number;
  createdAt: string;
  widgets: WidgetDto[];
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

export interface AddWidgetRequest {
  type: string;
  x: number;
  y: number;
}

export interface MoveWidgetRequest {
  x: number;
  y: number;
}
