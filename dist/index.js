"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dbconfig_1 = __importDefault(require("./db/dbconfig"));
require("dotenv/config");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const contactRoute_1 = __importDefault(require("./routes/contactRoute"));
const app = (0, express_1.default)();
(0, dbconfig_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Server started');
});
app.use('/auth', authRoutes_1.default);
app.use('/api', contactRoute_1.default);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
