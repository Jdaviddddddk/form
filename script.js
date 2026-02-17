// script.js
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxSsLtbsKrU4HtoxEI2wAeNFk7kOpySuM0HqawdGVUcHaSIun9bViQ4JoAnQy1fkZvjCQ/exec'; 

let currentTab = 0;

// Función para mostrar el paso actual
function showTab(n) {
    let x = document.getElementsByClassName("tab");
    if (x.length === 0) return; // Si no hay tabs, salir
    
    if (n >= x.length) n = x.length - 1;
    if (n < 0) n = 0;

    // Ocultar todos los pasos
    for (let i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    
    // Mostrar el paso actual
    x[n].style.display = "block";
    
    // Manejo de botones Siguiente/Atrás
    let nextBtns = x[n].getElementsByClassName("next");
    let prevBtns = x[n].getElementsByClassName("prev");
    
    if (n == 0) {
        if(nextBtns.length > 0) nextBtns[0].style.display = "inline-block";
        if(prevBtns.length > 0) prevBtns[0].style.display = "none";
    } else {
        if(nextBtns.length > 0) nextBtns[0].style.display = "inline-block";
        if(prevBtns.length > 0) prevBtns[0].style.display = "inline-block";
    }
}

// Función para navegar entre pasos
function nextPrev(n) {
    let x = document.getElementsByClassName("tab");
    
    // Si vamos hacia adelante, validar
    if (n == 1 && !validateForm()) return false;
    
    // Ocultar paso actual
    x[currentTab].style.display = "none";
    
    // Cambiar índice
    currentTab = currentTab + n;
    
    // Si llegamos al final, enviar
    if (currentTab >= x.length) {
        document.getElementById("regForm").submit();
        return false;
    }
    
    // Mostrar nuevo paso
    showTab(currentTab);
}

// Validar que los campos estén llenos
function validateForm() {
    let x = document.getElementsByClassName("tab");
    let inputs = x[currentTab].getElementsByTagName("input");
    let selects = x[currentTab].getElementsByTagName("select");
    let valid = true;
    
    // Validar inputs
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "radio") {
            // Para radio buttons, verificar que al menos uno esté seleccionado
            let name = inputs[i].name;
            let checked = document.querySelector(`input[name="${name}"]:checked`);
            if (!checked) {
                valid = false;
            }
        } else {
            if (inputs[i].value == "") {
                inputs[i].style.borderColor = "#e74c3c";
                valid = false;
            } else {
                inputs[i].style.borderColor = "#ddd";
            }
        }
    }
    
    // Validar selects
    for (let i = 0; i < selects.length; i++) {
        if (selects[i].value == "") {
            selects[i].style.borderColor = "#e74c3c";
            valid = false;
        } else {
            selects[i].style.borderColor = "#ddd";
        }
    }
    
    if (!valid) {
        alert("Por favor responde esta pregunta antes de continuar.");
    }
    return valid;
}

// Enviar formulario a Google Sheets
function enviarFormularioFinal(event, idEncuesta) {
    event.preventDefault();
    
    const form = event.target;
    const btn = form.querySelector("button[type='submit']");
    const textoOriginal = btn.innerText;
    
    btn.innerText = "Enviando...";
    btn.disabled = true;

    const formData = new FormData(form);
    
    let userId = localStorage.getItem('usuario_id');
    if (!userId) {
        userId = 'User_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('usuario_id', userId);
    }
    formData.append('ID_Usuario', userId);

    fetch(SCRIPT_URL, { method: 'POST', body: formData })
    .then(response => {
        localStorage.setItem('encuesta_' + idEncuesta, 'true');
        alert('¡Respuestas guardadas correctamente!');
        
        if (localStorage.getItem('encuesta_1') && 
            localStorage.getItem('encuesta_2') && 
            localStorage.getItem('encuesta_3')) {
            window.location.href = 'premio.html';
        } else {
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión. Intenta de nuevo.');
        btn.innerText = textoOriginal;
        btn.disabled = false;
    });
}

// INICIALIZAR AL CARGAR LA PÁGINA
window.addEventListener('load', function() {
    console.log("Página cargada, inicializando tabs...");
    let tabs = document.getElementsByClassName("tab");
    if (tabs.length > 0) {
        console.log("Encontradas " + tabs.length + " preguntas");
        showTab(0);
    } else {
        console.log("No se encontraron tabs en esta página");
    }
});