import { initTelegram } from "./platforms/telegram";
import { initDiscord } from "./platforms/discord"
import { initFalatron } from "./services/falatron"

initFalatron();
initTelegram();
initDiscord();