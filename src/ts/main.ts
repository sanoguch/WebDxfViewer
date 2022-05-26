import { Helper } from 'dxf'

function readFile(event: Event): void {
    var file = event.target as HTMLInputElement;
    if (file) {
        var fileList = file.files;
        var reader = new FileReader();
        if (fileList && fileList.length > 0) {
            reader.readAsBinaryString(fileList[0])
            reader.onload = onLoadFile
        }
    }
}

function onLoadFile(event: Event): void {
    var reader = event.target as FileReader
    if (reader) {
        if (reader.readyState === 2) {
            var dxfContents = reader.result as string;
            var helper = new Helper(dxfContents);
            var svgContainer = document.querySelector('#svg');
            if (svgContainer) {
                svgContainer.innerHTML = helper.toSVG();
            }
        }
    }
}

function init() {
    var file = document.querySelector<HTMLInputElement>('#getfile');
    if (file) {
        file.onchange = readFile
    }
}

window.onload = init;
