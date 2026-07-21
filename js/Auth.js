(function(App) {
    'use strict';

    App.supabaseClient = supabaseClient;

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
    usernameInput: document.getElementById('account-username'),
    usernameBtn: document.getElementById('account-username-btn'),
    emailInput: document.getElementById('account-email'),
    emailBtn: document.getElementById('account-email-btn'),
    passwordOldInput: document.getElementById('account-password-old'),
    passwordInput: document.getElementById('account-password'),
    passwordConfirmInput: document.getElementById('account-password-confirm'),
    passwordBtn: document.getElementById('account-password-btn')
};

function showAuthScreen() {
    App.showOverlay(authElements.screen);
    switchMode('login');
}

function hideAuthScreen() {
    App.hideOverlay(authElements.screen);
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

        setAuthError('Bitte verifiziere deine E-Mail, um die Registrierung abzuschließen.');
        clearRegisterForm();
    }).catch(() => {
        setAuthError('Ein unerwarteter Fehler ist aufgetreten.');
    });
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
            const error = result.error;
            
            if (error) {
                setAuthError('Anmeldung fehlgeschlagen. Bitte überprüfe deine Angaben.');
                return;
            }
            initAuth();
        }).catch(() => {
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

function setAccountMessage(msg, isSuccess) {
    accountElements.message.textContent = msg || '';
    accountElements.message.classList.toggle('success', !!isSuccess);
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

function updateUsername() {
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

        setAccountMessage('Bestätigungslinks wurde an die alte und neue E-Mail-Adresse gesendet.', true);
    }).catch(() => {
        setAccountMessage('Ein unerwarteter Fehler ist aufgetreten.');
    });
}

function updateAccountPassword() {
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
            const error = result.error;

            if (error) {
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

accountElements.toggleBtn?.addEventListener('click', openAccountOverlay);
accountElements.closeBtn?.addEventListener('click', () => App.hideOverlay(accountElements.overlay));
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
authElements.signOutBtn?.addEventListener('click', signOutUser);

authElements.loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    signIn();
});

authElements.registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    signUp();
});

    App.initAuth = initAuth;

})(window.GameApp = window.GameApp || {});