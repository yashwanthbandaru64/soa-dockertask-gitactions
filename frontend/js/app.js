/**
 * Main Application Logic
 * Coordinates UI events, API calls, state rendering, and user feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        records: [],
        filterQuery: '',
        filterStatus: 'all',
        isLoading: false,
        backendOnline: false,
        pendingDeleteId: null,
        pendingDeleteName: ''
    };

    // DOM Elements - Views
    const viewRecords = document.getElementById('view-records');
    const viewAdd = document.getElementById('view-add');
    const navLinks = document.querySelectorAll('.nav-switch');

    // DOM Elements - Table & Lists
    const tableBody = document.getElementById('recordsTableBody');
    const recordsLoading = document.getElementById('recordsLoading');
    const recordsEmpty = document.getElementById('recordsEmpty');
    const recordsError = document.getElementById('recordsError');
    const recordsErrorMessage = document.getElementById('recordsErrorMessage');
    const recordsTableContainer = document.getElementById('recordsTableContainer');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    // DOM Elements - Stats
    const statTotal = document.getElementById('statTotal');
    const statWorking = document.getElementById('statWorking');
    const statRepair = document.getElementById('statRepair');
    const statCost = document.getElementById('statCost');

    // DOM Elements - Add Form
    const addEquipmentForm = document.getElementById('addEquipmentForm');
    const addNameInput = document.getElementById('addEquipmentName');
    const addBrandInput = document.getElementById('addBrand');
    const addCostInput = document.getElementById('addPurchaseCost');
    const addWorkingInput = document.getElementById('addWorking');
    const addSubmitBtn = document.getElementById('addSubmitBtn');
    const addResetBtn = document.getElementById('addResetBtn');

    // DOM Elements - Edit Modal
    const editModalEl = document.getElementById('editModal');
    const editModal = editModalEl ? new bootstrap.Modal(editModalEl) : null;
    const editForm = document.getElementById('editEquipmentForm');
    const editIdInput = document.getElementById('editId');
    const editNameInput = document.getElementById('editEquipmentName');
    const editBrandInput = document.getElementById('editBrand');
    const editCostInput = document.getElementById('editPurchaseCost');
    const editWorkingInput = document.getElementById('editWorking');
    const editSubmitBtn = document.getElementById('editSubmitBtn');

    // DOM Elements - Delete Modal
    const deleteModalEl = document.getElementById('deleteModal');
    const deleteModal = deleteModalEl ? new bootstrap.Modal(deleteModalEl) : null;
    const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
    const deleteItemNameEl = document.getElementById('deleteItemName');
    const deleteItemIdEl = document.getElementById('deleteItemId');

    // DOM Elements - Backend & Settings
    const connectionBadge = document.getElementById('connectionBadge');
    const connectionText = document.getElementById('connectionText');
    const connectionDot = document.getElementById('connectionDot');
    const backendSettingsModalEl = document.getElementById('backendSettingsModal');
    const backendSettingsModal = backendSettingsModalEl ? new bootstrap.Modal(backendSettingsModalEl) : null;
    const backendUrlInput = document.getElementById('backendUrlInput');
    const saveBackendUrlBtn = document.getElementById('saveBackendUrlBtn');
    const resetBackendUrlBtn = document.getElementById('resetBackendUrlBtn');
    const refreshRecordsBtn = document.getElementById('refreshRecordsBtn');
    const retryLoadBtn = document.getElementById('retryLoadBtn');

    // Toast elements
    const appToastEl = document.getElementById('appToast');
    const appToast = appToastEl ? new bootstrap.Toast(appToastEl, { delay: 4000 }) : null;
    const toastBody = document.getElementById('toastBody');
    const toastTitle = document.getElementById('toastTitle');
    const toastIcon = document.getElementById('toastIcon');

    // =========================================================================
    // UI Helpers (Notifications, Formats)
    // =========================================================================

    function showToast(message, type = 'success', title = '') {
        if (!appToastEl) return;
        toastBody.textContent = message;
        appToastEl.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning', 'text-bg-info');

        if (type === 'success') {
            appToastEl.classList.add('text-bg-success');
            toastTitle.textContent = title || 'Success';
            toastIcon.className = 'bi bi-check-circle-fill me-2';
        } else if (type === 'danger' || type === 'error') {
            appToastEl.classList.add('text-bg-danger');
            toastTitle.textContent = title || 'Error';
            toastIcon.className = 'bi bi-exclamation-triangle-fill me-2';
        } else if (type === 'warning') {
            appToastEl.classList.add('text-bg-warning');
            toastTitle.textContent = title || 'Warning';
            toastIcon.className = 'bi bi-exclamation-circle-fill me-2';
        } else {
            appToastEl.classList.add('text-bg-info');
            toastTitle.textContent = title || 'Notice';
            toastIcon.className = 'bi bi-info-circle-fill me-2';
        }
        appToast.show();
    }

    function formatCurrency(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    // =========================================================================
    // Navigation / View Switching
    // =========================================================================

    function switchView(targetViewId) {
        // Toggle view containers
        if (targetViewId === 'records') {
            viewRecords.classList.remove('d-none');
            viewAdd.classList.add('d-none');
            loadRecords(); // Auto-refresh when opening records view
        } else if (targetViewId === 'add') {
            viewRecords.classList.add('d-none');
            viewAdd.classList.remove('d-none');
            // Reset validation and autofocus
            window.Validation.resetFormStatus(addEquipmentForm);
            setTimeout(() => addNameInput.focus(), 150);
        }

        // Update nav active states
        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetViewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (target) switchView(target);
        });
    });

    // Quick shortcut button inside header
    document.querySelectorAll('.btn-switch-add').forEach(btn => {
        btn.addEventListener('click', () => switchView('add'));
    });

    // =========================================================================
    // Backend Health & Connectivity
    // =========================================================================

    async function checkBackendHealth() {
        connectionText.textContent = 'Connecting...';
        connectionDot.className = 'status-dot';
        try {
            await window.API.checkHealth();
            state.backendOnline = true;
            connectionText.textContent = 'Backend Online (Port 8081)';
            connectionDot.className = 'status-dot online';
            connectionBadge.className = 'connection-badge bg-success-subtle text-success border border-success-subtle';
        } catch (err) {
            state.backendOnline = false;
            connectionText.textContent = 'Backend Offline';
            connectionDot.className = 'status-dot offline';
            connectionBadge.className = 'connection-badge bg-danger-subtle text-danger border border-danger-subtle';
        }
    }

    // Open Backend URL modal on badge click
    connectionBadge.addEventListener('click', () => {
        backendUrlInput.value = window.CONFIG.getApiBase();
        backendSettingsModal.show();
    });

    saveBackendUrlBtn.addEventListener('click', () => {
        const newUrl = backendUrlInput.value.trim();
        if (newUrl) {
            window.CONFIG.setApiBase(newUrl);
            backendSettingsModal.hide();
            showToast('Backend URL updated to ' + newUrl, 'info');
            updateSwaggerLink();
            checkBackendHealth();
            loadRecords();
        }
    });

    resetBackendUrlBtn.addEventListener('click', () => {
        window.CONFIG.resetApiBase();
        backendUrlInput.value = window.CONFIG.DEFAULT_API_BASE;
        updateSwaggerLink();
        showToast('Reset to default URL: ' + window.CONFIG.DEFAULT_API_BASE, 'info');
    });

    // =========================================================================
    // Records Management (Fetch, Filter, Render)
    // =========================================================================

    async function loadRecords() {
        state.isLoading = true;
        renderLoadingState();

        try {
            const data = await window.API.getAll();
            state.records = Array.isArray(data) ? data : [];
            state.isLoading = false;
            state.backendOnline = true;
            connectionDot.className = 'status-dot online';
            connectionText.textContent = 'Backend Online (Port 8081)';
            connectionBadge.className = 'connection-badge bg-success-subtle text-success border border-success-subtle';

            renderRecords();
            updateStatistics();
        } catch (err) {
            state.isLoading = false;
            state.records = [];
            renderErrorState(err.message);
            updateStatistics();
        }
    }

    function renderLoadingState() {
        recordsLoading.classList.remove('d-none');
        recordsTableContainer.classList.add('d-none');
        recordsEmpty.classList.add('d-none');
        recordsError.classList.add('d-none');
    }

    function renderErrorState(message) {
        recordsLoading.classList.add('d-none');
        recordsTableContainer.classList.add('d-none');
        recordsEmpty.classList.add('d-none');
        recordsError.classList.remove('d-none');
        recordsErrorMessage.textContent = message || 'Failed to load records from backend server.';
    }

    function getFilteredRecords() {
        return state.records.filter(item => {
            // Text match
            const query = state.filterQuery.toLowerCase().trim();
            const matchesText = !query ||
                (item.equipmentname && item.equipmentname.toLowerCase().includes(query)) ||
                (item.brand && item.brand.toLowerCase().includes(query)) ||
                (item.id && item.id.toString().includes(query));

            // Status match
            let matchesStatus = true;
            if (state.filterStatus === 'working') {
                matchesStatus = item.working === true;
            } else if (state.filterStatus === 'broken') {
                matchesStatus = item.working === false;
            }

            return matchesText && matchesStatus;
        });
    }

    function renderRecords() {
        recordsLoading.classList.add('d-none');
        recordsError.classList.add('d-none');

        const filtered = getFilteredRecords();

        if (filtered.length === 0) {
            recordsTableContainer.classList.add('d-none');
            recordsEmpty.classList.remove('d-none');
            return;
        }

        recordsEmpty.classList.add('d-none');
        recordsTableContainer.classList.remove('d-none');
        tableBody.innerHTML = '';

        filtered.forEach(item => {
            const tr = document.createElement('tr');

            const isWorking = item.working === true;
            const statusBadge = isWorking
                ? `<span class="badge-status badge-working"><i class="bi bi-check-circle-fill"></i> Operational</span>`
                : `<span class="badge-status badge-broken"><i class="bi bi-tools"></i> Under Maintenance</span>`;

            tr.innerHTML = `
                <td><span class="badge-id">#${item.id}</span></td>
                <td>
                    <div class="fw-semibold text-dark">${escapeHtml(item.equipmentname)}</div>
                </td>
                <td>
                    <span class="text-secondary">${escapeHtml(item.brand)}</span>
                </td>
                <td>
                    <span class="fw-bold text-dark">${formatCurrency(item.purchaseCost)}</span>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="d-flex gap-1 justify-content-end">
                        <button type="button" class="btn btn-sm btn-outline-primary btn-action btn-edit" 
                                data-id="${item.id}" title="Edit Equipment">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-action btn-delete" 
                                data-id="${item.id}" data-name="${escapeHtml(item.equipmentname)}" title="Delete Equipment">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        // Attach action listeners
        tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openEditModal(id);
            });
        });

        tableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                openDeleteModal(id, name);
            });
        });
    }

    function updateStatistics() {
        const total = state.records.length;
        const working = state.records.filter(r => r.working === true).length;
        const repair = total - working;
        const totalCost = state.records.reduce((sum, r) => sum + (Number(r.purchaseCost) || 0), 0);

        statTotal.textContent = total;
        statWorking.textContent = working;
        statRepair.textContent = repair;
        statCost.textContent = formatCurrency(totalCost);
    }

    // Filter event listeners
    searchInput.addEventListener('input', (e) => {
        state.filterQuery = e.target.value;
        renderRecords();
    });

    statusFilter.addEventListener('change', (e) => {
        state.filterStatus = e.target.value;
        renderRecords();
    });

    refreshRecordsBtn.addEventListener('click', () => {
        loadRecords();
        showToast('Refreshing equipment data...', 'info');
    });

    retryLoadBtn.addEventListener('click', () => {
        loadRecords();
    });

    // Helper: Escape HTML string to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // =========================================================================
    // Add Equipment Form Handling
    // Notice: There is NO ID input field in this form!
    // =========================================================================

    // Setup interactive real-time validation on input/blur
    function setupFieldValidation(inputEl, ruleKey, errorElId) {
        const feedbackEl = document.getElementById(errorElId);
        const check = () => {
            const res = window.Validation.rules[ruleKey](inputEl.value);
            window.Validation.applyFieldStatus(inputEl, feedbackEl, res.isValid, res.message);
            return res.isValid;
        };
        inputEl.addEventListener('blur', check);
        inputEl.addEventListener('input', () => {
            if (inputEl.classList.contains('is-invalid')) {
                check();
            }
        });
        return check;
    }

    const checkAddName = setupFieldValidation(addNameInput, 'equipmentname', 'addEquipmentNameError');
    const checkAddBrand = setupFieldValidation(addBrandInput, 'brand', 'addBrandError');
    const checkAddCost = setupFieldValidation(addCostInput, 'purchaseCost', 'addPurchaseCostError');
    const checkAddWorking = setupFieldValidation(addWorkingInput, 'working', 'addWorkingError');

    addEquipmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Perform full validation
        const isNameValid = checkAddName();
        const isBrandValid = checkAddBrand();
        const isCostValid = checkAddCost();
        const isWorkingValid = checkAddWorking();

        if (!isNameValid || !isBrandValid || !isCostValid || !isWorkingValid) {
            showToast('Please correct the highlighted validation errors.', 'error');
            return;
        }

        // Form payload (NOTE: NO ID input field exists or is sent!)
        const payload = {
            equipmentname: addNameInput.value.trim(),
            brand: addBrandInput.value.trim(),
            purchaseCost: parseFloat(addCostInput.value),
            working: addWorkingInput.value === 'true'
        };

        // UI Loading state
        addSubmitBtn.disabled = true;
        const originalBtnHtml = addSubmitBtn.innerHTML;
        addSubmitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving to Database...`;

        try {
            const created = await window.API.add(payload);
            showToast(`Equipment "${created.equipmentname}" successfully added! (Generated ID: #${created.id})`, 'success');

            // Reset form
            addEquipmentForm.reset();
            window.Validation.resetFormStatus(addEquipmentForm);

            // Switch to records list and reload
            setTimeout(() => {
                switchView('records');
            }, 500);
        } catch (err) {
            showToast(err.message || 'Failed to add equipment. Please try again.', 'danger', 'Submission Error');
        } finally {
            addSubmitBtn.disabled = false;
            addSubmitBtn.innerHTML = originalBtnHtml;
        }
    });

    addResetBtn.addEventListener('click', () => {
        window.Validation.resetFormStatus(addEquipmentForm);
    });

    // =========================================================================
    // Integration & Testing Helpers
    // =========================================================================
    const presetValidBtn = document.getElementById('presetValidBtn');
    const presetInvalidCostBtn = document.getElementById('presetInvalidCostBtn');
    const presetBlankBtn = document.getElementById('presetBlankBtn');
    const swaggerLink = document.getElementById('swaggerLink');

    function updateSwaggerLink() {
        if (swaggerLink && window.CONFIG.getSwaggerUrl) {
            swaggerLink.href = window.CONFIG.getSwaggerUrl();
        }
    }
    updateSwaggerLink();

    if (presetValidBtn) {
        presetValidBtn.addEventListener('click', () => {
            window.Validation.resetFormStatus(addEquipmentForm);
            addNameInput.value = 'Commercial Treadmill Pro';
            addBrandInput.value = 'LifeFitness';
            addCostInput.value = '45000.00';
            addWorkingInput.value = 'true';
            checkAddName();
            checkAddBrand();
            checkAddCost();
            checkAddWorking();
            showToast('Loaded valid equipment sample preset.', 'info');
        });
    }

    if (presetInvalidCostBtn) {
        presetInvalidCostBtn.addEventListener('click', () => {
            window.Validation.resetFormStatus(addEquipmentForm);
            addNameInput.value = 'Adjustable Dumbbell Set';
            addBrandInput.value = 'Rogue Fitness';
            addCostInput.value = '-250.00'; // Negative cost to test validation
            addWorkingInput.value = 'true';
            checkAddName();
            checkAddBrand();
            checkAddCost();
            checkAddWorking();
            showToast('Loaded invalid negative cost to test range validation.', 'warning');
        });
    }

    if (presetBlankBtn) {
        presetBlankBtn.addEventListener('click', () => {
            addEquipmentForm.reset();
            checkAddName();
            checkAddBrand();
            checkAddCost();
            checkAddWorking();
            showToast('Triggered blank required field validation states.', 'error');
        });
    }

    // =========================================================================
    // Delete Equipment Modal & Handling
    // =========================================================================

    function openDeleteModal(id, name) {
        state.pendingDeleteId = id;
        state.pendingDeleteName = name;
        deleteItemIdEl.textContent = `#${id}`;
        deleteItemNameEl.textContent = name;
        deleteModal.show();
    }

    deleteConfirmBtn.addEventListener('click', async () => {
        if (!state.pendingDeleteId) return;

        const id = state.pendingDeleteId;
        const originalBtnHtml = deleteConfirmBtn.innerHTML;
        deleteConfirmBtn.disabled = true;
        deleteConfirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Deleting...`;

        try {
            const responseMessage = await window.API.delete(id);
            deleteModal.hide();
            showToast(responseMessage || `Equipment #${id} was deleted successfully.`, 'success');
            loadRecords(); // Refresh list
        } catch (err) {
            showToast(err.message || `Failed to delete equipment #${id}.`, 'danger');
        } finally {
            deleteConfirmBtn.disabled = false;
            deleteConfirmBtn.innerHTML = originalBtnHtml;
            state.pendingDeleteId = null;
        }
    });

    // =========================================================================
    // Edit Equipment Modal & Handling
    // =========================================================================

    function openEditModal(id) {
        const item = state.records.find(r => String(r.id) === String(id));
        if (!item) {
            showToast('Unable to find record in local cache.', 'warning');
            return;
        }

        window.Validation.resetFormStatus(editForm);
        editIdInput.value = item.id;
        editNameInput.value = item.equipmentname;
        editBrandInput.value = item.brand;
        editCostInput.value = item.purchaseCost;
        editWorkingInput.value = item.working ? 'true' : 'false';

        editModal.show();
    }

    const checkEditName = setupFieldValidation(editNameInput, 'equipmentname', 'editEquipmentNameError');
    const checkEditBrand = setupFieldValidation(editBrandInput, 'brand', 'editBrandError');
    const checkEditCost = setupFieldValidation(editCostInput, 'purchaseCost', 'editPurchaseCostError');
    const checkEditWorking = setupFieldValidation(editWorkingInput, 'working', 'editWorkingError');

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isNameValid = checkEditName();
        const isBrandValid = checkEditBrand();
        const isCostValid = checkEditCost();
        const isWorkingValid = checkEditWorking();

        if (!isNameValid || !isBrandValid || !isCostValid || !isWorkingValid) {
            showToast('Please fix validation errors before saving.', 'error');
            return;
        }

        const id = editIdInput.value;
        const payload = {
            equipmentname: editNameInput.value.trim(),
            brand: editBrandInput.value.trim(),
            purchaseCost: parseFloat(editCostInput.value),
            working: editWorkingInput.value === 'true'
        };

        editSubmitBtn.disabled = true;
        const origHtml = editSubmitBtn.innerHTML;
        editSubmitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Updating...`;

        try {
            await window.API.update(id, payload);
            editModal.hide();
            showToast(`Equipment #${id} updated successfully!`, 'success');
            loadRecords();
        } catch (err) {
            showToast(err.message || 'Failed to update equipment.', 'danger');
        } finally {
            editSubmitBtn.disabled = false;
            editSubmitBtn.innerHTML = origHtml;
        }
    });

    // =========================================================================
    // Initialization
    // =========================================================================

    checkBackendHealth();
    loadRecords();
});
