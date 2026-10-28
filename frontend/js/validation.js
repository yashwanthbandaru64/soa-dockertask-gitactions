/**
 * Form Validation Module
 * Provides validation rules and UI feedback helpers for Gym Equipment forms.
 */
const Validation = {
    /**
     * Validation rules matching backend constraints:
     * - equipmentname: Required, non-empty, length 2-60
     * - brand: Required, non-empty, length 2-50
     * - purchaseCost: Required, positive number (> 0), max 10,000,000
     * - working: Required boolean (true/false)
     */
    rules: {
        equipmentname(value) {
            if (!value || typeof value !== 'string' || value.trim().length === 0) {
                return { isValid: false, message: 'Equipment name is required and cannot be blank.' };
            }
            const trimmed = value.trim();
            if (trimmed.length < 2) {
                return { isValid: false, message: 'Equipment name must be at least 2 characters.' };
            }
            if (trimmed.length > 60) {
                return { isValid: false, message: 'Equipment name must not exceed 60 characters.' };
            }
            return { isValid: true, message: '' };
        },

        brand(value) {
            if (!value || typeof value !== 'string' || value.trim().length === 0) {
                return { isValid: false, message: 'Brand name is required and cannot be blank.' };
            }
            const trimmed = value.trim();
            if (trimmed.length < 2) {
                return { isValid: false, message: 'Brand name must be at least 2 characters.' };
            }
            if (trimmed.length > 50) {
                return { isValid: false, message: 'Brand name must not exceed 50 characters.' };
            }
            return { isValid: true, message: '' };
        },

        purchaseCost(value) {
            if (value === '' || value === null || value === undefined) {
                return { isValid: false, message: 'Purchase cost is required.' };
            }
            const num = Number(value);
            if (isNaN(num)) {
                return { isValid: false, message: 'Purchase cost must be a valid numeric value.' };
            }
            if (num <= 0) {
                return { isValid: false, message: 'Purchase cost must be greater than zero (> 0).' };
            }
            if (num > 10000000) {
                return { isValid: false, message: 'Purchase cost exceeds realistic maximum (10,000,000).' };
            }
            return { isValid: true, message: '' };
        },

        working(value) {
            if (value === '' || value === null || value === undefined) {
                return { isValid: false, message: 'Please select equipment working condition status.' };
            }
            if (value !== 'true' && value !== 'false' && typeof value !== 'boolean') {
                return { isValid: false, message: 'Invalid working condition value.' };
            }
            return { isValid: true, message: '' };
        }
    },

    /**
     * Validate an entire equipment form data object.
     * @param {Object} data { equipmentname, brand, purchaseCost, working }
     * @returns {Object} { isValid: boolean, errors: Object }
     */
    validateEquipment(data) {
        const errors = {};
        let isValid = true;

        const nameRes = this.rules.equipmentname(data.equipmentname);
        if (!nameRes.isValid) {
            errors.equipmentname = nameRes.message;
            isValid = false;
        }

        const brandRes = this.rules.brand(data.brand);
        if (!brandRes.isValid) {
            errors.brand = brandRes.message;
            isValid = false;
        }

        const costRes = this.rules.purchaseCost(data.purchaseCost);
        if (!costRes.isValid) {
            errors.purchaseCost = costRes.message;
            isValid = false;
        }

        const workingRes = this.rules.working(data.working);
        if (!workingRes.isValid) {
            errors.working = workingRes.message;
            isValid = false;
        }

        return { isValid, errors };
    },

    /**
     * Applies visual validation state to an input element (Bootstrap is-valid / is-invalid).
     */
    applyFieldStatus(inputEl, feedbackEl, isValid, message = '') {
        if (!inputEl) return;
        if (isValid) {
            inputEl.classList.remove('is-invalid');
            inputEl.classList.add('is-valid');
            if (feedbackEl) {
                feedbackEl.textContent = '';
            }
        } else {
            inputEl.classList.remove('is-valid');
            inputEl.classList.add('is-invalid');
            if (feedbackEl) {
                feedbackEl.textContent = message;
            }
        }
    },

    /**
     * Resets visual validation states from a form element.
     */
    resetFormStatus(formEl) {
        if (!formEl) return;
        formEl.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        formEl.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
        });
    }
};

window.Validation = Validation;
