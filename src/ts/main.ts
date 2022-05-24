function readFile(event: Event): void {
    console.log(event);
    var file = event.target as HTMLInputElement;
    if (file) {
        var fileList = file.files;
        var reader = new FileReader();
        if (fileList && fileList.length > 0) {
            reader.readAsText(fileList[0]);
            reader.onload = () => {
                var preView = document.querySelector('#preview');
                if (preView) {
                    preView.textContent = reader.result as string;
                }
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
