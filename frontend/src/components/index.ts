import { MenuUtils } from "../utils/menu-utils";
// import { Layout } from "./layout";
import { Diagrams } from "./diagrams";

export class Index {
    private diagrams: Diagrams | null = null;
    //  private openNewRoute: (url: string) => void;

    constructor(openNewRoute?: (url: string) => void) {
        // this.diagrams = null;
        //  this.openNewRoute = openNewRoute || (() => {});
        this.init();
    }

    async init(): Promise<void> {
        // const layout = new Layout((url: string) => {
        //     window.router.navigateTo(url);
        // });
        // this.diagrams = new Diagrams();
        // (window as any).diagramsInstance = this.diagrams; 
        MenuUtils.initMainMenu();
        await this.initDiagrams();
        this.setUpEvents();
    }

    private async initDiagrams(): Promise<void> {
        try {
            this.diagrams = new Diagrams();
            await this.diagrams.init();
            (window as any).diagramsInstance = this.diagrams;
        } catch (error) {
            console.error('Ошибка инициализации диаграмм:', error);
        }
    }

    setUpEvents() {
        console.log('Главная страница инициализирована');
    }
}