class AdminDashboard {
    constructor() {
        // --- Componentes de Layout ---
        this.body = document.body;
        this.menuToggle = document.getElementById('menu-toggle');
        this.mainHeader = document.getElementById('main-header');
        this.sidebarWidthClosed = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-closed').trim();
        this.sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
        this.contentSections = document.querySelectorAll('.content-section');
        this.mainPageTitle = document.getElementById('main-page-title');

        // --- Modais e Formulários de Cliente ---
        this.cadastroForm = document.getElementById('cadastroFormModal');
        this.modalElementCadastro = document.getElementById('modalCadastroCliente');
        this.spinnerCadastro = document.getElementById('loadingSpinnerCadastro');
        this.resultMessageDiv = document.getElementById('resultMessageCadastro');
        this.messageTitle = document.getElementById('messageTitle');
        this.messageBody = document.getElementById('messageBody');

        // --- Agendamento e Autocomplete ---
        this.agendamentoForm = document.getElementById('agendamentoFormAdmin');
        this.inputNomeCliente = document.getElementById('nomeClienteAdmin');
        this.inputWhatsappAgendamento = document.getElementById('whatsappClienteAgendamento');
        this.divResultados = document.getElementById('autocompleteResults');
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
        });
    }

    toggleSidebar() {
        const sidebarWidthOpen = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-open').trim();
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
});