document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÕES ---
    const backendUrl = 'https://rifa-backend-o7sm.onrender.com'; // <-- SUA URL REAL DO RENDER AQUI
    const numeroInicial = 111;
    const numeroFinal = 120;
    
    // --- ELEMENTOS DA PÁGINA ---
    const containerNumeros = document.getElementById('rifa-numeros');
    const modalCompra = document.getElementById('modal-compra');
    const spanNumeroSelecionado = document.getElementById('numero-selecionado');
    const formComprador = document.getElementById('form-comprador');
    const closeModalButton = document.querySelector('.close-button');

    // --- NOVOS ELEMENTOS DO MODAL PIX ---
    const modalPix = document.getElementById('modal-pix');
    const closePixModalButton = document.querySelector('.pix-close');
    const copyPixKeyButton = document.getElementById('copy-pix-key');
    const pixKeyInput = document.getElementById('pix-key-input');

    async function gerarNumeros() {
        // ... (Esta função continua exatamente a mesma de antes)
        containerNumeros.innerHTML = 'Carregando números...';
        try {
            const response = await fetch(`${backendUrl}/api/rifa`);
            if (!response.ok) { throw new Error('Não foi possível carregar os dados da rifa.'); }
            const numerosVendidos = await response.json();
            containerNumeros.innerHTML = '';
            for (let i = numeroInicial; i <= numeroFinal; i++) {
                const numeroBtn = document.createElement('button');
                numeroBtn.textContent = i;
                numeroBtn.classList.add('numero-btn');
                numeroBtn.dataset.numero = i;
                if (numerosVendidos.includes(i.toString())) {
                    numeroBtn.classList.add('indisponivel');
                    numeroBtn.disabled = true;
                } else {
                    numeroBtn.classList.add('disponivel');
                    numeroBtn.addEventListener('click', () => selecionarNumero(i));
                }
                containerNumeros.appendChild(numeroBtn);
            }
        } catch (error) {
            containerNumeros.innerHTML = `<p style="color: red;">${error.message}</p>`;
            console.error('Erro ao buscar números:', error);
        }
    }

    function selecionarNumero(numero) {
        spanNumeroSelecionado.textContent = numero;
        modalCompra.style.display = 'block';
    }

    // --- A GRANDE MUDANÇA ESTÁ AQUI ---
    formComprador.addEventListener('submit', async function(event) {
        event.preventDefault();
        const numeroComprado = spanNumeroSelecionado.textContent;
        const dadosCompra = {
            numero: numeroComprado,
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            endereco: document.getElementById('endereco').value,
        };

        try {
            const response = await fetch(`${backendUrl}/api/comprar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCompra),
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.message || 'Ocorreu um erro na reserva.'); }
            
            // Se a reserva foi um sucesso no backend:
            // 1. Atualiza a aparência do botão na tela
            const btnComprado = document.querySelector(`.numero-btn[data-numero='${numeroComprado}']`);
            if (btnComprado) {
                btnComprado.classList.remove('disponivel');
                btnComprado.classList.add('indisponivel');
                btnComprado.disabled = true;
            }
            
            // 2. Fecha o modal de formulário
            modalCompra.style.display = 'none';
            formComprador.reset();
            
            // 3. ABRE O NOVO MODAL DE PAGAMENTO PIX
            modalPix.style.display = 'block';

        } catch (error) {
            alert(`Erro: ${error.message}`);
            console.error('Erro ao registrar reserva:', error);
        }
    });

    // --- FUNÇÕES PARA OS MODAIS ---
    function fecharModalCompra() {
        modalCompra.style.display = 'none';
        formComprador.reset();
    }
    
    function fecharModalPix() {
        modalPix.style.display = 'none';
    }
    
    closeModalButton.addEventListener('click', fecharModalCompra);
    closePixModalButton.addEventListener('click', fecharModalPix);

    window.addEventListener('click', (event) => {
        if (event.target == modalCompra) { fecharModalCompra(); }
        if (event.target == modalPix) { fecharModalPix(); }
    });
    
    // Função para copiar a chave PIX
    copyPixKeyButton.addEventListener('click', () => {
        pixKeyInput.select();
        document.execCommand('copy');
        copyPixKeyButton.textContent = 'Copiado!';
        setTimeout(() => {
            copyPixKeyButton.textContent = 'Copiar Chave';
        }, 2000);
    });

    gerarNumeros();
});