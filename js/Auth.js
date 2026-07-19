let currentUser = null;
let lastAuthCheck = Date.now();
let currentMode = 'login';
const MAX_USERNAME_LENGTH = 20;
const MIN_USERNAME_LENGTH = 3;

const authElements = {
    screen: document.getElementById('auth-screen'),
    errorText: document.getElementById('auth-error'),
    emailInput: document.getElementById('auth-email'),
    passwordInput: document.getElementById('auth-password'),
    usernameInput: document.getElementById('auth-username'),
    actionBtn: document.getElementById('auth-action-btn'),
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
    usernameInput: document.getElementById('account-username'),
    usernameBtn: document.getElementById('account-username-btn'),
    emailInput: document.getElementById('account-email'),
    emailBtn: document.getElementById('account-email-btn'),
    passwordInput: document.getElementById('account-password'),
    passwordConfirmInput: document.getElementById('account-password-confirm'),
    passwordBtn: document.getElementById('account-password-btn')
};

function showAuthScreen() {
    if (authElements.screen) authElements.screen.style.display = 'flex';
    switchMode('login');
}

function hideAuthScreen() {
    if (authElements.screen) authElements.screen.style.display = 'none';
}

function setAuthError(msg) {
    if (authElements.errorText) authElements.errorText.textContent = msg || '';
}

function switchMode(mode) {
    currentMode = mode;
    setAuthError('');
    
    if (mode === 'login') {
        authElements.tabLogin.classList.add('active');
        authElements.tabRegister.classList.remove('active');
        authElements.usernameInput.style.display = 'none';
        authElements.actionBtn.textContent = 'Einloggen';
    } else {
        authElements.tabLogin.classList.remove('active');
        authElements.tabRegister.classList.add('active');
        authElements.usernameInput.style.display = 'block';
        authElements.actionBtn.textContent = 'Registrieren';
    }
}

function initAuth() {
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

                    hideAuthScreen();
                    if (authElements.userLabel) {
                        authElements.userLabel.textContent = user.user_metadata?.display_name || user.email;
                    }
                });
        })
        .catch(() => {
            showAuthScreen();
        });
}

function signUp() {
    setAuthError('');
    const email = authElements.emailInput.value.trim();
    const password = authElements.passwordInput.value;
    const username = authElements.usernameInput.value.trim();

    if (!email || !password || !username) {
        setAuthError('Bitte E-Mail, Passwort und Username ausfüllen.');
        return;
    }

    if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
        setAuthError(`Der Username muss zwischen ${MIN_USERNAME_LENGTH} und ${MAX_USERNAME_LENGTH} Zeichen lang sein.`);
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
        const error = result.error;

        if (error) {
            setAuthError('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
            return;
        }

        setAuthError('Registrierung erfolgreich! Du kannst dich jetzt einloggen.');
        switchMode('login');
    }).catch(() => {
        setAuthError('Ein unerwarteter Fehler ist aufgetreten.');
    });
}

function signIn() {
    setAuthError('');
    const email = authElements.emailInput.value.trim();
    const password = authElements.passwordInput.value;

    if (!email || !password) {
        setAuthError('Bitte E-Mail und Passwort eingeben.');
        return;
    }

    supabaseClient.auth.signInWithPassword({ email, password })
        .then(result => {
            const error = result.error;
            
            if (error) {
                setAuthError('Anmeldung fehlgeschlagen. Bitte überprüfe deine Angaben.');
                return;
            }

            location.reload();
        }).catch(() => {
            setAuthError('Ein unerwarteter Fehler ist aufgetreten.');
        });
}

function handleAuthAction() {
    if (currentMode === 'login') {
        signIn();
    } else {
        signUp();
    }
}

function signOutUser() {
    supabaseClient.auth.signOut()
        .then(() => {
            location.reload();
        })
        .catch(() => {
            location.reload(); 
        });
}

function setAccountMessage(msg, isSuccess) {
    if (!accountElements.message) return;
    accountElements.message.textContent = msg || '';
    accountElements.message.classList.toggle('success', !!isSuccess);
}

function openAccountOverlay() {
    setAccountMessage('');
    if (accountElements.usernameInput) {
        accountElements.usernameInput.value = currentUser?.user_metadata?.display_name || '';
    }
    if (accountElements.emailInput) {
        accountElements.emailInput.value = currentUser?.email || '';
    }
    if (accountElements.passwordInput) accountElements.passwordInput.value = '';
    if (accountElements.passwordConfirmInput) accountElements.passwordConfirmInput.value = '';
    showOverlay(accountElements.overlay);
}

function updateUsername() {
    setAccountMessage('');
    const newUsername = accountElements.usernameInput.value.trim();

    if (!newUsername) {
        setAccountMessage('Bitte einen Username eingeben.');
        return;
    }

    if (newUsername.length < MIN_USERNAME_LENGTH || newUsername.length > MAX_USERNAME_LENGTH) {
        setAccountMessage(`Der Username muss zwischen ${MIN_USERNAME_LENGTH} und ${MAX_USERNAME_LENGTH} Zeichen lang sein.`);
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
        if (authElements.userLabel) {
            authElements.userLabel.textContent = user.user_metadata?.display_name || user.email;
        }
        setAccountMessage('Username erfolgreich geändert.', true);
    }).catch(() => {
        setAccountMessage('Ein unerwarteter Fehler ist aufgetreten.');
    });
}

function updateAccountEmail() {
    setAccountMessage('');
    const newEmail = accountElements.emailInput.value.trim();

    if (!newEmail) {
        setAccountMessage('Bitte eine E-Mail-Adresse eingeben.');
        return;
    }

    supabaseClient.auth.updateUser({
        email: newEmail
    }).then(result => {
        const error = result.error;

        if (error) {
            setAccountMessage('E-Mail konnte nicht geändert werden.');
            return;
        }

        setAccountMessage('Bestätigungslink wurde an die neue E-Mail-Adresse gesendet.', true);
    }).catch(() => {
        setAccountMessage('Ein unerwarteter Fehler ist aufgetreten.');
    });
}

function updateAccountPassword() {
    setAccountMessage('');
    const newPassword = accountElements.passwordInput.value;
    const confirmPassword = accountElements.passwordConfirmInput.value;

    if (!newPassword || !confirmPassword) {
        setAccountMessage('Bitte beide Passwortfelder ausfüllen.');
        return;
    }

    if (newPassword !== confirmPassword) {
        setAccountMessage('Die Passwörter stimmen nicht überein.');
        return;
    }

    if (newPassword.length < 6) {
        setAccountMessage('Das Passwort muss mindestens 6 Zeichen lang sein.');
        return;
    }

    supabaseClient.auth.updateUser({
        password: newPassword
    }).then(result => {
        const error = result.error;

        if (error) {
            setAccountMessage('Passwort konnte nicht geändert werden.');
            return;
        }

        accountElements.passwordInput.value = '';
        accountElements.passwordConfirmInput.value = '';
        setAccountMessage('Passwort erfolgreich geändert.', true);
    }).catch(() => {
        setAccountMessage('Ein unerwarteter Fehler ist aufgetreten.');
    });
}

accountElements.toggleBtn?.addEventListener('click', openAccountOverlay);
accountElements.closeBtn?.addEventListener('click', () => hideOverlay(accountElements.overlay));
accountElements.usernameBtn?.addEventListener('click', updateUsername);
accountElements.emailBtn?.addEventListener('click', updateAccountEmail);
accountElements.passwordBtn?.addEventListener('click', updateAccountPassword);

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
        } catch (e) {
        }
        showAuthScreen();
    }
}

document.addEventListener('visibilitychange', recheckAuthOnReturn);
window.addEventListener('focus', recheckAuthOnReturn);

authElements.tabLogin?.addEventListener('click', () => switchMode('login'));
authElements.tabRegister?.addEventListener('click', () => switchMode('register'));
authElements.actionBtn?.addEventListener('click', handleAuthAction);
authElements.signOutBtn?.addEventListener('click', signOutUser);