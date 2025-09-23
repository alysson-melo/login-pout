// Login/Registration
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

        alert("~Você fez login")
    }
    catch (error) {
        alert("Não foi possível conectar ao servidor")
        console.error(error)
    }
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
            alert("As senhas não coincidem!")
            return
        }
        showScreen('#registrationScreen3')
    }
})

const formStep3 = document.querySelector('#formStep3')
formStep3.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fullName = document.querySelector('#fullName').value.trim()
    const bday = bdayISO
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
})

// Calendar
const maxYear = new Date().getFullYear() - 80
const minYear = new Date().getFullYear() - 15
let currentDate = new Date(minYear, 0, 1)
let selectedDate = null
let selectedYear = null

function generateCalendar(year, month) {
    const calendar = document.getElementById('calendar')
    const monthYear = document.getElementById('monthYear')

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

    monthYear.textContent = `${months[month]} de ${year}`
    calendar.innerHTML = ''

    // Add day headers
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div')
        dayHeader.classList.add('day-header')
        dayHeader.textContent = day
        calendar.appendChild(dayHeader)
    })

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    // Calcular dias do mês anterior
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()

    // Calcular dias do proximo mes
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year

    // Total de celulas necesarias (6 semanas de 7 dias)
    const totalCells = 42
    let dayCounter = 1
    let nextMonthDay = 1

    for (let i = 0; i < totalCells; i++) {
        const dayElement = document.createElement('div')
        dayElement.classList.add('day')

        let dayNumber
        let dateStr
        let isCurrentMonth = true
        let isValidDate = true

        if (i < startingDayOfWeek) {
            // Dias do mes anterior
            dayNumber = daysInPrevMonth - (startingDayOfWeek - 1 - i)
            dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
            isCurrentMonth = false
            dayElement.classList.add('other-month')
            isValidDate = prevYear >= maxYear && prevYear <= minYear
        } else if (dayCounter <= daysInMonth) {
            // Dias do mes atual
            dayNumber = dayCounter
            dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
            dayCounter++
            isValidDate = year >= maxYear && year <= minYear
        } else {
            // Dias do proximo mes
            dayNumber = nextMonthDay
            dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
            nextMonthDay++
            isCurrentMonth = false
            dayElement.classList.add('other-month')
            isValidDate = nextYear >= maxYear && nextYear <= minYear
        }

        dayElement.textContent = dayNumber
        dayElement.dataset.date = dateStr
        dayElement.dataset.isCurrentMonth = isCurrentMonth

        // Adiciona evento de clique apenas para datas validas
        if (isValidDate) {
            if (isCurrentMonth) {
                dayElement.addEventListener('click', () => selectDate(dateStr, dayNumber))
            } else {
                dayElement.addEventListener('click', () => {
                    if (i < startingDayOfWeek) {
                        changeMonth(-1)
                        setTimeout(() => {
                            selectDate(dateStr, dayNumber)
                        }, 50)
                    } else {
                        changeMonth(1)
                        setTimeout(() => {
                            selectDate(dateStr, dayNumber)
                        }, 50)
                    }
                })
            }
        } else {
            dayElement.style.opacity = '0.3'
            dayElement.style.cursor = 'not-allowed'
        }

        calendar.appendChild(dayElement)
    }

    updateAllDayClasses()
}

function updateAllDayClasses() {
    const todayStr = new Date().toISOString().slice(0, 10)
    const dayElements = document.querySelectorAll('.day[data-date]')

    dayElements.forEach(dayElement => {
        const dateStr = dayElement.dataset.date
        const isCurrentMonth = dayElement.dataset.isCurrentMonth === 'true'

        dayElement.classList.remove('today', 'selected')

        if (isCurrentMonth) {
            if (todayStr === dateStr) {
                dayElement.classList.add('today')
            }

            if (selectedDate && selectedDate === dateStr) {
                dayElement.classList.add('selected')
            }
        } else {
            if (selectedDate && selectedDate === dateStr) {
                dayElement.classList.add('selected')
            }
        }
    })

    // Update confirm button state
    const confirmBtn = document.getElementById('confirmDateBtn')
    confirmBtn.disabled = !selectedDate
}

function selectDate(dateStr, day) {
    selectedDate = dateStr
    updateAllDayClasses()
}

function changeMonth(direction) {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)

    if (newDate.getFullYear() >= maxYear && newDate.getFullYear() <= minYear) {
        currentDate = newDate
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth())
    }
}

function openCalendar() {
    document.getElementById('calendarModal').classList.add('active')
}

function closeCalendar() {
    document.getElementById('calendarModal').classList.remove('active')
}

let bdayISO = ''
function confirmDate() {
    if (selectedDate) {
        const [year, month, day] = selectedDate.split('-')
        const date = new Date(year, month - 1, day)
        bdayISO = date.toISOString()
        const formattedDate = date.toLocaleDateString('pt-BR')
        document.getElementById('bday').value = formattedDate
        closeCalendar()
    }
}

function openYearModal() {
    selectedYear = currentDate.getFullYear()
    generateYearGrid()
    document.getElementById('yearModal').classList.add('active')
}

function closeYearModal() {
    document.getElementById('yearModal').classList.remove('active')
    selectedYear = null
}

function generateYearGrid() {
    const yearGrid = document.getElementById('yearGrid')
    const currentYear = new Date().getFullYear()

    yearGrid.innerHTML = ''

    for (let year = minYear; year >= maxYear; year--) {
        const yearElement = document.createElement('div')
        yearElement.classList.add('year-item')
        yearElement.textContent = year
        yearElement.dataset.year = year

        yearElement.addEventListener('click', () => selectYear(year))
        yearGrid.appendChild(yearElement)
    }
    updateAllYearClasses()
}

function selectYear(year) {
    selectedYear = year
    updateAllYearClasses()
}

function updateAllYearClasses() {
    const currentYear = new Date().getFullYear()
    const yearElements = document.querySelectorAll('.year-item[data-year]')

    yearElements.forEach(yearElement => {
        const year = parseInt(yearElement.dataset.year)

        yearElement.classList.remove('current', 'selected')

        if (year === currentYear) {
            yearElement.classList.add('current')
        }

        if (year === selectedYear) {
            yearElement.classList.add('selected')
        }
    })
}

function confirmYearSelection() {
    if (selectedYear !== null) {
        currentDate.setFullYear(selectedYear)
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth())
    }
    closeYearModal()
}

// Event listeners for calendar
document.getElementById('bday').addEventListener('click', openCalendar)

document.getElementById('calendarModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeCalendar()
    }
})

document.getElementById('yearModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeYearModal()
    }
})

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeYearModal()
        closeCalendar()
    }
})

// Initialize calendar
generateCalendar(currentDate.getFullYear(), currentDate.getMonth())