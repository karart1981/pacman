import { Game } from "./src/Game.js";

let app = new Game("gameCanvas", 32, 2);

menu.addEventListener("click", ()=>{
    location.reload();
})
exit.addEventListener("click", ()=>{
    close();
})