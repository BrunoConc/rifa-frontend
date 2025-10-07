document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÕES DA RIFA ---
    const numeroInicial = 111;
    const numeroFinal = 120;
    // IMPORTANTE: Troque a URL abaixo pelo seu link de pagamento (Mercado Pago, PagSeguro, etc.)
    const urlGatewayPagamento = "https://www.mercadopago.com.br/seu-link-de-pagamento"; 

    // --- ELEMENTOS DA PÁGINA ---
    const containerNumeros = document.getElementById('rifa-numeros');
    const modal = document.getElementById('modal-compra');
    const spanNumeroSelecionado = document.getElementById('numero-selecionado');
    const formComprador = document.getElementById('form-comprador');
    const closeModalButton = document.querySelector('.close-button');

    // --- LÓGICA DA APLICAÇÃO ---

    // Carrega os números vendidos do armazenamento local do navegador
    let numerosVendidos = JSON.parse(localStorage.getItem('rifaNumerosVendidos')) || [];

    // Função para gerar os botões dos números
    function gerarNumeros() {
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
    }

    // Função chamada quando um número disponível é clicado
    function selecionarNumero(numero) {
        spanNumeroSelecionado.textContent = numero;
        modal.style.display = 'block';
    }

    // Função para fechar o modal
    function fecharModal() {
        modal.style.display = 'none';
        formComprador.reset(); // Limpa o formulário
    }

    // Event listener para o formulário de compra
    formComprador.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const numeroComprado = spanNumeroSelecionado.textContent;
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;

        // Ação importante: Salvar os dados do comprador
        // Em um site real, você enviaria isso para um servidor ou uma planilha.
        // Por enquanto, vamos apenas exibir no console para você ver.
        console.log("--- NOVO COMPRADOR ---");
        console.log("Número:", numeroComprado);
        console.log("Nome:", nome);
        console.log("Telefone:", telefone);
        console.log("Endereço:", endereco);
        console.log("----------------------");

        // Marcar o número como vendido
        numerosVendidos.push(numeroComprado);
        localStorage.setItem('rifaNumerosVendidos', JSON.stringify(numerosVendidos));

        // Atualizar a aparência do botão
        const btnComprado = document.querySelector(`.numero-btn[data-numero='${numeroComprado}']`);
        if (btnComprado) {
            btnComprado.classList.remove('disponivel');
            btnComprado.classList.add('indisponivel');
            btnComprado.disabled = true;
        }

        fecharModal();

        // Redirecionar para o pagamento
        alert(`Obrigado, ${nome}! Você será redirecionado para o pagamento do número ${numeroComprado}.`);
        window.location.href = urlGatewayPagamento;
    });

    // Fechar o modal ao clicar no 'X' ou fora dele
    closeModalButton.addEventListener('click', fecharModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            fecharModal();
        }
    });

    // Inicia a geração dos números quando a página carrega
    gerarNumeros();
});