# GroSnap - Smart Food Scanner

An AI-powered food barcode scanner that helps you make healthier, more informed food choices. Upload barcode images to get instant product information plus unique AI-driven insights you won't find anywhere else.

## Features

- � *a*Upload Barcode Images\*\* - Upload photos of barcodes for instant scanning
- 🍕 **Product Information** - Comprehensive data from Open Food Facts database
- 📊 **Nutritional Facts** - Detailed nutrition breakdown per 100g
- 🧠 **AI Health Alternatives** - Get personalized healthier product recommendations
- � *o*Mood-Based Suggestions\*\* - Discover foods that match your mood and energy levels
- ✅ **Diet Compatibility** - Check if products match Vegan, Keto, Halal, Kosher, and more
- 🌱 **Eco Impact Score** - Understand the environmental footprint of your food choices
- 🎨 **Modern Dark UI** - Beautiful, responsive interface that works on all devices
- ⚡ **Fast & Easy** - Get results in seconds with drag-and-drop support

## How to Use

1. Open `index.html` in a web browser
2. Click "Upload Barcode Image" to get started
3. Upload a photo of a barcode (or drag and drop)
4. View product information and nutritional facts
5. Explore AI-powered insights:
   - Find healthier alternatives
   - Get mood-based food recommendations
   - Check diet compatibility
   - See environmental impact scores

**Alternative:** Enter a barcode number manually if you know it

## Browser Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection for API access

## Local Development

1. Clone or download this repository
2. Add your OpenRouter API key in `config.js`:
   ```javascript
   OPENROUTER_API_KEY: "your-api-key-here";
   ```
3. Start a local web server:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve`
   - Or any local web server
4. Visit `http://localhost:8000` (or appropriate port)

## Configuration

Edit `config.js` to customize:

- OpenRouter API key for AI features
- AI model selection
- API endpoints

## Technologies Used

- **Quagga.js** - Barcode detection from images
- **Open Food Facts API** - Product and nutrition data
- **OpenRouter API** - AI-powered insights (Gemini 2.0 Flash)
- **Vanilla JavaScript** - No frameworks, pure performance
- **Modern CSS** - Beautiful dark theme with smooth animations
