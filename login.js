const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.querySelector('#loginEmail').value.trim()
    const password = document.querySelector('#loginPassword').value.trim()

    const user = {
        email: email,
        senha: password
    }

    try {
        const response = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            const errorData = await response.json()
            alert(errorData.error)
            return
        }

        alert("Você fez login")
    }
    catch (error) {
        alert("Não foi possível conectar ao servidor")
        console.error(error)
    }
})