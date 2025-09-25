function clearErrors() {
    document.querySelectorAll('.error-message').forEach(span => {
        span.textContent = ''
    })
}

const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearErrors()

    const email = document.querySelector('#loginEmail').value.trim()
    const password = document.querySelector('#loginPassword').value

    let isValid = true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
        document.getElementById('errorLoginEmail').textContent = 'Digite um email válido'
        isValid = false
    }

    if (!password) {
        document.getElementById('errorLoginPassword').textContent = 'Digite sua senha'
        isValid = false
    }

    if (!isValid) return

    const user = { email: email, senha: password }

    try {
        const response = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.log(errorData.error)
            alert(errorData.error)
            return
        }
        alert("Você fez login")
    }
    catch (error) {
        alert("Não foi possível conectar ao servidor, tente novamente mais tarde")
        console.error(error)
    }
})