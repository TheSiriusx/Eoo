const contactModalHTML = `
    <div id="contactModal" class="modal">
        <div class="modal-content">
            <h2>Contáctanos</h2>
            <div class="contact-options">
                <div class="contact-item">
                    <span class="icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
                    </span>
                    <a href="" target="_blank">(0412) 231 98 03</a>
                </div>
                <div class="contact-item">
                    <span class="icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </span>
                    <a href="mailto:atencionubii@ubiipagos.com">atencionubii@ubiipagos.com</a>
                </div>
                <div class="contact-item">
                    <span class="icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.19-2.19a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </span>
                    <a href="tel:02123191580">(0212) 319 15 80</a>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="closeContactModal" class="btn-cancelar">Cancelar</button>
            </div>
        </div>
    </div>
`;

function initContactModal() {

    document.body.insertAdjacentHTML('beforeend', contactModalHTML);

    const contactModal = document.getElementById('contactModal');
    const openContactModal = document.getElementById('openContactModal');
    const closeContactModal = document.getElementById('closeContactModal');

    if (openContactModal && contactModal) {
        openContactModal.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
        });
    }

    if (closeContactModal && contactModal) {
        closeContactModal.addEventListener('click', () => {
            contactModal.classList.remove('active');
        });
    }


    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', initContactModal);
