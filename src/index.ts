import { AsyncLoadTextApplication } from './applicaiton/AysncLoadTestApplicaiton';
import { BasicWebGLApplication } from './applicaiton/BaseWebGLApplication';
import { Application } from './core/application';

let appNames: string[] = ['AsyncLoadTextApplication', 'BasicWebGLApplication'];
let select: HTMLSelectElement = document.getElementById('select') as HTMLSelectElement;
let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

function addItem(select: HTMLSelectElement, value: string): void {
	select.options.add(new Option(value, value));
}

function addItems(select: HTMLSelectElement): void {
	if (canvas === null) return;
	for (let i: number = 0; i < appNames.length; i++) {
		addItem(select, appNames[i]);
	}
	select.selectedIndex = 7;
}

function createText(id: string): Text {
	let elem: HTMLSpanElement = document.getElementById(id) as HTMLSpanElement;
	let text: Text = document.createTextNode('');
	elem.appendChild(text);
	return text;
}

let fps: Text = createText('fps');
let tris: Text = createText('tris');
let verts: Text = createText('verts');
function frameCallback(app: Application): void {
	fps.nodeValue = String(app.fps.toFixed(0));
	tris.nodeValue = '0';
	verts.nodeValue = '0';
}

select.onchange = (): void => {
	if (canvas === null) return;
	if (select.selectedIndex === 0) {
		let app: AsyncLoadTextApplication = new AsyncLoadTextApplication(canvas);
		app.run();
	} else if (select.selectedIndex === 1) {
		let app: BasicWebGLApplication = new BasicWebGLApplication(canvas);
		app.run();
	}
};

addItems(select);
