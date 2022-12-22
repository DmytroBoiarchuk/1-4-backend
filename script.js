async function getDataFromServer(someUrl) {
    let stringData = await fetch(someUrl);
    let parsedData = await stringData.json();
    return parsedData.data;
}

function createSearchField(newTable) {
    let input = document.createElement("input");
    document.getElementById("usersTable").insertBefore(input, newTable);
    input.classList.add("search-input");
    let inputType = document.createAttribute("type");
    inputType.value = "text";
    input.setAttributeNode(inputType);
    let buttonSearch = document.createElement("button");
    let textButtonSearch = document.createTextNode("Search By Name");
    document.getElementById("usersTable").insertBefore(buttonSearch, newTable);
    buttonSearch.appendChild(textButtonSearch);
    buttonSearch.classList.add("delete-button")

    buttonSearch.addEventListener("click", () => {
        let id = input.value.toLowerCase();
        if (input.value !== null) {
            document.getElementById(id).scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
            let atr = document.createAttribute("style")
            atr.value = "background-color: #964343";
            document.getElementById(id).setAttributeNode(atr);
            setTimeout(() => {
                document.getElementById(id).removeAttribute("style")
            }, 3000)
        }
    })
}

async function deleteUser(event) {
    let url = config1.apiUrl + "/" + event.currentTarget.getAttribute('data-id')
    await fetch(url, {
        method: 'DELETE',
    }).then(() => {
        document.getElementsByTagName("table")[0].remove();
        DataTable(config1)
    });
}

function CreateDefaultHeaders(config, newTable) {
    document.getElementById(config.parent.slice(1, config.parent.length)).appendChild(newTable);
    let tHead = document.createElement("thead");
    newTable.appendChild(tHead);
    let tr = document.createElement("tr");
    tHead.appendChild(tr);
    let th = document.createElement("th");
    tr.appendChild(th);
    let number = document.createTextNode("№");
    th.appendChild(number);
    if (document.getElementsByClassName("delete-button").length === 0) {
        createSearchField(newTable);
        createAddButton(newTable);
    }
    return tr;

}

function createNewFiledInTab() {
    let newRow = document.createElement("tr");
    document.getElementsByTagName("tbody")[0]
        .insertBefore(newRow, document.getElementsByTagName("tr")[1]);
    for (let i = 0; i < config1.columns.length + 1; i++) {
        let newRowTh = document.createElement("th");
        newRow.appendChild(newRowTh);
        if (i !== 0) {
            let newThInput;
            newThInput = document.createElement("input");
            let inpAttr = document.createAttribute("type");
            inpAttr.value = "text";
            newThInput.setAttributeNode(inpAttr);
            let contentAtr = document.createAttribute("contenteditable");
            contentAtr.value = "true";
            newThInput.setAttributeNode(contentAtr);
            newRowTh.appendChild(newThInput);
            newThInput.classList.add("input-class-name")
            let styleInput = document.createAttribute("style");
            styleInput.value = "min-width: 150px; min-height: 150px";
            if (i !== 0) {
                styleInput.value = "min-width: 150px; min-height: 150px";
                newThInput.setAttributeNode(styleInput);
            } else {
                styleInput.value = "width: 30px; min-height: 150px";
                newThInput.setAttributeNode(styleInput);
            }
        }
    }
}

function createAddButton(newTable) {
    let addButton = document.createElement("button");
    let addButtonText = document.createTextNode("Add New Row");
    addButton.appendChild(addButtonText);
    document.getElementById("usersTable").insertBefore(addButton, newTable);
    addButton.classList.add("delete-button");
    let addAtr = document.createAttribute("style")
    addAtr.value = "margin-top: 20px"
    addButton.setAttributeNode(addAtr);
    addButton.addEventListener("click", createNewFiledInTab)
}

function createBody(newTable, tr, config) {
    for (let i = 0; i < config.columns.length; i++) {
        let newTh = document.createElement("th");
        let value = document.createTextNode(config.columns[i].title);
        tr.appendChild(newTh);
        newTh.appendChild(value);
    }
    let deleteTh = document.createElement("th");
    let deleteThValue = document.createTextNode("DELETE");
    tr.appendChild(deleteTh);
    deleteTh.appendChild(deleteThValue);
    let tBody = document.createElement("tbody");
    newTable.appendChild(tBody);
    return tBody;
}

function builtPartsOfTAble(dataLength, tBody, config, data) {
    for (let j = 0; j < dataLength; j++) {
        let tr2 = document.createElement("tr");
        let tr2Id = document.createAttribute("id");
        tr2Id.value = data[Object.keys(data)[j]].name.toLowerCase();
        tr2.setAttributeNode(tr2Id);
        tBody.appendChild(tr2);
        let newTh = document.createElement("th");
        let valueN = document.createTextNode(Object.keys(data)[j]);
        tr2.appendChild(newTh);
        newTh.appendChild(valueN);
        for (let i = 0; i < config.columns.length; i++) {
            let newTh2 = document.createElement('th');
            let valueTh;
            if (data !== null && !('apiUrl' in config)) {
                valueTh = document.createTextNode(data[j][config.columns[i].value])
            } else {
                if (data[Object.keys(data)[j]][config.columns[i].value].includes('.jpg')) {
                    valueTh = document.createElement("img");
                    let src = document.createAttribute("src");
                    src.value = data[Object.keys(data)[j]][config.columns[i].value];
                    valueTh.setAttributeNode(src);
                } else {
                    valueTh = document.createTextNode(data[Object.keys(data)[j]][config.columns[i].value])
                }
            }
            newTh2.appendChild(valueTh);
            tr2.appendChild(newTh2);

        }
        ////
        let deleteButtonCell = document.createElement('th');
        let deleteButton = document.createElement('button');
        let buttonText = document.createTextNode("DELETE");
        let attributeId = document.createAttribute("data-id");
        attributeId.value = Object.keys(data)[j];
        deleteButton.setAttributeNode(attributeId);
        tr2.appendChild(deleteButtonCell);
        deleteButtonCell.appendChild(deleteButton);
        deleteButton.appendChild(buttonText);
        deleteButton.className = "delete-button";
        deleteButton.onclick = deleteUser;
        ///
    }
}

function DataTable(config, data = null) {
    //create header and default N%
    let newTable = document.createElement("table");
    let tr = CreateDefaultHeaders(config, newTable);
    let tBody = createBody(newTable, tr, config);
    if (data !== null && !('apiUrl' in config)) {
        builtPartsOfTAble(data.length, tBody, config, data);
    } else {
        getDataFromServer(config.apiUrl).then((data) => {
            builtPartsOfTAble(Object.keys(data).length, tBody, config, data);
        })

    }
}

async function makePost(url, body) {
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
}

function dataIsValid() {
    let inputsDatas = document.querySelectorAll(".input-class-name");
    for (let j = 1; j < inputsDatas.length; j++) {
        if (inputsDatas[j].value === '') {
            return false;
        }
    }
    return true;
}

document.addEventListener('keyup', event => {
    if (event.code === 'Enter') {
        if (dataIsValid()) {
            let inputsData = document.querySelectorAll(".input-class-name");
            const obj = {
                name: inputsData[0].value,
                surname: inputsData[1].value,
                avatar: inputsData[2].value,
                birthday: inputsData[3].value,
            }
            let newUrl = config1.apiUrl;
            makePost(newUrl, obj).then(() => {
                document.getElementsByTagName("table")[0]
                    .remove();
                DataTable(config1);
            });
        } else {
            alert("You have miss input field(s)!")
        }
    }
});


const config1 = {
    parent: '#usersTable',
    columns: [
        {title: 'Name', value: 'name'},
        {title: 'Sure Name', value: 'surname'},
        {title: 'Avatar', value: 'avatar'},
        {title: 'Birth Day', value: 'birthday'}
    ],
    apiUrl: "https://mock-api.shpp.me/DmytroBoiarchuk446/users"
};

const users = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12, length: 45},
    {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15, length: 25},
    {id: 30052, name: 'Илюха', surname: 'Иванов', age: 19, length: 'Нет информации'},

    {id: 30053, name: 'Дима', surname: 'Степкин', age: 77, length: 50},

    {id: 30054, name: 'Игорь', surname: 'Пупкин', age: 14000, length: 999},

];

DataTable(config1);
