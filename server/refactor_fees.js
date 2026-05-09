const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, 'controllers', 'feePaymentController.js');
let code = fs.readFileSync(controllerPath, 'utf8');

// 1. Export middlewares
code = code.replace('const upload = multer({', 'const upload = multer({');
code = code.replace('const handleFormData = (req, res, next) => {', 'const handleFormData = (req, res, next) => {');

// We will add exports at the bottom for middlewares
code += `\nexports.upload = upload;\nexports.handleFormData = handleFormData;\n`;

// 2. Replace route definitions with controller exports
code = code.replace(/router\.post\('\/', handleFormData, upload\.single\('receiptFile'\), async \(req, res\) => {/g, 'exports.createFeePayment = async (req, res) => {');
code = code.replace(/router\.get\('\/', authenticateAdmin, async \(req, res\) => {/g, 'exports.getFeePayments = async (req, res) => {');
code = code.replace(/router\.get\('\/:id', authenticateAdmin, async \(req, res\) => {/g, 'exports.getFeePaymentById = async (req, res) => {');
code = code.replace(/router\.get\('\/receipt\/:receiptNumber', async \(req, res\) => {/g, 'exports.getFeePaymentByReceipt = async (req, res) => {');
code = code.replace(/router\.get\('\/email\/:email', async \(req, res\) => {/g, 'exports.getFeePaymentsByEmail = async (req, res) => {');
code = code.replace(/router\.put\('\/:id\/status', authenticateAdmin, async \(req, res\) => {/g, 'exports.updateFeePaymentStatus = async (req, res) => {');
code = code.replace(/router\.put\('\/:id', authenticateAdmin, async \(req, res\) => {/g, 'exports.updateFeePayment = async (req, res) => {');
code = code.replace(/router\.delete\('\/:id', authenticateAdmin, async \(req, res\) => {/g, 'exports.deleteFeePayment = async (req, res) => {');
code = code.replace(/router\.post\('\/:id\/receipt', authenticateAdmin, upload\.single\('receiptFile'\), async \(req, res\) => {/g, 'exports.uploadReceiptForPayment = async (req, res) => {');
code = code.replace(/router\.get\('\/stats\/summary', authenticateAdmin, async \(req, res\) => {/g, 'exports.getFeePaymentStats = async (req, res) => {');
code = code.replace(/router\.get\('\/search\/advanced', authenticateAdmin, async \(req, res\) => {/g, 'exports.searchFeePaymentsAdvanced = async (req, res) => {');

// Remove router initialization and module.exports = router;
code = code.replace("const router = express.Router();\n", "");
code = code.replace("module.exports = router;", "");

// Write back
fs.writeFileSync(controllerPath, code);

console.log('Successfully refactored feePaymentController.js');
