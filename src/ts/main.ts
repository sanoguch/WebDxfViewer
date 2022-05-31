import { Plotter } from './plotter'
import { Blueprint } from './blueprint'

class Main {

    public initPlotter(): void {
        const canvas: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
        if (canvas) {
            const width: number = 640;
            const height: number = 480;
            this.plotter = new Plotter(canvas, width, height, -width/2.0, -height/2.0, width/2.0, height/2.0);
        }
    }

    public init(): void {
        var file = document.querySelector<HTMLInputElement>('#getfile');
        if (file) {
            file.onchange = (event: Event) => this.readDxfFile(event)
        }
    }

    private readDxfFile(event: Event): void {
        var file = event.target as HTMLInputElement;
        if (file) {
            var fileList = file.files;
            var reader = new FileReader();
            if (fileList && fileList.length > 0) {
                reader.readAsBinaryString(fileList[0])
                reader.onload = (event: Event) => this.onLoadDxfFile(event)
            }
        }
    }

    private onLoadDxfFile(event: Event): void {
        var reader = event.target as FileReader
        if (reader) {
            if (reader.readyState === 2) {
                var dxfContents = reader.result as string;
                this.blueprint.readDxfFile(dxfContents);

                if (this.plotter) {
                    this.plotter.render()
                }
            }
        }
    }

    private plotter: Plotter | null = null;
    private blueprint: Blueprint = new Blueprint();
}

const main: Main = new Main();
window.addEventListener('DOMContentLoaded', () => main.initPlotter());
window.addEventListener('load', () => main.init());
