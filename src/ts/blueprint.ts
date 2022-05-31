import { Helper } from 'dxf'

export class Blueprint {
    public readDxfFile(dxfContents: string): void {
        this.dxfHelper = new Helper(dxfContents);
        // var polylines = this.dxfHelper.toPolylines();
        // console.log(polylines);
        // var svgContainer = document.querySelector('#svg');
        // if (svgContainer) {
        //     //console.log('parsed:', helper.parsed);
        //     svgContainer.innerHTML = helper.toSVG();
        // }
    }

    private dxfHelper: Helper | null = null;
}
