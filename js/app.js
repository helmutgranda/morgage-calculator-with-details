function formatCurrency(value) {
    return '$' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatInputCurrency(value) {
    var num = value.toString().replace(/[^0-9]/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function parseInputCurrency(value) {
    return parseFloat(value.toString().replace(/[^0-9]/g, '')) || 0;
}

function calculateForTerm(homePrice, downPaymentPercent, interestRate, term) {
    var downPaymentAmount = homePrice * (downPaymentPercent / 100);
    var loanAmount = homePrice - downPaymentAmount;
    var monthlyRate = interestRate / 12;
    var numberOfPayments = term * 12;

    var monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    if (isNaN(monthlyPayment) || monthlyPayment === Infinity) {
        monthlyPayment = loanAmount / numberOfPayments;
    }

    var totalPaid = monthlyPayment * numberOfPayments;
    var totalInterest = totalPaid - loanAmount;

    return {
        monthly: monthlyPayment,
        loan: loanAmount,
        interest: totalInterest,
        total: totalPaid
    };
}

function calculateAll() {
    var homePrice = parseInputCurrency(document.getElementById('homePrice').value) || 0;
    var downPaymentPercent = parseFloat(document.getElementById('downPaymentSlider').value) || 0;
    var interestRate = parseFloat(document.getElementById('interestRateSlider').value) / 100;

    var terms = [50, 30, 15, 10];
    
    terms.forEach(function(term) {
        var result = calculateForTerm(homePrice, downPaymentPercent, interestRate, term);
        
        document.getElementById('monthly' + term).textContent = formatCurrency(result.monthly);
        document.getElementById('loan' + term).textContent = formatCurrency(result.loan);
        
        var interestElement = document.getElementById('interest' + term);
        interestElement.textContent = formatCurrency(result.interest);
        
        if (result.interest > result.loan) {
            interestElement.classList.add('red');
        } else {
            interestElement.classList.remove('red');
        }
        
        document.getElementById('total' + term).textContent = formatCurrency(result.total);
    });

    var selectedCard = document.querySelector('sl-card.selected');
    var selectedTerm = selectedCard ? parseInt(selectedCard.dataset.term) : 30;
    var result = calculateForTerm(homePrice, downPaymentPercent, interestRate, selectedTerm);
    document.getElementById('monthlyPayment').textContent = formatCurrency(result.monthly);
    document.getElementById('selectedTerm').textContent = selectedTerm;
}

document.getElementById('downPaymentSlider').addEventListener('sl-input', function() {
    var homePrice = parseInputCurrency(document.getElementById('homePrice').value) || 0;
    var percent = this.value;
    var amount = homePrice * (percent / 100);
    var sliderPercent = (percent / 90) * 100;
    
    var valueDisplay = document.getElementById('downPaymentValue');
    valueDisplay.textContent = percent + '% - ' + formatCurrency(amount);
    valueDisplay.style.left = sliderPercent + '%';
    
    calculateAll();
});

document.getElementById('interestRateSlider').addEventListener('sl-input', function() {
    var rate = parseFloat(this.value);
    var sliderPercent = (rate / 20) * 100;
    
    var valueDisplay = document.getElementById('interestRateValue');
    valueDisplay.textContent = rate.toFixed(2) + '%';
    valueDisplay.style.left = sliderPercent + '%';
    
    calculateAll();
});

document.getElementById('homePrice').addEventListener('input', function() {
    var rawValue = this.value;
    var numericValue = parseInputCurrency(rawValue);
    var formattedValue = formatInputCurrency(numericValue);
    
    if (this.value !== formattedValue) {
        this.value = formattedValue;
    }
    
    calculateAll();
    document.getElementById('downPaymentSlider').dispatchEvent(new CustomEvent('sl-input'));
});

document.getElementById('detailsBtn').addEventListener('click', function() {
    var details = document.getElementById('details');
    details.classList.toggle('show');
    this.textContent = details.classList.contains('show') ? 'Hide Details' : 'See Details';
});

var cards = document.querySelectorAll('sl-card[data-term]');
cards.forEach(function(card) {
    card.addEventListener('click', function() {
        cards.forEach(function(c) {
            c.classList.remove('selected');
        });
        this.classList.add('selected');
        
        var term = parseInt(this.dataset.term);
        var homePrice = parseInputCurrency(document.getElementById('homePrice').value) || 0;
        var downPaymentPercent = parseFloat(document.getElementById('downPaymentSlider').value) || 0;
        var interestRate = parseFloat(document.getElementById('interestRateSlider').value) / 100;
        
        var result = calculateForTerm(homePrice, downPaymentPercent, interestRate, term);
        document.getElementById('monthlyPayment').textContent = formatCurrency(result.monthly);
        document.getElementById('selectedTerm').textContent = term;
    });
});

calculateAll();
