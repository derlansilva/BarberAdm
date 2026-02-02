class AdminDashboard {
    constructor() {
        // =================================================================
        // 1. INICIALIZAÇÃO DE VARIÁVEIS E COMPONENTES (PROPRIEDADES DA CLASSE)
        // =================================================================
        this.body = document.body;
        this.menuToggle = document.getElementById('menu-toggle');
        this.mainHeader = document.getElementById('main-header');

        // Variáveis de Layout e Sidebar
        this.sidebarWidthClosed = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-closed').trim();
        this.sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
        this.contentSections = document.querySelectorAll('.content-section');
        this.mainPageTitle = document.getElementById('main-page-title');

        // Modal de Cadastro (SPINNER)
        this.modalElementCadastro = document.getElementById('modalCadastroCliente');
        this.cadastroForm = document.getElementById('cadastroFormModal');
        this.spinnerCadastro = document.getElementById('loadingSpinnerCadastro');
        this.resultMessageDiv = document.getElementById('resultMessageCadastro');
        this.messageTitle = document.getElementById('messageTitle');
        this.messageBody = document.getElementById('messageBody');
        this.modalCadastro = this.modalElementCadastro ? new bootstrap.Modal(this.modalElementCadastro) : null;

        // Modal de Agendamento (AUTOCOMPLETAR)
        this.modalElementAgendamento = document.getElementById('modalNovoAgendamento');
        this.agendamentoForm = document.getElementById('agendamentoFormAdmin');
        this.inputNomeCliente = document.getElementById('nomeClienteAdmin');
        this.inputWhatsappAgendamento = document.getElementById('whatsappClienteAgendamento');
        this.divResultados = document.getElementById('autocompleteResults');
        this.searchTimeout = null;

        // Catálogo de Serviços
        this.btnEditarServico = document.querySelectorAll('.btn-editar-servico');
        this.formAdicionarServico = document.getElementById('formAdicionarServico');
        this.formEditarServico = document.getElementById('formEditarServico');
        // NOVO: Adiciona o ID do Modal de Adicionar Serviço
        this.modalAdicionarServico = document.getElementById('modalAdicionarServico');


        // Configurações de Tempo
        this.TEMPO_ESPERA_SPINNER = 3000;
        this.TEMPO_EXIBICAO_MENSAGEM = 2000;
    }

    // --- MÉTODOS DE UTILIDADE ---
    // ... (navigateToSection e toggleSidebar permanecem iguais) ...
    navigateToSection(targetId, title) {
        this.contentSections.forEach(section => { section.style.display = 'none'; });
        const targetSection = document.getElementById(targetId);
        if (targetSection) { targetSection.style.display = 'block'; }
        this.mainPageTitle.textContent = title;
        this.sidebarLinks.forEach(link => {
            link.classList.remove('active-menu');
            if (link.getAttribute('data-target') === targetId) { link.classList.add('active-menu'); }
        });
    }

    toggleSidebar() {
        const sidebarWidthOpen = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-open').trim();
        const isClosed = !this.body.classList.contains('sidebar-open');

        if (isClosed) {
            this.body.classList.add('sidebar-open');
            this.menuToggle.innerHTML = '<i class="bi bi-x-lg"></i>';
            this.mainHeader.style.left = sidebarWidthOpen;
            this.mainHeader.style.width = `calc(100% - ${sidebarWidthOpen})`;
        } else {
            this.body.classList.remove('sidebar-open');
            this.menuToggle.innerHTML = '<i class="bi bi-list"></i>';
            this.mainHeader.style.left = this.sidebarWidthClosed;
            this.mainHeader.style.width = `calc(100% - ${this.sidebarWidthClosed})`;
        }
    }

    // Função genérica para submissão de formulários (simulação)
    // MANTIDA, MAS NÃO SERÁ USADA PARA NOVO SERVIÇO
    handleFormSubmit(event, endpoint, successMessage, modalElement) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const params = new URLSearchParams(formData).toString();

        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        console.log(`Enviando dados para ${endpoint}:`, params);

        // Simulação de Fetch (Substituir pelo Fetch real em produção)
        setTimeout(() => {
            alert(successMessage);
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
            window.location.reload();
        }, 1000);
    }

    // --- SETUP PRINCIPAL ---

    // ... (setupCadastroForm e setupAutocompletar permanecem iguais) ...
    setupCadastroForm() {
        if (!this.cadastroForm || !this.modalElementCadastro) return;

        this.cadastroForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const params = new URLSearchParams(formData).toString();

            this.cadastroForm.style.display = 'none';
            this.spinnerCadastro.style.display = 'flex';
            const submitButton = this.cadastroForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            const startTime = Date.now();

            fetch('/cadastrar', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params })
            .then(response => { return Promise.all([response.ok, response.text()]); })
            .then(([isSuccess, message]) => {

                const remainingDelay = Math.max(0, this.TEMPO_ESPERA_SPINNER - (Date.now() - startTime));

                setTimeout(() => {
                    this.spinnerCadastro.style.display = 'none';

                     if (isSuccess) {
                        messageTitle.textContent = "✅ Cliente Cadastrado!";
                        messageTitle.className = 'text-success text-center';
                    }
                    else {
                        messageTitle.textContent = "❌ Falha no Cadastro!";
                        messageTitle.className = 'text-danger text-center';
                    }

                    this.messageBody.textContent = message;
                    this.resultMessageDiv.style.display = 'flex';
                }, remainingDelay);
            })
            .catch(error => {
                // ... (lógica de erro)
            });
        });

        // Eventos do Modal (show/hidden)
        this.modalElementCadastro.addEventListener('show.bs.modal', () => {
            this.cadastroForm.reset();
            this.spinnerCadastro.style.display = 'none';
            this.resultMessageDiv.style.display = 'none';
            this.cadastroForm.style.display = 'block';
            this.cadastroForm.querySelector('button[type="submit"]').disabled = false;
        });
        this.modalElementCadastro.addEventListener('hidden.bs.modal', () => {
            this.cadastroForm.reset();
            this.spinnerCadastro.style.display = 'none';
            this.resultMessageDiv.style.display = 'none';
            this.cadastroForm.style.display = 'block';
            this.cadastroForm.querySelector('button[type="submit"]').disabled = false;
        });
    }

    setupAutocompletar() {
        if (!this.inputNomeCliente || !this.divResultados) return;

        // Setup Autocompletar: Anexar divResults
        if (!this.divResultados.parentNode) {
            const parentDiv = this.inputNomeCliente.closest('.mb-3');
            if (parentDiv) {
                parentDiv.appendChild(this.divResultados);
            }
        }

        this.inputNomeCliente.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            const termo = this.inputNomeCliente.value.trim();

            if (termo.length < 2) { this.divResultados.style.display = 'none'; return; }

            this.searchTimeout = setTimeout(() => {
                fetch(`/api/find?termo=${encodeURIComponent(termo)}`)
                    .then(response => {
                        if (!response.ok) { throw new Error('Falha na API: ' + response.status); }
                        return response.json();
                    })
                    .then(clientes => {
                        this.divResultados.innerHTML = '';
                        if (Array.isArray(clientes) && clientes.length > 0) {
                            clientes.forEach(cliente => {
                                const item = document.createElement('a');
                                item.href = '#';
                                item.className = 'list-group-item list-group-item-action';
                                item.textContent = `${cliente.nome} (${cliente.whatsapp})`;
                                item.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    this.inputNomeCliente.value = cliente.nome;
                                    this.inputWhatsappAgendamento.value = cliente.whatsapp; // Salva o WhatsApp
                                    this.divResultados.style.display = 'none';
                                });
                                this.divResultados.appendChild(item);
                            });
                            this.divResultados.style.display = 'block';
                        } else { this.divResultados.style.display = 'none'; }
                    })
                    .catch(error => { /* ... lógica de erro ... */ });
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (e.target !== this.inputNomeCliente && e.target.parentNode !== this.divResultados) {
                this.divResultados.style.display = 'none';
            }
        });
    }

    setupAgendamentoForm() {
        if (!this.agendamentoForm || !this.modalElementAgendamento) return;

        this.agendamentoForm.addEventListener('submit', (event) => {
            // Usa o handleFormSubmit genérico
            this.handleFormSubmit(event, '/agendar', 'Agendamento confirmado com sucesso!', this.modalElementAgendamento);
        });
    }

    setupServiceManagement() {
    console.log("testando se entrou na função ")
        // LÓGICA DE CADASTRO DE NOVO SERVIÇO (REESCRITA PARA USAR FETCH JSON)
        if (!this.formAdicionarServico) return;
        this.formAdicionarServico.addEventListener('submit', (event) => {

            console.log("testando se entrou no form")
            event.preventDefault();

            const form = event.target;
            const submitButton = form.querySelector('button[type="submit"]');

            // Desabilitar botão e mostrar status de envio
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';

            // 1. Coletar os dados do formulário

            const formData = new FormData(form);


           const formData1 = new FormData(event.target);
           const params1 = new URLSearchParams(formData1).toString();


            fetch('/service', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params1 })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                // Se houver erro no servidor, lança uma exceção
                return response.text().then(text => { throw new Error(`Status ${response.status}: ${text}`); });
            })
            .then(data => {
                // Sucesso no cadastro
                alert(`Serviço "${data.nome}" cadastrado com sucesso! Preço: R$ ${data.preco.toFixed(2).replace('.', ',')}`);

                form.reset(); // Limpa o formulário

                // Fechar modal e recarregar a lista (melhor prática)
                if (this.modalAdicionarServico) {
                    const modalInstance = bootstrap.Modal.getInstance(this.modalAdicionarServico);
                    if (modalInstance) modalInstance.hide();
                }
                window.location.reload(); // Recarrega a página para atualizar a lista
            })
            .catch(error => {
                console.error('Erro no Cadastro de Serviço:', error);
                alert(`Falha no cadastro de serviço!\nDetalhes: ${error.message}`);
            })
            .finally(() => {
                // Reabilita o botão
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="bi bi-save"></i> Salvar Serviço';
            });
        });


        // --- CONTINUAÇÃO DA LÓGICA DE EDIÇÃO E REMOÇÃO ---
        if (this.formEditarServico) {
            this.formEditarServico.addEventListener('submit', (event) => {
                this.handleFormSubmit(event, '/servicos/atualizar', 'Serviço atualizado com sucesso!', document.getElementById('modalEditarServico'));
            });
        }

        // Lógica para preencher o modal de edição ao clicar no botão
        this.btnEditarServico.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.currentTarget.closest('tr');
                const serviceId = row.dataset.id;

                // Simulação de preenchimento do modal (necessário AJAX em produção)
                document.getElementById('servicoIdEditar').value = serviceId;
                document.getElementById('nomeServicoEditar').value = row.cells[0].textContent;
                document.getElementById('precoServicoEditar').value = row.cells[1].textContent.replace('R$ ', '').replace(',', '.');
            });
        });

        // Lógica de REMOÇÃO (simulação)
        document.querySelectorAll('.btn-remover-servico').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm(`Tem certeza que deseja remover este serviço?`)) {
                    e.currentTarget.closest('tr').remove();
                }
            });
        });
    }

    setupNavigationListeners() {
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());

        this.sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                if (targetId) {
                    e.preventDefault();
                    let title = "Dashboard de Gerenciamento";
                    if (targetId === 'agendamentos-section') { title = "Lista Completa de Agendamentos"; }
                    else if (targetId === 'servicos-section') { title = "Catálogo de Serviços e Preços"; }
                    else if (targetId === 'fidelidade-section') { title = "Clientes e Controle de Fidelidade"; }
                    this.navigateToSection(targetId, title);
                }
            });
        });
    }

    initialState() {
        this.body.classList.remove('sidebar-open');
        this.menuToggle.innerHTML = '<i class="bi bi-list"></i>';
        this.navigateToSection('dashboard-section', 'Dashboard de Gerenciamento');
        this.mainHeader.style.left = this.sidebarWidthClosed;
        this.mainHeader.style.width = `calc(100% - ${this.sidebarWidthClosed})`;
    }

    // --- MÉTODO INIT PRINCIPAL ---
    init() {
        this.setupCadastroForm();
        this.setupAutocompletar();
        this.setupAgendamentoForm();
        this.setupServiceManagement();
        this.setupNavigationListeners();
        this.initialState();
    }
}

// --- Ponto de Entrada Principal ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cria uma instância da classe
    const app = new AdminDashboard();
    // 2. Chama o método de inicialização
    app.init();
});