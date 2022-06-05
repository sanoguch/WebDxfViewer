import * as THREE from 'three';

export class Plotter {
  constructor(
    private canvas: HTMLCanvasElement,
    private width: number,
    private height: number,
    private x0: number,
    private y0: number,
    private x1: number,
    private y1: number
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(x0, x1, y1, y0, 0.0, 1.0);
    this.camera.position.set(0.0, 0.0, 0.5);
  }

  public drawPolylines(vertices: number[][], color: number): void {
    const points: THREE.Vector3[] = new Array<THREE.Vector3>();
    vertices.forEach((vertex: number[]) => {
      if (vertex.length >= 3) {
        points.push(new THREE.Vector3(vertex[0], vertex[1], vertex[2]));
      }
    });
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: color });
    const line: THREE.Line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

  public setViewport(x0: number, y0: number, x1: number, y1: number, keepAspectRatio = false): void {
    if (keepAspectRatio) {
      const windowAspectRatio = this.height / this.width;
      const viewAspectRatio = (y1 - y0) / (x1 - x0);

      const viewHalfWidth = (x1 - x0) / 2.0;
      const viewHalfHeight = (y1 - y0) / 2.0;
      const centerX = x0 + viewHalfWidth;
      const centerY = y0 + viewHalfHeight;

      if (viewAspectRatio > 1.0) {
        this.camera.left = centerX - viewHalfHeight / windowAspectRatio;
        this.camera.right = centerX + viewHalfHeight / windowAspectRatio;
        this.camera.bottom = y0;
        this.camera.top = y1;
      } else {
        this.camera.left = x0;
        this.camera.right = x1;
        this.camera.bottom = centerY - viewHalfWidth * windowAspectRatio;
        this.camera.top = centerY + viewHalfWidth * windowAspectRatio;
      }
    } else {
      this.camera.left = x0;
      this.camera.right = x1;
      this.camera.bottom = y0;
      this.camera.top = y1;
    }
    this.camera.updateProjectionMatrix();
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
}
