class AdminDashboard {
    constructor() {
<<<<<<< HEAD
        // --- Componentes de Layout ---
        this.body = document.body;
        this.menuToggle = document.getElementById('menu-toggle');
        this.mainHeader = document.getElementById('main-header');
=======
        // =================================================================
        // 1. INICIALIZAÇÃO DE VARIÁVEIS E COMPONENTES (PROPRIEDADES DA CLASSE)
        // =================================================================
        this.body = document.body;
        this.menuToggle = document.getElementById('menu-toggle');
        this.mainHeader = document.getElementById('main-header');

        // Variáveis de Layout e Sidebar
>>>>>>> 2a9f3f53e7bb266d648c5c60939a4c818fe8e34d
        this.sidebarWidthClosed = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-closed').trim();
        this.sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
        this.contentSections = document.querySelectorAll('.content-section');
        this.mainPageTitle = document.getElementById('main-page-title');

<<<<<<< HEAD
        // --- Modais e Formulários de Cliente ---
        this.cadastroForm = document.getElementById('cadastroFormModal');
        this.modalElementCadastro = document.getElementById('modalCadastroCliente');
=======
        // Modal de Cadastro (SPINNER)
        this.modalElementCadastro = document.getElementById('modalCadastroCliente');
        this.cadastroForm = document.getElementById('cadastroFormModal');
>>>>>>> 2a9f3f53e7bb266d648c5c60939a4c818fe8e34d
        this.spinnerCadastro = document.getElementById('loadingSpinnerCadastro');
        this.resultMessageDiv = document.getElementById('resultMessageCadastro');
        this.messageTitle = document.getElementById('messageTitle');
        this.messageBody = document.getElementById('messageBody');
<<<<<<< HEAD

        // --- Agendamento e Autocomplete ---
=======
        this.modalCadastro = this.modalElementCadastro ? new bootstrap.Modal(this.modalElementCadastro) : null;

        // Modal de Agendamento (AUTOCOMPLETAR)
        this.modalElementAgendamento = document.getElementById('modalNovoAgendamento');
>>>>>>> 2a9f3f53e7bb266d648c5c60939a4c818fe8e34d
        this.agendamentoForm = document.getElementById('agendamentoFormAdmin');
        this.inputNomeCliente = document.getElementById('nomeClienteAdmin');
        this.inputWhatsappAgendamento = document.getElementById('whatsappClienteAgendamento');
        this.divResultados = document.getElementById('autocompleteResults');
<<<<<<< HEAD
        this.selectServico = document.getElementById('selectServicoAgendamento');

        // --- Gestão de Serviços ---
        this.formAdicionarServico = document.getElementById('formAdicionarServico');
        this.modalAdicionarServico = document.getElementById('modalAdicionarServico');
        this.formEditarServico = document.getElementById('formEditarServico');
        this.modalEditarServico = document.getElementById('modalEditarServico');

        this.searchTimeout = null;
        this.TEMPO_ESPERA_SPINNER = 2000;
    }

    // --- Auxiliar para substituir o confirm() nativo por Modal ---
    pedirConfirmacao(titulo, mensagem, corBotao = 'btn-primary') {
        return new Promise((resolve) => {
            const modalEl = document.getElementById('modalConfirmacaoAcao');
            const btnConfirmar = document.getElementById('btnConfirmarAcao');

            document.getElementById('confirmModalTitle').textContent = titulo;
            document.getElementById('confirmModalMessage').textContent = mensagem;

            btnConfirmar.className = `btn ${corBotao} px-4`;

            const modal = new bootstrap.Modal(modalEl);
            modal.show();

            const handleConfirm = () => {
                modal.hide();
                btnConfirmar.removeEventListener('click', handleConfirm);
                resolve(true);
            };

            btnConfirmar.addEventListener('click', handleConfirm);

            modalEl.addEventListener('hidden.bs.modal', () => {
                btnConfirmar.removeEventListener('click', handleConfirm);
                resolve(false);
            }, { once: true });
        });
    }

    getBadgeClass(status) {
        const classes = {
            'PENDENTE': 'bg-warning text-dark',
            'CONFIRMADO': 'bg-success',
            'CONCLUIDO': 'bg-info',
            'CANCELADO': 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    // =================================================================
    // 1. NAVEGAÇÃO E LAYOUT
    // =================================================================
    navigateToSection(targetId, title) {
        this.contentSections.forEach(section => { section.style.display = 'none'; });
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.style.display = 'block';
        this.mainPageTitle.textContent = title;
        this.sidebarLinks.forEach(link => {
            link.classList.toggle('active-menu', link.getAttribute('data-target') === targetId);
=======
        this.searchTimeout = null;

        // Catálogo de Serviços
        this.btnEditarServico = document.querySelectorAll('.btn-editar-servico');
        this.formAdicionarServico = document.getElementById('formAdicionarServico');
        this.formEditarServico = document.getElementById('formEditarServico');


        // Configurações de Tempo
        this.TEMPO_ESPERA_SPINNER = 3000;
        this.TEMPO_EXIBICAO_MENSAGEM = 2000;
    }

    // --- MÉTODOS DE UTILIDADE ---

    navigateToSection(targetId, title) {
        this.contentSections.forEach(section => { section.style.display = 'none'; });
        const targetSection = document.getElementById(targetId);
        if (targetSection) { targetSection.style.display = 'block'; }
        this.mainPageTitle.textContent = title;
        this.sidebarLinks.forEach(link => {
            link.classList.remove('active-menu');
            if (link.getAttribute('data-target') === targetId) { link.classList.add('active-menu'); }
>>>>>>> 2a9f3f53e7bb266d648c5c60939a4c818fe8e34d
        });
    }

    toggleSidebar() {
        const sidebarWidthOpen = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-open').trim();
<<<<<<< HEAD
        const isOpen = this.body.classList.toggle('sidebar-open');
        this.menuToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
        this.mainHeader.style.left = isOpen ? sidebarWidthOpen : this.sidebarWidthClosed;
        this.mainHeader.style.width = `calc(100% - ${isOpen ? sidebarWidthOpen : this.sidebarWidthClosed})`;
    }

    setupNavigationListeners() {
        this.menuToggle.onclick = () => this.toggleSidebar();
        this.sidebarLinks.forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                this.navigateToSection(link.getAttribute('data-target'), link.innerText.trim());
            };
        });
    }

    // =================================================================
    // 2. GESTÃO DE SERVIÇOS
    // =================================================================
    async loadServicesTable() {
        const tableBody = document.getElementById('listaServicosTabela');
        if (!tableBody) return;
        try {
            const response = await fetch('/findAll/services');
            const services = await response.json();
            tableBody.innerHTML = '';
            services.forEach(service => {
                tableBody.insertAdjacentHTML('beforeend', `
                    <tr data-id="${service.id}">
                        <td>${service.name}</td>
                        <td>R$ ${service.price.toFixed(2).replace('.', ',')}</td>
                        <td>${service.time} min</td>
                        <td>
                            <button class="btn btn-sm btn-outline-info me-2" onclick="app.prepareEditService(this)"><i class="bi bi-pencil-square"></i> Editar</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="app.deleteService(${service.id})"><i class="bi bi-trash"></i> Remover</button>
                        </td>
                    </tr>`);
            });
        } catch (error) { console.error('Erro serviços:', error); }
    }

    async loadServicesIntoSelect() {
        if (!this.selectServico) return;
        try {
            const response = await fetch('/findAll/services');
            const services = await response.json();
            this.selectServico.innerHTML = '<option value="" selected disabled>Selecione um serviço...</option>';
            services.forEach(s => {
                this.selectServico.insertAdjacentHTML('beforeend', `<option value="${s.id}">${s.name} - R$ ${s.price.toFixed(2)}</option>`);
            });
        } catch (e) { console.error(e); }
    }

    setupServiceManagement() {
        if (!this.formAdicionarServico) return;
        this.formAdicionarServico.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = this.formAdicionarServico.querySelector('button[type="submit"]');
            const params = new URLSearchParams(new FormData(event.target)).toString();
            submitButton.disabled = true;
            submitButton.innerHTML = 'Salvando...';
            try {
                const response = await fetch('/register/service', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params
                });
                if (response.ok) {
                    bootstrap.Modal.getInstance(this.modalAdicionarServico).hide();
                    this.formAdicionarServico.reset();
                    this.loadServicesTable();
                    this.loadServicesIntoSelect();
                }
            } catch (e) { alert("Erro na conexão."); } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Salvar Serviço';
            }
        });
    }

    prepareEditService(button) {
        const row = button.closest('tr');
        document.getElementById('servicoIdEditar').value = row.dataset.id;
        document.getElementById('nomeServicoEditar').value = row.cells[0].textContent;
        document.getElementById('precoServicoEditar').value = row.cells[1].textContent.replace('R$ ', '').replace(',', '.');
        document.getElementById('duracaoServicoEditar').value = row.cells[2].textContent.replace(' min', '');
        new bootstrap.Modal(this.modalEditarServico).show();
    }

    async deleteService(id) {
        const confirmado = await this.pedirConfirmacao('Remover Serviço', 'Deseja realmente remover este serviço permanentemente?', 'btn-danger');
        if (!confirmado) return;
        try {
            await fetch(`/api/services/delete/${id}`, { method: 'DELETE' });
            this.loadServicesTable();
            this.loadServicesIntoSelect();
        } catch (e) { alert("Erro ao deletar."); }
    }

    // =================================================================
    // 3. GESTÃO DE CLIENTES E CADASTRO
    // =================================================================
    setupCadastroForm() {
        if (!this.cadastroForm) return;
        this.modalElementCadastro.addEventListener('show.bs.modal', () => {
            this.cadastroForm.style.display = 'block';
            this.spinnerCadastro.style.display = 'none';
            this.resultMessageDiv.style.display = 'none';
            this.cadastroForm.reset();
        });
        this.cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const params = new URLSearchParams(new FormData(event.target)).toString();
            this.cadastroForm.style.display = 'none';
            this.spinnerCadastro.style.display = 'flex';
            try {
                const response = await fetch('/register/client', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params
                });
                const isSuccess = response.ok;
                const message = await response.text();
                setTimeout(() => {
                    this.spinnerCadastro.style.display = 'none';
                    this.messageTitle.textContent = isSuccess ? "✅ Sucesso!" : "❌ Erro!";
                    this.messageBody.textContent = message;
                    this.resultMessageDiv.style.display = 'flex';
                    if(isSuccess) setTimeout(() => bootstrap.Modal.getInstance(this.modalElementCadastro).hide(), 1500);
                }, 1000);
            } catch (e) { alert("Erro de conexão."); }
        });
    }

    setupAutocompleteAgendamento() {
        if (!this.inputNomeCliente || !this.divResultados) return;
        this.inputNomeCliente.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            const termo = this.inputNomeCliente.value.trim();
            if (termo.length < 2) { this.divResultados.style.display = 'none'; return; }
            this.searchTimeout = setTimeout(async () => {
                try {
                    const response = await fetch(`/api/find?termo=${encodeURIComponent(termo)}`);
                    const clientes = await response.json();
                    this.divResultados.innerHTML = '';
                    if (clientes.length > 0) {
                        clientes.forEach(c => {
                            const btn = document.createElement('button');
                            btn.className = 'list-group-item list-group-item-action';
                            btn.textContent = `${c.name} (${c.whatsapp})`;
                            btn.onclick = () => {
                                this.inputNomeCliente.value = c.name;
                                if(this.inputWhatsappAgendamento) this.inputWhatsappAgendamento.value = c.whatsapp;
                                this.divResultados.style.display = 'none';
                            };
                            this.divResultados.appendChild(btn);
                        });
                        this.divResultados.style.display = 'block';
                    }
                } catch (e) { console.error(e); }
            }, 300);
        });
    }

    // =================================================================
    // 4. AGENDAMENTOS E GANHOS (DASHBOARD)
    // =================================================================
    async loadTodayAppointments() {
        const tableBody = document.querySelector('#dashboard-section table tbody');
        if (!tableBody) return;
        try {
            const response = await fetch('/api/appointments/today');
            const appointments = await response.json();
            tableBody.innerHTML = '';
            appointments.forEach(appo => {
                const time = new Date(appo.appointmentTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const badgeClass = this.getBadgeClass(appo.status);
                tableBody.insertAdjacentHTML('beforeend', `
                    <tr>
                        <td>${time}</td>
                        <td><span class="cliente-link">${appo.client.name}</span></td>
                        <td>${appo.service.name}</td>
                        <td><span class="badge ${badgeClass}">${appo.status}</span></td>
                        <td>
                            ${appo.status !== 'CONCLUIDO' ?
                                `<button class="btn btn-sm btn-outline-primary" onclick="app.alterarStatus(${appo.id}, 'CONCLUIDO')" title="Concluir"><i class="bi bi-check-lg"></i></button>` :
                                `<i class="bi bi-check-circle-fill text-info"></i>`
                            }
                            <button class="btn btn-sm btn-outline-danger" onclick="app.alterarStatus(${appo.id}, 'CANCELADO')"><i class="bi bi-x-lg"></i></button>
                        </td>
                    </tr>`);
            });
            const counter = document.querySelector('.card.bg-warning .text-huge');
            if (counter) counter.textContent = appointments.length;
            this.loadDashboardStats(); // Atualiza ganhos sempre que carregar lista
        } catch (e) { console.error(e); }
    }

    async alterarStatus(id, novoStatus) {
        const titulo = novoStatus === 'CONCLUIDO' ? 'Finalizar Serviço' : 'Cancelar Agendamento';
        const msg = novoStatus === 'CONCLUIDO' ? 'Deseja finalizar este serviço e somar o valor aos ganhos?' : 'Deseja realmente cancelar este agendamento?';
        const corBtn = novoStatus === 'CONCLUIDO' ? 'btn-success' : 'btn-danger';

        const confirmado = await this.pedirConfirmacao(titulo, msg, corBtn);
        if(!confirmado) return;

        try {
            const response = await fetch(`/api/appointments/${id}/status?status=${novoStatus}`, { method: 'PUT' });
            if (response.ok) {
                await this.loadTodayAppointments();
                document.getElementById('btnAplicarFiltro')?.click();
            }
        } catch (e) { alert("Erro ao atualizar status."); }
    }

    // =================================================================
    // 5. FINANCEIRO REAL
    // =================================================================
   async loadDashboardStats() {
       try {
           // A URL deve ser EXATAMENTE esta para bater com o Controller acima
           const response = await fetch('/api/appointments/dashboard/stats');
           const stats = await response.json();

           // Seletor exato do seu HTML para o card de Ganhos
           const ganhosElement = document.querySelector('.card-ganhos .text-huge');

           if (ganhosElement) {
               // Formata o valor real vindo do banco (ex: 150.00 -> R$ 150,00)
               ganhosElement.textContent = stats.ganhosMes.toLocaleString('pt-BR', {
                   style: 'currency',
                   currency: 'BRL'
               });
           }
       } catch (e) {
           console.error("Erro ao carregar soma real:", e);
       }
   }

    // =================================================================
    // 6. FILTROS
    // =================================================================
    setupFiltroAgendamentos() {
        const btn = document.getElementById('btnAplicarFiltro');
        if (!btn) return;
        btn.addEventListener('click', async () => {
            const data = document.getElementById('filtroData').value;
            const status = document.getElementById('filtroStatus').value;
            const cliente = document.getElementById('filtroCliente').value;
            try {
                const response = await fetch(`/api/appointments/filter?data=${data}&status=${status}&cliente=${cliente}`);
                const agendamentos = await response.json();
                this.renderizarTabelaFiltro(agendamentos);
            } catch (e) { console.error(e); }
        });
    }

    renderizarTabelaFiltro(agendamentos) {
        const tableBody = document.querySelector('#agendamentos-section table tbody');
        if (!tableBody) return;
        tableBody.innerHTML = agendamentos.length === 0 ? '<tr><td colspan="7" class="text-center">Sem resultados.</td></tr>' : '';
        agendamentos.forEach(appo => {
            const time = new Date(appo.appointmentTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            tableBody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td>${appo.id}</td>
                    <td>${time}</td>
                    <td>${appo.client.name}</td>
                    <td>${appo.service.name}</td>
                    <td>R$ ${appo.service.price.toFixed(2)}</td>
                    <td><span class="badge ${this.getBadgeClass(appo.status)}">${appo.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-info"><i class="bi bi-eye"></i></button>
                        ${appo.status !== 'CONCLUIDO' ? `<button class="btn btn-sm btn-success" onclick="app.alterarStatus(${appo.id}, 'CONCLUIDO')"><i class="bi bi-check-lg"></i> Concluir</button>` : ''}
                    </td>
                </tr>`);
        });
    }

    setupBookingSubmission() {
        if (!this.agendamentoForm) return;
        this.agendamentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                nome: document.getElementById('nomeClienteAdmin').value,
                servico: document.getElementById('selectServicoAgendamento').value,
                data: document.getElementById('dataAgendamento').value,
                hora: document.getElementById('horaAgendamento').value
            };
            try {
                const response = await fetch('/api/appointments/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data).toString()
                });
                if (response.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('modalAgendamento')).hide();
                    this.agendamentoForm.reset();
                    this.loadTodayAppointments();
                }
            } catch (e) { alert("Erro ao agendar."); }
        });
    }

    init() {
        this.setupNavigationListeners();
        this.setupCadastroForm();
        this.setupAutocompleteAgendamento();
        this.setupServiceManagement();
        this.loadServicesTable();
        this.loadServicesIntoSelect();
        this.setupBookingSubmission();
        this.loadTodayAppointments();
        this.setupFiltroAgendamentos();
        this.loadDashboardStats();
        this.navigateToSection('dashboard-section', 'Dashboard de Gerenciamento');
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    if (typeof app === 'undefined') {
        app = new AdminDashboard();
        app.init();
    }
=======
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

                    setTimeout(() => {
                        this.modalCadastro.hide();
                        window.location.href = '/admin';
                    }, this.TEMPO_EXIBICAO_MENSAGEM);

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
        if (this.formAdicionarServico) {
            this.formAdicionarServico.addEventListener('submit', (event) => {
                this.handleFormSubmit(event, '/servicos/adicionar', 'Novo serviço adicionado!', document.getElementById('modalAdicionarServico'));
            });
        }

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

setupModalDetalhesLoader() {
    const modalDetalhesElement = document.getElementById('modalClienteDetalhes');

    if (modalDetalhesElement) {
        modalDetalhesElement.addEventListener('show.bs.modal', (event) => {

            // Descobre qual TR disparou o modal
            const relatedTarget = event.relatedTarget;

            // Verifica se o alvo é a linha do cliente (tr)
            if (relatedTarget && relatedTarget.classList.contains('cliente-row')) {
                const row = relatedTarget;
                const clienteId = row.dataset.clienteId;
                const nome = row.dataset.nome;
                const whatsapp = row.dataset.whatsapp;
                const cortes = parseInt(row.dataset.cortes);

                // Em Produção: FETCH para carregar o histórico completo (GET /api/clientes/{clienteId})

                // Atualizar o Título e Dados do Modal
                document.getElementById('modalClienteDetalhesLabel').innerHTML = `<i class="bi bi-person-fill"></i> Detalhes do Cliente: ${nome}`;

                // Lógica de Fidelidade
                const progresso = (cortes / 10) * 100;

                // Preencher o conteúdo do modal
                // ATENÇÃO: Os IDs no modal de detalhes devem existir
                if(document.getElementById('cortesAtuais')) {
                    document.getElementById('cortesAtuais').textContent = `${cortes} de 10`;
                }
                // ... (preencher o restante dos dados do modal com o progresso) ...
            }
        });
    }
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
        this.setupModalDetalhesLoader()
    }
}

// --- Ponto de Entrada Principal ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cria uma instância da classe
    const app = new AdminDashboard();
    // 2. Chama o método de inicialização
    app.init();
>>>>>>> 2a9f3f53e7bb266d648c5c60939a4c818fe8e34d
});