let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")
const counterEl = document.getElementById("counter-el")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

function escapeHtml(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
}

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        const safeLead = escapeHtml(leads[i])
        listItems += `
            <li class="link-item">
                <a target='_blank' href='${safeLead}' class="link-text">
                    ${safeLead}
                </a>
                <button class="trash-btn" data-index="${i}" aria-label="Удалить ссылку">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                </button>
            </li>
        `
    }
    ulEl.innerHTML = listItems

    counterEl.textContent = myLeads.length || ""
}

ulEl.addEventListener("click", function(event) {
    const trashBtn = event.target.closest(".trash-btn")
    if (!trashBtn) return

    const index = Number(trashBtn.dataset.index)
    myLeads.splice(index, 1)
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    render(myLeads)
})

deleteBtn.addEventListener("dblclick", function() {
    localStorage.removeItem("myLeads")
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    if (!inputEl.value.trim()) return

    myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    render(myLeads)
})