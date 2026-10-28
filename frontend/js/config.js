/**
 * Application Configuration
 * Defines API endpoints and default configurations for CrudService.
 */
const CONFIG = {
    // Default backend URL pointing to CrudService running on port 8081
    DEFAULT_API_BASE: 'http://localhost:8081/gym',

    // Local storage key for custom backend URL (for flexibility during evaluation)
    STORAGE_KEY: 'gym_api_base_url',

    // Retrieve active API Base URL
    getApiBase() {
        return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_API_BASE;
    },

    // Save custom API Base URL
    setApiBase(url) {
        if (url) {
            // Remove trailing slash if present
            const cleanUrl = url.replace(/\/+$/, '');
            localStorage.setItem(this.STORAGE_KEY, cleanUrl);
        } else {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    },

    // Reset to default
    resetApiBase() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    // Retrieve active Swagger UI URL
    getSwaggerUrl() {
        const base = this.getApiBase().replace(/\/gym\/?$/, '');
        return `${base}/swagger-ui/index.html`;
    },

    // Endpoints mapping according to GymController.java
    endpoints: {
        health: '/',               // GET /gym/ -> String ("Crud Service is Running")
        displayAll: '/Displayall', // GET /gym/Displayall -> List<Response>
        add: '/Add',               // POST /gym/Add -> Response
        getById: (id) => `/Get/${id}`,       // GET /gym/Get/{id} -> Response
        update: (id) => `/Update/${id}`,    // PUT /gym/Update/{id} -> Response
        delete: (id) => `/Delete/${id}`     // DELETE /gym/Delete/{id} -> String
    }
};

window.CONFIG = CONFIG;
