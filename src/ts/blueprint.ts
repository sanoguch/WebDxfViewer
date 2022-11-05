import { Helper } from 'dxf';
import { Plotter } from './plotter';

export class Blueprint {
  constructor(dxfContents: string) {
    this.dxfHelper = new Helper(dxfContents);
  }

  public draw(plotter: Plotter): void {
    const { bbox, polylines } = this.dxfHelper.toPolylines();

    polylines.forEach((polyline) => {
      const vertices = polyline.vertices.map((vertex) => {
        return [vertex[0], vertex[1], 0.0];
      });
      const rgb = (polyline.rgb[0] << 16) | (polyline.rgb[1] << 8) | polyline.rgb[2];
      plotter.drawPolylines(vertices, rgb);
    });
    plotter.setImageSize(bbox.min.x, bbox.min.y, bbox.max.x, bbox.max.y);
  }

  private dxfHelper: Helper;
}
