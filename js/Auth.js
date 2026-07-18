let currentUser = null;
let currentUsername = null;

const authElements = {
    screen: document.getElementById('auth-screen'),
    errorText: document.getElementById('auth-error'),
    emailInput: document.getElementById('auth-email'),
    passwordInput: document.getElementById('auth-password'),
    usernameInput: document.getElementById('auth-username'),
    signUpBtn: document.getElementById('auth-signup-btn'),
    signInBtn: document.getElementById('auth-signin-btn'),
    signOutBtn: document.getElementById('auth-signout-btn'),
    userLabel: document.getElementById('auth-user-email')
};

function showAuthScreen() {
    if (authElements.screen) authElements.screen.style.display = 'flex';
}

function hideAuthScreen() {
    if (authElements.screen) authElements.screen.style.display = 'none';
}

function setAuthError(msg) {
    if (authElements.errorText) authElements.errorText.textContent = msg || '';
}

function initAuth() {
    return supabaseClient.auth.getSession()
        .then(result => {
            const session = result.data?.session;
            currentUser = session?.user || null;

            if (currentUser) {
                currentUsername = currentUser.user_metadata?.display_name || null;
                
                hideAuthScreen();
                if (authElements.userLabel) {
                    authElements.userLabel.textContent = currentUsername || currentUser.email;
                }
            } else {
                showAuthScreen();
            }
        })
        .catch(err => {
            console.error("Fehler beim Abrufen der Session:", err);
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
            setAuthError(error.message);
            return;
        }

        setAuthError('Registrierung erfolgreich!');
    }).catch(err => {
        setAuthError('Ein unerwarteter Fehler ist aufgetreten.');
        console.error(err);
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
                setAuthError(error.message);
                return;
            }

            location.reload();
        }).catch(err => {
            setAuthError('Ein unerwarteter Fehler ist aufgetreten.');
            console.error(err);
        });
}

function signOutUser() {
    supabaseClient.auth.signOut()
        .then(() => {
            location.reload();
        })
        .catch(err => {
            console.error("Fehler beim Abmelden:", err);
            location.reload(); 
        });
}

authElements.signUpBtn?.addEventListener('click', signUp);
authElements.signInBtn?.addEventListener('click', signIn);
authElements.signOutBtn?.addEventListener('click', signOutUser);