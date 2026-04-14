import { GRID_UNIT_CM } from '../constants/grid';

interface PlacedWidget {
  x: number;
  y: number;
  cols: number;
  rows: number;
}

export function findFirstFreeCell(
  placed: PlacedWidget[],
  newCols: number,
  newRows: number,
  mirrorWidthCm: number,
  mirrorHeightCm: number,
): { x: number; y: number } {
  const totalCols = Math.floor(mirrorWidthCm / GRID_UNIT_CM);
  const totalRows = Math.floor(mirrorHeightCm / GRID_UNIT_CM);

  const occupied: boolean[][] = Array.from({ length: totalRows }, () =>
    new Array<boolean>(totalCols).fill(false),
  );

  for (const w of placed) {
    const startCol = Math.round(w.x / GRID_UNIT_CM);
    const startRow = Math.round(w.y / GRID_UNIT_CM);
    for (let r = startRow; r < startRow + w.rows && r < totalRows; r++) {
      for (let c = startCol; c < startCol + w.cols && c < totalCols; c++) {
        if (occupied[r]) occupied[r][c] = true;
      }
    }
  }

  for (let row = 0; row <= totalRows - newRows; row++) {
    for (let col = 0; col <= totalCols - newCols; col++) {
      let fits = true;
      scan: for (let r = row; r < row + newRows; r++) {
        for (let c = col; c < col + newCols; c++) {
          if (occupied[r]?.[c]) {
            fits = false;
            break scan;
          }
        }
      }
      if (fits) return { x: col * GRID_UNIT_CM, y: row * GRID_UNIT_CM };
    }
  }

  return { x: 0, y: 0 };
}
