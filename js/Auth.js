let currentUser = null;
let lastAuthCheck = Date.now();
let currentMode = 'login';

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