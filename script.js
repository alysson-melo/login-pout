function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'))
    document.querySelector(screenId).classList.add('active')
}

const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.querySelector('#loginEmail').value.trim()
    const password = document.querySelector('#loginPassword').value.trim()

    const user = {
        email: email,
        senha: password
    }

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
})

document.querySelector('#registrationPage').addEventListener('click', () => {
    showScreen('#registrationScreen1')
})

const formStep1 = document.querySelector('#formStep1')
formStep1.addEventListener('submit', (e) => {
    e.preventDefault()
    const fullName = document.querySelector('#fullName').value.trim()
    const bday = document.querySelector('#bday').value
    if (fullName && bday) showScreen('#registrationScreen2')
})

const formStep2 = document.querySelector('#formStep2')
formStep2.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.querySelector('#registrationEmail').value.trim()
    const password = document.querySelector('#registrationPassword').value
    const confirmPassword = document.querySelector('#confirmPassword').value

    if (email && password && confirmPassword) {
        if (password !== confirmPassword) {
            alert("As senhas não conferem!")
            return
        }
        showScreen('#registrationScreen3')
    }
})

const formStep3 = document.querySelector('#formStep3')
formStep3.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fullName = document.querySelector('#fullName').value.trim()
    const bday = document.querySelector('#bday').value
    const email = document.querySelector('#registrationEmail').value.trim()
    const password = document.querySelector('#registrationPassword').value.trim()
    const userName = document.querySelector('#userName').value.trim()
    const radioBtnGender = document.querySelector('input[name="gender"]:checked')
    const gender = radioBtnGender ? radioBtnGender.value : null

    const newUser = {
        Nome: fullName,
        NomeDeUsuario: userName,
        DataDeNascimento: bday,
        Email: email,
        Senha: password,
        Sexo: gender
    }

    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        if (!response.ok) {
            const errorData = await response.json()
            alert(`Erro ao cadastrar: ${errorData.error}`)
            return
        }

        alert("Usuário cadastrado com sucesso!")
        showScreen('#loginScreen')
    }
    catch (error) {
        alert(error)
    }
}
)
