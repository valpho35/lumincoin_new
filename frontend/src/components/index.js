import { MenuUtils } from "../utils/menu-utils.js";
import { Layout } from "../components/layout.js";
import { Diagrams } from "../components/diagrams.js";

export class Index {
    constructor() {
        this.diagrams = null;
        this.init();
    }

    init() {
        new Layout();
        this.diagrams = new Diagrams();
        window.diagramsInstance = this.diagrams; 
        MenuUtils.initMainMenu();
        this.setUpEvents();
    }

    // setUpEvents() {
    //     console.log('Главная страница инициализирована');
    // }
}