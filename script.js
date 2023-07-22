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

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
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
    );
}
function renderProperTime(timeInMinutes){
    const hours = (parseInt(timeInMinutes) / 60).toFixed(0);
    const minutes = (parseInt(timeInMinutes) % 60).toFixed(0);
    return parseInt(hours) > 0 ? hours +"h " + minutes +"m" : minutes +"m";
}


function renderTask(taskId, title, description, status) {
    // console.log('Zadanie o id :', taskId);
    // console.log('tytuł to:', title);
    // console.log('opis to:', description);
    // console.log('status to:', status);
    // console.log('*'.repeat(50));
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
    const ul = document.createElement("ul");
    ul.className = "list-group list-group-flush";
    section.appendChild(ul);
    apiListOperationsForTask(taskId).then(resp => resp.data.forEach(function (el){
        renderOperation(ul, status, el.id, el.description, el.timeSpent);
        console.log(el);
    }))


}


// <section className="card mt-5 shadow-sm">-->
//     <!--    <div class="card-header d-flex justify-content-between align-items-center">-->
//     <!--      <div>-->
//     <!--        <h5>Przykład zamkniętego zadania</h5>-->
//     <!--        <h6 class="card-subtitle text-muted">Zamknięte zadanie da się tylko usunąć</h6>-->
//     <!--      </div>-->
//     <!--      <div>-->
//                 <button className="btn btn-dark btn-sm">Finish</button>-- >
//     <!--        <button class="btn btn-outline-danger btn-sm ml-2">Delete</button>-->
//     <!--      </div>-->
//     <!--    </div>-->
//     <!--    <ul class="list-group list-group-flush">-->

function renderOperation(ul, status, id, description, timeSpent){
    console.log(status);
    console.log(id);
    console.log(description);
    console.log(timeSpent);
    console.log(ul);


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

function addTask(event){
    event.preventDefault();
    const title = event.target.children[0].firstElementChild.value;
    const description = event.target.children[1].firstElementChild.value;
    if( title.length >= 5 && description.length >= 5) {
        apiCreateTask(title, description)
            .catch( resp => console.log(resp));
    }

}



document.addEventListener('DOMContentLoaded', function() {
    const addForm = document.querySelector(".js-task-adding-form");
    addForm.addEventListener("submit", addTask);




    apiListTasks()
        .then(resp => resp.data.forEach(function (el){
            renderTask(el.id, el.title, el.description, el.status);
        }));


});