import * as THREE from 'three';

export class Plotter {
  constructor(
    private canvas: HTMLCanvasElement,
    width: number,
    height: number,
    private imageLeft: number,
    private imageBottom: number,
    private imageRight: number,
    private imageTop: number,
    private keepAspectRatio: boolean = true
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();

    this.keepAspectRatio = keepAspectRatio;
    this.camera = new THREE.OrthographicCamera(imageLeft, imageRight, imageTop, imageBottom, 0.0, 1.0);
    this.camera.position.set(0.0, 0.0, 0.5);

    this.addMouseEventListeners();
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

  public setImageSize(imageLeft: number, imageBottom: number, imageRight: number, imageTop: number): void {
    this.imageLeft = imageLeft;
    this.imageBottom = imageBottom;
    this.imageRight = imageRight;
    this.imageTop = imageTop;
    this.setViewport(imageLeft, imageBottom, imageRight, imageTop);
  }

  public setViewport(x0: number, y0: number, x1: number, y1: number): void {
    if (this.keepAspectRatio) {
      const windowAspectRatio = this.canvas.height / this.canvas.width;
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

  private addMouseEventListeners(): void {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e), false);
  }

  private onMouseDown(e: MouseEvent): void {
    this.mouseDown = true;
    const ndc = this.getNDC(e.clientX, e.clientY);
    this.prevPos = ndc;
  }

  private onMouseUp(_e: MouseEvent): void {
    this.mouseDown = false;
    this.prevPos = [0, 0];
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.mouseDown) {
      const prevVec = new THREE.Vector3(this.prevPos[0], this.prevPos[1], 0.0);
      prevVec.unproject(this.camera);
      const ndc = this.getNDC(e.clientX, e.clientY);
      const newVec = new THREE.Vector3(ndc[0], ndc[1], 0.0);
      newVec.unproject(this.camera);

      const dx = newVec.x - prevVec.x;
      const dy = newVec.y - prevVec.y;

      const camera = this.camera;
      this.setViewport(camera.left - dx, camera.bottom - dy, camera.right - dx, camera.top - dy);
      this.render();

      this.prevPos = ndc;
    }
  }

  private onWheel(e: WheelEvent): void {
    const ndc = this.getNDC(e.clientX, e.clientY);

    if (e.deltaY < 0) {
      this.setZoom(this.zoom * this.zoomStep, ndc);
    } else {
      this.setZoom(this.zoom / this.zoomStep, ndc);
    }

    this.render();
  }

  private setZoom(value: number, point: [number, number]): void {
    if (this.minZoom <= value && value <= this.maxZoom) {
      const coeff = this.zoom / value;
      this.zoom = value;

      const camera = this.camera;
      const newWidth = (camera.right - camera.left) * coeff;
      const newHeight = (camera.top - camera.bottom) * coeff;

      const vec = new THREE.Vector3(point[0], point[1], 0.0);
      vec.unproject(this.camera);

      const left = (point[0] - (-1.0)) / 2.0 * newWidth;
      const right = (1.0 - point[0]) / 2.0 * newWidth;
      const down = (point[1] - (-1.0)) / 2.0 * newHeight;
      const up = (1.0 - point[1]) / 2.0 * newHeight;;
      this.setViewport(vec.x - left, vec.y - down, vec.x + right, vec.y + up);
    }
  }

  private getNDC(x: number, y: number): [number, number] {
    const canvas = this.canvas;
    const rect = canvas.getBoundingClientRect();
    return [(x - rect.left) / canvas.width * 2.0 - 1.0, (canvas.height - (y - rect.top)) / canvas.height * 2.0 - 1.0];
  }

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;

  private mouseDown = false;
  private prevPos = [0, 0];

  private zoom = 1.0;
  private minZoom = 0.00001;
  private maxZoom = 64;
  private zoomStep: number = Math.sqrt(Math.sqrt(2.0));
}
