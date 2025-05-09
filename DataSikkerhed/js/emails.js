/**
 * Email Templates
 * Contains content for the various emails that appear in the simulated Gmail inbox
 */

const emailTemplates = {
    // Payment Confirmation Email (vises efter brugeren er faldet for iPhone-scam)
    // Welcome Email
    welcome: {
        sender: 'DataSikkerhed <info@datasikkerhed.dk>',
        subject: 'Velkommen til DataSikkerheds-testen',
        date: '7. maj 2025 09:45',
        content: `
            <div class="email-content-container">
                <p>Hej!</p>
                <p>Velkommen til DataSikkerhedstesten. I denne test vil du blive udsat for forskellige scenarier, der repræsenterer almindelige online trusler og situationer, hvor du skal være opmærksom på din datasikkerhed.</p>
                <p>Husk, at dette er et kontrolleret testmiljø, og ingen af dine oplysninger vil blive misbrugt eller delt med nogen.</p>
                <p>Formålet med testen er at hjælpe dig med at identificere potentielle sikkerhedsrisici og lære, hvordan du kan beskytte dine personlige oplysninger online.</p>
                <p>God fornøjelse med testen!</p>
                <p>Venlig hilsen,<br>DataSikkerhedsteamet</p>
            </div>
        `
    },
    
    paymentConfirmation: {
        sender: 'iPhone Præmie <payment@prize-lottery-international.com>',
        subject: 'Betaling mangler - Aktiver din konto',
        date: '7. maj 2025 12:10',
        content: `
            <div class="email-content-container scam-email">
                <div class="email-header-scam" style="background-color: #ff5f57; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="color: white; margin: 0; font-size: 24px;">⚠️ BETALING MANGLER - BEKRÆFT DIN IDENTITET ⚠️</h2>
                </div>
                <p>Hej,</p>
                <p>Vi mangler din betaling på 59 kr. for leveringsomkostninger af din <strong>iPhone 16 Pro (128GB)</strong>.</p>
                <p>For at færdiggøre processen og aktivere din præmiekonto, skal du bekræfte din identitet ved at indtaste følgende oplysninger:</p>
                <ul>
                    <li>Fuldt navn</li>
                    <li>Adresse</li>
                    <li>Et gyldigt ID (Pas eller Kørekort)</li>
                    <li>Dit betalingskort (for at dække leveringsgebyret)</li>
                </ul>
                <div class="action-button" style="text-align: center; margin: 25px 0;">
                    <a href="identity-verification.html" class="scam-button" style="background-color: #0071e3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease;">BEKRÆFT DIN IDENTITET NU</a>
                </div>
                <p class="small-notice" style="font-size: 13px; color: #777; background-color: #fff9e6; padding: 10px; border-left: 3px solid #ffcc00; margin: 15px 0;">Bemærk: Dette er det sidste trin inden vi kan ekspedere din præmie. Hvis ikke du bekræfter inden for 12 timer, vil præmien gå til en anden vinder.</p>
                <p>Venlig hilsen,<br>Præmieteamet</p>
                <div class="email-footer-scam">
                    <p>Prize Lottery International &copy; 2025 | Alle rettigheder forbeholdes</p>
                    <p class="footer-links">
                        <a href="#">Afmeld</a> | 
                        <a href="#">Privatlivspolitik</a> | 
                        <a href="#">Betingelser</a>
                    </p>
                </div>
            </div>
        `
    },
    

    // iPhone Scam Email
    iphoneScam: {
        sender: 'iPhone Præmie <win@prize-lottery-international.com>',
        subject: 'Din iPhone 16 Pro - Bekræft oplysninger',
        date: '7. maj 2025 11:32',
        content: `
            <div class="email-content-container scam-email">
                <div class="email-banner" style="background-color: #000; text-align: center; padding: 20px 0; border-radius: 8px 8px 0 0;">
                    <img src="assets/images/iphone16-banner.png" alt="iPhone 16 Pro" class="banner-img" style="max-width: 90%; height: auto; margin: 0 auto;">
                </div>
                <div class="email-header-scam" style="background-color: #f8f8f8; padding: 15px; border-bottom: 1px solid #ddd; text-align: center;">
                    <h2 style="color: #0071e3; margin: 0; font-size: 24px; font-weight: bold;">🎉 TILLYKKE MED DIN NYE iPHONE 16 PRO! 🎉</h2>
                </div>
                <div style="padding: 20px; background-color: white;">
                    <p style="font-size: 16px; color: #333;">Kære vinder,</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">Vi er glade for at kunne bekræfte, at du har vundet en spritny <strong>iPhone 16 Pro (128GB)</strong> i vores månedlige lodtrækning!</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">Din email blev udvalgt blandt over 500.000 deltagere, og du er nu kun få skridt fra at modtage din præmie.</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">For at kunne sende dig din præmie, har vi brug for at bekræfte dine oplysninger:</p>
                    <ul style="background-color: #f8f8f8; padding: 15px 30px; border-radius: 8px; margin: 15px 0;">
                        <li style="padding: 5px 0; color: #333;">Fulde navn</li>
                        <li style="padding: 5px 0; color: #333;">Leveringsadresse</li>
                        <li style="padding: 5px 0; color: #333;">Telefonnummer</li>
                        <li style="padding: 5px 0; color: #333;">Betalingsoplysninger for at dække leveringsgebyret på kun 99 kr.</li>
                    </ul>
                    <div class="action-button" style="text-align: center; margin: 25px 0;">
                        <a href="iphone-claim.html" class="scam-button" style="background-color: #0071e3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">INDTAST OPLYSNINGER NU</a>
                    </div>
                    <table style="width: 100%; margin: 20px 0; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr style="background-color: #f0f0f0;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Produktdetaljer</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Værdi</th>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">Model</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">iPhone 16 Pro</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">Lagerplads</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">128GB</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">Farve</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">Titanium</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">Markedsværdi</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">10.999 kr.</td>
                        </tr>
                    </table>
                    <p class="small-notice" style="font-size: 13px; color: #777; background-color: #fff9e6; padding: 10px; border-left: 3px solid #ffcc00; margin: 15px 0;">Bemærk: Du skal bekræfte dine oplysninger inden for 24 timer, ellers vil præmien blive givet til en anden vinder fra vores venteliste.</p>
                    <p style="font-size: 16px; color: #333;">Venlig hilsen,<br>Præmieteamet</p>
                </div>
                <div class="email-footer-scam" style="background-color: #f2f2f2; padding: 15px; border-top: 1px solid #ddd; text-align: center; border-radius: 0 0 8px 8px;">
                    <p style="color: #666; font-size: 13px; margin: 5px 0;">Prize Lottery International &copy; 2025 | Alle rettigheder forbeholdes</p>
                    <p class="footer-links" style="color: #666; font-size: 13px; margin: 5px 0;">
                        <a href="#" style="color: #0071e3; text-decoration: none;">Afmeld</a> | 
                        <a href="#" style="color: #0071e3; text-decoration: none;">Privatlivspolitik</a> | 
                        <a href="#" style="color: #0071e3; text-decoration: none;">Betingelser</a>
                    </p>
                </div>
            </div>
        `
    },

    // Facebook Reset Password
    facebookReset: {
        sender: 'Faceb0ok Sikkerhed <security@faceb0ok-team.com>',
        subject: 'Din konto er blevet begrænset - Bekræft identitet',
        date: '7. maj 2025 10:15',
        content: `
            <div class="email-content-container scam-email">
                <div class="email-header-facebook">
                    <img src="assets/images/facebook-logo.png" alt="Facebook" class="facebook-header-logo">
                </div>
                <div class="security-alert">
                    <h3>Sikkerhedsadvarsel: Usædvanlig aktivitet på din konto</h3>
                </div>
                <p>Hej,</p>
                <p>Vi har registreret usædvanlig aktivitet på din Facebook-konto. For at beskytte din konto, har vi midlertidigt begrænset visse funktioner.</p>
                <p>Vi beder dig om at bekræfte din identitet for at genoprette fuld adgang til din konto.</p>
                <div class="action-steps">
                    <p><strong>Sådan bekræfter du din identitet:</strong></p>
                    <ol>
                        <li>Klik på knappen "Bekræft Identitet" nedenfor</li>
                        <li>Log ind på din konto</li>
                        <li>Følg vejledningen for at bekræfte din identitet</li>
                    </ol>
                </div>
                <div class="action-button">
                    <a href="facebook-verification.html" class="facebook-button">BEKRÆFT IDENTITET</a>
                </div>
                <p class="small-warning">Hvis du ikke bekræfter din identitet inden for 48 timer, vil din konto muligvis blive permanent deaktiveret.</p>
                <p>Tak for din forståelse og samarbejde.</p>
                <p>Venlig hilsen,<br>Faceb0ok Sikkerhedsteam</p>
                <div class="email-footer-facebook">
                    <p>Denne meddelelse blev sendt til <span class="user-email"></span>. Hvis du ikke ønsker at modtage e-mails fra Faceb0ok Sikkerhed, kan du <a href="#">afmelde</a> dem.</p>
                    <p>Faceb0ok, Inc., Attention: Community Support, Menlo Park, CA 94025</p>
                </div>
            </div>
        `
    },
    
    // Facebook Security Follow-up Email (LEGITIMATE)
    facebookSecurity: {
        sender: 'Facebook Sikkerhed <security@mail.facebook.com>',
        subject: 'Sikkerhedsadvarsel: Ny login på din konto',
        date: '7. maj 2025 14:03',
        content: `
            <div class="email-content-container genuine-email">
                <div class="email-header-facebook-genuine" style="background-color: #1877f2; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
                    <img src="assets/images/facebook-logo-white.png" alt="Facebook" class="facebook-header-logo" style="height: 30px; width: auto;">
                </div>
                <div class="security-alert" style="background-color: #ffebee; padding: 10px; margin: 15px 0; border-left: 4px solid #d32f2f;">
                    <h3 style="color: #d32f2f; margin: 0;">Sikkerhedsadvarsel: Ny login registreret</h3>
                </div>
                <div style="padding: 20px;">
                    <p>Hej,</p>
                    <p>Vi har registreret et login på din Facebook-konto fra en ny enhed og placering. Hvis dette ikke var dig, kan din konto være blevet kompromitteret.</p>
                    
                    <div style="background-color: #f5f6f7; padding: 15px; margin: 15px 0; border-radius: 8px;">
                        <p><strong>Login-detaljer:</strong></p>
                        <ul style="list-style-type: none; padding: 0;">
                            <li style="padding: 5px 0;"><strong>Tidspunkt:</strong> 7. maj 2025, 14:01</li>
                            <li style="padding: 5px 0;"><strong>Enhed:</strong> Unknown Windows Device</li>
                            <li style="padding: 5px 0;"><strong>Placering:</strong> Kiev, Ukraine (IP: 176.36.xx.xx)</li>
                            <li style="padding: 5px 0;"><strong>Browser:</strong> Chrome på Windows</li>
                        </ul>
                    </div>
                    
                    <p><strong>Hvis dette var dig:</strong> Du behøver ikke at foretage dig noget.</p>
                    
                    <p><strong>Hvis dette IKKE var dig:</strong> Din konto kan være blevet kompromitteret. Du bør straks:</p>
                    
                    <ol>
                        <li>Skift din adgangskode ved at gå til Indstillinger &gt; Sikkerhed og login</li>
                        <li>Aktiver to-faktor-godkendelse, hvis du ikke allerede har gjort det</li>
                        <li>Gennemgå nylige aktiviteter på din konto for mistænkelige handlinger</li>
                    </ol>
                    
                    <div class="action-button" style="text-align: center; margin: 25px 0;">
                        <a href="./facebook-reset-password.html" class="genuine-button" style="background-color: #1877f2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">NULSTIL DIN ADGANGSKODE</a>
                    </div>
                    
                    <p>Beskyt din konto ved at aktivere to-faktor-godkendelse og aldrig dele din adgangskode med andre.</p>
                    
                    <p>Venlig hilsen,<br>Facebook Sikkerhedsteam</p>
                </div>
                
                <div class="email-footer-genuine" style="background-color: #f5f6f7; padding: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #737373;">
                    <p>Denne besked blev sendt til [din-email]@example.com for at informere dig om vigtige ændringer på din Facebook-konto.</p>
                    <p>Meta Platforms, Inc., Attention: Community Support, 1 Facebook Way, Menlo Park, CA 94025</p>
                    <p>© Meta 2025</p>
                </div>
            </div>
        `
    },
    
    // Facebook Security Follow-up Email (FAKE/PHISHING)
    facebookSecurityFake: {
        sender: 'Facebook Sikkerheds Team <secure@faceb00k-account-security.com>',
        subject: 'Advarsel: Mistænkelig login på din konto',
        date: '7. maj 2025 14:07',
        content: `
            <div class="email-content-container scam-email">
                <div class="email-header-facebook-fake" style="background-color: #1877f2; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
                    <img src="assets/images/facebook-logo-white.png" alt="Facebook" class="facebook-header-logo" style="height: 30px; width: auto;">
                </div>
                <div class="security-alert" style="background-color: #ffebee; padding: 10px; margin: 15px 0; border-left: 4px solid #d32f2f;">
                    <h3 style="color: #d32f2f; margin: 0;">Advarsel: Mistænkelig login registreret</h3>
                </div>
                <div style="padding: 20px;">
                    <p>Hej,</p>
                    <p>Vi har registreret et forsøg på at logge ind på din Facebook-konto fra en ukendt enhed og placering. For at beskytte din konto, skal du omgående verificere din identitet.</p>
                    
                    <div style="background-color: #f5f6f7; padding: 15px; margin: 15px 0; border-radius: 8px;">
                        <p><strong>Login-detaljer:</strong></p>
                        <ul style="list-style-type: none; padding: 0;">
                            <li style="padding: 5px 0;"><strong>Tidspunkt:</strong> 7. maj 2025, 14:05</li>
                            <li style="padding: 5px 0;"><strong>Enhed:</strong> Unknown Device</li>
                            <li style="padding: 5px 0;"><strong>Placering:</strong> Moscow, Russia (IP: 95.108.xx.xx)</li>
                            <li style="padding: 5px 0;"><strong>Browser:</strong> Unknown Browser</li>
                        </ul>
                    </div>
                    
                    <p><strong>Handling påkrævet:</strong> Af sikkerhedsmæssige årsager skal du bekræfte din identitet og opdatere din adgangskode inden for 24 timer, ellers vil din konto blive låst.</p>
                    
                    <div class="action-button" style="text-align: center; margin: 25px 0;">
                        <a href="facebook-verification.html" class="fake-button" style="background-color: #1877f2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">BEKRÆFT DIN IDENTITET</a>
                    </div>
                    
                    <p>Hvis du ikke genkender dette login-forsøg, skal du straks:</p>
                    
                    <ol>
                        <li>Klikke på knappen ovenfor for at bekræfte din identitet</li>
                        <li>Opdatere din adgangskode</li>
                        <li>Tilføje ekstra sikkerhed til din konto</li>
                    </ol>
                    
                    <p>Venlig hilsen,<br>Faceb00k Sikkerhedsteamet</p>
                </div>
                
                <div class="email-footer-fake" style="background-color: #f5f6f7; padding: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #737373;">
                    <p>Denne besked blev automatisk sendt til dig som svar på ændringer på din Facebook-konto</p>
                    <p>Facebook, Inc., 1 Faceb00k Way, Menlo Park, CA 94025</p>
                    <p>© Facebook 2025</p>
                </div>
            </div>
        `
    }
};

// DataSikkerhed Welcome Email - to appear at the bottom of the list
const welcomeEmailHTML = `
<div class="email-item" id="welcomeMail">
    <div class="email-checkbox">
        <input type="checkbox" id="email3">
        <label for="email3"></label>
    </div>
    <div class="email-star">
        <i class="far fa-star"></i>
    </div>
    <div class="email-delete" title="Slet email">
        <i class="fas fa-trash-alt" id="deleteWelcomeEmail"></i>
    </div>
    <div class="email-sender">
        <strong>DataSikkerhed</strong>
    </div>
    <div class="email-content">
        <div class="email-subject">
            <strong>Velkommen til DataSikkerheds-testen</strong>
        </div>
        <div class="email-snippet">
            - Tak fordi du deltager i vores test om datasikkerhed. Du vil modtage forskellige scenarier i denne test...  
        </div>
    </div>
    <div class="email-time">09:45</div>
</div>
`;


// Email for bekræftigelse af kort-oplysninger efter iPhone-svindel
const confirmationEmailHTML = `
<div class="email-item unread" id="paymentConfirmationMail">
    <div class="email-checkbox">
        <input type="checkbox" id="emailPayment">
        <label for="emailPayment"></label>
    </div>
    <div class="email-star">
        <i class="far fa-star"></i>
    </div>
    <div class="email-delete" title="Slet email">
        <i class="fas fa-trash-alt" id="deletePaymentEmail"></i>
    </div>
    <div class="email-sender">
        <strong>iPhone Præmie</strong>
    </div>
    <div class="email-content">
        <div class="email-subject">
            <strong>Betaling mangler - Aktiver din konto</strong>
        </div>
        <div class="email-snippet">
            - Vi mangler din betaling på 59 kr. for at aktivere din præmiekonto. Bekræft din identitet og gennemfør betalingen nu...  
        </div>
    </div>
    <div class="email-time">12:10</div>
</div>
`;

// Facebook security follow-up email (LEGITIMATE) after submitting credentials
const facebookSecurityEmailHTML = `
<div class="email-item unread important" id="facebookSecurityMail">
    <div class="email-checkbox">
        <input type="checkbox" id="emailFacebookSecurity">
        <label for="emailFacebookSecurity"></label>
    </div>
    <div class="email-star">
        <i class="far fa-star"></i>
    </div>
    <div class="email-delete" title="Slet email">
        <i class="fas fa-trash-alt" id="deleteFacebookSecurityEmail"></i>
    </div>
    <div class="email-sender">
        <strong>Facebook Sikkerhed</strong>
    </div>
    <div class="email-content">
        <div class="email-subject">
            <strong>Sikkerhedsadvarsel: Ny login på din konto</strong>
        </div>
        <div class="email-snippet">
            - Vi har registreret et login på din Facebook-konto fra en ny enhed og placering. Hvis dette ikke var dig, kan din konto være blevet...  
        </div>
    </div>
    <div class="email-time">14:03</div>
</div>
`;

// Facebook security follow-up email (FAKE/PHISHING)
const facebookSecurityFakeEmailHTML = `
<div class="email-item unread important" id="facebookSecurityFakeMail">
    <div class="email-checkbox">
        <input type="checkbox" id="emailFacebookSecurityFake">
        <label for="emailFacebookSecurityFake"></label>
    </div>
    <div class="email-star">
        <i class="far fa-star"></i>
    </div>
    <div class="email-delete" title="Slet email">
        <i class="fas fa-trash-alt" id="deleteFacebookSecurityFakeEmail"></i>
    </div>
    <div class="email-sender">
        <strong>Facebook Sikkerheds Team</strong>
    </div>
    <div class="email-content">
        <div class="email-subject">
            <strong>Advarsel: Mistænkelig login på din konto</strong>
        </div>
        <div class="email-snippet">
            - Vi har registreret et forsøg på at logge ind på din Facebook-konto fra en ukendt enhed og placering. For at beskytte din konto...  
        </div>
    </div>
    <div class="email-time">14:07</div>
</div>
`;

