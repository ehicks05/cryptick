interface Params {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const Crosshair = ({ x, y, w, h }: Params) => (
  <>
    <line stroke={'rgba(100, 100, 100, .35)'} x1={0} y1={y} x2={w} y2={y} />
    <line stroke={'rgba(100, 100, 100, .35)'} x1={x} y1={0} x2={x} y2={h} />
  </>
);
