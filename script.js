// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // Seleciona os elementos do DOM
    const form = document.getElementById('form-agendamento');
    const telefoneInput = document.getElementById('telefone');
    const agendamentoWrapper = document.getElementById('agendamento-wrapper');
    const confirmacaoDiv = document.getElementById('confirmacao-agendamento');
    const resumoDiv = document.getElementById('resumo-agendamento');
    const novoAgendamentoBtn = document.getElementById('novo-agendamento-btn');
    const agendaEscritorioDiv = document.getElementById('agenda-escritorio');
    const listaAgendamentosUl = document.getElementById('lista-agendamentos');

    // --- MÁSCARA DE TELEFONE ---
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        value = value.substring(0, 11); // Limita a 11 dígitos (DDD + celular)
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
        value = value.replace(/(\d{5})(\d)/, '$1-$2'); // Coloca hífen entre o quinto e o sexto dígitos
        e.target.value = value;
    });

    // --- LÓGICA DO FORMULÁRIO ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validação de data (não pode ser no passado)
        const dataSelecionada = new Date(document.getElementById('data').value + 'T00:00:00');
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera o horário para comparar apenas a data

        if (dataSelecionada < hoje) {
            alert('A data do atendimento não pode ser no passado. Por favor, escolha uma data futura.');
            return;
        }

        // Coleta os dados do formulário
        const agendamento = {
            nome: document.getElementById('nome').value.trim(),
            telefone: telefoneInput.value.trim(),
            email: document.getElementById('email').value.trim(),
            area: document.getElementById('area').value,
            data: document.getElementById('data').value,
            horario: document.getElementById('horario').value,
            observacoes: document.getElementById('observacoes').value.trim()
        };

        // --- SIMULAÇÃO DE INTEGRAÇÃO COM BACK-END ---
        simularEnvioParaBackend(agendamento);

        // --- ATUALIZAÇÃO DA INTERFACE ---
        mostrarConfirmacao(agendamento);
        adicionarAgendamentoNaAgendaSimulada(agendamento);

        form.reset();
    });

    // --- FUNÇÕES AUXILIARES ---

    /**
     * Simula o envio dos dados para um servidor (e-mail, WhatsApp, etc.).
     * Em um projeto real, aqui seria a chamada fetch() para sua API.
     */
    function simularEnvioParaBackend(dados) {
        console.log('--- 1. DADOS PARA API (Ex: Node.js + Nodemailer) ---');
        console.log('Estes dados seriam enviados via POST para /api/agendamento');
        console.log(dados);

        const mensagemWhatsApp = `Olá! Gostaria de agendar um atendimento.
        - Nome: ${dados.nome}
        - Área: ${dados.area}
        - Data: ${formatarData(dados.data)}
        - Horário: ${dados.horario}`;

        // Número do escritório (substitua pelo número real com código do país)
        const numeroWhatsAppEscritorio = '5511999998888'; 
        const linkWhatsApp = `https://wa.me/${numeroWhatsAppEscritorio}?text=${encodeURIComponent(mensagemWhatsApp)}`;
        document.getElementById('link-whatsapp').href = linkWhatsApp;

        console.log('\n--- 2. LINK WHATSAPP GERADO ---');
        console.log(linkWhatsApp);

        const linkGoogleAgenda = gerarLinkGoogleAgenda(dados);
        document.getElementById('link-google-agenda').href = linkGoogleAgenda;
        console.log('\n--- 3. LINK GOOGLE AGENDA GERADO ---');
        console.log(linkGoogleAgenda);
    }

    /**
     * Exibe a tela de confirmação para o usuário.
     */
    function mostrarConfirmacao(dados) {
        form.classList.add('hidden');
        confirmacaoDiv.classList.remove('hidden');

        resumoDiv.innerHTML = `
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>Área de Interesse:</strong> ${dados.area}</p>
            <p><strong>Data:</strong> ${formatarData(dados.data)}</p>
            <p><strong>Horário:</strong> ${dados.horario}</p>
        `;
    }

    /**
     * Adiciona o novo agendamento na lista visível da "agenda do escritório".
     */
    function adicionarAgendamentoNaAgendaSimulada(dados) {
        agendaEscritorioDiv.classList.remove('hidden');
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${formatarData(dados.data)} às ${dados.horario}h:</strong> ${dados.nome} (Área: ${dados.area})`;
        listaAgendamentosUl.appendChild(listItem);
    }

    /**
     * Gera um link para adicionar o evento ao Google Calendar.
     */
    function gerarLinkGoogleAgenda(dados) {
        const inicioEvento = new Date(`${dados.data}T${dados.horario}:00`);
        // Adiciona 1 hora à hora de início para definir o fim
        const fimEvento = new Date(inicioEvento.getTime() + 60 * 60 * 1000); 

        // Formato ISO 8601 sem hífens e dois pontos (ex: 20240729T140000Z)
        const formatoDataGoogle = (data) => data.toISOString().replace(/-|:|\.\d{3}/g, '');

        const dataInicioUTC = formatoDataGoogle(inicioEvento);
        const dataFimUTC = formatoDataGoogle(fimEvento);

        const titulo = `Consulta Jurídica - ${dados.nome}`;
        const detalhes = `Cliente: ${dados.nome}\nÁrea: ${dados.area}\nTelefone: ${dados.telefone}\nE-mail: ${dados.email}\nObservações: ${dados.observacoes}`;
        const local = "Nosso Escritório - Endereço Completo";

        const url = [
            'https://www.google.com/calendar/render?action=TEMPLATE',
            `&text=${encodeURIComponent(titulo)}`,
            `&dates=${dataInicioUTC}/${dataFimUTC}`,
            `&details=${encodeURIComponent(detalhes)}`,
            `&location=${encodeURIComponent(local)}`
        ].join('');

        return url;
    }

    /**
     * Formata a data de YYYY-MM-DD para DD/MM/YYYY.
     */
    function formatarData(dataString) {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Evento para o botão "Fazer Novo Agendamento"
    novoAgendamentoBtn.addEventListener('click', () => {
        confirmacaoDiv.classList.add('hidden');
        form.classList.remove('hidden');
    });
});
