(function(App) {
    'use strict';

    let currentUser = null;
    let lastAuthCheck = Date.now();
    let currentMode = 'login';

    App.getCurrentUser = () => currentUser;

    const authElements = {
        screen: document.getElementById('auth-screen'),
        errorText: document.getElementById('auth-error'),
        loginForm: document.getElementById('auth-login-form'),
        registerForm: document.getElementById('auth-register-form'),
        loginEmailInput: document.getElementById('auth-login-email'),
        loginPasswordInput: document.getElementById('auth-login-password'),
        registerEmailInput: document.getElementById('auth-register-email'),
        registerPasswordInput: document.getElementById('auth-register-password'),
        registerPasswordConfirmInput: document.getElementById('auth-register-password-confirm'),
        registerUsernameInput: document.getElementById('auth-register-username'),
        signOutBtn: document.getElementById('auth-signout-btn'),
        userLabel: document.getElementById('auth-user-email'),
        tabLogin: document.getElementById('tab-login'),
        tabRegister: document.getElementById('tab-register')
    };

    const accountElements = {
        toggleBtn: document.getElementById('account-toggle'),
        overlay: document.getElementById('account-overlay'),
        closeBtn: document.getElementById('close-account'),
        message: document.getElementById('account-message'),
        usernameForm: document.getElementById('account-username-form'),
        usernameInput: document.getElementById('account-username'),
        emailForm: document.getElementById('account-email-form'),
        emailInput: document.getElementById('account-email'),
        passwordForm: document.getElementById('account-password-form'),
        passwordOldInput: document.getElementById('account-password-old'),
        passwordInput: document.getElementById('account-password'),
        passwordConfirmInput: document.getElementById('account-password-confirm')
    };

    function showAuthScreen() {
        App.showOverlay(authElements.screen);
        switchMode('login');
    }

    function setAuthError(msg) {
        authElements.errorText.textContent = msg || '';
    }

    function switchMode(mode) {
        currentMode = mode;
        setAuthError('');

        if (mode === 'login') {
            authElements.tabLogin.classList.add('active');
            authElements.tabRegister.classList.remove('active');
            App.hideOverlay(authElements.registerForm);
            App.showOverlay(authElements.loginForm);
        } else {
            authElements.tabLogin.classList.remove('active');
            authElements.tabRegister.classList.add('active');
            App.hideOverlay(authElements.loginForm);
            App.showOverlay(authElements.registerForm);
        }
    }

    function clearRegisterForm() {
        authElements.registerEmailInput.value = '';
        authElements.registerPasswordInput.value = '';
        authElements.registerPasswordConfirmInput.value = '';
        authElements.registerUsernameInput.value = '';
    }

    function setAccountMessage(msg, isSuccess) {
        accountElements.message.textContent = msg || '';
        accountElements.message.classList.toggle('success', !!isSuccess);
    }

    App.initAuth = function() {
        return supabaseClient.auth.getSession()
            .then(result => {
                const session = result.data?.session;

                if (!session) {
                    currentUser = null;
                    showAuthScreen();
                    return;
                }

                return supabaseClient.auth.getUser()
                    .then(userResult => {
                        const user = userResult.data?.user;
                        const userError = userResult.error;

                        if (userError || !user) {
                            currentUser = null;
                            return supabaseClient.auth.signOut().finally(() => {
                                showAuthScreen();
                            });
                        }

                        currentUser = user;
                        App.hideOverlay(authElements.screen);
                        authElements.userLabel.textContent = user.user_metadata?.display_name || user.email;
                    });
            })
            .catch(() => {
                showAuthScreen();
            });
    };

    function signUp() {
        setAuthError('');
        const email = authElements.registerEmailInput.value.trim();
        const password = authElements.registerPasswordInput.value;
        const passwordConfirm = authElements.registerPasswordConfirmInput.value;
        const username = authElements.registerUsernameInput.value.trim();

        if (!email || !password || !passwordConfirm || !username) {
            setAuthError('Bitte alle Felder ausfüllen.');
            return;
        }

        if (username.length < 3 || username.length > 15) {
            setAuthError('Der Username muss zwischen 3 und 15 Zeichen lang sein.');
            return;
        }

        if (password !== passwordConfirm) {
            setAuthError('Die Passwörter stimmen nicht überein.');
            return;
        }

        if (password.length < 6) {
            setAuthError('Das Passwort muss mindestens 6 Zeichen lang sein.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setAuthError('Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }

        supabaseClient.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    display_name: username
                }
            }
        }).then(result => {
            if (result.error) {
                setAuthError(getSignUpErrorMessage(result.error));
                return;
            }

            const user = result.data?.user;
            if (user && user.identities && user.identities.length === 0) {
                setAuthError('Für diese E-Mail-Adresse existiert bereits ein Konto.');
                return;
            }

            setAuthError('Bitte verifiziere deine E-Mail, um die Registrierung abzuschließen.');
            clearRegisterForm();
        }).catch(() => {
            setAuthError('Ein unerwarteter Fehler ist aufgetreten.');
        });
    }

    function getSignUpErrorMessage(error) {
        const status = error?.status;
        const code = error?.code || '';
        const rawMsg = (error?.message || '').toLowerCase();

        if (code === 'user_already_exists' || rawMsg.includes('already registered') || rawMsg.includes('already exists')) {
            return 'Für diese E-Mail-Adresse existiert bereits ein Konto.';
        }

        if (code === 'weak_password' || rawMsg.includes('password')) {
            return 'Das Passwort erfüllt nicht die Anforderungen.';
        }

        if (code === 'email_address_invalid' || (rawMsg.includes('invalid') && rawMsg.includes('email'))) {
            return 'Diese E-Mail-Adresse ist ungültig.';
        }

        if (code === 'over_email_send_rate_limit' || status === 429 || rawMsg.includes('rate limit')) {
            return 'Zu viele Versuche. Bitte warte kurz und versuche es erneut.';
        }

        if (status === 0 || rawMsg.includes('network') || rawMsg.includes('fetch')) {
            return 'Keine Verbindung zum Server. Bitte überprüfe deine Internetverbindung.';
        }

        return 'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
    }

    function signIn() {
        setAuthError('');
        const email = authElements.loginEmailInput.value.trim();
        const password = authElements.loginPasswordInput.value;

        if (!email || !password) {
            setAuthError('Bitte E-Mail und Passwort eingeben.');
            return;
        }

        supabaseClient.auth.signInWithPassword({ email, password })
            .then(result => {
                if (result.error) {
                    setAuthError('Anmeldung fehlgeschlagen. Bitte überprüfe deine Angaben.');
                    return;
                }
                App.initAuth().then(() => {
                    App.loadGame();
                    App.updateUI();
                });
            })
            .catch(() => {
                setAuthError('Ein unerwarteter Fehler ist aufgetreten.');
            });
    }

    function signOutUser() {
        App.saveGame();
        supabaseClient.auth.signOut()
            .then(() => {
                location.reload();
            })
            .catch(() => {
                location.reload(); 
            });
    }

    function openAccountOverlay() {
        setAccountMessage('');

        accountElements.usernameInput.value = currentUser?.user_metadata?.display_name || '';
        accountElements.emailInput.value = currentUser?.email || '';
        accountElements.passwordOldInput.value = '';
        accountElements.passwordInput.value = '';
        accountElements.passwordConfirmInput.value = '';

        App.showOverlay(accountElements.overlay);
    }

    function updateUsername(e) {
        e.preventDefault();
        setAccountMessage('');
        const newUsername = accountElements.usernameInput.value.trim();

        if (!newUsername) {
            setAccountMessage('Bitte einen Username eingeben.');
            return;
        }

        if (newUsername.length < 3 || newUsername.length > 15) {
            setAccountMessage('Der Username muss zwischen 3 und 15 Zeichen lang sein.');
            return;
        }

        supabaseClient.auth.updateUser({
            data: { display_name: newUsername }
        }).then(result => {
            const error = result.error;
            const user = result.data?.user;

            if (error || !user) {
                setAccountMessage('Username konnte nicht geändert werden.');
                return;
            }

            currentUser = user;
            authElements.userLabel.textContent = user.user_metadata?.display_name || user.email;

            setAccountMessage('Username erfolgreich geändert.', true);
        }).catch(() => {
            setAccountMessage('Ein unerwarteter Fehler ist aufgetreten.');
        });
    }

    function updateAccountEmail(e) {
        e.preventDefault();
        setAccountMessage('');
        const newEmail = accountElements.emailInput.value.trim();

        if (!newEmail) {
            setAccountMessage('Bitte eine E-Mail-Adresse eingeben.');
            return;
        }

        supabaseClient.auth.updateUser({
            email: newEmail
        }).then(result => {
            if (result.error) {
                setAccountMessage('E-Mail konnte nicht geändert werden.');
                return;
            }

            setAccountMessage('Bestätigungslinks wurde an die alte und neue E-Mail-Adresse gesendet.', true);
        }).catch(() => {
            setAccountMessage('Ein unerwarteter Fehler ist aufgetreten.');
        });
    }

    function updateAccountPassword(e) {
        e.preventDefault();
        setAccountMessage('');
                const oldPassword = accountElements.passwordOldInput.value;
        const newPassword = accountElements.passwordInput.value;
        const confirmPassword = accountElements.passwordConfirmInput.value;

        if (!oldPassword || !newPassword || !confirmPassword) {
            setAccountMessage('Bitte alle Passwortfelder ausfüllen.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setAccountMessage('Die neuen Passwörter stimmen nicht überein.');
            return;
        }

        if (newPassword.length < 6) {
            setAccountMessage('Das neue Passwort muss mindestens 6 Zeichen lang sein.');
            return;
        }

        if (!currentUser || !currentUser.email) {
            setAccountMessage('Benutzer nicht gefunden. Bitte logge dich neu ein.');
            return;
        }

        supabaseClient.auth.signInWithPassword({
            email: currentUser.email,
            password: oldPassword
        }).then(reauthResult => {
            if (reauthResult.error) {
                setAccountMessage('Das aktuelle Passwort ist falsch.');
                return;
            }

            supabaseClient.auth.updateUser({
                password: newPassword
            }).then(result => {
                if (result.error) {
                    setAccountMessage('Passwort konnte nicht geändert werden.');
                    return;
                }

                accountElements.passwordOldInput.value = '';
                accountElements.passwordInput.value = '';
                accountElements.passwordConfirmInput.value = '';
                setAccountMessage('Passwort erfolgreich geändert.', true);
            }).catch(() => {
                setAccountMessage('Ein unerwarteter Fehler beim Aktualisieren ist aufgetreten.');
            });

        }).catch(() => {
            setAccountMessage('Ein unerwarteter Fehler bei der Überprüfung ist aufgetreten.');
        });
    }

    async function recheckAuthOnReturn() {
        if (document.visibilityState !== 'visible') return;
        if (!currentUser) return;

        const now = Date.now();
        if (now - lastAuthCheck < 30000) return;
        lastAuthCheck = now;

        const { data, error } = await supabaseClient.auth.getUser();

        if (error || !data?.user) {
            currentUser = null;
            try {
                await supabaseClient.auth.signOut();
            } catch (e) {}
            showAuthScreen();
        }
    }

    accountElements.toggleBtn?.addEventListener('click', openAccountOverlay);
    accountElements.closeBtn?.addEventListener('click', () => App.hideOverlay(accountElements.overlay));
    
    accountElements.usernameForm?.addEventListener('submit', updateUsername);
    accountElements.emailForm?.addEventListener('submit', updateAccountEmail);
    accountElements.passwordForm?.addEventListener('submit', updateAccountPassword);

    document.addEventListener('visibilitychange', recheckAuthOnReturn);
    window.addEventListener('focus', recheckAuthOnReturn);

    authElements.tabLogin?.addEventListener('click', () => switchMode('login'));
    authElements.tabRegister?.addEventListener('click', () => switchMode('register'));
    authElements.signOutBtn?.addEventListener('click', signOutUser);

    authElements.loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        signIn();
    });

    authElements.registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        signUp();
    });

    document.addEventListener('click', function(e) {
        const toggleBtn = e.target.closest('.pw-toggle-btn');
        if (!toggleBtn) return;
        e.preventDefault();

        const wrapper = toggleBtn.closest('.password-input-wrapper');
        if (!wrapper) return;

        const input = wrapper.querySelector('input');
        const eyeClosedLine = toggleBtn.querySelector('.eye-closed');

        if (input) {
            if (input.type === 'password') {
                input.type = 'text';
                if (eyeClosedLine) eyeClosedLine.style.display = 'block';
            } else {
                input.type = 'password';
                if (eyeClosedLine) eyeClosedLine.style.display = 'none';
            }
        }
    });

    const registerPwInput = authElements.registerPasswordInput;
    const registerPwConfirmInput = authElements.registerPasswordConfirmInput;
    const strengthFill = document.getElementById('pw-strength-fill');

    const pwRules = {
        length: { regex: /.{6,}/, element: document.getElementById('rule-length') },
        upper: { regex: /[A-Z]/, element: document.getElementById('rule-upper') },
        lower: { regex: /[a-z]/, element: document.getElementById('rule-lower') },
        number: { regex: /[0-9]/, element: document.getElementById('rule-number') },
        special: { regex: /[^A-Za-z0-9]/, element: document.getElementById('rule-special') }
    };

    const matchElement = document.getElementById('rule-match');

    function checkPasswordRequirements() {
        if (!registerPwInput) return;
        const val = registerPwInput.value;
        const confirmVal = registerPwConfirmInput ? registerPwConfirmInput.value : '';
        let passedCount = 0;
        const totalRules = Object.keys(pwRules).length;

        for (const key in pwRules) {
            const rule = pwRules[key];
            if (rule.element) {
                const isPassed = rule.regex.test(val);
                if (isPassed) {
                    rule.element.classList.add('valid');
                    passedCount++;
                } else {
                    rule.element.classList.remove('valid');
                }
            }
        }

        if (matchElement) {
            if (val.length > 0 && val === confirmVal) {
                matchElement.classList.add('valid');
            } else {
                matchElement.classList.remove('valid');
            }
        }

        const pct = (passedCount / totalRules) * 100;
        if (strengthFill) {
            strengthFill.style.width = pct + '%';
            if (pct <= 40) {
                strengthFill.style.backgroundColor = '#d32f2f';
            } else if (pct <= 80) {
                strengthFill.style.backgroundColor = '#f57c00';
            } else {
                strengthFill.style.backgroundColor = '#2e7d32';
            }
        }
    }

    if (registerPwInput) {
        registerPwInput.addEventListener('input', checkPasswordRequirements);
    }
    if (registerPwConfirmInput) {
        registerPwConfirmInput.addEventListener('input', checkPasswordRequirements);
    }

})(window.GameApp = window.GameApp || {});