// AI Feature Functions

let currentProductCache = {};

// Get Healthier Alternatives
async function getHealthierAlternatives(barcode) {
  showAILoading("Finding healthier alternatives...");
  
  try {
    const product = window.currentProduct || currentProductCache[barcode];
    const userPrefs = getUserPreferences();
    
    const result = await aiService.getHealthierSubstitutes(product, userPrefs);
    
    showAIResult("Healthier Alternatives", result);
  } catch (error) {
    showAIError("Could not fetch alternatives. Please check your API key.");
  }
}

// Mood-Based Recommendations
function showMoodSelector(barcode) {
  const moods = ['Tired', 'Stressed', 'Energetic', 'Hungry After Workout', 'Relaxed', 'Focused'];
  
  let html = '<div class="mood-selector">';
  html += '<h3>How are you feeling?</h3>';
  html += '<div class="mood-grid">';
  
  moods.forEach(mood => {
    html += `<button class="mood-button" onclick="getMoodRecommendations('${barcode}', '${mood}')">${mood}</button>`;
  });
  
  html += '</div></div>';
  
  showAIModal("Select Your Mood", html);
}

async function getMoodRecommendations(barcode, mood) {
  closeAIModal();
  showAILoading(`Finding foods for when you're ${mood.toLowerCase()}...`);
  
  try {
    const product = window.currentProduct || currentProductCache[barcode];
    const result = await aiService.getMoodBasedRecommendations(mood, product);
    
    showAIResult(`Recommendations for ${mood}`, result);
  } catch (error) {
    showAIError("Could not fetch recommendations. Please check your API key.");
  }
}

// Diet Compatibility
async function checkDietCompatibility(barcode) {
  const diets = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Halal', 'Kosher', 'Gluten-Free'];
  
  let html = '<div class="diet-selector">';
  html += '<h3>Select Diets to Check</h3>';
  html += '<div class="diet-grid">';
  
  diets.forEach(diet => {
    html += `<label class="diet-checkbox">
      <input type="checkbox" value="${diet}" class="diet-check">
      <span>${diet}</span>
    </label>`;
  });
  
  html += '</div>';
  html += `<button class="modal-button" onclick="analyzeDiets('${barcode}')">Check Compatibility</button>`;
  html += '</div>';
  
  showAIModal("Diet Compatibility", html);
}

async function analyzeDiets(barcode) {
  const checkboxes = document.querySelectorAll('.diet-check:checked');
  const selectedDiets = Array.from(checkboxes).map(cb => cb.value);
  
  if (selectedDiets.length === 0) {
    alert('Please select at least one diet');
    return;
  }
  
  closeAIModal();
  showAILoading("Analyzing diet compatibility...");
  
  try {
    const product = window.currentProduct || currentProductCache[barcode];
    const result = await aiService.analyzeDietCompatibility(product, selectedDiets);
    
    showAIResult("Diet Compatibility Analysis", result);
  } catch (error) {
    showAIError("Could not analyze compatibility. Please check your API key.");
  }
}

// Eco Score Analysis
async function analyzeEcoScore(barcode) {
  showAILoading("Analyzing environmental impact...");
  
  try {
    const product = window.currentProduct || currentProductCache[barcode];
    const result = await aiService.analyzeEcoImpact(product);
    
    showAIResult("Environmental Impact", result);
  } catch (error) {
    showAIError("Could not analyze eco score. Please check your API key.");
  }
}



// UI Helper Functions
function showAILoading(message) {
  const overlay = document.createElement('div');
  overlay.className = 'ai-overlay';
  overlay.id = 'aiOverlay';
  
  const loader = document.createElement('div');
  loader.className = 'ai-loader';
  loader.innerHTML = `
    <div class="loader-spinner"></div>
    <p>${message}</p>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(loader);
}

function hideAILoading() {
  const overlay = document.getElementById('aiOverlay');
  const loader = document.querySelector('.ai-loader');
  
  if (overlay) overlay.remove();
  if (loader) loader.remove();
}

function formatAIResponse(content) {
  // Remove markdown code blocks
  content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Try to parse JSON and format nicely
  try {
    const parsed = JSON.parse(content);
    
    // Check if it's an array of alternatives or mood recommendations
    if (Array.isArray(parsed)) {
      // Check if it's mood recommendations
      if (parsed[0]?.food_name && parsed[0]?.why_it_helps) {
        let html = '<div class="mood-recommendations-list">';
        parsed.forEach((item, index) => {
          const energyClass = item.energy_level?.toLowerCase() || 'sustain';
          const energyIcon = energyClass === 'boost' ? '⚡' : energyClass === 'calm' ? '🧘' : '🔋';
          
          html += `
            <div class="mood-card">
              <div class="mood-card-header">
                <span class="mood-number">${index + 1}</span>
                <h4>${item.food_name}</h4>
                <span class="energy-badge ${energyClass}">${energyIcon} ${item.energy_level || 'Sustain'}</span>
              </div>
              <p class="mood-reason">${item.why_it_helps}</p>
              ${item.key_nutrients ? `<div class="nutrients-tags">
                <span class="nutrient-label">Key Nutrients:</span>
                <div class="tags-container">
                  ${item.key_nutrients.split(',').map(n => `<span class="nutrient-tag">${n.trim()}</span>`).join('')}
                </div>
              </div>` : ''}
            </div>
          `;
        });
        html += '</div>';
        return html;
      }
      
      // Otherwise it's healthier alternatives
      let html = '<div class="alternatives-list">';
      parsed.forEach((item, index) => {
        html += `
          <div class="alternative-card">
            <div class="alternative-header">
              <span class="alternative-number">${index + 1}</span>
              <h4>${item.product_type_name || item.name || 'Alternative'}</h4>
            </div>
            ${item.why_it_s_healthier ? `<p class="alternative-reason"><strong>Why it's healthier:</strong> ${item.why_it_s_healthier}</p>` : ''}
            ${item.flavor_similarity ? `<div class="similarity-bar">
              <span>Flavor Similarity</span>
              <div class="bar-container">
                <div class="bar-fill" style="width: ${item.flavor_similarity * 10}%"></div>
                <span class="bar-label">${item.flavor_similarity}/10</span>
              </div>
            </div>` : ''}
            ${item.estimated_price_range ? `<p class="price-range">💰 ${item.estimated_price_range}</p>` : ''}
          </div>
        `;
      });
      html += '</div>';
      return html;
    }
    
    // Check if it's an eco score object
    if (parsed.eco_score || parsed['carbon_footprint'] || parsed['overall_eco_score']) {
      let html = '<div class="eco-score-card">';
      
      // Overall score at top
      if (parsed.overall_eco_score) {
        const score = parsed.overall_eco_score;
        const scoreClass = score >= 7 ? 'good' : score >= 4 ? 'medium' : 'poor';
        html += `<div class="eco-overall-top">
          <div class="score-circle-large ${scoreClass}">
            <span class="score-number">${score}</span>
            <span class="score-label">/10</span>
          </div>
          <div class="score-text">
            <h4>Environmental Impact Score</h4>
            <p>${score >= 7 ? 'Great choice! 🌱' : score >= 4 ? 'Moderate impact ⚠️' : 'High impact 🔴'}</p>
          </div>
        </div>`;
      }
      
      html += '<div class="eco-metrics">';
      
      if (parsed.carbon_footprint) {
        html += `<div class="eco-item">
          <span class="eco-icon">🌍</span>
          <div class="eco-info">
            <span class="eco-label">Carbon Footprint</span>
            <span class="eco-value ${parsed.carbon_footprint.toLowerCase()}">${parsed.carbon_footprint}</span>
          </div>
        </div>`;
      }
      
      if (parsed.water_usage) {
        html += `<div class="eco-item">
          <span class="eco-icon">💧</span>
          <div class="eco-info">
            <span class="eco-label">Water Usage</span>
            <span class="eco-value ${parsed.water_usage.toLowerCase()}">${parsed.water_usage}</span>
          </div>
        </div>`;
      }
      
      if (parsed.transportation_impact) {
        html += `<div class="eco-item">
          <span class="eco-icon">🚚</span>
          <div class="eco-info">
            <span class="eco-label">Transportation</span>
            <span class="eco-value ${parsed.transportation_impact.toLowerCase()}">${parsed.transportation_impact}</span>
          </div>
        </div>`;
      }
      
      if (parsed.packaging_sustainability_score) {
        html += `<div class="eco-item">
          <span class="eco-icon">📦</span>
          <div class="eco-info">
            <span class="eco-label">Packaging</span>
            <div class="mini-bar-container">
              <div class="mini-bar-fill" style="width: ${parsed.packaging_sustainability_score * 10}%"></div>
              <span class="mini-bar-label">${parsed.packaging_sustainability_score}/10</span>
            </div>
          </div>
        </div>`;
      }
      
      html += '</div>';
      
      if (parsed.explanation) {
        html += `<div class="eco-explanation">
          <h5>📊 Analysis</h5>
          <p>${parsed.explanation}</p>
        </div>`;
      }
      
      if (parsed.tips && Array.isArray(parsed.tips)) {
        html += `<div class="eco-tips">
          <h5>💡 Eco-Friendly Tips</h5>
          <ul>
            ${parsed.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>`;
      }
      
      html += '</div>';
      return html;
    }
    
    // Check if it's diet compatibility
    if (Object.keys(parsed).some(key => ['Vegan', 'Vegetarian', 'Keto', 'Halal', 'Kosher', 'Paleo', 'Gluten-Free'].includes(key))) {
      let html = '<div class="diet-results">';
      
      // Summary at top
      const totalDiets = Object.keys(parsed).length;
      const compatibleCount = Object.values(parsed).filter(info => {
        const comp = info.compatible || info.Compatible;
        return comp === 'Yes' || comp === true;
      }).length;
      const maybeCount = Object.values(parsed).filter(info => {
        const comp = info.compatible || info.Compatible;
        return comp === 'Maybe';
      }).length;
      
      html += `<div class="diet-summary">
        <div class="summary-stats">
          <div class="stat-item compatible">
            <span class="stat-icon">✓</span>
            <div class="stat-info">
              <span class="stat-number">${compatibleCount}</span>
              <span class="stat-label">Compatible</span>
            </div>
          </div>
          <div class="stat-item maybe">
            <span class="stat-icon">?</span>
            <div class="stat-info">
              <span class="stat-number">${maybeCount}</span>
              <span class="stat-label">Maybe</span>
            </div>
          </div>
          <div class="stat-item not-compatible">
            <span class="stat-icon">✗</span>
            <div class="stat-info">
              <span class="stat-number">${totalDiets - compatibleCount - maybeCount}</span>
              <span class="stat-label">Not Compatible</span>
            </div>
          </div>
        </div>
      </div>`;
      
      html += '<div class="diet-cards-container">';
      
      Object.entries(parsed).forEach(([diet, info]) => {
        const compatible = info.compatible || info.Compatible;
        const isCompatible = compatible === 'Yes' || compatible === true;
        const isMaybe = compatible === 'Maybe';
        const confidence = info.confidence || 5;
        
        html += `
          <div class="diet-result-card ${isCompatible ? 'compatible' : isMaybe ? 'maybe' : 'not-compatible'}">
            <div class="diet-result-header">
              <div class="diet-header-left">
                <span class="diet-icon">${isCompatible ? '✓' : isMaybe ? '?' : '✗'}</span>
                <h4>${diet}</h4>
              </div>
              <div class="diet-header-right">
                <span class="compatibility-badge">${compatible}</span>
                <div class="confidence-indicator">
                  <span class="confidence-label">Confidence</span>
                  <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidence * 10}%"></div>
                  </div>
                  <span class="confidence-value">${confidence}/10</span>
                </div>
              </div>
            </div>
            
            <div class="diet-body">
              ${info.reason || info.Reason ? `
                <div class="diet-section">
                  <span class="section-icon">📋</span>
                  <div class="section-content">
                    <h5>Analysis</h5>
                    <p>${info.reason || info.Reason}</p>
                  </div>
                </div>
              ` : ''}
              
              ${info.concerns && info.concerns !== 'null' && info.concerns !== null ? `
                <div class="diet-section concerns">
                  <span class="section-icon">⚠️</span>
                  <div class="section-content">
                    <h5>Concerns</h5>
                    <p>${info.concerns || info.Concerns}</p>
                  </div>
                </div>
              ` : ''}
              
              ${info.alternatives && info.alternatives !== 'null' && info.alternatives !== null ? `
                <div class="diet-section alternatives">
                  <span class="section-icon">💡</span>
                  <div class="section-content">
                    <h5>Suggestion</h5>
                    <p>${info.alternatives}</p>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });
      
      html += '</div></div>';
      return html;
    }
    
    // Default JSON display
    return '<pre class="json-result">' + JSON.stringify(parsed, null, 2) + '</pre>';
    
  } catch (e) {
    // Not JSON, format as markdown-style text
    let formatted = content;
    
    // Format headers
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Format lists
    formatted = formatted.replace(/^\d+\.\s+\*\*(.*?)\*\*/gm, '<h4>$1</h4>');
    formatted = formatted.replace(/^\*\s+(.*?):/gm, '<p class="list-item"><strong>$1:</strong>');
    
    // Format paragraphs
    formatted = formatted.split('\n\n').map(para => {
      if (para.trim() && !para.includes('<h4>') && !para.includes('<p class="list-item">')) {
        return '<p>' + para.trim() + '</p>';
      }
      return para;
    }).join('');
    
    // Replace single newlines with <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return '<div class="ai-text-result">' + formatted + '</div>';
  }
}

function showAIResult(title, content) {
  hideAILoading();
  
  const formattedContent = formatAIResponse(content);
  
  showAIModal(title, formattedContent);
}

function showAIError(message) {
  hideAILoading();
  showAIModal("Error", `<p class="error-message">${message}</p>`);
}

function showAIModal(title, content) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = closeAIModal;
  
  const modal = document.createElement('div');
  modal.className = 'ai-modal';
  modal.innerHTML = `
    <div class="ai-modal-header">
      <h3>${title}</h3>
      <button class="close-modal-btn" onclick="closeAIModal()">×</button>
    </div>
    <div class="ai-modal-content">
      ${content}
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}

function closeAIModal() {
  const overlay = document.querySelector('.modal-overlay');
  const modal = document.querySelector('.ai-modal');
  
  if (overlay) overlay.remove();
  if (modal) modal.remove();
}

function showSuccessToast(message) {
  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
