import { Router } from "./router";
import "./styles/styles.css";

class App {
    private router: Router | null = null;

    constructor() {
        this.initializeApp();
    }

    private initializeApp(): void {
        this.router = new Router();
        this.setupEventListeners();
        // this.start();
    }

    private setupEventListeners(): void {
        window.addEventListener('DOMContentLoaded', () => {
        });

        // window.addEventListener('load', () => {
        //     this.onWindowLoad();
        // });
    }

    // private onWindowLoad(): void {

    // }

    // private setupLogo(): void {
    //     const logoElement = document.querySelector('.logo img') as HTMLImageElement;

    //     if (logoElement) {

    //     } else {

    //     }
    // }

    // private start(): void {

    // }
}


document.addEventListener('DOMContentLoaded', () => {
    new App();
});