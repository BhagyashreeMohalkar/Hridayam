// JavaScript for Heart Disease Detection App

document.addEventListener('DOMContentLoaded', function() {
    // Update range slider values
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
        const valueSpan = document.getElementById(input.id + 'Value');
        if (valueSpan) {
            valueSpan.textContent = input.value;
            input.addEventListener('input', function() {
                valueSpan.textContent = input.value;
            });
        }
    });

    // Handle prediction form submission
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitPrediction();
        });
    }

    // Handle contact form submission
    const contactForm = document.querySelector('form');
    if (contactForm && contactForm.id !== 'predictionForm') {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
        });
    }
});

async function submitPrediction() {
    const form = document.getElementById('predictionForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('result');
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Analyzing...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            displayResult(result);
        } else {
            throw new Error(result.error || 'Prediction failed');
        }
    } catch (error) {
        displayError(error.message);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const riskMeter = document.getElementById('riskMeter');
    
    if (result.prediction === 1) {
        resultTitle.innerHTML = '<i class="fas fa-exclamation-triangle text-danger me-2"></i>Higher Risk Detected';
        resultTitle.className = 'text-danger';
        resultText.innerHTML = `
            <p class="mb-2">Our analysis suggests a higher risk of heart disease.</p>
            <p class="mb-2"><strong>Risk Probability:</strong> ${(result.probability.disease * 100).toFixed(1)}%</p>
            <div class="alert alert-warning">
                <strong>Important:</strong> This is a screening tool only. Please consult with a healthcare professional for proper medical evaluation.
            </div>
        `;
    } else {
        resultTitle.innerHTML = '<i class="fas fa-check-circle text-success me-2"></i>Lower Risk Detected';
        resultTitle.className = 'text-success';
        resultText.innerHTML = `
            <p class="mb-2">Our analysis suggests a lower risk of heart disease.</p>
            <p class="mb-2"><strong>Risk Probability:</strong> ${(result.probability.disease * 100).toFixed(1)}%</p>
            <div class="alert alert-info">
                <strong>Note:</strong> Maintain a healthy lifestyle and regular check-ups for optimal cardiovascular health.
            </div>
        `;
    }
    
    // Create risk meter visualization
    const riskPercentage = result.probability.disease * 100;
    riskMeter.innerHTML = `
        <div class="risk-meter">
            <div class="risk-indicator" style="left: ${riskPercentage}%"></div>
        </div>
        <div class="d-flex justify-content-between mt-2">
            <small class="text-success">Low Risk</small>
            <small class="text-warning">Moderate Risk</small>
            <small class="text-danger">High Risk</small>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function displayError(message) {
    const resultDiv = document.getElementById('result');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    
    resultTitle.innerHTML = '<i class="fas fa-exclamation-circle text-danger me-2"></i>Error';
    resultTitle.className = 'text-danger';
    resultText.innerHTML = `
        <div class="alert alert-danger">
            <strong>Error:</strong> ${message}
            <br>Please try again or contact support if the problem persists.
        </div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to cards on scroll
function animateOnScroll() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;
        
        if (cardTop < window.innerHeight - cardVisible) {
            card.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
