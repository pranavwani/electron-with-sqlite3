nfi.log()

const dbNameInput = document.querySelector('.db-name-input')
const tableNameInput = document.querySelector('.table-name-input')
const createRecordTableNameInput = document.querySelector('.create-record-table-name-input')
const fetchRecordsTableNameInput = document.querySelector('.fetch-records-table-name-input')
const createTrayBtn = document.querySelector('.create-tray-btn')

createTrayBtn.addEventListener('click', () => {
    nfi.createTray()
})

document.querySelector('.connect-database-btn').addEventListener('click', () => {
    document.getElementsByClassName('connect-database-prompt')[0].style.display='block'
    document.getElementsByClassName('overlay')[0].style.display='block'
})

document.querySelector('.call-connect-database-api-btn').addEventListener('click', () => {
    if (dbNameInput.value) {
        nfi.db.openDB(dbNameInput.value)

        dbNameInput.value = ''

        document.getElementsByClassName('connect-database-prompt')[0].style.display='none'
        document.getElementsByClassName('overlay')[0].style.display='none'
    }
})

document.querySelector('.create-table-btn').addEventListener('click', () => {
    document.getElementsByClassName('create-table-prompt')[0].style.display='block'
    document.getElementsByClassName('overlay')[0].style.display='block'
})

document.querySelector('.call-create-table-api-btn').addEventListener('click', () => {
    if (tableNameInput.value) {
        nfi.db.createTable(tableNameInput.value)

        tableNameInput.value = ''

        document.getElementsByClassName('create-table-prompt')[0].style.display='none'
        document.getElementsByClassName('overlay')[0].style.display='none'
    }
})



document.querySelector('.create-record-btn').addEventListener('click', () => {
    document.getElementsByClassName('create-record-prompt')[0].style.display='block'
    document.getElementsByClassName('overlay')[0].style.display='block'
})

document.querySelector('.call-create-record-api-btn').addEventListener('click', () => {
    if (createRecordTableNameInput.value) {
        nfi.db.createRecord(createRecordTableNameInput.value)

        createRecordTableNameInput.value = ''

        document.getElementsByClassName('create-record-prompt')[0].style.display='none'
        document.getElementsByClassName('overlay')[0].style.display='none'
    }
})

document.querySelector('.fetch-records-btn').addEventListener('click', () => {
    document.getElementsByClassName('fetch-records-prompt')[0].style.display='block'
    document.getElementsByClassName('overlay')[0].style.display='block'
})

document.querySelector('.call-fetch-records-api-btn').addEventListener('click', async () => {
    if (fetchRecordsTableNameInput.value) {
        const records = await nfi.db.fetchRecords(fetchRecordsTableNameInput.value)

        fetchRecordsTableNameInput.value = ''

        console.log(records)

        document.getElementsByClassName('fetch-records-prompt')[0].style.display='none'
        document.getElementsByClassName('overlay')[0].style.display='none'
    }
})

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        document.getElementsByClassName('connect-database-prompt')[0].style.display = 'none'
        document.getElementsByClassName('create-table-prompt')[0].style.display = 'none'
        document.getElementsByClassName('overlay')[0].style.display = 'none'
    }
})