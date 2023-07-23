const apikey = 'f67a43c6-8a88-4a4f-9a5b-d9c63285fc57';
const apihost = 'https://todo-api.coderslab.pl';

function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey }
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiDeleteTasks(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            method: 'DELETE',
            headers: {
                Authorization: apikey
            }
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: { Authorization: apikey }
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('apiListOperationsForTask');
            }
            return resp.json();
        }
    );
}
function renderProperTime(timeInMinutes){
    const hours = (parseInt(timeInMinutes) / 60).toFixed(0);
    const minutes = (parseInt(timeInMinutes) % 60).toFixed(0);
    return parseInt(hours) > 0 ? hours +"h " + minutes +"m" : minutes +"m";
}

function renderTask(taskId, title, description, status) {
    const main = document.querySelector("#app");
    const section = document.createElement("section");
    section.className = "card mt-5 shadow-sm";
    main.appendChild(section);
    const mainDiv = document.createElement("div");
    mainDiv.className = "card-header d-flex justify-content-between align-items-center";
    section.appendChild(mainDiv);
    const titleDiv = document.createElement('div');
    mainDiv.appendChild(titleDiv);
    titleDiv.appendChild(document.createElement("h5"));
    titleDiv.firstElementChild.innerText = title;
    const h6 = document.createElement("h6");
    h6.innerText = description;
    h6.className = "card-subtitle text-muted";
    titleDiv.appendChild(h6);
    const buttonDiv = document.createElement('div');
    mainDiv.appendChild(buttonDiv);
    if( status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = "btn btn-dark btn-sm";
        finishButton.innerText = 'Finish';
        buttonDiv.appendChild(finishButton);
    }
    const deleteButton = document.createElement('button');
    deleteButton.className = "btn btn-outline-danger btn-sm ml-2";
    deleteButton.innerText = 'Delete';
    buttonDiv.appendChild(deleteButton);
    deleteButton.addEventListener("click", function (event){
        apiDeleteTasks(taskId)
            .then( function (resp){
                section.remove();
            });
    }); // usunięcie taska
    const ul = document.createElement("ul");
    ul.className = "list-group list-group-flush";
    section.appendChild(ul);

    apiListOperationsForTask(taskId).then(resp => {
        if (resp.data.length > 0){
            resp.data.forEach(function (el){
                renderOperation(ul, status, el.task.id, el.description, el.timeSpent);
            });
        }
    });
    if( status === 'open') {
        const divOperationAdd = document.createElement('div');
        divOperationAdd.classList.add('card-body'); // tutaj może być wyjebka
        section.appendChild(divOperationAdd);
        const form = document.createElement('form');
        divOperationAdd.appendChild(form);
        const divInput = document.createElement('div');
        divInput.className = "input-group";
        form.appendChild(divInput);
        const input = document.createElement('input');
        input.type = "text";
        input.placeholder = "Operation description";
        input.className = "form-control";
        input.minLength = 5;
        divInput.appendChild(input);
        const divInputButton = document.createElement('div');
        divInputButton.className = "input-group-append";
        divInput.appendChild(divInputButton);
        const inputButton = document.createElement('button');
        inputButton.className = "btn btn-info";
        inputButton.innerText = "Add";
        divInputButton.appendChild(inputButton);
        form.addEventListener('submit', function (event){
            event.preventDefault();
            const operationDescription = event.currentTarget.firstElementChild.firstElementChild.value;
            event.currentTarget.firstElementChild.firstElementChild.value = "";
            apiCreateOperationForTask(taskId, operationDescription)
                .then(function (resp){
                    renderOperation(ul, status, resp.data.id, resp.data.description, resp.data.timeSpent);
                });
        });

    }


}


//<div class="card-body">-->
// <!--      <form>-->
// <!--        <div class="input-group">-->
// <!--          <input type="text" placeholder="Operation description" class="form-control" minlength="5">-->
// <!--          <div class="input-group-append">-->
// <!--            <button class="btn btn-info">Add</button>-->
// <!--          </div>-->
// <!--        </div>-->
// <!--      </form>-->
// <!--    </div>-->
// <!--  </section>-->

function renderOperation(ul, status, id, description, timeSpent){
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    ul.appendChild(li);
    const mainDiv = document.createElement('div');
    mainDiv.innerText = description;
    li.appendChild(mainDiv);
    const span = document.createElement('span');
    span.className = "badge badge-success badge-pill ml-2";
    span.innerText = renderProperTime(timeSpent);
    mainDiv.appendChild(span);
    if( status === 'open') {
        const buttonDiv = document.createElement('div');
        li.appendChild(buttonDiv);
        const button15Minutes = document.createElement('button');
        button15Minutes.className = "btn btn-outline-success btn-sm mr-2";
        button15Minutes.innerText = '+15m';
        buttonDiv.appendChild(button15Minutes);
        const button1Hour = document.createElement('button');
        button1Hour.className = "btn btn-outline-success btn-sm mr-2";
        button1Hour.innerText = '+1h';
        buttonDiv.appendChild(button1Hour);
        const buttonDelete = document.createElement('button');
        buttonDelete.className = "btn btn-outline-danger btn-sm";
        buttonDelete.innerText = 'Delete';
        buttonDiv.appendChild(buttonDelete);
    }

}
//              <li className="list-group-item d-flex justify-content-between align-items-center">-->
//     <!--        <div>
//     <!--          W otwartym zadaniu istniejącym operacjom można dodać czas
//     <!--          <span class="badge badge-success badge-pill ml-2">2h 0m</span>-->
//     <!--        </div>-->
//     <!--        <div>-->
//     <!--          <button class="btn btn-outline-success btn-sm mr-2">+15m</button>-->
//     <!--          <button class="btn btn-outline-success btn-sm mr-2">+1h</button>-->
//     <!--          <button class="btn btn-outline-danger btn-sm">Delete</button>-->
//     <!--        </div>-->
//     <!--      </li>-->
//     <!--      <li class="list-group-item d-flex justify-content-between align-items-center">-->
//     <!--        <div>-->
//     <!--          W otwartym zadaniu operacje można także usunąć-->
//     <!--          <span class="badge badge-success badge-pill ml-2">15m</span>-->
//     <!--        </div>-->
//     <!--        <div>-->
//     <!--          <button class="btn btn-outline-success btn-sm mr-2">+15m</button>-->
//     <!--          <button class="btn btn-outline-success btn-sm mr-2">+1h</button>-->
//     <!--          <button class="btn btn-outline-danger btn-sm">Delete</button>-->
//     <!--        </div>-->
//     <!--      </li>-->
//     <!--    </ul>-->


function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description, status: 'open' }),
            method: 'POST'
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}
// /api/tasks/:id/operations
function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + '/api/tasks/' + taskId + "/operations",
        {
            method: 'POST',
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description, timeSpent: 0 })

        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function addTask(event){
    event.preventDefault();
    const title = event.target.children[0].firstElementChild.value;
    const description = event.target.children[1].firstElementChild.value;
    event.target.children[0].firstElementChild.value = "";
    event.target.children[1].firstElementChild.value = "";
    if( title.length >= 5 && description.length >= 5) {
        apiCreateTask(title, description)
            .then( resp =>  renderTask( resp.data.id, resp.data.title, resp.data.description, resp.data.status))
            .catch( resp => console.log(resp));
    }

}



document.addEventListener('DOMContentLoaded', function() {
    const addForm = document.querySelector(".js-task-adding-form");
    addForm.addEventListener("submit", addTask);




    apiListTasks()
        .then(resp => resp.data.forEach(function (el){
            console.log(resp);
            renderTask(el.id, el.title, el.description, el.status);
        }));


});