/**
 * Login page JavaScript
 * Handles the temporary user login creation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    if (passwordToggles) {
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = toggle.querySelector('i');
                
                // Toggle password visibility
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    // Password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    function checkPasswordStrength() {
        const password = passwordInput.value;
        
        // Check various criteria
        const length = document.getElementById('length');
        const uppercase = document.getElementById('uppercase');
        const lowercase = document.getElementById('lowercase');
        const number = document.getElementById('number');
        const special = document.getElementById('special');
        
        // Reset classes
        [length, uppercase, lowercase, number, special].forEach(item => {
            item.classList.remove('valid');
        });
        
        // Validate criteria
        if (password.length >= 8) {
            length.classList.add('valid');
        }
        
        if (/[A-Z]/.test(password)) {
            uppercase.classList.add('valid');
        }
        
        if (/[a-z]/.test(password)) {
            lowercase.classList.add('valid');
        }
        
        if (/[0-9]/.test(password)) {
            number.classList.add('valid');
        }
        
        if (/[^A-Za-z0-9]/.test(password)) {
            special.classList.add('valid');
        }
        
        // Avanceret adgangskode-evaluering
        let passwordWeaknesses = [];
        
        // Tjek for almindelige talrækker som '123', '456', etc.
        if (/123|234|345|456|567|678|789|987|876|765|654|543|432|321/.test(password)) {
            passwordWeaknesses.push('contains_number_sequence');
        }
        
        // Tjek om '!' er det eneste specialtegn og om det er til sidst
        if (password.endsWith('!') && 
            (password.match(/[^A-Za-z0-9]/g) || []).length === 1 && 
            password.includes('!')) {
            passwordWeaknesses.push('exclamation_only_at_end');
        }
        
        // Tjek om adgangskoden er mindre end 12 tegn
        if (password.length < 12) {
            passwordWeaknesses.push('less_than_12_chars');
        }
        
        // Gem adgangskodeanalysen i localStorage til senere brug på resultatsiden
        let userChoices = {};
        try {
            userChoices = JSON.parse(localStorage.getItem('userChoices')) || {};
        } catch (error) {
            userChoices = {};
        }
        
        if (!userChoices.passwordAnalysis) {
            userChoices.passwordAnalysis = {};
        }
        
        userChoices.passwordAnalysis.weaknesses = passwordWeaknesses;
        userChoices.passwordAnalysis.password = password; // Vi gemmer password til analyseformål
        
        localStorage.setItem('userChoices', JSON.stringify(userChoices));
    }
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Reset errors
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const confirmPasswordError = document.getElementById('confirmPasswordError');
            
            emailError.textContent = '';
            emailError.classList.remove('visible');
            passwordError.textContent = '';
            passwordError.classList.remove('visible');
            confirmPasswordError.textContent = '';
            confirmPasswordError.classList.remove('visible');
            
            // Validation
            let hasErrors = false;
            
            if (!email) {
                emailError.textContent = 'Email er påkrævet';
                emailError.classList.add('visible');
                hasErrors = true;
            }
            
            if (password.length < 8) {
                passwordError.textContent = 'Adgangskoden skal være mindst 8 tegn lang';
                passwordError.classList.add('visible');
                hasErrors = true;
            }
            
            if (password !== confirmPassword) {
                confirmPasswordError.textContent = 'Adgangskoderne matcher ikke';
                confirmPasswordError.classList.add('visible');
                hasErrors = true;
            }
            
            if (hasErrors) {
                return;
            }
            
            // Create user choices object if it doesn't exist
            let userChoices = {};
            try {
                userChoices = JSON.parse(localStorage.getItem('userChoices')) || {};
            } catch (error) {
                // Initialize a new object if parsing fails
                userChoices = {};
            }
            
            // Make sure the structure exists
            if (!userChoices.login) {
                userChoices = {
                    login: {
                        created: false,
                        email: '',
                        password: ''
                    },
                    scenarios: {
                        gmailLogin: {
                            attempted: false,
                            usedCorrectCredentials: false
                        },
                        dbaScenario: {
                            attempted: false,
                            clickedAd: false,
                            reportedAsSpam: false,
                            providedPersonalInfo: false
                        },
                        facebookScenario: {
                            attempted: false,
                            clickedFakeLink: false,
                            usedCorrectLogin: false
                        }
                    },
                    score: 0,
                    maxScore: 3,
                    completed: false
                };
            }
            
            // Store login info in localStorage
            userChoices.login.created = true;
            userChoices.login.email = email;
            userChoices.login.password = password;
            
            localStorage.setItem('userChoices', JSON.stringify(userChoices));
            
            // Show success message and redirect to first scenario
            alert('Login oprettet! Husk disse oplysninger til de kommende scenarier.');
            
            // Navigate to the first scenario (Gmail login)
            window.location.href = 'gmail-login.html';
        });
    }
});
