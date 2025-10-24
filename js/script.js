// Load machines from localStorage or defaults
function loadMachines() {
    const stored = localStorage.getItem('machines');
    return stored ? JSON.parse(stored) : getDefaultMachines();
}

function getDefaultMachines() {
    return window.defaultMachines || [];
}

function saveMachines(machines) {
    localStorage.setItem('machines', JSON.stringify(machines));
}

function renderMachines() {
    const machines = loadMachines();
    const maquinaGrid = document.querySelector('.maquinas-grid');
    maquinaGrid.innerHTML = ''; // Clear existing content
    machines.forEach(machine => {
        const item = document.createElement('div');
        item.classList.add('maquina-item');
        item.dataset.model = machine.model;
        item.innerHTML = `
            <img src="${machine.img}" alt="${machine.title}">
            <div class="maquina-info">
                <h3>${machine.title}</h3>
                <p class="descripcion">${machine.desc}</p>
                <p class="precio">${machine.price}</p>
            </div>
        `;
        maquinaGrid.appendChild(item);
    });
}

// Admin functions
function promptPassword() {
    const password = '1001439Ronald'; // Change this to your desired password
    const enteredPassword = prompt('Ingresa la contraseña de administrador:');
    if (enteredPassword === password) {
        initAdmin();
    } else {
        alert('Contraseña incorrecta.');
    }
}

function initAdmin() {
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
        adminSection.style.display = 'block';
        // Scroll to admin section
        adminSection.scrollIntoView({ behavior: 'smooth' });
        const machines = loadMachines();
        const container = document.getElementById('admin-forms');
        if (container) {
            container.innerHTML = ''; // Clear existing forms
            machines.forEach((machine, index) => {
                const form = document.createElement('div');
                form.classList.add('admin-form');
                form.innerHTML = `
                    <h3>Máquina ${machine.model}</h3>
                    <label>URL de Imagen: <input type="text" value="${machine.img}" data-field="img" data-index="${index}"></label><br>
                    <label>Título: <input type="text" value="${machine.title}" data-field="title" data-index="${index}"></label><br>
                    <label>Descripción: <textarea data-field="desc" data-index="${index}">${machine.desc.replace(/<br>/g, '\n')}</textarea></label><br>
                    <label>Precio: <input type="text" value="${machine.price}" data-field="price" data-index="${index}"></label><br>
                `;
                container.appendChild(form);
            });

            // Add real-time save on input change
            const inputs = document.querySelectorAll('#admin-forms input, #admin-forms textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    const machines = loadMachines();
                    const index = parseInt(input.dataset.index);
                    const field = input.dataset.field;
                    let value = input.value;
                    if (field === 'desc') {
                        value = value.replace(/\n/g, '<br>');
                    }
                    machines[index][field] = value;
                    saveMachines(machines);
                    // Update the page in real-time
                    renderMachines();
                });
            });
        } else {
            console.error('Admin forms container not found');
        }

        // Render comments table
        renderCommentsTable();
    } else {
        console.error('Admin section not found');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('mouseover', () => {
            contactButton.style.backgroundColor = '#00aaff';
        });
        contactButton.addEventListener('mouseout', () => {
            contactButton.style.backgroundColor = '#007bff';
        });
    }

    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.opacity = '0.9';
        });
        item.addEventListener('mouseleave', () => {
            item.style.opacity = '1';
        });
    });

    const maquinaGrid = document.querySelector('.maquinas-grid');

    const instagramLink = 'https://www.instagram.com/ryk_800/?igsh=MXVtenRjaXhhOHFoMQ==';
    const whatsappBaseNumber = '+573226526403';
    const whatsappLink = `https://wa.me/${whatsappBaseNumber}`;
    const phoneNumbers = ['+573226526403', '+573101234567'];
    const machineAddress = 'El Carmen de Viboral, Antioquia, Colombia';

    const modal = document.createElement('div');
    modal.classList.add('machine-modal');
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <img src="" alt="Imagen de la Máquina" class="modal-image">
            <div class="modal-details">
                <h3 class="modal-title"></h3>
                <p class="modal-price"></p>
                <div class="social-icons">
                    <a href="${instagramLink}" target="_blank" class="social-icon instagram"><i class="fab fa-instagram"></i></a>
                    <a href="${whatsappLink}" target="_blank" class="social-icon whatsapp"><i class="fab fa-whatsapp"></i></a>
                </div>
                <p>Llamar a: <a href="tel:${phoneNumbers[0]}">${phoneNumbers[0]}</a> / <a href="tel:${phoneNumbers[1]}">${phoneNumbers[1]}</a></p>
                <p>Ubicación: ${machineAddress}</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    maquinaGrid.addEventListener('click', function(event) {
        const clickedMaquinaItem = event.target.closest('.maquina-item');
        if (clickedMaquinaItem) {
            const imageSrc = clickedMaquinaItem.querySelector('img').src;
            const title = clickedMaquinaItem.querySelector('h3').textContent;
            const price = clickedMaquinaItem.querySelector('.precio').textContent;

            modal.querySelector('.modal-image').src = imageSrc;
            modal.querySelector('.modal-title').textContent = title;
            modal.querySelector('.modal-price').textContent = price;
            modal.style.display = 'flex';
        }
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Load and render machines from Firebase
    renderMachines();

    // Listen for updates from admin panel
    const channel = new BroadcastChannel('machines-update');
    channel.onmessage = function(event) {
        if (event.data === 'update') {
            renderMachines();
        }
    };
});

document.addEventListener('DOMContentLoaded', function() {
    

    
    const whatsappIcon = document.getElementById('whatsapp-icon');
    const chatBubble = document.getElementById('chat-bubble');

    
    if (whatsappIcon && chatBubble) {
        
       
        const showBubble = () => {
            chatBubble.classList.add('show');
        };

       
        const hideBubble = () => {
            chatBubble.classList.remove('show');
        };

        
        whatsappIcon.addEventListener('mouseenter', showBubble);

       
        whatsappIcon.addEventListener('mouseleave', hideBubble);

        
        whatsappIcon.addEventListener('click', hideBubble);
    }
});

document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('whatsapp-form');

    if (form) {
        form.addEventListener('submit', function(event) {

            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const correo = document.getElementById('correo').value;
            const mensaje = document.getElementById('mensaje').value;

            // Save to localStorage
            const comments = loadComments();
            comments.push({
                nombre,
                telefono,
                correo,
                mensaje,
                timestamp: new Date().toLocaleString()
            });
            saveComments(comments);

            // Show success message
            alert('Su mensaje se ha enviado con éxito.');
            // Clear form
            form.reset();
        });
    }
});

// Functions for comments
function loadComments() {
    const stored = localStorage.getItem('userComments');
    return stored ? JSON.parse(stored) : [];
}

function saveComments(comments) {
    localStorage.setItem('userComments', JSON.stringify(comments));
}

function renderCommentsTable() {
    const comments = loadComments();
    const tableContainer = document.getElementById('comments-table');
    if (tableContainer) {
        tableContainer.innerHTML = ''; // Clear existing content
        if (comments.length === 0) {
            tableContainer.innerHTML = '<p>No hay comentarios aún.</p>';
            return;
        }
        const table = document.createElement('table');
        table.classList.add('comments-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Mensaje</th>
                    <th>Fecha</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                ${comments.map((comment, index) => `
                    <tr>
                        <td>${comment.nombre}</td>
                        <td>${comment.telefono}</td>
                        <td>${comment.correo}</td>
                        <td>${comment.mensaje}</td>
                        <td>${comment.timestamp}</td>
                        <td><button class="delete-comment-btn" data-index="${index}">🗑️</button></td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        tableContainer.appendChild(table);

        // Add event listeners to delete buttons
        const deleteButtons = tableContainer.querySelectorAll('.delete-comment-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteComment(index);
            });
        });
    }
}

function deleteComment(index) {
    const comments = loadComments();
    comments.splice(index, 1); // Remove the comment at the specified index
    saveComments(comments);
    renderCommentsTable(); // Re-render the table
}


// Tarjeta tecnicos

document.addEventListener('DOMContentLoaded', () => {
    const tecnicosCardsContainer = document.querySelector('.tecnicos-cards-container');

    const tecnicos = [
        {
            nombre: 'Juan Riaza',
            edad: 43,
            experiencia: '5 años en reparación de máquinas de confección.',
            tipo: 'Técnico en Reparación de Máquinas',
            correo: 'mejoresmaquinas80@gmail.com',
            telefono: '+57 310 123 4567'
        },
        {
            nombre: 'Wilber Valencia',
            edad: 42,
            experiencia: '5 años en reparación de máquinas de confección.',
            tipo: 'Técnico en Reparación de Máquinas',
            correo: 'wilro4307@gmail.com',
            telefono: '+57 322 652 6403'
        }
    ];



    function createTecnicoCard(tecnico, index) {
        const card = document.createElement('div');
        card.classList.add('tecnico-card');
        card.dataset.id = index;

        card.innerHTML = `
            <h4>${tecnico.nombre}</h4>
            <p><strong>Edad:</strong> ${tecnico.edad} años</p>
            <p><strong>Tipo:</strong> ${tecnico.tipo}</p>
            <p><strong>Experiencia:</strong> ${tecnico.experiencia}</p>
            <p><strong>Correo:</strong> <a href="mailto:${tecnico.correo}" style="color: #ce2f2f; text-decoration: none;">${tecnico.correo}</a></p>
            <p><strong>Teléfono:</strong> <a href="tel:${tecnico.telefono}" style="color: #ce2f2f; text-decoration: none;">${tecnico.telefono}</a></p>
        `;
        return card;
    }

    // Generate cards directly
    tecnicos.forEach((tecnico, index) => {
        tecnicosCardsContainer.appendChild(createTecnicoCard(tecnico, index));
    });

    // Add admin trigger (e.g., double-click on header logo to prompt password)
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('dblclick', promptPassword);
    } else {
        console.error('Logo not found');
    }

    // Save all changes button
    const saveAllButton = document.getElementById('save-all');
    if (saveAllButton) {
        saveAllButton.addEventListener('click', () => {
            const machines = loadMachines();
            const inputs = document.querySelectorAll('input[data-field], textarea[data-field]');
            inputs.forEach(input => {
                const index = parseInt(input.dataset.index);
                const field = input.dataset.field;
                let value = input.value;
                if (field === 'desc') {
                    value = value.replace(/\n/g, '<br>');
                }
                machines[index][field] = value;
            });
            saveMachines(machines);
            // Broadcast update to other tabs
            const channel = new BroadcastChannel('machines-update');
            channel.postMessage('update');
            channel.close();
            alert('Cambios guardados exitosamente.');
        });
    }

    // Auto-save on page unload
    window.addEventListener('beforeunload', () => {
        const adminSection = document.getElementById('admin-section');
        if (adminSection && adminSection.style.display !== 'none') {
            const machines = loadMachines();
            const inputs = document.querySelectorAll('input[data-field], textarea[data-field]');
            inputs.forEach(input => {
                const index = parseInt(input.dataset.index);
                const field = input.dataset.field;
                let value = input.value;
                if (field === 'desc') {
                    value = value.replace(/\n/g, '<br>');
                }
                machines[index][field] = value;
            });
            saveMachines(machines);
        }
    });
});
