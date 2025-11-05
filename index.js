// Funcionalidad para el selector de temas
document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('themeSelect');
    const themeSections = document.querySelectorAll('.theme-section');
    
    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        
        themeSections.forEach(section => {
            if (selectedTheme === 'all' || section.dataset.theme === selectedTheme) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
    
    // Funcionalidad para la búsqueda en el sidebar
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll('.theme-section li a');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const listItem = item.parentElement;
            
            if (text.includes(searchTerm)) {
                listItem.style.display = 'block';
                // Resaltar el término buscado
                if (searchTerm) {
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    item.innerHTML = item.textContent.replace(regex, '<mark>$1</mark>');
                }
            } else {
                listItem.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar encabezados de sección según si tienen elementos visibles
        const subheaders = document.querySelectorAll('.theme-section li.subheader');
        subheaders.forEach(header => {
            const nextItems = [];
            let nextElement = header.nextElementSibling;
            
            while (nextElement && !nextElement.classList.contains('subheader')) {
                if (nextElement.style.display !== 'none') {
                    nextItems.push(nextElement);
                }
                nextElement = nextElement.nextElementSibling;
            }
            
            if (nextItems.length > 0) {
                header.style.display = 'block';
            } else {
                header.style.display = 'none';
            }
        });
    });
    
    // Funcionalidad para el botón flotante y modal de búsqueda
    const searchFab = document.getElementById('searchFab');
    const searchModal = document.getElementById('searchModal');
    const closeModal = document.querySelector('.close');
    const modalSearch = document.getElementById('modalSearch');
    const searchResults = document.getElementById('searchResults');
    
    // Abrir modal
    searchFab.addEventListener('click', function() {
        searchModal.style.display = 'block';
        modalSearch.focus();
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', function() {
        searchModal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === searchModal) {
            searchModal.style.display = 'none';
        }
    });
    
    // Búsqueda en modal
    modalSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const allItems = document.querySelectorAll('.theme-section li a');
        const resultsContainer = document.getElementById('searchResults');
        
        // Limpiar resultados anteriores
        resultsContainer.innerHTML = '';
        
        if (searchTerm) {
            const results = [];
            
            allItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                const href = item.getAttribute('href');
                
                if (text.includes(searchTerm) && href !== '#') {
                    // Encontrar a qué tema pertenece
                    const themeSection = item.closest('.theme-section');
                    const themeName = themeSection.querySelector('h2').textContent;
                    
                    results.push({
                        text: item.textContent,
                        href: href,
                        theme: themeName
                    });
                }
            });
            
            // Mostrar resultados
            if (results.length > 0) {
                const resultsList = document.createElement('ul');
                
                results.forEach(result => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = result.href;
                    link.target = 'viewer';
                    link.innerHTML = `<span class="theme-indicator">${result.theme}</span> ${highlightText(result.text, searchTerm)}`;
                    
                    listItem.appendChild(link);
                    resultsList.appendChild(listItem);
                });
                
                resultsContainer.appendChild(resultsList);
            } else {
                resultsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">No se encontraron resultados</p>';
            }
        } else {
            resultsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Escribe algo para buscar</p>';
        }
    });
    
    // Función para resaltar texto en resultados
    function highlightText(text, term) {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Cerrar modal al seleccionar un resultado
    searchResults.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            searchModal.style.display = 'none';
        }
    });
});