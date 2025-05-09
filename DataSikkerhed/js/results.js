/**
 * Results JavaScript
 * Handles displaying the user's test results and choices
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get user choices from localStorage
    const userChoices = JSON.parse(localStorage.getItem('userChoices')) || {};
    
    // Hvis userChoices ikke har maxScore (ældre versioner), sæt det til 5
    if (!userChoices.maxScore) {
        userChoices.maxScore = 5;
    }
    
    // Vis titler baseret på brugeradfærd lige over sikkerhedsscoren
    const finalScore = document.querySelector('.final-score');
    if (finalScore && userChoices.behaviorPatterns) {
        const behaviorTitles = document.createElement('div');
        behaviorTitles.className = 'behavior-titles';
        
        // Tjek om brugeren ignorerede nogle eller alle emails
        if (userChoices.behaviorPatterns.ignoredAllEmails) {
            // Hvis de ignorerede alle emails
            const emailAlert = document.createElement('div');
            emailAlert.className = 'behavior-alert warning';
            emailAlert.innerHTML = `
                <h3>🔔 Email-opmærksomhed: Ingen emails læst</h3>
                <p>Du ignorerede alle emails uden at læse dem. Emails kan indeholde vigtige sikkerhedsadvarsler eller mistænkelige aktiviteter, der kræver din opmærksomhed.</p>
            `;
            behaviorTitles.appendChild(emailAlert);
        } else if (userChoices.behaviorPatterns.ignoredSomeEmails) {
            // Hvis de ignorerede nogle, men ikke alle emails
            const emailAlert = document.createElement('div');
            emailAlert.className = 'behavior-alert info';
            emailAlert.innerHTML = `
                <h3>📧 Email-håndtering: Delvis opmærksom</h3>
                <p>Du læste nogle emails, men ignorerede ${userChoices.behaviorPatterns.ignoredEmailCount} email(s). Det er vigtigt at være opmærksom på alle emails, da de kan indeholde vigtige sikkerhedsrelaterede informationer.</p>
            `;
            behaviorTitles.appendChild(emailAlert);
        }
        
        // Tjek om brugeren konsekvent brugte samme adgangskode på tværs af services
        if (userChoices.scenarios && userChoices.scenarios.gmailLogin && userChoices.scenarios.facebookScenario) {
            // Hvis brugeren har forsøgt at logge ind på både Gmail og Facebook
            if (userChoices.scenarios.gmailLogin.attempted && userChoices.scenarios.facebookScenario.attempted) {
                // Tjek om brugeren brugte rigtig kodeord begge steder
                if (userChoices.scenarios.gmailLogin.usedCorrectCredentials && userChoices.scenarios.facebookScenario.usedCorrectLogin) {
                    const passwordAlert = document.createElement('div');
                    passwordAlert.className = 'behavior-alert success';
                    passwordAlert.innerHTML = `
                        <h3>🗳️ God adgangskode-hukommelse</h3>
                        <p>Du huskede korrekt dine adgangskoder på tværs af forskellige services. Dette er vigtig for at kunne håndtere dine online konti sikkert.</p>
                    `;
                    behaviorTitles.appendChild(passwordAlert);
                }
            }
        }
        
        // Better Safe Than Sorry - Tjek om brugeren kontrollerede afsender og slettede emails
        if (userChoices.scenarios && userChoices.scenarios.emailHandling) {
            // Tjek om brugeren både kontrollerede afsendere og slettede en mistænkelig email
            if (userChoices.scenarios.emailHandling.checkedSender && 
                (userChoices.scenarios.emailHandling.deletedPhishingEmail || 
                 userChoices.scenarios.dbaScenario && userChoices.scenarios.dbaScenario.reportedAsSpam)) {
                
                const safetyAlert = document.createElement('div');
                safetyAlert.className = 'behavior-alert success';
                safetyAlert.innerHTML = `
                    <h3>🔐 Better Safe Than Sorry</h3>
                    <p>Du kontrollerede afsenderens email-adresse og reagerede hensigtmæssigt på mistænkelige emails. Dette er afgrørende for at undgå phishing-angreb.</p>
                `;
                behaviorTitles.appendChild(safetyAlert);
            }
        }
        
        // Safe Surfer - Tjek om brugeren aktiverede VPN tidligt
        if (userChoices.behaviorPatterns && userChoices.behaviorPatterns.earlyVpnActivation) {
            const vpnAlert = document.createElement('div');
            vpnAlert.className = 'behavior-alert success';
            vpnAlert.innerHTML = `
                <h3>🔒 Safe Surfer</h3>
                <p>Du aktiverede VPN tidligt i sessionen. Dette beskytter din identitet og trafik mod overvågning og datatyveri.</p>
            `;
            behaviorTitles.appendChild(vpnAlert);
        }
        
        // Andre adfærdsmønstre kan tilføjes her...
        
        // Tjek om brugeren har lavet fejlfri gennemførelse
        const checkPerfectScore = () => {
            const choicesList = document.getElementById('choicesList');
            if (!choicesList) return false;
            
            // Tjek om alle choice-item elementer har klassen 'correct'
            const allChoiceItems = choicesList.querySelectorAll('.choice-item');
            if (allChoiceItems.length === 0) return false; // Ingen valg endnu
            
            // Tjek om der findes nogen med incorrect klassen
            const incorrectChoices = choicesList.querySelectorAll('.choice-item.incorrect');
            
            // Hvis vi har valg, og ingen af dem er forkerte (ignorer neutral klassen)
            return allChoiceItems.length > 0 && incorrectChoices.length === 0;
        };
        
        // Kør efter DOM er fuldt loadet
        setTimeout(() => {
            if (checkPerfectScore()) {
                const perfectAlert = document.createElement('div');
                perfectAlert.className = 'behavior-alert success';
                perfectAlert.innerHTML = `
                    <h3>🌟 Fejlfri Gennemførelse</h3>
                    <p>Tillykke! Du har gennemført alle scenarier uden fejl. Du udviser en høj grad af bevidsthed omkring online sikkerhed.</p>
                `;
                behaviorTitles.appendChild(perfectAlert);
            }
            
            // Tilføj titler til siden hvis der er nogen
            if (behaviorTitles.children.length > 0) {
                // Indsæt behavioral titles før final score elementet
                finalScore.parentNode.insertBefore(behaviorTitles, finalScore);
            }
        }, 300); // Vent lidt på at DOM er fuldt loadet
    }

    // Beregn sikkerhedsscore baseret på antal korrekte valg
    const calculateSecurityScore = () => {
        // Vent på at DOM er loadet og choicesList er populeret
        setTimeout(() => {
            const scoreValue = document.getElementById('scoreValue');
            if (!scoreValue) return;
            
            const choicesList = document.getElementById('choicesList');
            if (!choicesList) return;
            
            // Tæl antal elementer
            const allChoiceItems = choicesList.querySelectorAll('.choice-item:not(.neutral)'); // Ignorer neutrale elementer
            const correctChoices = choicesList.querySelectorAll('.choice-item.correct');
            
            // Sikr at vi har valg at arbejde med
            if (allChoiceItems.length === 0) {
                scoreValue.textContent = '0/0';
                return;
            }
            
            // Beregn score baseret på antal korrekte valg ud af totale antal valg
            const score = correctChoices.length;
            const maxScore = allChoiceItems.length;
            
            // Gem den nye score i localStorage for konsistens
            userChoices.score = score;
            userChoices.maxScore = maxScore;
            localStorage.setItem('userChoices', JSON.stringify(userChoices));
            
            // Vis score
            scoreValue.textContent = `${score}/${maxScore}`;
            
            // Tilføj en visuel klasse baseret på score procent
            const scorePercent = (score / maxScore) * 100;
            const finalScoreElement = document.querySelector('.final-score');
            
            if (finalScoreElement) {
                // Fjern eksisterende klasser
                finalScoreElement.classList.remove('score-very-low', 'score-low', 'score-medium', 'score-good', 'score-high', 'score-perfect');
                
                // Tilføj den korrekte klasse
                if (scorePercent === 100) {
                    finalScoreElement.classList.add('score-perfect');
                } else if (scorePercent >= 80) {
                    finalScoreElement.classList.add('score-high');
                } else if (scorePercent >= 60) {
                    finalScoreElement.classList.add('score-good');
                } else if (scorePercent >= 40) {
                    finalScoreElement.classList.add('score-medium');
                } else if (scorePercent >= 20) {
                    finalScoreElement.classList.add('score-low');
                } else {
                    finalScoreElement.classList.add('score-very-low');
                }
            }
            
            // Tilføj titler baseret på sikkerhedsscore
            const behaviorTitles = document.querySelector('.behavior-titles');
            if (behaviorTitles) {
                // Tjek om der findes en score-baseret titel - slet den hvis den findes
                const existingScoreTitle = behaviorTitles.querySelector('.score-based-title');
                if (existingScoreTitle) {
                    existingScoreTitle.remove();
                }
                
                // Opret en ny titel baseret på scoren
                const scoreTitle = document.createElement('div');
                scoreTitle.className = 'behavior-alert score-based-title';
                
                // Find ud af om brugeren brugte VPN men stadig lavede fejl
                const usedVPN = userChoices.vpnActive || (userChoices.behaviorPatterns && userChoices.behaviorPatterns.earlyVpnActivation);
                const madeErrors = scorePercent < 100 && correctChoices.length < allChoiceItems.length;
                const mixedSecurity = usedVPN && madeErrors;
                
                // Prioritet til Mixed Security titlen, så score-baserede titler
                if (mixedSecurity) {
                    scoreTitle.className = 'behavior-alert score-based-title warning';
                    scoreTitle.innerHTML = `
                        <h3>⚠️ Blandet Sikkerhed</h3>
                        <p>Du har brugt VPN, hvilket er godt, men har stadig lavet nogle sikkerhedsfejl. VPN beskytter din identitet og netværkstrafik, men ikke mod phishing og svindel hvor du frivilligt afgiver oplysninger.</p>
                    `;
                } else {
                    // Titler baseret på sikkerhedsscoren
                    if (scorePercent === 100) {
                        // Vises allerede som 'Fejlfri Gennemførelse'
                        return;
                    } else if (scorePercent >= 80) {
                        scoreTitle.className = 'behavior-alert score-based-title success';
                        scoreTitle.innerHTML = `
                            <h3>🔒 Sikkerhedsbevidst</h3>
                            <p>Du har udvist en høj grad af sikkerhedsbevidsthed og undgået de fleste af de mest almindelige faldgruber. Fortsæt det gode arbejde!</p>
                        `;
                    } else if (scorePercent >= 60) {
                        scoreTitle.className = 'behavior-alert score-based-title info';
                        scoreTitle.innerHTML = `
                            <h3>🔓 God Sikkerhed</h3>
                            <p>Du har truffet flere gode sikkerhedsvalg, men der er stadig plads til forbedring. Prøv at være mere opmærksom på URL'er og afsenderadresser.</p>
                        `;
                    } else if (scorePercent >= 40) {
                        scoreTitle.className = 'behavior-alert score-based-title warning';
                        scoreTitle.innerHTML = `
                            <h3>⚙️ Moderat Sikkerhed</h3>
                            <p>Du har lavet en del sikkerhedsfejl. Prøv at være mere kritisk over for emails, links og websteder, og overvej at bruge VPN for at beskytte din identitet online.</p>
                        `;
                    } else if (scorePercent >= 20) {
                        scoreTitle.className = 'behavior-alert score-based-title warning';
                        scoreTitle.innerHTML = `
                            <h3>⚠️ Lav Sikkerhed</h3>
                            <p>Du har lavet en del alvorlige sikkerhedsfejl. Vær mere forsigtig med personlige oplysninger, kontroller altid URL'er, og undgå at klikke på mistænkelige links.</p>
                        `;
                    } else {
                        scoreTitle.className = 'behavior-alert score-based-title error';
                        scoreTitle.innerHTML = `
                            <h3>🚨 Meget Lav Sikkerhed</h3>
                            <p>Du har lavet mange sikkerhedsfejl. Du bør straks forbedre dine online-sikkerhedsvaner for at undgå identitetstyveri, phishing og andre onlinesvindler.</p>
                        `;
                    }
                }
                
                // Indsæt titlen øverst i behaviorTitles
                if (behaviorTitles.firstChild) {
                    behaviorTitles.insertBefore(scoreTitle, behaviorTitles.firstChild);
                } else {
                    behaviorTitles.appendChild(scoreTitle);
                }
            }
        }, 500); // Vent lidt længere så DOM er helt klar
    };
    
    // Kør score-beregningen
    calculateSecurityScore();
    
    // Display personlige adgangskode-tips baseret på brugerens adgangskode
    const passwordAnalysisTips = document.getElementById('passwordAnalysisTips');
    if (passwordAnalysisTips && userChoices.passwordAnalysis && userChoices.passwordAnalysis.weaknesses) {
        const weaknesses = userChoices.passwordAnalysis.weaknesses;
        
        if (weaknesses.length > 0) {
            const tipContainer = document.createElement('div');
            tipContainer.className = 'password-weaknesses';
            
            // Overskrift til personlige tips
            const tipHeader = document.createElement('p');
            tipHeader.innerHTML = '<strong>Personlige forbedringer til din adgangskode:</strong>';
            tipContainer.appendChild(tipHeader);
            
            // Liste med personlige anbefalinger
            const tipList = document.createElement('ul');
            tipList.className = 'weakness-list';
            
            if (weaknesses.includes('contains_number_sequence')) {
                const tip = document.createElement('li');
                tip.className = 'warning';
                tip.innerHTML = 'Din adgangskode indeholder en forudsigelig talrække (f.eks. "123"). Dette gør den lettere at gætte.';
                tipList.appendChild(tip);
            }
            
            if (weaknesses.includes('exclamation_only_at_end')) {
                const tip = document.createElement('li');
                tip.className = 'warning';
                tip.innerHTML = 'Din adgangskode har kun "!" som specialtegn og det er placeret til sidst. Dette er et meget almindeligt mønster som hackere kender til.';
                tipList.appendChild(tip);
            }
            
            if (weaknesses.includes('less_than_12_chars')) {
                const tip = document.createElement('li');
                tip.className = 'warning';
                tip.innerHTML = 'Din adgangskode er kortere end 12 tegn. Længere adgangskoder er sværere at bryde ved brute force-angreb.';
                tipList.appendChild(tip);
            }
            
            tipContainer.appendChild(tipList);
            passwordAnalysisTips.appendChild(tipContainer);
        }
    }
    
    // Hjælpefunktion til at tilføje valg til listen
    function addChoiceItem(isCorrect, title, explanation) {
        const item = document.createElement('div');
        
        // Tjek om dette er specifikt DataSikkerhed email der er SLETTET (kun den skal være neutral)
        const isDataSikkerhedDeleted = title.includes('DataSikkerhed - SLETTET');
        
        // Sæt den korrekte styling baseret på type
        if (isDataSikkerhedDeleted) {
            // Grå styling med minus-symbol KUN for DataSikkerhed email
            item.className = 'choice-item neutral';
            item.innerHTML = `
                <div class="choice-icon">−</div>
                <div class="choice-content">
                    <div class="choice-title">${title}</div>
                    <div class="choice-explanation">${explanation}</div>
                </div>
            `;
        } else {
            // Normal styling for alle andre emails
            item.className = `choice-item ${isCorrect ? 'correct' : 'incorrect'}`;
            item.innerHTML = `
                <div class="choice-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="choice-content">
                    <div class="choice-title">${title}</div>
                    <div class="choice-explanation">${explanation}</div>
                </div>
            `;
        }
        
        choicesList.appendChild(item);
        return item;
    }
    
    // Generate choice list
    const choicesList = document.getElementById('choicesList');
    if (choicesList) {
        // Velkomst email åbnet
        if (userChoices.openedWelcomeMail) {
            addChoiceItem(true, 'Velkomst Email', 'Du åbnede velkomst-emailen og læste instruktionerne, hvilket er første skridt i at forstå testens formål.');
        }
        
        // Gmail login scenario
        if (userChoices.scenarios && userChoices.scenarios.gmailLogin) {
            if (userChoices.scenarios.gmailLogin.attempted) {
                addChoiceItem(
                    userChoices.scenarios.gmailLogin.usedCorrectCredentials,
                    'Scenario 1: Gmail Login',
                    userChoices.scenarios.gmailLogin.usedCorrectCredentials 
                        ? 'Du brugte dine korrekte loginoplysninger. Det er god praksis at være opmærksom på, hvilke oplysninger du bruger til forskellige tjenester.'
                        : 'Du brugte ikke de loginoplysninger, du oprettede i starten. I en rigtig situation kunne dette have ledt til, at du glemte dine login-detaljer.'
                );
                
                // Check for "Glemt adgangskode"
                if (userChoices.scenarios.gmailLogin.usedForgotPassword) {
                    addChoiceItem(
                        false,
                        'Scenario 1.1: Gmail - Glemt adgangskode',
                        'Du brugte "Glemt adgangskode" funktionen. I en rigtig situation er dette en legitim funktion, men det er bedre at huske dine login-oplysninger eller bruge en password manager.'
                    );
                }
            }
        }
        
        // DBA/iPhone scenario - nu opdelt i separate dele for forskellige fejl
        if (userChoices.scenarios && userChoices.scenarios.dbaScenario) {
            // Del 1: Klikning på usikkert link
            if (userChoices.scenarios.dbaScenario.clickedUnsafeLink || userChoices.scenarios.dbaScenario.clickedScamAd) {
                const dbaLinkItem = document.createElement('div');
                dbaLinkItem.className = 'choice-item incorrect';
                
                // Check if VPN was active when clicking the unsafe link
                let explanationText = 'Du klikkede på et mistænkeligt link der førte til en falsk side. Dette er en almindelig måde, svindlere bruger til at lokke folk til at afgive personlige oplysninger.';
                
                if (userChoices.scenarios.dbaScenario.clickedUnsafeLinkWithVPN) {
                    explanationText = 'Du klikkede på et mistænkeligt link med din VPN aktiveret. Det er godt at du beskyttede din identitet med VPN, men det er stadig risikabelt at klikke på mistænkelige links. VPN beskytter din IP-adresse og lokation, men ikke mod at afgive personlige oplysninger til falske hjemmesider.';
                    dbaLinkItem.className = 'choice-item partial'; // Apply a partial success class
                }
                
                dbaLinkItem.innerHTML = `
                    <div class="choice-icon">${userChoices.scenarios.dbaScenario.clickedUnsafeLinkWithVPN ? '⚠️' : '❌'}</div>
                    <div class="choice-content">
                        <div class="choice-title">Scenario 2: ${userChoices.scenarios.dbaScenario.clickedUnsafeLinkWithVPN ? 'DBA-link med VPN aktiveret' : 'Usikkert DBA-link'}</div>
                        <div class="choice-explanation">
                            ${explanationText}
                        </div>
                    </div>
                `;
                
                choicesList.appendChild(dbaLinkItem);
            }
            
            // Del 2: Indtastning af personlige oplysninger i iPhone claim form
            if (userChoices.scenarios.dbaScenario.submittedPersonalInfo) {
                const dbaPersonalInfoItem = document.createElement('div');
                dbaPersonalInfoItem.className = 'choice-item incorrect';
                
                // Get VPN status for this scenario
                let vpnActive = userChoices.vpnActive;
                let explanationClass = vpnActive ? 'partial' : 'incorrect';
                let explanationIcon = vpnActive ? '⚠️' : '❌';
                let explanationTitle = vpnActive ? 'Scenario 2.1: iPhone konkurrence med VPN aktiveret' : 'Scenario 2.1: iPhone konkurrence - Personlige oplysninger';
                let explanationText = vpnActive ? 
                    'Du afgav personlige oplysninger på en usikker side, men din VPN var aktiveret. VPN beskytter din IP-adresse, men beskytter ikke mod phishing og svindel hvor du frivilligt afgiver personlige oplysninger.' : 
                    'Du afgav personlige oplysninger på en usikker side (http://) uden beskyttelse. Dette er en sikkerhedsrisiko, da dine data kunne blive opsnappet og misbrugt.';
                
                // Check if we have detailed information about what was shared
                let sharedDetailsHTML = '<div class="shared-details"><strong>Du delte følgende personlige oplysninger:</strong><ul>';
                
                // Add all personal info items
                sharedDetailsHTML += '<li>Dit fulde navn</li>';
                sharedDetailsHTML += '<li>Din adresse</li>';
                sharedDetailsHTML += '<li>Dit postnummer og by</li>';
                sharedDetailsHTML += '<li>Din email</li>';
                sharedDetailsHTML += '<li>Dit telefonnummer</li>';
                
                sharedDetailsHTML += '</ul></div>';
                
                dbaPersonalInfoItem.className = `choice-item ${explanationClass}`;
                dbaPersonalInfoItem.innerHTML = `
                    <div class="choice-icon">${explanationIcon}</div>
                    <div class="choice-content">
                        <div class="choice-title">${explanationTitle}</div>
                        <div class="choice-explanation">
                            ${explanationText}
                            ${sharedDetailsHTML}
                        </div>
                    </div>
                `;
                
                choicesList.appendChild(dbaPersonalInfoItem);
            }

            // Del 3: Indtastning af betalingsinformation i Identity Verification
            // Tilføjer ekstra check for at sikre, at brugeren rent faktisk har trykket på
            // "BEKRÆFT OG BETAL 59 KR." knappen i identity-verification.html
            if (userChoices.scenarios.dbaScenario.submittedPaymentInfo && 
                userChoices.scenarios.identityVerification && 
                userChoices.scenarios.identityVerification.submittedSensitiveInfo) {
                const dbaPaymentInfoItem = document.createElement('div');
                dbaPaymentInfoItem.className = 'choice-item incorrect';
                
                // Get VPN status for this scenario
                let vpnActive = userChoices.vpnActive;
                let explanationClass = vpnActive ? 'partial' : 'incorrect';
                let explanationIcon = vpnActive ? '⚠️' : '❌';
                let explanationTitle = vpnActive ? 'Scenario 2.2: Betalingsinformation med VPN aktiveret' : 'Scenario 2.2: Betalingsinformation';
                let explanationText = vpnActive ? 
                    'Du indtastede følsom betalingsinformation på et usikkert websted. Selvom din VPN beskyttede din IP-adresse, beskytter den ikke mod svindel hvor du frivilligt afgiver dine kortoplysninger.' : 
                    'Du indtastede følsom betalingsinformation på et usikkert websted uden beskyttelse. Dette er en alvorlig sikkerhedsrisiko, da der ikke var nogen kryptering og dine kortoplysninger kan blive stjålet.';
                
                // Create HTML list of shared financial information
                let sharedDetailsHTML = '<div class="shared-details"><strong>Du delte følgende betalingsoplysninger:</strong><ul>';
                
                // Add all payment info items
                sharedDetailsHTML += '<li>Dit kreditkortnummer</li>';
                sharedDetailsHTML += '<li>Kortets udløbsdato</li>';
                sharedDetailsHTML += '<li>Kortets sikkerhedskode (CVV)</li>';
                sharedDetailsHTML += '<li>Kortholders navn</li>';
                
                // Identity information is also included on this page
                sharedDetailsHTML += '<li>Dit ID-nummer</li>';
                
                sharedDetailsHTML += '</ul></div>';
                
                dbaPaymentInfoItem.className = `choice-item ${explanationClass}`;
                dbaPaymentInfoItem.innerHTML = `
                    <div class="choice-icon">${explanationIcon}</div>
                    <div class="choice-content">
                        <div class="choice-title">${explanationTitle}</div>
                        <div class="choice-explanation">
                            ${explanationText}
                            ${sharedDetailsHTML}
                        </div>
                    </div>
                `;
                
                choicesList.appendChild(dbaPaymentInfoItem);
            }
            
            // Hvis brugeren anmeldte det som spam (korrekt handling)
            if (userChoices.scenarios.dbaScenario.reportedAsSpam) {
                const dbaCorrectItem = document.createElement('div');
                dbaCorrectItem.className = 'choice-item correct';
                
                dbaCorrectItem.innerHTML = `
                    <div class="choice-icon">✅</div>
                    <div class="choice-content">
                        <div class="choice-title">Scenario 2: DBA - Spam rapport</div>
                        <div class="choice-explanation">
                            Du identificerede korrekt reklamen som spam og anmeldte den. 
                            Dette er den sikre måde at håndtere mistænkelige tilbud.
                        </div>
                    </div>
                `;
                
                choicesList.appendChild(dbaCorrectItem);
            }
        }
        
        // Email interaktioner
        if (userChoices.scenarios && userChoices.scenarios.gmailInbox) {
            // Handle Welcome email
            if (userChoices.scenarios.gmailInbox.viewedWelcomeEmail) {
                addChoiceItem(true, 'Email: DataSikkerhed - Velkommen', 'Du læste velkomst-emailen fra DataSikkerhed, som indeholdt vigtige informationer om testen.');
            }

            if (userChoices.scenarios.gmailInbox.deletedWelcomeEmail) {
                addChoiceItem(null, 'Email: DataSikkerhed - SLETTET', 'Du slettede velkomst-emailen fra DataSikkerhed. Dette har ingen effekt på din score, da det er en neutral handling.');
            }
            
            // Handle iPhone scam email
            if (userChoices.scenarios.gmailInbox.viewedIPhoneScamEmail) {
                addChoiceItem(false, 'Email: iPhone Præmie', 'Du åbnede en mistænkelig email om en iPhone-præmie. Dette kan lede til phishing.');
            }
            
            if (userChoices.scenarios.gmailInbox.deletedIPhoneEmail) {
                addChoiceItem(true, 'Email: iPhone Præmie - SLETTET', 'Du slettede den mistænkelige email om iPhone-præmie. Dette var korrekt, da det var forsøg på phishing.');
            }
            
            // Handle Facebook reset email
            if (userChoices.scenarios.gmailInbox.viewedFacebookResetEmail) {
                addChoiceItem(false, 'Email: Facebook Sikkerhed', 'Du åbnede en mistænkelig email om nulstilling af Facebook-adgangskode. Dette var et phishing-forsøg.');
            }
            
            if (userChoices.scenarios.gmailInbox.deletedFacebookEmail) {
                addChoiceItem(true, 'Email: Facebook Reset Password - SLETTET', 'Du slettede en mistænkelig email, der udgav sig for at være fra Facebook uden at åbne den. Dette er god praksis for at undgå phishing-angreb.');
            }
            
            // Handle Facebook legitimate security follow-up email
            if (userChoices.scenarios.gmailInbox.viewedFacebookSecurityEmail) {
                addChoiceItem(true, 'Email: Facebook Sikkerhedsadvarsel (legitim)', 'Du åbnede sikkerhedsadvarslen fra Facebook. Dette var en legitim email der advarer om, at din konto kan være kompromitteret.');
            }
            
            if (userChoices.scenarios.gmailInbox.deletedFacebookSecurityEmail) {
                addChoiceItem(false, 'Email: Facebook Sikkerhedsadvarsel (legitim) - SLETTET', 'Du slettede sikkerhedsadvarslen fra Facebook. Denne email var legitim og indeholdt vigtig information om sikkerhed for din konto.');
            }
            
            // Handle Facebook fake security follow-up email
            if (userChoices.scenarios.gmailInbox.viewedFacebookSecurityFakeEmail) {
                addChoiceItem(false, 'Email: Facebook Sikkerheds Team (phishing)', 'Du åbnede en phishing-email, der udgav sig for at være fra Facebook. Den falske email har et mistænkeligt afsender-domæne (faceb00k-account-security.com) og forsøger at få dig til at afgive personlige oplysninger.');
            }
            
            if (userChoices.scenarios.gmailInbox.deletedFacebookSecurityFakeEmail) {
                addChoiceItem(true, 'Email: Facebook Sikkerheds Team (phishing) - SLETTET', 'Du slettede en phishing-email, der udgav sig for at være fra Facebook. God beslutning! Denne email var et forsøg på at få adgang til dine personlige oplysninger.');
            }
            
            // Betalings-email interactions
            if (userChoices.clickedPaymentConfirmation) {
                addChoiceItem(false, 'Email: Betaling mangler', 'Du åbnede en mistænkelig betalingsbekræftelses-email. Dette var et forsøg på at få dig til at angive betalingsoplysninger.');
            }
            
            if (userChoices.scenarios.gmailInbox.deletedPaymentEmail) {
                addChoiceItem(true, 'Email: Betaling mangler - SLETTET', 'Du slettede en mistænkelig email der bad om betaling uden at åbne den. Dette er den sikre måde at håndtere potentielle phishing-mails på.');
            }
            
            // Handle checking sender email addresses
            if (userChoices.scenarios.gmailInbox.checkedSenderEmail) {
                let emailType = '';
                let description = '';
                let isCorrect = true;
                
                // Customize message based on which email's sender was checked
                switch(userChoices.scenarios.gmailInbox.checkedSenderEmailType) {
                    case 'iPhoneScamMail':
                        emailType = 'iPhone Præmie';
                        description = 'Du kontrollerede afsenderens email-adresse for iPhone præmie-mailen og opdagede, at den var fra en mistænkelig afsender. Dette er en god sikkerhedspraksis.';
                        break;
                    case 'facebookResetMail':
                        emailType = 'Facebook Sikkerhed (phishing)';
                        description = 'Du kontrollerede afsenderens email-adresse for Facebook sikkerhedsmailen og opdagede, at den var fra en mistænkelig afsender (faceb0ok-team.com). Dette er en god måde at afsløre phishing på.';
                        break;
                    case 'facebookSecurityMail':
                        emailType = 'Facebook Sikkerhedsadvarsel (legitim)';
                        description = 'Du kontrollerede afsenderens email-adresse for Facebook sikkerhedsadvarslen. Dette er en god praksis, selvom denne email faktisk var legitim.';
                        break;
                    case 'paymentConfirmationMail':
                        emailType = 'Betaling mangler';
                        description = 'Du kontrollerede afsenderens email-adresse for betalingsmailen og opdagede, at den var fra en mistænkelig afsender. Dette er god sikkerhedspraksis.';
                        break;
                    default:
                        emailType = 'Email afsender';
                        description = 'Du kontrollerede en afsenders email-adresse. Dette er altid god praksis for at identificere potentielle phishing-forsøg.';
                }
                
                addChoiceItem(isCorrect, `Kontrollerede sender: ${emailType}`, description);
            }
        }
                // Facebook scenario
        if (userChoices.scenarios && userChoices.scenarios.facebookScenario) {
            // Klikket på falsk Facebook link
            if (userChoices.scenarios.facebookScenario.clickedFakeLink) {
                addChoiceItem(
                    false,
                    'Scenario 3: Facebook - Falsk webside',
                    'Du klikkede på det falske Facebook-link (faceb0ok.com). Altid tjek URL\'en nøje for at undgå phishing-sider.'
                );
                
                // Indtastet oplysninger på falsk Facebook
                if (userChoices.scenarios.facebookScenario.submittedCredentials) {
                    addChoiceItem(
                        false,
                        'Scenario 3.1: Facebook - Afgivne oplysninger',
                        'Du indtastede dine Facebook login-oplysninger på en falsk hjemmeside. Dette ville give svindlere adgang til din Facebook-konto i et virkeligt scenarie.'
                    );
                }

                // Check if they entered their real password on the fake security page
                if (userChoices.scenarios.facebookScenario.fellForFakeFacebookSecurityPhishing) {
                    addChoiceItem(
                        false,
                        'Scenario: Facebook Sikkerhedsadvarsel Phishing',
                        'Du faldt for en falsk Facebook sikkerhedsadvarsel og afgav dine oplysninger. Dette er et klassisk phishing-angreb.'
                    );

                    // Check if they used their real password
                    if (userChoices.scenarios.facebookScenario.usedRealPassword) {
                        addChoiceItem(
                            false,
                            'Facebook: Brugte rigtig adgangskode',
                            'Du indtastede din rigtige adgangskode på en falsk Facebook-side. Dette er særligt farligt, da svindleren nu har adgang til din konto.'
                        );
                    } else {
                        addChoiceItem(
                            true,
                            'Facebook: Brugte falsk adgangskode',
                            'Du indtastede en anden adgangskode end din rigtige på den falske Facebook-side. Dette er godt, da det begrænser svindlerens adgang.'
                        );
                    }
                }

                // Check if they used the legitimate password reset page
                if (userChoices.scenarios.facebookScenario.usedLegitimateReset) {
                    addChoiceItem(
                        true,
                        'Facebook: Nulstillede adgangskode',
                        'Du reagerede korrekt på sikkerhedsadvarslen ved at nulstille din adgangskode på den legitime Facebook-side. Dette er den rette måde at beskytte din konto på efter et sikkerhedsbrud.'
                    );
                }
            }
            
            // Brugt korrekt Facebook login
            if (userChoices.scenarios.facebookScenario.usedCorrectLogin) {
                addChoiceItem(
                    true,
                    'Scenario 3: Facebook - Korrekt login',
                    'Du valgte det rigtige Facebook-link. Det er godt at være opmærksom på URL\'en og sikre, at du besøger den rigtige hjemmeside.'
                );
            }
        }
        
        // Hvis ingen scenarier er blevet forsøgt
        if (choicesList.children.length === 0) {
            choicesList.innerHTML = '<p>Ingen scenarier er blevet gennemført endnu.</p>';
        }
        
        // Sorter valgene i kronologisk rækkefølge (baseret på DOM-rækkefølgen)
        Array.from(choicesList.children)
            .sort((a, b) => {
                const titleA = a.querySelector('.choice-title').textContent;
                const titleB = b.querySelector('.choice-title').textContent;
                
                // Prioritér scenarier efter nummer
                const scenarioNumA = (titleA.match(/Scenario (\d+)/) || [0, 0])[1];
                const scenarioNumB = (titleB.match(/Scenario (\d+)/) || [0, 0])[1];
                
                return scenarioNumA - scenarioNumB;
            })
            .forEach(node => choicesList.appendChild(node));
    }
    
    // Handle print button
    const printResultsBtn = document.getElementById('printResultsBtn');
    if (printResultsBtn) {
        printResultsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
    }
    
    // Handle reset button - completely clear all user data
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear all localStorage data
            localStorage.clear();
            
            // Show confirmation and redirect
            alert('Alle dine testdata er blevet nulstillet. Du vil nu starte forfra.');
            window.location.href = 'index.html';
        });
    }
});
