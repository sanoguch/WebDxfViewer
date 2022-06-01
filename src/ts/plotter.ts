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

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
}
