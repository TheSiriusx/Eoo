
    // Configura la Tasa BCV fija por código aquí:
    const TASA_BCV = 800; 

    // CAMBIA AQUÍ EL NOMBRE DEL ARCHIVO HTML DE DESTINO:
    const ARCHIVO_DESTINO = "inicio.html"; 

    const slider = document.getElementById('creditSlider');
    const displayAmount = document.getElementById('displayAmount');
    const displayBs = document.getElementById('displayBs');
    const displayTooltipBalance = document.getElementById('displayTooltipBalance');
    const displayMinBalance = document.getElementById('displayMinBalance');
    const btnSubmit = document.getElementById('btnSubmit');
    const termsCheckbox = document.getElementById('terms');

    let botonHabilitado = false; // Bandera para saber si ya pasaron los 3 segundos

    function actualizarCalculos() {
        const valUsd = parseFloat(slider.value);
        
        // Calcular valor total en Bolívares (Tasa BCV)
        const totalBs = valUsd * TASA_BCV;
        const bsFormatted = totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        // Actualizar visualización principal (Dólares arriba, Bolívares total abajo)
        displayAmount.textContent = '$' + valUsd.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        displayBs.textContent = 'Bs. ' + bsFormatted + ' Tasa BCV';

        // Calcular el 15% del total en Bolívares para los elementos inferiores
        const calculo15Bs = totalBs * 0.15;
        const cuotaBsFormatted = calculo15Bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Actualizar los textos dinámicos con el 15% en bolívares
        displayTooltipBalance.textContent = 'Bs. ' + cuotaBsFormatted;
        displayMinBalance.textContent = 'Bs. ' + cuotaBsFormatted;
    }

    slider.addEventListener('input', actualizarCalculos);
    slider.addEventListener('change', actualizarCalculos);
    actualizarCalculos();

    // Temporizador inicial: espera 3 segundos desde que carga la página para habilitar el botón
    setTimeout(function() {
        botonHabilitado = true;
        btnSubmit.classList.add('active');
        btnSubmit.textContent = 'Solicitar';
    }, 3000);

    // Lógica al hacer clic en el botón
    btnSubmit.addEventListener('click', function() {
        // Si aún no han pasado los 3 segundos, no hace nada
        if (!botonHabilitado) return;

        // Validar si la casilla de términos NO está marcada
        if (!termsCheckbox.checked) {
            btnSubmit.classList.add('error');
            btnSubmit.textContent = '¡Acepte los términos y condiciones!';

            setTimeout(function() {
                btnSubmit.classList.remove('error');
                btnSubmit.textContent = 'Solicitar';
            }, 2000);
            return;
        }

        // Si ya pasaron los 3 segundos y aceptó los términos, procede a la redirección
        btnSubmit.classList.remove('active');
        btnSubmit.style.backgroundColor = '#dee2e6';
        btnSubmit.style.color = '#6c757d';
        btnSubmit.textContent = 'Procesando...';

        setTimeout(function() {
            window.location.href = ARCHIVO_DESTINO;
        }, 1000);
    });
