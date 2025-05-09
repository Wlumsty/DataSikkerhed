/**
 * Scenarios JavaScript
 * Handles all the interactive functionality for the different scam scenarios
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize countdown timer for identity verification page if it exists
    if (document.querySelector('.identity-verification-page')) {
        let countdown = 11 * 60 * 60 + 59 * 60 + 59; // 11 hours, 59 minutes, 59 seconds
        const countdownDisplay = document.getElementById('countdown');
        
        if (countdownDisplay) {
            function updateCountdown() {
                const hours = Math.floor(countdown / 3600);
                const minutes = Math.floor((countdown % 3600) / 60);
                const seconds = countdown % 60;
                
                countdownDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                if (countdown > 0) {
                    countdown--;
                    setTimeout(updateCountdown, 1000);
                } else {
                    countdownDisplay.textContent = "00:00:00";
                    countdownDisplay.style.color = "#ff0000";
                }
            }
            
            updateCountdown();
        }
    }
    // Implementer global luk-knap funktionalitet
    const closeButton = document.querySelector('.action-button.close');
    if (closeButton) {
        // Opret reset dropdown HTML
        const resetDropdown = document.createElement('div');
        resetDropdown.className = 'reset-dropdown';
        resetDropdown.innerHTML = `
            <p>Er du sikker på at du vil nulstille og afslutte?</p>
            <div class="dropdown-buttons">
                <button class="btn-yes">Ja</button>
                <button class="btn-no">Nej</button>
            </div>
        `;
        closeButton.appendChild(resetDropdown);
        
        // Tilføj event listeners til knapper
        const yesButton = resetDropdown.querySelector('.btn-yes');
        const noButton = resetDropdown.querySelector('.btn-no');
        
        yesButton.addEventListener('click', () => {
            // NULSTIL ALT og gå til forsiden
            localStorage.removeItem('userChoices');
            // Fjern også vores nye hasVisitedGoogleSearch flag
            localStorage.removeItem('hasVisitedGoogleSearch');
            window.location.href = 'index.html';
        });
        
        noButton.addEventListener('click', () => {
            resetDropdown.classList.remove('show');
        });
        
        // Vis dropdown ved klik på luk knappen
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            resetDropdown.classList.toggle('show');
        });
    }
    
    // Get user choices from localStorage
    const userChoices = JSON.parse(localStorage.getItem('userChoices')) || {
        score: 0,
        scenarios: {},
        vpnActive: false
    };
    
    // Debug localStorage indhold ved start
    console.log('Initial localStorage content:', JSON.stringify(userChoices));
    
    // Handle VPN button
    const vpnToggle = document.getElementById('vpnToggle');
    if (vpnToggle) {
        // Apply VPN status from localStorage
        if (userChoices.vpnActive) {
            vpnToggle.classList.add('active');
        }
        
        // Add click event to toggle VPN
        vpnToggle.addEventListener('click', () => {
            if (userChoices.vpnActive) {
                // Deaktiver VPN
                userChoices.vpnActive = false;
                vpnToggle.classList.remove('active');
            } else {
                // Aktiver VPN
                userChoices.vpnActive = true;
                vpnToggle.classList.add('active');
                
                // Tracking af tidlig VPN-aktivering (Safe Surfer)
                // Hvis vi er på gmail-login.html siden
                if (window.location.pathname.includes('gmail-login.html')) {
                    // Initialiser behaviorPatterns hvis det ikke findes
                    if (!userChoices.behaviorPatterns) {
                        userChoices.behaviorPatterns = {};
                    }
                    
                    // Markér at brugeren er en "Safe Surfer" der aktiverer VPN tidligt
                    userChoices.behaviorPatterns.earlyVpnActivation = true;
                }
            }
            
            // Save to localStorage
            localStorage.setItem('userChoices', JSON.stringify(userChoices));
        });
    }
    
    // Handle Gmail login scenario
    if (document.querySelector('.gmail-page')) {
        const gmailLoginForm = document.getElementById('gmailLoginForm');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        const closeModal = document.querySelector('.close-modal');
        const continueTestBtn = document.getElementById('continueTestBtn');
        const savedEmail = document.getElementById('savedEmail');
        const savedPassword = document.getElementById('savedPassword');
        
        // Forgot password functionality
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Display the saved credentials
                savedEmail.textContent = userChoices.login.email;
                savedPassword.textContent = userChoices.login.password;
                
                // Record this action (will impact score)
                userChoices.scenarios.gmailLogin.usedForgotPassword = true;
                
                // Tracking af adfærdsmønster - glemte kodeord
                if (!userChoices.behaviorPatterns) {
                    userChoices.behaviorPatterns = {};
                }
                
                if (!userChoices.behaviorPatterns.forgottenPasswords) {
                    userChoices.behaviorPatterns.forgottenPasswords = [];
                }
                
                // Tilføj 'gmail' til listen over steder hvor brugeren har glemt kodeord
                if (!userChoices.behaviorPatterns.forgottenPasswords.includes('gmail')) {
                    userChoices.behaviorPatterns.forgottenPasswords.push('gmail');
                }
                
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Show the modal
                forgotPasswordModal.classList.add('show');
            });
        }
        
        // Close modal functionality
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                forgotPasswordModal.classList.remove('show');
            });
        }
        
        // Continue button in modal
        if (continueTestBtn) {
            continueTestBtn.addEventListener('click', () => {
                forgotPasswordModal.classList.remove('show');
            });
        }
        
        // Handle login form submission
        if (gmailLoginForm) {
            gmailLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const email = document.getElementById('gmailEmail').value;
                const password = document.getElementById('gmailPassword').value;
                
                // Reset error messages
                const gmailEmailError = document.getElementById('gmailEmailError');
                const gmailPasswordError = document.getElementById('gmailPasswordError');
                gmailEmailError.textContent = '';
                gmailEmailError.classList.remove('visible');
                gmailPasswordError.textContent = '';
                gmailPasswordError.classList.remove('visible');
                
                // Check if user used their temporary login credentials
                const usedCorrectCredentials = (
                    email === userChoices.login.email && 
                    password === userChoices.login.password
                );
                
                // Validate login
                if (!usedCorrectCredentials) {
                    gmailPasswordError.textContent = 'Forkert email eller adgangskode';
                    gmailPasswordError.classList.add('visible');
                    return;
                }
                
                // Update scenario status
                userChoices.scenarios.gmailLogin.attempted = true;
                userChoices.scenarios.gmailLogin.usedCorrectCredentials = true;
                
                // Update score if they used the correct credentials (but reduce if they used forgot password)
                if (userChoices.scenarios.gmailLogin.usedForgotPassword) {
                    // They get half a point if they had to use the forgot password feature
                    userChoices.score += 0.5;
                } else {
                    userChoices.score += 1;
                }
                
                // Save to localStorage
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Redirect to the Gmail inbox
                window.location.href = 'gmail-inbox.html';
            });
        }
    }
    
    // Handle DBA/iPhone scam scenario
    if (document.querySelector('.dba-page')) {
        // Ad click handler
        const scamAd = document.getElementById('scamAd');
        const claimBtn = scamAd ? scamAd.querySelector('.claim-btn') : null;
        const reportBtn = document.getElementById('reportAd');
        
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                // User clicked on the scam ad (incorrect choice)
                if (!userChoices.scenarios.dbaScenario) {
                    userChoices.scenarios.dbaScenario = {};
                }
                userChoices.scenarios.dbaScenario.clickedScamAd = true;
                
                // Check VPN status - reduce score less if VPN is active
                if (userChoices.vpnActive) {
                    userChoices.score -= 0.5; // Less points deducted because VPN offers some protection
                    userChoices.scenarios.dbaScenario.clickedUnsafeLinkWithVPN = true;
                    alert('Du har klikket på et mistænkeligt link, men din VPN var aktiv. Dette beskyttede dine personlige oplysninger i nogen grad. I en virkelig situation ville dette stadig kunne være risikabelt.');
                } else {
                    userChoices.score -= 1; // Full point deduction for clicking on unsafe link without protection
                    userChoices.scenarios.dbaScenario.clickedUnsafeLink = true;
                }
                
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Redirect to iPhone claim page
                window.location.href = 'iphone-claim.html';
            });
        }
        
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                // User reported the ad as spam (correct choice)
                userChoices.scenarios.dbaScenario.attempted = true;
                userChoices.scenarios.dbaScenario.reportedAsSpam = true;
                userChoices.score += 1;
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Show feedback and redirect to the next scenario
                alert('Godt valgt! Du har korrekt identificeret dette som spam. Du vil nu blive sendt videre til næste scenario.');
                
                // Tjek om brugeren allerede har besøgt Google search siden
                const hasVisitedGoogleSearch = localStorage.getItem('hasVisitedGoogleSearch');
                if (hasVisitedGoogleSearch !== 'true') {
                    window.location.href = 'google-search.html';
                }
            });
        }
    }
    
    // Handle iPhone claim form
    if (document.querySelector('.prize-claim-page')) {
        console.log('Prize claim page detected');
        const paymentForm = document.getElementById('prizeClaimForm');
        const claimFormEmailInput = document.getElementById('emailAddress');
        
        console.log('prizeClaimForm found:', paymentForm !== null);
        
        // Auto-forslag af email, hvis brugeren har login-email
        if (claimFormEmailInput && userChoices.login && userChoices.login.email) {
            // Tilføj event listener så vi kan vise email når brugeren klikker på feltet
            claimFormEmailInput.addEventListener('focus', function() {
                // Kun sæt værdi hvis feltet er tomt
                if (this.value === '') {
                    this.value = userChoices.login.email;
                    // Vælg hele teksten så brugeren kan overskrive let
                    this.select();
                }
            });
        }
        
        // Sikr os at vi håndterer formular-submit korrekt
        if (paymentForm) {
            console.log('Adding submit event listener to prizeClaimForm');
            
            paymentForm.addEventListener('submit', (e) => {
                console.log('Form submitted!');
                e.preventDefault();
                
                // Store user fell for payment scam
                userChoices.scamSuccess = true;
                userChoices.showPaymentConfirmationEmail = true;
                if (!userChoices.scenarios.dbaScenario) {
                    userChoices.scenarios.dbaScenario = {};
                }
                userChoices.scenarios.dbaScenario.submittedPaymentInfo = true;
                userChoices.score -= 1; // Subtract a point for submitting sensitive information
                
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Redirect to the Gmail inbox with the new scam email
                console.log('Redirecting to gmail-inbox.html');
                window.location.href = 'gmail-inbox.html';
            });
            
            // Sikrer os at formularen ikke kan sendes til en standard action
            paymentForm.setAttribute('action', 'javascript:void(0);');
        } else {
            // Hvis paymentForm ikke blev fundet, prøv at tilføje event listener når dokumentet er fuldt indlæst
            console.log('Could not find prizeClaimForm, trying alternative approach');
            setTimeout(() => {
                const paymentFormRetry = document.getElementById('prizeClaimForm');
                if (paymentFormRetry) {
                    console.log('Found prizeClaimForm on retry');
                    paymentFormRetry.addEventListener('submit', (e) => {
                        console.log('Form submitted (retry)!');
                        e.preventDefault();
                        
                        // Store user fell for payment scam
                        userChoices.scamSuccess = true;
                        userChoices.showPaymentConfirmationEmail = true;
                        if (!userChoices.scenarios.dbaScenario) {
                            userChoices.scenarios.dbaScenario = {};
                        }
                        // Vi sætter submittedPersonalInfo i stedet for submittedPaymentInfo
                        // for at undgå at vise forkert feedback i resultatssiden
                        userChoices.scenarios.dbaScenario.submittedPersonalInfo = true;
                        userChoices.score -= 1;
                        
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                        
                        console.log('Redirecting to gmail-inbox.html (retry)');
                        window.location.href = 'gmail-inbox.html';
                    });
                    paymentFormRetry.setAttribute('action', 'javascript:void(0);');
                }
            }, 500); // Vent et halvt sekund og prøv igen
        }
    }
    
    // Handle Google Search page
    if (document.querySelector('.google-page')) {
        // Registrer at brugeren har besøgt Google search siden
        if (!userChoices.scenarios.googleSearch) {
            userChoices.scenarios.googleSearch = {};
        }
        
        // Sæt visited flag
        userChoices.scenarios.googleSearch.visited = true;
        localStorage.setItem('userChoices', JSON.stringify(userChoices));
    }
    
    // Handle Gmail Inbox page
    if (document.querySelector('.gmail-inbox-page')) {
    // Email items
    const emailItems = document.querySelectorAll('.email-item');
    const emailDetailModal = document.getElementById('emailDetailModal');
    const emailModalTitle = document.getElementById('emailModalTitle');
    const emailModalBody = document.getElementById('emailModalBody');
    const closeEmailButton = document.getElementById('closeEmailButton');
    const continueButton = document.getElementById('continueButton');
    const emailList = document.querySelector('.email-list');
    const iPhoneScamEmail = document.getElementById('iPhoneScamMail');
    const facebookResetEmail = document.getElementById('facebookResetMail');
    const welcomeEmail = document.getElementById('welcomeMail');
    
    // Opdater "read" status baseret på userChoices ved page load
    if (userChoices.scenarios && userChoices.scenarios.gmailInbox) {
        // Hvis iPhone email er blevet læst, fjern unread klassen
        if (userChoices.scenarios.gmailInbox.viewedIPhoneScamEmail && iPhoneScamEmail) {
            iPhoneScamEmail.classList.remove('unread');
        }
        
        // Hvis Facebook email er blevet læst, fjern unread klassen
        if (userChoices.scenarios.gmailInbox && userChoices.scenarios.gmailInbox.viewedFacebookResetEmail && facebookResetEmail) {
            facebookResetEmail.classList.remove('unread');
        }
        
        // Hvis DataSikkerhed email er blevet læst, fjern unread klassen
        if (userChoices.scenarios.gmailInbox && userChoices.scenarios.gmailInbox.viewedWelcomeEmail && welcomeEmail) {
            welcomeEmail.classList.remove('unread');
        }
        
        // Hvis Facebook Security email er blevet læst, fjern unread klassen
        const facebookSecurityMail = document.getElementById('facebookSecurityMail');
        if (userChoices.scenarios.gmailInbox && userChoices.scenarios.gmailInbox.viewedFacebookSecurityEmail && facebookSecurityMail) {
            facebookSecurityMail.classList.remove('unread');
        }
        
        // Hvis Facebook Security Fake email er blevet læst, fjern unread klassen
        const facebookSecurityFakeMail = document.getElementById('facebookSecurityFakeMail');
        if (userChoices.scenarios.gmailInbox && userChoices.scenarios.gmailInbox.viewedFacebookSecurityFakeEmail && facebookSecurityFakeMail) {
            facebookSecurityFakeMail.classList.remove('unread');
        }
        
        // Hvis Payment Confirmation email er blevet læst, fjern unread klassen
        const paymentConfirmationMail = document.getElementById('paymentConfirmationMail');
        if (userChoices.scenarios.gmailInbox && userChoices.scenarios.gmailInbox.viewedPaymentEmail && paymentConfirmationMail) {
            paymentConfirmationMail.classList.remove('unread');
        }
        
        // Hvis emails er blevet slettet, fjern dem fra DOM
        if (userChoices.scenarios.gmailInbox.deletedWelcomeEmail && welcomeEmail) {
            welcomeEmail.remove();
        }
        
        if (userChoices.scenarios.gmailInbox.deletedIPhoneScamEmail && iPhoneScamEmail) {
            iPhoneScamEmail.remove();
        }
        
        if (userChoices.scenarios.gmailInbox.deletedFacebookEmail && facebookResetEmail) {
            facebookResetEmail.remove();
        }
    }
    
    // Email delete buttons
    const deleteIPhoneEmailBtn = document.getElementById('deleteIPhoneEmail');
    const deleteFacebookEmailBtn = document.getElementById('deleteFacebookEmail');
    const deleteWelcomeEmailBtn = document.getElementById('deleteWelcomeEmail');
    
    // Handle iPhone email deletion
    if (deleteIPhoneEmailBtn) {
        deleteIPhoneEmailBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the parent email click event
            
            // Update user choices to track this action (positive impact on score)
            if (!userChoices.scenarios.gmailInbox) {
                userChoices.scenarios.gmailInbox = {};
            }
            
            userChoices.scenarios.gmailInbox.deletedIPhoneScamEmail = true;
            userChoices.score += 1; // Add points for correctly deleting suspicious email
            localStorage.setItem('userChoices', JSON.stringify(userChoices));
            
            // Show feedback and redirect
            alert('Godt valgt! Du har korrekt identificeret og slettet en mistænkelig email uden at åbne den.');
            
            // Remove the email from the inbox
            if (iPhoneScamEmail) {
                iPhoneScamEmail.remove();
            }
            
            // Kun omdiriger til Google search hvis brugeren ikke allerede har været der
            // Tjekker direkte i localStorage om brugeren tidligere har besøgt Google search siden
            window.setTimeout(() => {
                // Tjek om brugeren allerede har set Google search siden via det direkte flag
                const hasVisitedGoogleSearch = localStorage.getItem('hasVisitedGoogleSearch');
                if (hasVisitedGoogleSearch !== 'true') {
                    window.location.href = 'google-search.html';
                }
            }, 1000);
        });
    }
    
    // Handle Facebook email deletion
    if (deleteFacebookEmailBtn) {
        deleteFacebookEmailBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the parent email click event
            
            // Update user choices
            if (!userChoices.scenarios.gmailInbox) {
                userChoices.scenarios.gmailInbox = {};
            }
            
            userChoices.scenarios.gmailInbox.deletedFacebookEmail = true;
            userChoices.score += 0.5; // Add points for deleting suspicious email
            localStorage.setItem('userChoices', JSON.stringify(userChoices));
            
            // Remove the email from the inbox
            if (facebookResetEmail) {
                facebookResetEmail.remove();
            }
        });
    }
    
    // Handle Welcome email deletion
    if (deleteWelcomeEmailBtn) {
        deleteWelcomeEmailBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the parent email click event
            
            // Update user choices
            if (!userChoices.scenarios.gmailInbox) {
                userChoices.scenarios.gmailInbox = {};
            }
            
            userChoices.scenarios.gmailInbox.deletedWelcomeEmail = true;
            // No score impact for deleting the welcome email
            localStorage.setItem('userChoices', JSON.stringify(userChoices));
            
            // Remove the email from the inbox
            const welcomeEmail = document.getElementById('welcomeMail');
            if (welcomeEmail) {
                welcomeEmail.remove();
            }
        });
    }

        // Check if we need to display Facebook security emails in Gmail inbox (both real and fake)
        // Only show if they're not marked as deleted in userChoices
        // The order of emails: newest at top
        // 1. Fake Facebook security email (14:07)
        // 2. Legitimate Facebook security email (14:03) - only if user entered real password on fake Facebook page
        // 3. Payment confirmation email (12:10) 
        // 4. iPhone scam email (baseline)
        // 5. DataSikkerhed welcome email (09:45) - at the bottom

        // We'll add them in reverse chronological order (oldest first) as we're using 'afterbegin'

        // First check and add the legitimate Facebook security email if:
        // 1. It hasn't been deleted AND
        // 2. The user entered their "real" password on the fake Facebook page
        // Vi sætter betingelsen tilbage, så den ægte mail KUN vises når usedRealPassword er true
        if (userChoices.showFacebookSecurityEmail && 
            emailList && 
            userChoices.scenarios && 
            userChoices.scenarios.facebookScenario && 
            userChoices.scenarios.facebookScenario.usedRealPassword === true) {

            if (!userChoices.scenarios.gmailInbox || !userChoices.scenarios.gmailInbox.deletedFacebookSecurityEmail) {
                emailList.insertAdjacentHTML('afterbegin', facebookSecurityEmailHTML);
                
                // Add event listener for legitimate Facebook security email
                const facebookSecurityMail = document.getElementById('facebookSecurityMail');
                const deleteFacebookSecurityEmail = document.getElementById('deleteFacebookSecurityEmail');
                
                // Apply the read status if it was previously viewed
                if (userChoices.scenarios.gmailInbox && userChoices.scenarios.gmailInbox.viewedFacebookSecurityEmail) {
                    facebookSecurityMail.classList.remove('unread');
                    // Store in localStorage again to ensure it persists
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                }
                
                // Add delete handler for legitimate Facebook security email
                if (deleteFacebookSecurityEmail) {
                    deleteFacebookSecurityEmail.addEventListener('click', function(e) {
                        e.stopPropagation(); // Prevent triggering the parent email click event
                        
                        // Update user choices
                        if (!userChoices.scenarios.gmailInbox) {
                            userChoices.scenarios.gmailInbox = {};
                        }
                        
                        userChoices.scenarios.gmailInbox.deletedFacebookSecurityEmail = true;
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                        
                        // Remove the email from the inbox
                        if (facebookSecurityMail) {
                            facebookSecurityMail.remove();
                        }
                    });
                }
            }
        }
            
        // Then add the fake security email if it hasn't been deleted
        if (userChoices.showFacebookSecurityEmail && emailList) {
            if (!userChoices.scenarios.gmailInbox || !userChoices.scenarios.gmailInbox.deletedFacebookSecurityFakeEmail) {
                // Insert fake Facebook security email
                emailList.insertAdjacentHTML('afterbegin', facebookSecurityFakeEmailHTML); 
                
                // Add event listener for fake Facebook security email
                const facebookSecurityFakeMail = document.getElementById('facebookSecurityFakeMail');
                const deleteFacebookSecurityFakeEmail = document.getElementById('deleteFacebookSecurityFakeEmail');
                
                // Apply the read status if it was previously viewed
                if (userChoices.scenarios.gmailInbox && userChoices.scenarios.gmailInbox.viewedFacebookSecurityFakeEmail) {
                    facebookSecurityFakeMail.classList.remove('unread');
                    // Store in localStorage again to ensure it persists
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                }
                
                // Add delete handler for fake Facebook security email
                if (deleteFacebookSecurityFakeEmail) {
                    deleteFacebookSecurityFakeEmail.addEventListener('click', function(e) {
                        e.stopPropagation(); // Prevent triggering the parent email click event
                        
                        // Update user choices
                        if (!userChoices.scenarios.gmailInbox) {
                            userChoices.scenarios.gmailInbox = {};
                        }
                        
                        userChoices.scenarios.gmailInbox.deletedFacebookSecurityFakeEmail = true;
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                        
                        // Remove the email from the inbox
                        if (facebookSecurityFakeMail) {
                            facebookSecurityFakeMail.remove();
                        }
                    });
                }
            }
        
        // Only add DataSikkerhed welcome email if it hasn't been deleted AND isn't already present
        const existingWelcomeEmail = document.getElementById('welcomeMail');
        
        // Check both conditions: 1) Not already in DOM, 2) Not marked as deleted in userChoices
        const welcomeEmailShouldBeAdded = !existingWelcomeEmail && 
                                        emailList && 
                                        (!userChoices.scenarios || 
                                         !userChoices.scenarios.gmailInbox || 
                                         !userChoices.scenarios.gmailInbox.deletedWelcomeEmail);
                                        
        if (welcomeEmailShouldBeAdded) {
            // Insert DataSikkerhed welcome email at the bottom of the list (append to end)
            emailList.insertAdjacentHTML('beforeend', welcomeEmailHTML);
            
            // Add event listener for welcome email
            const welcomeMail = document.getElementById('welcomeMail');
            const deleteWelcomeEmail = document.getElementById('deleteWelcomeEmail');
            
            // Add delete handler for welcome email
            if (deleteWelcomeEmail) {
                deleteWelcomeEmail.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent triggering the parent email click event
                    
                    // Update user choices
                    if (!userChoices.scenarios.gmailInbox) {
                        userChoices.scenarios.gmailInbox = {};
                    }
                    
                    userChoices.scenarios.gmailInbox.deletedWelcomeEmail = true;
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    
                    // Remove the email from the inbox
                    if (welcomeMail) {
                        welcomeMail.remove();
                    }
                });
            }
            
            // Click handler for welcome email
            if (welcomeMail) {
                welcomeMail.addEventListener('click', () => {
                    emailModalTitle.textContent = emailTemplates.welcome.subject;
                    
                    // Extract sender name and email parts
                    const senderFull = emailTemplates.welcome.sender;
                    const senderName = senderFull.split('<')[0].trim();
                    const senderEmail = senderFull.includes('<') ? senderFull.split('<')[1].replace('>', '') : senderFull;
                    
                    emailModalBody.innerHTML = `
                        <div class="email-header-details">
                            <p>
                                <strong>Fra:</strong> 
                                <span class="sender-name" data-sender-email="${senderEmail}" data-email-id="welcomeMail">${senderName}</span>
                                <span class="sender-email">${senderEmail}</span>
                            </p>
                            <p><strong>Emne:</strong> ${emailTemplates.welcome.subject}</p>
                            <p><strong>Dato:</strong> ${emailTemplates.welcome.date}</p>
                        </div>
                        ${emailTemplates.welcome.content}
                    `;
                    emailDetailModal.style.display = 'block';
                    
                    // Skift fra unread til read - fjern unread klassen
                    welcomeMail.classList.remove('unread');
                    
                    // Update user choices to track that the welcome email was viewed
                    userChoices.scenarios.gmailInbox = userChoices.scenarios.gmailInbox || {};
                    userChoices.scenarios.gmailInbox.viewedWelcomeEmail = true;
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    
                    // Add event listener for the sender name click
                    const senderNameElement = emailModalBody.querySelector('.sender-name');
                    const senderEmailElement = emailModalBody.querySelector('.sender-email');
                    
                    if (senderNameElement && senderEmailElement) {
                        senderNameElement.addEventListener('click', function() {
                            // Toggle visibility of the email address
                            senderEmailElement.classList.toggle('visible');
                        });
                    }
                });
            }
        }
            
        // Click handler for legitimate Facebook security email
        const facebookSecurityMail = document.getElementById('facebookSecurityMail');
        if (facebookSecurityMail) {
                facebookSecurityMail.addEventListener('click', () => {
                    emailModalTitle.textContent = emailTemplates.facebookSecurity.subject;
                    
                    // Extract sender name and email parts
                    const senderFull = emailTemplates.facebookSecurity.sender;
                    const senderName = senderFull.split('<')[0].trim();
                    const senderEmail = senderFull.includes('<') ? senderFull.split('<')[1].replace('>', '') : senderFull;
                    
                    emailModalBody.innerHTML = `
                        <div class="email-header-details">
                            <p>
                                <strong>Fra:</strong> 
                                <span class="sender-name" data-sender-email="${senderEmail}" data-email-id="facebookSecurityMail">${senderName}</span>
                                <span class="sender-email">${senderEmail}</span>
                            </p>
                            <p><strong>Emne:</strong> ${emailTemplates.facebookSecurity.subject}</p>
                            <p><strong>Dato:</strong> ${emailTemplates.facebookSecurity.date}</p>
                        </div>
                        ${emailTemplates.facebookSecurity.content}
                    `;
                    emailDetailModal.style.display = 'block';
                    
                    // Marker mailen som læst ved at fjerne unread klassen
                    facebookSecurityMail.classList.remove('unread');
                    
                    // Update user choices to track that the Facebook security email was viewed
                    userChoices.scenarios.gmailInbox = userChoices.scenarios.gmailInbox || {};
                    userChoices.scenarios.gmailInbox.viewedFacebookSecurityEmail = true;
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    
                    // Add event listener for the sender name click
                    const senderNameElement = emailModalBody.querySelector('.sender-name');
                    const senderEmailElement = emailModalBody.querySelector('.sender-email');
                    
                    if (senderNameElement && senderEmailElement) {
                        senderNameElement.addEventListener('click', function() {
                            // Toggle visibility of the email address
                            senderEmailElement.classList.toggle('visible');
                            
                            // Make sure userChoices.scenarios.gmailInbox exists
                            if (!userChoices.scenarios.gmailInbox) {
                                userChoices.scenarios.gmailInbox = {};
                            }
                            
                            // Track that the user checked the sender email (only track once)
                            if (!userChoices.scenarios.gmailInbox.checkedSenderEmail) {
                                userChoices.scenarios.gmailInbox.checkedSenderEmail = true;
                                
                                // Store which email's sender was checked
                                userChoices.scenarios.gmailInbox.checkedSenderEmailType = 'facebookSecurityMail';
                                
                                // Add points for checking the sender email address (good security practice)
                                userChoices.score += 0.5;
                                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                            }
                        });
                    }
                });
            }
            
            // Click handler for fake Facebook security email
            const facebookSecurityFakeMail = document.getElementById('facebookSecurityFakeMail');
            if (facebookSecurityFakeMail) {
                facebookSecurityFakeMail.addEventListener('click', () => {
                    emailModalTitle.textContent = emailTemplates.facebookSecurityFake.subject;
                    
                    // Extract sender name and email parts
                    const senderFull = emailTemplates.facebookSecurityFake.sender;
                    const senderName = senderFull.split('<')[0].trim();
                    const senderEmail = senderFull.includes('<') ? senderFull.split('<')[1].replace('>', '') : senderFull;
                    
                    emailModalBody.innerHTML = `
                        <div class="email-header-details">
                            <p>
                                <strong>Fra:</strong> 
                                <span class="sender-name" data-sender-email="${senderEmail}" data-email-id="facebookSecurityFakeMail">${senderName}</span>
                                <span class="sender-email">${senderEmail}</span>
                            </p>
                            <p><strong>Emne:</strong> ${emailTemplates.facebookSecurityFake.subject}</p>
                            <p><strong>Dato:</strong> ${emailTemplates.facebookSecurityFake.date}</p>
                        </div>
                        ${emailTemplates.facebookSecurityFake.content}
                    `;
                    emailDetailModal.style.display = 'block';
                    
                    // Marker mailen som læst ved at fjerne unread klassen
                    facebookSecurityFakeMail.classList.remove('unread');
                    
                    // Update user choices to track that the fake Facebook security email was viewed
                    userChoices.scenarios.gmailInbox = userChoices.scenarios.gmailInbox || {};
                    userChoices.scenarios.gmailInbox.viewedFacebookSecurityFakeEmail = true;
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    
                    // Add event listener for the sender name click
                    const senderNameElement = emailModalBody.querySelector('.sender-name');
                    const senderEmailElement = emailModalBody.querySelector('.sender-email');
                    
                    if (senderNameElement && senderEmailElement) {
                        senderNameElement.addEventListener('click', function() {
                            // Toggle visibility of the email address
                            senderEmailElement.classList.toggle('visible');
                            
                            // Make sure userChoices.scenarios.gmailInbox exists
                            if (!userChoices.scenarios.gmailInbox) {
                                userChoices.scenarios.gmailInbox = {};
                            }
                            
                            // Track that the user checked the sender email (only track once)
                            if (!userChoices.scenarios.gmailInbox.checkedSenderEmail) {
                                userChoices.scenarios.gmailInbox.checkedSenderEmail = true;
                                
                                // Store which email's sender was checked
                                userChoices.scenarios.gmailInbox.checkedSenderEmailType = 'facebookSecurityFakeMail';
                                
                                // Add points for checking the sender email address (good security practice)
                                userChoices.score += 0.5;
                                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                            }
                        });
                    }
                });
            }
        }
        
        // Check if we need to display payment confirmation email in Gmail inbox
        if (userChoices.showPaymentConfirmationEmail && emailList && (!userChoices.scenarios.gmailInbox || !userChoices.scenarios.gmailInbox.deletedPaymentEmail)) {
            // Only show the email if it hasn't been deleted
            emailList.insertAdjacentHTML('beforeend', confirmationEmailHTML); // Use beforeend to place it below the Facebook emails
            
            // Add event listener for payment confirmation email
            const paymentConfirmationMail = document.getElementById('paymentConfirmationMail');
            const deletePaymentEmailBtn = document.getElementById('deletePaymentEmail');
            
            // Apply the read status if it was previously viewed
            if (userChoices.scenarios.gmailInbox && userChoices.scenarios.gmailInbox.viewedPaymentEmail) {
                paymentConfirmationMail.classList.remove('unread');
                // Store in localStorage again to ensure it persists
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
            }
            
            // Add event listener for delete button
            if (deletePaymentEmailBtn) {
                deletePaymentEmailBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent triggering the parent email click event
                    
                    // Update user choices
                    if (!userChoices.scenarios.gmailInbox) {
                        userChoices.scenarios.gmailInbox = {};
                    }
                    
                    userChoices.scenarios.gmailInbox.deletedPaymentEmail = true;
                    userChoices.score += 1; // Add points for correctly deleting suspicious email
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    
                    // Show feedback and redirect
                    alert('Godt valgt! Du har korrekt identificeret og slettet en mistænkelig email uden at åbne den.');
                    
                    // Remove the email from the inbox
                    if (paymentConfirmationMail) {
                        paymentConfirmationMail.remove();
                    }
                    
                    // Redirect to Google search kun hvis brugeren ikke allerede har været der
                    window.setTimeout(() => {
                        // Tjek om brugeren allerede har besøgt Google search siden
                        const hasVisitedGoogleSearch = localStorage.getItem('hasVisitedGoogleSearch');
                        if (hasVisitedGoogleSearch !== 'true') {
                            window.location.href = 'google-search.html';
                        }
                    }, 1000);
                });
            }
            
            if (paymentConfirmationMail) {
                paymentConfirmationMail.addEventListener('click', () => {
                    emailModalTitle.textContent = emailTemplates.paymentConfirmation.subject;
                    
                    // Extract sender name and email parts
                    const senderFull = emailTemplates.paymentConfirmation.sender;
                    const senderName = senderFull.split('<')[0].trim();
                    const senderEmail = senderFull.includes('<') ? senderFull.split('<')[1].replace('>', '') : senderFull;
                    
                    emailModalBody.innerHTML = `
                        <div class="email-header-details">
                            <p>
                                <strong>Fra:</strong> 
                                <span class="sender-name" data-sender-email="${senderEmail}" data-email-id="paymentConfirmationMail">${senderName}</span>
                                <span class="sender-email">${senderEmail}</span>
                            </p>
                            <p><strong>Emne:</strong> ${emailTemplates.paymentConfirmation.subject}</p>
                            <p><strong>Dato:</strong> ${emailTemplates.paymentConfirmation.date}</p>
                        </div>
                        ${emailTemplates.paymentConfirmation.content}
                    `;
                    emailDetailModal.style.display = 'block';
                    
                    // Marker mailen som læst ved at fjerne unread klassen
                    paymentConfirmationMail.classList.remove('unread');
                    
                    // Update user choices to track that the payment confirmation email was viewed
                    userChoices.scenarios.gmailInbox = userChoices.scenarios.gmailInbox || {};
                    userChoices.scenarios.gmailInbox.viewedPaymentEmail = true;
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    
                    // Add event listener for the sender name click
                    const senderNameElement = emailModalBody.querySelector('.sender-name');
                    const senderEmailElement = emailModalBody.querySelector('.sender-email');
                    
                    if (senderNameElement && senderEmailElement) {
                        senderNameElement.addEventListener('click', function() {
                            // Toggle visibility of the email address
                            senderEmailElement.classList.toggle('visible');
                            
                            // Make sure userChoices.scenarios.gmailInbox exists
                            if (!userChoices.scenarios.gmailInbox) {
                                userChoices.scenarios.gmailInbox = {};
                            }
                            
                            // Track that the user checked the sender email (only track once)
                            if (!userChoices.scenarios.gmailInbox.checkedSenderEmail) {
                                userChoices.scenarios.gmailInbox.checkedSenderEmail = true;
                                
                                // Store which email's sender was checked
                                userChoices.scenarios.gmailInbox.checkedSenderEmailType = 'paymentConfirmationMail';
                                
                                // Add points for checking the sender email address (good security practice)
                                userChoices.score += 0.5;
                                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                            }
                        });
                    }
                });
            }
        }
        
        // På første besøg, vis kun velkomstemailen
        
        if (iPhoneScamEmail && facebookResetEmail) {
            // Som standard er emails skjult
            iPhoneScamEmail.style.display = 'none';
            facebookResetEmail.style.display = 'none';
            
            // Vis kun iPhone scam email hvis velkomst-mailen er åbnet
            // OG brugeren har klikket på "Fortsæt til DBA" i velkomstemailen
            if (userChoices.openedWelcomeMail && userChoices.scenarios.dbaScenario &&
                userChoices.scenarios.dbaScenario.started) {
                iPhoneScamEmail.style.display = '';
            }
            
            // Vis kun Facebook reset email hvis velkomst-mailen er åbnet
            // OG brugeren har klikket på iPhone scam emailen
            if (userChoices.openedWelcomeMail && userChoices.scenarios.gmailInbox &&
                userChoices.scenarios.gmailInbox.viewedIPhoneScamEmail) {
                facebookResetEmail.style.display = '';
            }
        }
        

        
        // Email Modal interactions
        if (emailItems && emailDetailModal) {
            emailItems.forEach(email => {
                email.addEventListener('click', function() {
                    const emailId = this.id;
                    let emailTemplate;
                    
                    if (emailId === 'welcomeMail') {
                        emailTemplate = emailTemplates.welcome;
                        
                        // Fjern unread klassen for at markere som læst
                        this.classList.remove('unread');
                        
                        // Gem read status i localStorage
                        if (!userChoices.scenarios.gmailInbox) {
                            userChoices.scenarios.gmailInbox = {};
                        }
                        userChoices.scenarios.gmailInbox.viewedWelcomeEmail = true;
                        userChoices.openedWelcomeMail = true; // For bagudkompatibilitet
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                        
                        // Vis/skjul fortsæt knap kun hvis den eksisterer
                        const continueButton = document.getElementById('continueButton');
                        if (continueButton) {
                            continueButton.style.display = 'inline-block';
                            continueButton.addEventListener('click', () => {
                                // Mark scenario as started
                                if (!userChoices.scenarios.dbaScenario) {
                                    userChoices.scenarios.dbaScenario = {};
                                }
                                userChoices.scenarios.dbaScenario.started = true;
                                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                                
                                // Close the email and navigate to DBA scenario
                                emailDetailModal.style.display = 'none';
                                window.location.href = 'dba-scenario.html';
                            }, { once: true }); // only trigger once
                        }
                    } else if (emailId === 'iPhoneScamMail') {
                        emailTemplate = emailTemplates.iphoneScam;
                        
                        // Fjern unread klassen for at markere som læst
                        this.classList.remove('unread');
                        
                        // Mark the iPhone scam email as opened
                        if (!userChoices.scenarios.gmailInbox) {
                            userChoices.scenarios.gmailInbox = {};
                        }
                        userChoices.scenarios.gmailInbox.viewedIPhoneScamEmail = true;
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                        
                        // Vis Facebook reset email efter iPhone mailen er åbnet
                        if (facebookResetEmail) {
                            facebookResetEmail.style.display = '';
                        }
                    } else if (emailId === 'facebookResetMail') {
                        emailTemplate = emailTemplates.facebookReset;
                        
                        // Fjern unread klassen for at markere som læst
                        this.classList.remove('unread');
                        
                        // Mark the Facebook reset email as opened
                        if (!userChoices.scenarios.gmailInbox) {
                            userChoices.scenarios.gmailInbox = {};
                        }
                        userChoices.scenarios.gmailInbox.viewedFacebookResetEmail = true;
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                        
                        // Træk 1 point af for at åbne phishing email
                        userChoices.score -= 1;
                        userChoices.clickedFacebookReset = true;
                    } else if (emailId === 'paymentConfirmationMail') {
                        emailTemplate = emailTemplates.paymentConfirmation;
                        
                        // Fjern unread klassen for at markere som læst
                        this.classList.remove('unread');
                        
                        // Gem read status i localStorage
                        if (!userChoices.scenarios.gmailInbox) {
                            userChoices.scenarios.gmailInbox = {};
                        }
                        userChoices.scenarios.gmailInbox.viewedPaymentEmail = true;
                        
                        // Træk 0.5 point af for at åbne bekræftelsesmail efter iPhone scam
                        userChoices.score -= 0.5;
                        userChoices.clickedPaymentConfirmation = true;
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    }
                    
                    if (emailTemplate) {
                        // Extract just the sender name from the sender string (before the email part)
                        const senderFull = emailTemplate.sender;
                        const senderName = senderFull.split('<')[0].trim();
                        const senderEmail = senderFull.includes('<') ? senderFull.split('<')[1].replace('>', '') : senderFull;
                        
                        // Fill email modal with content
                        emailModalTitle.textContent = emailTemplate.subject;
                        emailModalBody.innerHTML = `
                            <div class="email-header-details">
                                <p>
                                    <strong>Fra:</strong> 
                                    <span class="sender-name" data-sender-email="${senderEmail}" data-email-id="${emailId}">${senderName}</span>
                                    <span class="sender-email">${senderEmail}</span>
                                </p>
                                <p><strong>Emne:</strong> ${emailTemplate.subject}</p>
                                <p><strong>Dato:</strong> ${emailTemplate.date}</p>
                            </div>
                            ${emailTemplate.content}
                        `;
                        
                        // Add event listener for the sender name to reveal the full email address
                        const senderNameElement = emailModalBody.querySelector('.sender-name');
                        const senderEmailElement = emailModalBody.querySelector('.sender-email');
                        
                        if (senderNameElement && senderEmailElement) {
                            senderNameElement.addEventListener('click', function() {
                                // Toggle visibility of the email address
                                senderEmailElement.classList.toggle('visible');
                                
                                // Make sure userChoices.scenarios.gmailInbox exists
                                if (!userChoices.scenarios.gmailInbox) {
                                    userChoices.scenarios.gmailInbox = {};
                                }
                                
                                // Get the email ID from the data attribute
                                const clickedEmailId = this.getAttribute('data-email-id');
                                
                                // Track that the user checked the sender email (only track once)
                                if (!userChoices.scenarios.gmailInbox.checkedSenderEmail) {
                                    userChoices.scenarios.gmailInbox.checkedSenderEmail = true;
                                    
                                    // Store which email's sender was checked
                                    userChoices.scenarios.gmailInbox.checkedSenderEmailType = clickedEmailId;
                                    
                                    // Add points for checking the sender email address (good security practice)
                                    userChoices.score += 0.5;
                                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                                }
                            });
                        }
                        
                        // Sæt destination baseret på email type
                        if (continueButton) {
                            let nextDestination = '';
                            if (emailId === 'welcomeMail') {
                                nextDestination = 'dba-scenario.html';
                            } else if (emailId === 'iPhoneScamMail') {
                                nextDestination = 'iphone-claim.html';
                            } else if (emailId === 'facebookResetMail') {
                                nextDestination = 'facebook-fake.html';
                            }
                            
                            if (nextDestination) {
                                continueButton.setAttribute('data-destination', nextDestination);
                            }
                        }
                        
                        // Vis email modal
                        emailDetailModal.style.display = 'block';
                        
                        // Record which email was viewed
                        userChoices.scenarios.gmailInbox = userChoices.scenarios.gmailInbox || {};
                        userChoices.scenarios.gmailInbox.viewedEmail = emailId;
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    }
                });
            });
        }
        
        // Håndter luk email knap
        if (closeEmailButton) {
            closeEmailButton.addEventListener('click', () => {
                emailDetailModal.style.display = 'none';
            });
        }
        
        // Håndter kryds-knappen i email modal
        const emailModalClose = document.querySelector('.email-modal-close');
        if (emailModalClose) {
            emailModalClose.addEventListener('click', () => {
                emailDetailModal.style.display = 'none';
            });
        }
        
        // Continue button in email modal
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                const nextDestination = continueButton.dataset.destination;
                if (nextDestination) {
                    window.location.href = nextDestination;
                } else {
                    // Default to DBA scenario if no destination set
                    window.location.href = 'dba-scenario.html';
                }
            });
        }
        
        // Add a standalone continue button outside the email modal to proceed to next scenario
        const continueToNextScenarioBtn = document.createElement('button');
        continueToNextScenarioBtn.className = 'btn btn-primary continue-to-next';
        continueToNextScenarioBtn.textContent = 'Fortsæt til næste scenarie';
        document.querySelector('.gmail-content').appendChild(continueToNextScenarioBtn);
        
        continueToNextScenarioBtn.addEventListener('click', () => {
            // Tjek om brugeren har ignoreret emails før videre
            
            // Initialiser brugerens beteende-tracking hvis det ikke findes
            if (!userChoices.behaviorPatterns) {
                userChoices.behaviorPatterns = {};
            }
            
            // Tracking af ignorerede emails
            const emails = document.querySelectorAll('.email-item');
            let availableEmails = 0;
            let viewedEmails = 0;
            
            // Tæl aktive emails og hvor mange der er blevet læst
            emails.forEach(email => {
                // Kun tæl emails der ikke er blevet slettet (stadig er synlige)
                if (email.offsetParent !== null) {
                    availableEmails++;
                    if (!email.classList.contains('unread')) {
                        viewedEmails++;
                    }
                }
            });
            
            // Registrer ignorerede emails
            if (availableEmails > 0 && viewedEmails === 0) {
                // Brugeren har ignoreret alle emails
                if (!userChoices.behaviorPatterns.ignoredAllEmails) {
                    userChoices.behaviorPatterns.ignoredAllEmails = true;
                }
            }
            
            if (availableEmails > 0 && viewedEmails < availableEmails) {
                // Brugeren har ignoreret nogle emails
                if (!userChoices.behaviorPatterns.ignoredSomeEmails) {
                    userChoices.behaviorPatterns.ignoredSomeEmails = true;
                }
                userChoices.behaviorPatterns.ignoredEmailCount = availableEmails - viewedEmails;
            }
            
            // Gem de opdaterede brugervalg
            localStorage.setItem('userChoices', JSON.stringify(userChoices));
            
            // Determine which stage we're at and navigate accordingly
            if (userChoices.scenarios.facebookScenario && userChoices.scenarios.facebookScenario.submittedCredentials) {
                // If the user has completed the Facebook phishing scenario, go to results
                window.location.href = 'results.html';
            } else if (userChoices.scenarios.dbaScenario && userChoices.scenarios.dbaScenario.clickedScamAd) {
                // If the user has clicked on the iPhone scam ad, go to Google search page
                window.location.href = 'google-search.html';
            } else {
                // Default to DBA scenario (initial stage)
                window.location.href = 'dba-scenario.html';
            }
        });
    }
    
    // Handle iPhone claim page
    if (document.querySelector('.prize-claim-page')) {
        const prizeClaimForm = document.getElementById('prizeClaimForm');
        let countdownInterval;
        
        // Setup countdown timer
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            let timeLeft = 600; // 10 minutes in seconds
            
            countdownInterval = setInterval(() => {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    countdownElement.textContent = '0:00';
                } else {
                    timeLeft--;
                }
            }, 1000);
        }
        
        if (prizeClaimForm) {
            prizeClaimForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Clean up interval if it exists
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                }
                
                // User provided personal information (incorrect choice)
                userChoices.scenarios.dbaScenario.providedPersonalInfo = true;
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Show feedback and redirect to next scenario
                alert('Du har netop delt dine personlige oplysninger med en potentiel svindler! I et virkeligt scenarie ville disse oplysninger kunne misbruges.');
                // Redirect til Gmail inbox i stedet for google-search
                console.log('Redirecting to gmail-inbox.html from second event listener');
                window.location.href = 'gmail-inbox.html';
            });
        }
    }
    
    // Handle Google Search scenario
    if (document.querySelector('.google-page')) {
        const fakeResult = document.getElementById('fakeResult');
        const realResult = document.getElementById('realResult');
        const closeInstructions = document.getElementById('closeInstructions');
        
        if (closeInstructions) {
            closeInstructions.addEventListener('click', () => {
                const instructionsOverlay = document.querySelector('.instructions-overlay');
                if (instructionsOverlay) {
                    instructionsOverlay.style.display = 'none';
                }
            });
        }
        
        if (fakeResult) {
            fakeResult.addEventListener('click', (e) => {
                // User clicked on the fake Facebook result
                userChoices.scenarios.facebookScenario.attempted = true;
                userChoices.scenarios.facebookScenario.clickedFakeLink = true;
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Don't prevent default to allow navigation
            });
        }
        
        if (realResult) {
            realResult.addEventListener('click', (e) => {
                // User clicked on the real Facebook result (correct choice)
                userChoices.scenarios.facebookScenario.attempted = true;
                userChoices.score += 1;
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Don't prevent default to allow navigation
            });
        }
    }
    
    // Handle Facebook Fake Login
    if (document.querySelector('.fake-facebook')) {
        const facebookLoginForm = document.getElementById('facebookLoginForm');
        const fbEmailInput = document.getElementById('fbEmail');
        
        // Auto-forslag af email, hvis brugeren har login-email
        if (fbEmailInput && userChoices.login && userChoices.login.email) {
            // Tilføj autocomplete attribut (men ikke prefill)
            fbEmailInput.setAttribute('autocomplete', 'email');
            
            // Tilføj event listener så vi kan vise email når brugeren klikker på feltet
            fbEmailInput.addEventListener('focus', function() {
                // Kun sæt værdi hvis feltet er tomt
                if (this.value === '') {
                    this.value = userChoices.login.email;
                    // Vælg hele teksten så brugeren kan overskrive let
                    this.select();
                }
            });
        }
        
        if (facebookLoginForm) {
            facebookLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const email = document.getElementById('fbEmail').value;
                const password = document.getElementById('fbPassword').value;
                
                // User submitted credentials to fake Facebook (incorrect choice)
                if (!userChoices.scenarios.facebookScenario) {
                    userChoices.scenarios.facebookScenario = {};
                }
                userChoices.scenarios.facebookScenario.clickedFakeLink = true;
                userChoices.scenarios.facebookScenario.submittedCredentials = true;
                userChoices.score -= 1; // Subtract points for submitting credentials to fake site
                
                // Tjek om brugeren har indtastet en korrekt adgangskode
                // Vi gemmer den tidligere som en del af login-processen
                // Kun hvis brugeren har indtastet sin rigtige adgangskode, skal den ægte sikkerhedsmail vises
                if (userChoices.login && password === userChoices.login.password) {
                    userChoices.scenarios.facebookScenario.usedRealPassword = true;
                } else {
                    userChoices.scenarios.facebookScenario.usedRealPassword = false;
                }
                
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Forskellige advarsler baseret på om brugeren har indtastet sin rigtige adgangskode
                if (userChoices.scenarios.facebookScenario.usedRealPassword) {
                    // Vis den mere alvorlige advarsel, hvis brugeren har brugt sin rigtige adgangskode
                    const alertEl = document.createElement('div');
                    alertEl.className = 'security-alert';
                    alertEl.innerHTML = `
                        <div class="alert-content">
                            <h3>www.mracing195.com siger</h3>
                            <p>Du har netop givet dine Facebook login-oplysninger til en svindler! I 
                            et virkeligt scenarie ville denne svindler nu have adgang til din 
                            Facebook-konto. Du vil nu modtage en sikkerhedsmail i din indbakke.</p>
                            <button class="alert-button" id="alertOkBtn">OK</button>
                        </div>
                    `;
                    document.body.appendChild(alertEl);
                    
                    // Tilføj styling til advarslen
                    const style = document.createElement('style');
                    style.textContent = `
                        .security-alert {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0,0,0,0.7);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 9999;
                        }
                        .alert-content {
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            max-width: 400px;
                            text-align: center;
                        }
                        .alert-content h3 {
                            margin-top: 0;
                            color: #333;
                        }
                        .alert-button {
                            background-color: #8B4513;
                            color: white;
                            border: none;
                            padding: 8px 30px;
                            margin-top: 15px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                    `;
                    document.head.appendChild(style);
                    
                    // Håndter klik på OK-knappen
                    document.getElementById('alertOkBtn').addEventListener('click', () => {
                        alertEl.remove();
                        style.remove();
                        
                        // Flag to show security follow-up email in inbox
                        userChoices.showFacebookSecurityEmail = true;
                        localStorage.setItem('userChoices', JSON.stringify(userChoices));
                        
                        // Redirect til Gmail inbox
                        window.location.href = 'gmail-inbox.html';
                    });
                } else {
                    // Vis standardadvarsel hvis brugeren brugte en anden adgangskode
                    alert('Du har netop givet Facebook login-oplysninger til en svindler! I et virkeligt scenarie ville denne svindler kunne forsøge at bruge disse oplysninger til at få adgang til din konto.');
                    
                    // Flag to show security follow-up email in inbox
                    userChoices.showFacebookSecurityEmail = true;
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    
                    // Redirect til Gmail inbox
                    window.location.href = 'gmail-inbox.html';
                }
            });
        }
    }
    
    // Handle iPhone Prize Claim page
    if (document.querySelector('.prize-claim-page')) {
        const prizeClaimForm = document.getElementById('prizeClaimForm');
        
        if (prizeClaimForm) {
            prizeClaimForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Initialize the dbaScenario object if it doesn't exist
                if (!userChoices.scenarios.dbaScenario) {
                    userChoices.scenarios.dbaScenario = {};
                }
                
                // Record that personal information was submitted on the prize claim page
                userChoices.scenarios.dbaScenario.submittedPersonalInfo = true;
                
                // Collect information about the data provided
                const personalData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('emailAddress').value,
                    phone: document.getElementById('phoneNumber').value,
                    address: document.getElementById('address').value,
                    postalCode: document.getElementById('postalCode').value,
                    city: document.getElementById('city').value
                };
                
                // Deduct points based on VPN status
                let scoreDeduction = 1; // Default deduction
                
                if (userChoices.vpnActive) {
                    scoreDeduction = 0.5; // Less points deducted with VPN
                    alert('Du har indtastet personlige oplysninger på en usikker side, men din VPN var aktiv. Dette beskytter din IP-adresse, men ikke mod at afgive personlige oplysninger til en potentiel svindler.');
                } else {
                    alert('Du har indtastet personlige oplysninger på en usikker side uden beskyttelse. Dette er en sikkerhedsrisiko, da dine oplysninger kan blive opsnappet af tredjeparter.');
                }
                
                userChoices.score -= scoreDeduction;
                
                // Save to localStorage
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Redirect back to Gmail inbox page
                window.location.href = 'gmail-inbox.html';
            });
        }
    }

    // Handle Identity Verification Form
    if (document.querySelector('.identity-verification-page')) {
        const identityForm = document.getElementById('identityVerificationForm');
        
        if (identityForm) {
            identityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Logging values entered (in real life these would be sent to a server)
                console.log('Identity verification form submitted');
                
                // Store sensitive information only for demonstration purposes
                const sensitiveData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    cardInfo: document.getElementById('cardNumber').value,
                    expiry: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value
                };
                
                // Track exactly which types of personal information were provided
                // Create a detailed object to track specific information categories
                const sharedInfoDetails = {
                    personalInfo: {
                        name: Boolean(document.getElementById('fullName').value),
                        address: Boolean(document.getElementById('address').value)
                    },
                    contactInfo: {
                        email: Boolean(document.getElementById('email').value),
                        phone: Boolean(document.getElementById('phone').value)
                    },
                    financialInfo: {
                        cardNumber: Boolean(document.getElementById('cardNumber').value),
                        expiryDate: Boolean(document.getElementById('expiryDate').value),
                        cvv: Boolean(document.getElementById('cvv').value)
                    },
                    identityInfo: {
                        idNumber: Boolean(document.getElementById('idNumber').value)
                    }
                };
                
                // Update user choices to track this action with more detailed tracking
                if (!userChoices.scenarios.identityVerification) {
                    userChoices.scenarios.identityVerification = {};
                }
                
                userChoices.scenarios.identityVerification.attempted = true;
                userChoices.scenarios.identityVerification.submittedSensitiveInfo = true;
                
                // Track specific types of information provided
                userChoices.scenarios.identityVerification.providedPersonalInfo = true; // Name, address
                userChoices.scenarios.identityVerification.providedContactInfo = true; // Email, phone
                userChoices.scenarios.identityVerification.providedFinancialInfo = true; // Card details
                userChoices.scenarios.identityVerification.providedIdInfo = true; // ID information
                
                // Store the detailed information tracking in userChoices
                userChoices.scenarios.identityVerification.sharedInfoDetails = sharedInfoDetails;
                
                // Count the number of sensitive fields filled for more detailed score impact
                let sensitiveFieldCount = 0;
                if (document.getElementById('fullName').value) sensitiveFieldCount++;
                if (document.getElementById('address').value) sensitiveFieldCount++;
                if (document.getElementById('idNumber').value) sensitiveFieldCount++;
                if (document.getElementById('cardNumber').value) sensitiveFieldCount++;
                if (document.getElementById('cvv').value) sensitiveFieldCount++;
                
                userChoices.scenarios.identityVerification.sensitiveFieldCount = sensitiveFieldCount;
                
                // Scale the score reduction based on the amount of information provided and VPN status
                let scoreReduction = Math.min(3, 1 + (sensitiveFieldCount * 0.4));
                
                // Also track that payment information was submitted (for the DBA scenario results)
                if (!userChoices.scenarios.dbaScenario) {
                    userChoices.scenarios.dbaScenario = {};
                }
                userChoices.scenarios.dbaScenario.submittedPaymentInfo = true;
                
                // Reduce the score penalty if VPN is active
                if (userChoices.vpnActive) {
                    scoreReduction = scoreReduction * 0.7; // 30% less penalty with VPN
                    alert('Du har indtastet følsomme betalingsoplysninger på en usikker side. Din VPN beskytter din identitet, men ikke dine kortoplysninger når du afgiver dem frivilligt til en svindler.');
                } else {
                    alert('DU ER BLEVET SVINDLET! Du har netop afgivet meget følsomme personlige og finansielle oplysninger til en svindler uden VPN-beskyttelse. I en rigtig situation ville dette kunne føre til identitetstyveri og økonomisk tab.');
                }
                
                userChoices.score -= scoreReduction; // Dynamic score reduction based on info provided
                
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Redirect to Google search page instead of results
                window.setTimeout(() => {
                    localStorage.setItem('userChoices', JSON.stringify(userChoices));
                    
                    // Tjek om brugeren allerede har besøgt Google search siden
                    const hasVisitedGoogleSearch = localStorage.getItem('hasVisitedGoogleSearch');
                    if (hasVisitedGoogleSearch !== 'true') {
                        window.location.href = 'google-search.html';
                    } else {
                        // Hvis de allerede har besøgt Google search, send til Gmail indbakken
                        window.location.href = 'gmail-inbox.html';
                    }
                }, 500);
            });
        }
    }
    
    // Handle Facebook Real Login
    if (document.querySelector('.real-facebook')) {
        const facebookLoginFormReal = document.getElementById('facebookLoginFormReal');
        const fbEmailRealInput = document.getElementById('fbEmailReal');
        
        // Auto-forslag af email, hvis brugeren har login-email
        if (fbEmailRealInput && userChoices.login && userChoices.login.email) {
            // Simuler auto-complete af email
            fbEmailRealInput.value = userChoices.login.email;
            
            // Tilføj autocomplete attribut
            fbEmailRealInput.setAttribute('autocomplete', 'email');
        }
        
        if (facebookLoginFormReal) {
            facebookLoginFormReal.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const email = document.getElementById('fbEmailReal').value;
                const password = document.getElementById('fbPasswordReal').value;
                
                // User used the real Facebook page (correct choice)
                if (!userChoices.scenarios.facebookScenario) {
                    userChoices.scenarios.facebookScenario = {};
                }
                userChoices.scenarios.facebookScenario.usedCorrectLogin = true;
                userChoices.score += 1; // Add point for using the correct Facebook
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Show feedback and redirect to results
                alert('Du har korrekt identificeret den rigtige Facebook-side! Testen er nu gennemført.');
                
                // Mark the test as completed
                userChoices.completed = true;
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
                
                // Redirect to results page
                window.location.href = 'results.html';
            });
        }
    }
});
