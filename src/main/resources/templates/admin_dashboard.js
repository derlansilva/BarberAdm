// admin_dashboard.js

class AdminDashboard {
    constructor() {
        // As variáveis globais (DOM elements, configs) viram propriedades da classe
        console.log("estou funcionando ")
        // 1. Variáveis de Layout
        this.body = document.body;
        this.menuToggle = document.getElementById('menu-toggle');
        this.mainHeader = document.getElementById('main-header');
        this.sidebarWidthClosed = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-closed').trim();
        this.sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
        this.contentSections = document.querySelectorAll('.content-section');
        this.mainPageTitle = document.getElementById('main-page-title');

        // 2. Variáveis de Cadastro (Spinner)
        this.modalElementCadastro = document.getElementById('modalCadastroCliente');
        this.cadastroForm = document.getElementById('cadastroFormModal');
        this.spinnerCadastro = document.getElementById('loadingSpinnerCadastro');
        this.resultMessageDiv = document.getElementById('resultMessageCadastro');
        this.modalCadastro = this.modalElementCadastro ? new bootstrap.Modal(this.modalElementCadastro) : null;
        this.TEMPO_ESPERA_SPINNER = 3000;
        this.TEMPO_EXIBICAO_MENSAGEM = 2000;

        // 3. Variáveis de Agendamento (Autocompletar)
        this.inputNomeCliente = document.getElementById('nomeClienteAdmin');
        this.divResultados = document.getElementById('autocompleteResults');
        this.searchTimeout = null; // Inicializado como null
    }

    // Método principal para iniciar todos os listeners e estados
    init() {
        this.setupAutocompletarDiv();
        this.setupNavigation();
        this.setupCadastroForm();
        this.setupAutocompletarLogic();
        this.initialState();
    }

    // --- MÉTODOS (FUNÇÕES) ---

    setupAutocompletarDiv() {
        // Lógica para anexar divResults (Mantida, mas usando this.)
        if (this.inputNomeCliente && this.divResultados && !this.divResultados.parentNode) {
            const parentDiv = this.inputNomeCliente.closest('.mb-3');
            if (parentDiv) {
                parentDiv.appendChild(this.divResultados);
            }
        }
    }

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

    setupNavigation() {
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

    // O restante dos métodos (setupCadastroForm, setupAutocompletarLogic, initialState)
    // devem ser definidos aqui de forma semelhante, usando 'this.' para acessar as propriedades.

    // ... (Seu código do Modal de Cadastro se tornaria o método setupCadastroForm)
    // ... (Seu código de Autocompletar se tornaria o método setupAutocompletarLogic)

    initialState() {
        this.body.classList.remove('sidebar-open');
        this.menuToggle.innerHTML = '<i class="bi bi-list"></i>';
        this.navigateToSection('dashboard-section', 'Dashboard de Gerenciamento');
        this.mainHeader.style.left = this.sidebarWidthClosed;
        this.mainHeader.style.width = `calc(100% - ${this.sidebarWidthClosed})`;
    }
}

// --- Ponto de Entrada Principal ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cria uma instância da classe
    const app = new AdminDashboard();
    // 2. Chama o método de inicialização
    app.init();
});