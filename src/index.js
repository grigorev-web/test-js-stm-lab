// Массив пользователей
let users;

// Загружаем данные
fetchUsers();

// Загрузить данные снова
document.getElementById("fetch-btn").onclick = () => fetchUsers();

// Обработчик поля для ввода
let filterUsersDebounce = debounce(filterUsers, 2000);
document.getElementById("filter").oninput = (e) => {
  filterUsersDebounce(e);
};

// обработчик кнопки сброса "clear"
document.getElementById("clear-btn").onclick = () => {
  document.getElementById("filter").value = "";
  filterUsers("clear");
};

// декоратор debounce
function debounce(f, ms) {
  // При первом событии срабатывает моментально
  // Функция вызывается не чаще ms миллисекунд
  // При частых нажатиях срабатывает только последнее событие
  //
  let isCooldown = false;
  let timer;
  let timer2;
  return function () {
    if (isCooldown) {
      clearTimeout(timer);
      clearTimeout(timer2);
      timer = setTimeout(() => {
        f.apply(this, arguments);
        //console.log("2");
        isCooldown = false;
      }, 2000);
      return;
    }
    isCooldown = true;
    f.apply(this, arguments);
    //console.log("1");
    clearTimeout(timer);
    clearTimeout(timer2);
    timer2 = setTimeout(() => {
      isCooldown = false;
    }, ms);
  };
}
// fetch users from endpoint
function fetchUsers() {
  // индикатор загрузки
  document.getElementById("table").innerHTML = `<img src="Loading-bar.gif">`;
  // получение данных
  fetch("https://randomuser.me/api/?results=15")
    .then((response) => response.json())
    .then((result) => {
      // Записываем результат в массив users
      users = result.results;
      // отображаем результаты
      showTable(users);
    });
}

// Фунция - фильтр пользователей
function filterUsers(e) {
  // если событие вызвано нажатием на кнопку "clear"
  if (e === "clear") {
    // отображаем всех
    showTable(users);
    return;
  }
  // фильтр массива users
  let filteredUsers = users.filter((user) => {
    let firstName = user.name.first.toUpperCase();
    let lastName = user.name.last.toUpperCase();
    let target = e.target.value.toUpperCase();
    return firstName.includes(target) || lastName.includes(target);
  });
  // если поле пустое отображаем всех
  if (e.target.value === "") filteredUsers = users;
  showTable(filteredUsers);
}

//  Отображение пользователей
function showTable(users) {
  // формируем html таблицы
  let table;
  // checking the results for emptiness
  if (users.length === 0) table = "<p>No records found</p>";
  else
    table = `
  <table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Picture</th>
      <th scope="col">Location</th>
      <th scope="col">Email</th>
      <th scope="col">Phone</th>
      <th scope="col">Registered date</th>
    </tr>
  </thead>
  <tbody>`;
  // цикл по users для генерации строк таблицы
  users.map((user) => {
    // get formated date string
    let registeredDate = dateFormat(user.registered.date);

    table += `
    <tr>
      <th scope="row">${user.name.first + " " + user.name.last}</th>
      <td class="photo"><img src="${user.picture.thumbnail}">
        <p class="photo-tip">
          <img src="${user.picture.large}">
        </p>
      </td>
      <td>${user.location.state + " " + user.location.city}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${registeredDate}</td>
    </tr>
    <tr>`;
  });

  table += `</tbody>
  </table>`;
  document.getElementById("table").innerHTML = table;
}

// Форматирование даты
function dateFormat(date) {
  // format date to dd.MM.yyyy
  // day of month
  let dd = new Date(date).getDate();
  // month
  let MM =
    new Date(date).getMonth() < 10
      ? "0" + new Date(date).getMonth()
      : new Date(date).getMonth();
  // year
  let yyyy = new Date(date).getFullYear();
  // return formatted string
  return dd + "." + MM + "." + yyyy;
}
