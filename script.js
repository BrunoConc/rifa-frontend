document.addEventListener('DOMContentLoaded', () => {
    // !! IMPORTANTE !! VAMOS TROCAR ESSA URL NO PASSO FINAL
    const backendUrl = 'https://rifa-backend-o7sm.onrender.com'; 

    const numeroInicial = 111;
    const numeroFinal = 120;
    const urlGatewayPagamento = "https://www.mercadopago.com.br/seu-link-de-pagamento";

    // ... (cole o resto do script.js da versão com fetch, ele não muda)
    const containerNumeros = document.getElementById('rifa-numeros');
    const modal = document.getElementById('modal-compra');
    const spanNumeroSelecionado = document.getElementById('numero-selecionado');
    const formComprador = document.getElementById('form-comprador');
    const closeModalButton = document.querySelector('.close-button');

    async function gerarNumeros() {
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
        modal.style.display = 'block';
    }

    function fecharModal() {
        modal.style.display = 'none';
        formComprador.reset();
    }

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
            if (!response.ok) { throw new Error(result.message || 'Ocorreu um erro na compra.'); }

            const btnComprado = document.querySelector(`.numero-btn[data-numero='${numeroComprado}']`);
            if (btnComprado) {
                btnComprado.classList.remove('disponivel');
                btnComprado.classList.add('indisponivel');
                btnComprado.disabled = true;
            }
            fecharModal();
            alert(`Obrigado, ${dadosCompra.nome}! Sua reserva do número ${numeroComprado} foi feita. Redirecionando para o pagamento.`);
            window.location.href = urlGatewayPagamento;

        } catch (error) {
            alert(`Erro: ${error.message}`);
            console.error('Erro ao registrar compra:', error);
        }
    });

    closeModalButton.addEventListener('click', fecharModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) { fecharModal(); }
    });

    gerarNumeros();
});