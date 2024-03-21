// Função para carregar os itens da lista ao carregar a página
window.onload = function() {
    loadItems();
};

// Função para carregar os itens da lista do servidor
function loadItems() {
    fetch('/items')
        .then(response => response.json())
        .then(data => {
            const itemList = document.getElementById("itemList");
            itemList.innerHTML = ""; // Limpa a lista antes de adicionar os novos itens
            data.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item.name;

                // Adiciona botão de remoção para cada item
                const removeBtn = document.createElement("button");
                removeBtn.textContent = "Remove";
                removeBtn.onclick = function() {
                    removeItem(item.id);
                };

                listItem.appendChild(removeBtn);
                itemList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading items:', error));
}

// Função para adicionar um item à lista
function addItem() {
    const itemInput = document.getElementById("itemInput");
    const itemName = itemInput.value.trim();

    if (itemName !== "") {
        fetch('/addItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: itemName })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadItems(); // Recarrega os itens da lista após adicionar um novo item
            itemInput.value = ""; // Limpa o campo de entrada
        })
        .catch(error => console.error('Error adding item:', error));
    }
}

// Função para remover um item da lista
function removeItem(itemId) {
    fetch(`/removeItem/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadItems(); // Recarrega os itens da lista após remover um item
    })
    .catch(error => console.error('Error removing item:', error));
}
