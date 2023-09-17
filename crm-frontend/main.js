(() => {
  const CORE = document.getElementById('table');
  const BODY = document.getElementsByTagName('body')[0];
  const SEARCH_INPUT = document.getElementById('search-input');
  const SEARCH_BLOCK = document.getElementsByClassName('header__autocomplete-block')[0];
  const VIEWPORT = window.innerWidth;
  const COLUMN_COUNT = 6;
  const AUTOCOMPLETE_LIMIT = 5;
  // Параметры, которые обнуляются,
  // или автоматически расчитываются при загрузке страницы
  let mobileRes = false;
  if (VIEWPORT < 768) {
    mobileRes = true;
  }

  let searchedArray = [];
  location.hash = '';
  (async () => {
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    if (data.length) {
      tableSort(sortById, ascendingSortNumbers);
    }
  })();

  // Раздел "Работа с сервером"
  async function saveToServer(data) {
    const response = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return checkServerResponse(response);
  }

  async function changeOnServer(data, id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return checkServerResponse(response);
  }

  async function deleteFromServer(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE',
    });
    return checkServerResponse(response);
  }

  function checkServerResponse(resp) {
    if (resp.status === 200 || resp.status === 201) {
      return true;
    }
    if (resp.status === 404) {
      removeError();
      showError('Клиент не найден');
    } else if (resp.status >= 500) {
      removeError();
      showError('Странно, но сервер сломался');
    } else {
      removeError();
      showError('Что-то пошло не так...');
    }
    return false;
  }

  async function locationHashChanged() {
    const hash = location.hash.slice(1);
    const changeButton = document.getElementById(`table-change-${hash}`);
    if (changeButton) {
      changeButton.innerHTML =
        `<svg class="table-action-loading" width="12" height="12" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="Vector" d="M2 20C2 29.941 10.059 38 20 38C29.941 38 38 29.941 38 20C38 10.059 29.941 2 20 2C17.6755 2 15.454 2.4405
            13.414 3.243" stroke="#9873FF" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>
          Изменить`;
    }
    const response = await fetch(`http://localhost:3000/api/clients`);
    const data = await response.json();
    for (const client of data) {
      if (client.id === hash) {
        createModalForm('Изменить данные', changeOnServer, 'Сохранить', createDeleteModal,
          'Удалить клиента', client.id, client.surname, client.name,
          client.lastName, client.contacts);
        document.getElementById('modal-close').focus();
        setDefaultChangeIcon(changeButton);
        break;
      }
    }
  }
  window.onhashchange = locationHashChanged;

  // Раздел "Форматирование данных"
  function formatDates(arr) {
    for (const client of arr) {
      client.createdAt = new Date(client.createdAt);
      client.updatedAt = new Date(client.updatedAt);
    }
  }

  function getClientData(cliebntObj) {
    const id = cliebntObj.id;
    const fullName = `${cliebntObj.surname} ${cliebntObj.name} ${cliebntObj.lastName}`;
    // Функция-помошник
    function getDateTime(column) {
      const day = (column.getDate() < 10) ?
        `0${column.getDate()}` : column.getDate();
      const month = (column.getMonth() + 1 < 10) ?
        `0${column.getMonth() + 1}` : column.getMonth() + 1;
      const date = `${day}.${month}.${cliebntObj.createdAt.getFullYear()}`;

      const hour = (column.getHours() < 10) ?
        `0${column.getHours()}` : column.getHours();
      const minute = (column.getMinutes() < 10) ?
        `0${column.getMinutes()}` : column.getMinutes();
      const time = `${hour}:${minute}`;
      return { date, time };
    }
    const created = getDateTime(cliebntObj.createdAt);
    const updated = getDateTime(cliebntObj.updatedAt);

    return { id, fullName, created, updated };
  }

  function getContact(formattingContact) {
    const contactLink = document.createElement('a');
    contactLink.classList.add('table__contact');
    contactLink.setAttribute('target', '_blank');
    contactLink.ariaLabel = `Ссылка на контакт клиента ${formattingContact.value}`;

    const tooltipBlock = document.createElement('div');
    tooltipBlock.classList.add('table__tooltip-block');
    const tooltipText = document.createElement('span');
    tooltipText.classList.add('table__tooltip-value');
    const phoneLink = formattingContact.value.trim().replaceAll(/\s/g, '')
      .replaceAll(/-/g, '').replaceAll(/\(/g, '').replaceAll(/\)/g, '');
    const contactValueFormatted = formattingContact.value.trim().replaceAll(/\s/g, '&nbsp;')
      .replaceAll(/-/g, '&#8209;');

    switch (formattingContact.type) {
      case 'Телефон': contactLink.innerHTML =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="phone" opacity="0.7">
            <circle id="Ellipse 34" cx="8" cy="8" r="8" fill="#9873FF"/>
            <path id="Vector" d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222
             9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111
             5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556
             12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
          </g>
        </svg>`;
        contactLink.href = `tel:${phoneLink}`;
        tooltipText.innerHTML = contactValueFormatted;
        break;
      case 'Доп. телефон': contactLink.innerHTML =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="phone" opacity="0.7">
            <circle id="Ellipse 34" cx="8" cy="8" r="8" fill="#9873FF"/>
            <path id="Vector" d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222
             9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111
             5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556
             12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
          </g>
        </svg>`;
        contactLink.href = `tel:${phoneLink}`;
        tooltipText.innerHTML = `Доп.&nbsp;телефон:&nbsp;<span class="table__tooltip-link">${contactValueFormatted}</span>`;
        break;
      case 'Email': contactLink.innerHTML =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="mail" opacity="0.7">
            <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8
            0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12
            5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2
            6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8
            6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
          </g>
        </svg>`;
        contactLink.href = `mailto:${formattingContact.value}`;
        tooltipText.textContent = contactValueFormatted;
        break;
      case 'Facebook': contactLink.innerHTML =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="fb" opacity="0.7">
            <path id="fb_2" d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199
            16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859
            11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112
            10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16
            3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
          </g>
        </svg>`;
        contactLink.href = `${formattingContact.value}`;
        tooltipText.innerHTML = `Facebook:&nbsp;<span class="table__tooltip-link">${contactValueFormatted}</span>`;
        break;
      case 'Vk': contactLink.innerHTML =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="vk" opacity="0.7">
              <path id="Vector" d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16
              12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601
              9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055
              11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853
              10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366
              9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596
              8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463
              4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454
              2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166
              4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059
              6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513
              6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428
              6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136
              4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317
              7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358
              5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483
              5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817
              6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
          </g>
        </svg>`;
        contactLink.href = `${formattingContact.value}`;
        tooltipText.innerHTML = `Vk:&nbsp;<span class="table__tooltip-link">${contactValueFormatted}</span>`;
        break;
      default: contactLink.innerHTML =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="mail" opacity="0.7">
            <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172
            0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24
            13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83
            9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45
            5.015 8.995 5 9.99Z" fill="#9873FF"/>
          </g>
        </svg>`;
        contactLink.href = `${formattingContact.value}`;
        tooltipText.innerHTML = `${formattingContact.type}:&nbsp;<span class="table__tooltip-link">${contactValueFormatted}</span>`;
        break;
    }
    tooltipBlock.append(tooltipText);
    contactLink.append(tooltipBlock);
    return contactLink;
  }

  function getContactsDataFromForm(formattedBlock) {
    const formattedContacts = formattedBlock.getElementsByClassName('form__contact');
    const contactsArr = [];
    for (const formattedContact of formattedContacts) {
      const select = formattedContact.getElementsByClassName('form__custom-selected')[0];
      const input = formattedContact.getElementsByClassName('form__contact-input')[0];
      const contactObj = {
        type: select.textContent,
        value: input.value
      };
      contactsArr.push(contactObj);
    }
    return contactsArr;
  }

  // Раздел "Отрисовка таблицы"
  function renderClientsTable(clientsArray) {
    SEARCH_BLOCK.innerHTML = '';
    formatDates(clientsArray);
    const body = CORE.createTBody();
    body.classList.add('table__body', 'non-display');
    for (let i = 0; i < clientsArray.length; i++) {
      const clientData = getClientData(clientsArray[i]);
      const tr = body.insertRow();
      tr.classList.add('table__row');
      tr.id = `table-row-${i + 1}`;

      let j = 0;
      while (j < COLUMN_COUNT) {
        const td = document.createElement('td');
        td.classList.add('table__column', `table__column--${i + 1}`);
        tr.append(td);
        ++j;
      }

      const [td1, td2, td3, td4, td5, td6] =
        body.getElementsByClassName(`table__column--${i + 1}`);
      // Столбец "ID"
      td1.textContent = clientData.id;
      td1.classList.add('table__column--id');

      // Столбец "Фамилия Имя Отчество"
      td2.textContent = clientData.fullName;
      td2.classList.add('table__column--name');

      // Столбец "Дата и время создания" и "Последние изменения"
      // Функция-помошник
      function addDateTimeColumns(column, data) {
        const spanDate = document.createElement('p');
        spanDate.classList.add('table__text', 'table__text--date');
        spanDate.textContent = clientData[data].date;

        const spanTime = document.createElement('p');
        spanTime.classList.add('table__text', 'table__text--time');
        spanTime.textContent = clientData[data].time;

        column.classList.add(`table__column--${data}`);
        column.append(spanDate, spanTime);
      }

      addDateTimeColumns(td3, 'created');
      addDateTimeColumns(td4, 'updated');

      // Столбец	"Контакты"
      td5.classList.add('table__column--contacts');
      const contactsData = clientsArray[i].contacts;
      const contactsDisplayBlock = document.createElement('div');
      contactsDisplayBlock.classList.add('table__contacts-block', 'flex');
      for (let k = 0; k < contactsData.length; k++) {
        const contactFormatted = getContact(contactsData[k]);
        if (k > 3) {
          contactFormatted.classList.add('non-display');
        }
        contactsDisplayBlock.append(contactFormatted);
      }
      td5.append(contactsDisplayBlock);

      const contacts = td5.getElementsByClassName('table__contact');
      if (contacts.length > 4) {
        const contactPlus = document.createElement('button');
        contactPlus.classList.add('btn', 'table__contacts-plus', 'btn-reset');
        contactPlus.textContent = `+${contacts.length - 4}`;
        contactsDisplayBlock.append(contactPlus);
        contactPlus.addEventListener('click', () => {
          const contactsHidden = contactsDisplayBlock.querySelectorAll('.non-display');
          for (const contact of contactsHidden) {
            contact.classList.remove('non-display');
          }
          calculateTooltipX();
          contactPlus.classList.add('non-display');
        });
      }
      // Функция-помошник
      function calculateTooltipX() {
        for (const tooltip of CORE.getElementsByClassName('table__tooltip-block')) {
          const width = tooltip.clientWidth;
          tooltip.style.marginLeft = `-${width / 2}px`;
        }
      }

      // Столбец "Действия"
      td6.classList.add('table__column--actions');
      const changeButton = document.createElement('button');
      changeButton.classList.add('table__change', 'btn', 'btn-reset', 'flex');
      changeButton.id = `table-change-${clientData.id}`;
      setDefaultChangeIcon(changeButton);
      changeButton.ariaLabel = 'Нажмите чтобы изменить данные клиента';
      changeButton.addEventListener('click', () => {
        location.hash = `#${clientsArray[i].id}`;
      });
      td6.append(changeButton);

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('table__delete', 'btn', 'btn-reset', 'flex');
      deleteButton.innerHTML =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="cancel" opacity="0.7" clip-path="url(#clip0_216_224)">
      <path id="Vector" d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14
      4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8
      5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846
      11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
      </g>
      <defs>
      <clipPath id="clip0_216_224">
      <rect width="16" height="16" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      Удалить`;
      deleteButton.ariaLabel = 'Нажмите чтобы удалить контакт';
      deleteButton.addEventListener('click', () => {
        createDeleteModal(clientsArray[i].id);
        document.getElementById('modal-close').focus();
      });
      td6.append(deleteButton);
    }
    // Отменить изменения параметров, произведенные для демонстрации экрана загрузки
    document.getElementById('loading-overlay').remove();
    body.classList.remove('non-display');
    calculateTooltipX();
    if (mobileRes) {
      const scrollBlock = document.getElementsByClassName('table-block')[0];
      scrollBlock.style.overflowX = 'scroll';
    }
    const addClient = document.getElementsByClassName('add-client')[0];
    const addClientBtn = document.getElementById('add-client-btn');
    addClientBtn.disabled = false;
    addClient.classList.remove('add-client--loading');
  }

  async function reRenderTable(dataArr) {
    document.getElementsByClassName('table__body')[0].remove();
    loadingAction(CORE, 'table', `${CORE.clientWidth}px`, '337px');
    if (!dataArr) {
      const response = await fetch('http://localhost:3000/api/clients');
      const data = await response.json();
      renderClientsTable(data);
    } else { renderClientsTable(dataArr); }
  }

  // Раздел "Работа с модальными окнами"
  function createModalBlock() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content');

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      location.hash = '';
      modal.remove();
    });
    const modalClose = document.createElement('button');
    modalClose.classList.add('modal__close', 'btn-reset');
    modalClose.id = 'modal-close';
    modalClose.innerHTML = `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2332 7.73333L21.2665 6.76666L14.4998 13.5334L7.73318
    6.7667L6.76652 7.73336L13.5332 14.5L6.76654 21.2667L7.73321 22.2333L14.4998 15.4667L21.2665 22.2334L22.2332
    21.2667L15.4665 14.5L22.2332 7.73333Z" fill="#B0B0B0"/>
    </svg>`;
    modalClose.ariaLabel = 'Нажмите чтобы закрыть модальное окно';
    modalClose.addEventListener('click', () => closeModal());
    modalContent.append(modalClose);
    return { modal, modalContent };
  }

  function addSubmitBlock(submitBtnText, revertBtnText) {
    const submitBlock = document.createElement('div');
    submitBlock.classList.add('form__submit-block', 'flex');
    const submitBtn = document.createElement('button');
    submitBtn.classList.add('btn', 'form__button-submit', 'btn-reset');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.textContent = submitBtnText;

    const revertBtn = document.createElement('button');
    revertBtn.classList.add('btn', 'form__button-revert', 'btn-reset');
    revertBtn.setAttribute('type', 'button');
    revertBtn.textContent = revertBtnText;

    submitBlock.append(submitBtn);
    submitBlock.append(revertBtn);
    return { submitBlock, submitBtn, revertBtn };
  }

  function createModalForm(titleText, submitAction, submitText, revertAction, revertText,
    clientId = '', clientSurname = '', clientName = '', clientLastname = '', clientContacts = '') {
    SEARCH_BLOCK.innerHTML = '';
    const modal = createModalBlock().modal;
    const modalContent = createModalBlock().modalContent;

    const modalTitleBlock = document.createElement('div');
    modalTitleBlock.classList.add('modal__title-block');
    const modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal__title');
    modalTitle.textContent = titleText;
    modalTitleBlock.append(modalTitle);
    const modalIdDisplay = document.createElement('span');
    modalIdDisplay.classList.add('modal__id-display');
    modalIdDisplay.textContent = clientId ? `ID: ${clientId}` : '';
    modalTitleBlock.append(modalIdDisplay);
    modalContent.append(modalTitleBlock);

    const form = document.createElement('form');
    form.classList.add('form', 'modal__form');
    form.setAttribute('name', 'form');
    const formInputs = document.createElement('div');
    formInputs.classList.add('form__inputs');
    const list = document.createElement('ul');
    list.classList.add('form-list', 'list-reset', 'flex');
    formInputs.append(list);
    form.append(formInputs);
    const textInputs = addTextInputs(list, form, clientSurname, clientName, clientLastname);

    const contactsFormBlock = document.createElement('div');
    contactsFormBlock.classList.add('form__contacts-block', 'flex');
    const contactsBtn = document.createElement('button');
    contactsBtn.classList.add('btn', 'form__contacts-add', 'btn-reset', 'flex');
    contactsBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="add_circle_outline" clip-path="url(#clip0_224_3502)">
    <path id="Vector" d="M7.99998 4.66671C7.63331 4.66671 7.33331 4.96671 7.33331 5.33337V7.33337H5.33331C4.96665
    7.33337 4.66665 7.63337 4.66665 8.00004C4.66665 8.36671 4.96665 8.66671 5.33331 8.66671H7.33331V10.6667C7.33331
    11.0334 7.63331 11.3334 7.99998 11.3334C8.36665 11.3334 8.66665 11.0334 8.66665 10.6667V8.66671H10.6666C11.0333
    8.66671 11.3333 8.36671 11.3333 8.00004C11.3333 7.63337 11.0333 7.33337 10.6666 7.33337H8.66665V5.33337C8.66665
    4.96671 8.36665 4.66671 7.99998 4.66671ZM7.99998 1.33337C4.31998 1.33337 1.33331 4.32004 1.33331 8.00004C1.33331
    11.68 4.31998 14.6667 7.99998 14.6667C11.68 14.6667 14.6666 11.68 14.6666 8.00004C14.6666 4.32004 11.68 1.33337
    7.99998 1.33337ZM7.99998 13.3334C5.05998 13.3334 2.66665 10.94 2.66665 8.00004C2.66665 5.06004 5.05998 2.66671
    7.99998 2.66671C10.94 2.66671 13.3333 5.06004 13.3333 8.00004C13.3333 10.94 10.94 13.3334 7.99998 13.3334Z" fill="none"/>
    </g>
    <defs>
    <clipPath id="clip0_224_3502">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    <span class="form__add-contact">Добавить контакт</span>`;
    contactsBtn.setAttribute('type', 'button');
    contactsFormBlock.append(contactsBtn);
    const otherLists = contactsFormBlock.getElementsByClassName('form__custom-select');
    contactsBtn.addEventListener('click', () => {
      if (otherLists.length >= 10) {
        contactsBtn.classList.add('non-display');
      } else {
        for (const customSelectList of otherLists) {
          closeCustomSelect(customSelectList);
        }
        addContactSelect(contactsFormBlock, otherLists, contactsBtn);
      }
    });

    if (clientContacts) {
      for (const existingContact of clientContacts) {
        addContactSelect(contactsFormBlock, otherLists, contactsBtn,
          existingContact.type, existingContact.value);
      }
    }
    form.append(contactsFormBlock);

    // Создать кнопки отправки формы и отмены(или удаления)
    const submit = addSubmitBlock(submitText, revertText);
    const submitBlock = submit.submitBlock;
    form.append(submitBlock);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const contactsData = getContactsDataFromForm(contactsFormBlock);

      const nameBase = textInputs.nameInput.value.trim();
      const nameFormatted = `${nameBase.slice(0, 1).toUpperCase()}${nameBase.slice(1).toLowerCase()}`;
      const surnameBase = textInputs.surnameInput.value.trim();
      const surnameFormatted = `${surnameBase.slice(0, 1).toUpperCase()}${surnameBase.slice(1).toLowerCase()}`;
      const lastNameBase = textInputs.lastnameInput.value.trim();
      const lastNameFormatted = `${lastNameBase.slice(0, 1).toUpperCase()}${lastNameBase.slice(1).toLowerCase()}`;

      const clientNewObj = {
        name: nameFormatted,
        surname: surnameFormatted,
        lastName: lastNameFormatted,
        contacts: contactsData
      };
      const invalidContacts = form.getElementsByClassName('form__contact-input--invalid');
      const invalidNames = form.getElementsByClassName('form__text-input--invalid');
      if (contactsData.length !== 0
        && !invalidContacts.length && !invalidNames.length) {
        loadingAction(form, 'modal', `${form.clientWidth}px`, `${form.clientHeight - submitBlock.clientHeight}px`);
        modalBtnsloading();
        const serverAction = await submitAction(clientNewObj, clientId);
        if (serverAction) {
          closeModal();
          await reRenderTable();
        }
        const loading = document.getElementById('loading-overlay');
        if (loading) {
          modalBtnsDefault(submit.submitBtn, submitText, submit.revertBtn);
          loading.remove();
        }
      } else if (invalidContacts.length || invalidNames.length) {
        highlightInvalid(invalidNames, invalidContacts);
      } else { showError('для клиента необходимо добавить как минимум один контакт'); }
    });
    submit.revertBtn.addEventListener('click', () => revertAction(clientId));

    modalContent.append(form);
    modal.append(modalContent);
    BODY.prepend(modal);
  }

  function closeModal() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    const modal = document.getElementsByClassName('modal')[0];
    location.hash = '';
    modal.remove();
  }

  function createDeleteModal(clientId) {
    if (document.getElementsByClassName('modal').length) {
      closeModal();
    }
    const modal = createModalBlock().modal;
    const modalContent = createModalBlock().modalContent;
    modalContent.classList.add('modal__delete-modal-content');

    const deleteModalTitle = document.createElement('h2');
    deleteModalTitle.classList.add('modal__title', 'modal__delete-title');
    deleteModalTitle.textContent = 'Удалить клиента';
    modalContent.append(deleteModalTitle);
    const deleteModalDescr = document.createElement('p');
    deleteModalDescr.classList.add('modal__descr');
    deleteModalDescr.textContent = 'Вы действительно хотите удалить данного клиента?';
    modalContent.append(deleteModalDescr);

    const submit = addSubmitBlock('Удалить', 'Отмена');
    const submitBlock = submit.submitBlock;

    submit.submitBtn.addEventListener('click', async () => {
      modalBtnsloading();
      const serverAction = await deleteFromServer(clientId);
      if (serverAction) {
        closeModal();
        await reRenderTable();
      } else {
        modalBtnsDefault(submit.submitBtn, submitText, submit.revertBtn);
      }
    });
    submit.revertBtn.addEventListener('click', () => closeModal());

    modalContent.append(submitBlock);
    modal.append(modalContent);
    BODY.append(modal);
  }

  function addTextInputs(targetList, targetForm, surnameValue, nameValue, lastnameValue) {
    for (let i = 0; i < 3; i++) {
      const li = document.createElement('li');
      li.classList.add('form__item');

      const label = document.createElement('label');
      label.classList.add('form__label');
      const legend = document.createElement('span');
      legend.classList.add('form__legend');
      const legendText = document.createElement('span');
      legendText.classList.add('form__legend-text');
      const legendRequired = document.createElement('span');
      legendRequired.classList.add('form__required');

      const input = document.createElement('input');
      input.classList.add('form__text-input');
      input.type = 'text';
      input.addEventListener('focus', () => {
        const otherLists = document.getElementsByClassName('form__custom-select');
        for (const customSelectList of otherLists) {
          closeCustomSelect(customSelectList);
        }
      });
      input.addEventListener('input', () => {
        if (input.value.trim() === '') {
          input.value = '';
          legend.classList.remove('form__legend--value');
          removeError();
          input.classList.remove('form__text-input--invalid');
        } else {
          input.classList.remove('form__text-input--invalid');
          legend.classList.add('form__legend--value');
        }
      });
      input.addEventListener('change', () => {
        removeError();
        if (!validateNameInput(input)) {
          input.classList.add('form__text-input--invalid');
          showError('заполните поля имени, фамилии и отчества кириллицей без пробелов');
        }
      });
      legend.append(legendText);
      legend.append(legendRequired);
      label.append(legend);
      label.append(input);
      li.append(label);
      targetList.append(li);
    }

    const [labelSurname, labelName, labelLastname] =
      targetForm.getElementsByClassName('form__label');
    labelSurname.getElementsByClassName('form__legend-text')[0].textContent = 'Фамилия';
    labelSurname.getElementsByClassName('form__required')[0].textContent = '*';

    labelName.getElementsByClassName('form__legend-text')[0].textContent = 'Имя';
    labelName.getElementsByClassName('form__required')[0].textContent = '*';
    labelLastname.getElementsByClassName('form__legend-text')[0].textContent = 'Отчество';

    const [surnameInput, nameInput, lastnameInput] =
      targetForm.getElementsByClassName('form__text-input');
    surnameInput.id = 'surname-input';
    surnameInput.setAttribute('required', 'true');
    surnameInput.value = surnameValue;
    nameInput.id = 'name-input';
    nameInput.setAttribute('required', 'true');
    nameInput.value = nameValue;
    lastnameInput.id = 'lastname-input';
    lastnameInput.value = lastnameValue;

    // функция-помошник
    function checkNonEmpty(targetValue, targetLegend) {
      if (targetValue) {
        targetLegend.classList.add('form__legend--value');
      }
    }
    const [legendSurname, legendName, legendLastname] =
      targetForm.getElementsByClassName('form__legend');
    checkNonEmpty(surnameInput.value, legendSurname);
    checkNonEmpty(nameInput.value, legendName);
    checkNonEmpty(lastnameInput.value, legendLastname);

    return { nameInput, surnameInput, lastnameInput };
  }

  function closeCustomSelect(selectList) {
    const arrow = selectList.getElementsByClassName('form__custom-arrow')[0];
    arrow.classList.remove('up');
    arrow.classList.add('down');
    const customOptions = selectList.getElementsByClassName('form__custom-option');
    for (const customOption of customOptions) {
      customOption.classList.remove('form__custom-option--last');
      customOption.classList.add('non-display');
    }
  }

  function addContactSelect(target, customSelectLists, addBtn,
    type = 'Телефон', data = '') {
    // Создать блоки, включающие в себя контент
    target.style.padding = '25px 0'
    const inputBlock = document.createElement('div');
    inputBlock.classList.add('form__contact', 'flex');

    const customBlock = document.createElement('div');
    customBlock.classList.add('form__custom-select');
    customBlock.id = `form__custom-select--${customSelectLists.length + 1}`;
    inputBlock.append(customBlock);
    addBtn.before(inputBlock);

    for (let i = 0; i < 6; i++) {
      const option = document.createElement('div');
      option.classList.add('form__custom-option', 'non-display');
      customBlock.append(option);
    }
    const customSlectedBlock = document.createElement('div');
    const customSelected = document.createElement('div');
    customSelected.classList.add('form__custom-selected');
    customSelected.tabIndex = 0;
    // Создать стрелки на кастомном селекте
    customSlectedBlock.append(customSelected);
    customSlectedBlock.classList.add('form__custom-selected-arrow-block');
    const arrow = document.createElement('i');
    arrow.classList.add('form__custom-arrow', 'down');
    customSlectedBlock.append(arrow);
    customBlock.prepend(customSlectedBlock);
    // Добавить механики к опциям - их данные, взаимодействие между собой и авто-выбор, если это окно изменения данных о клиенте
    const [optPhone, optAdditPhone, optEmail, optVk, optFacebook, optOther] =
      inputBlock.getElementsByClassName('form__custom-option');
    // Функция-помошник
    function setSelection(contactType) {
      if (type === contactType.textContent) {
        customSelected.textContent = contactType.textContent;
        contactType.classList.add('selected');
      }
    }
    optPhone.textContent = 'Телефон';
    setSelection(optPhone);

    optAdditPhone.textContent = 'Доп. телефон';
    // Не показывать опцию дополнительного телефона, если у клиента еще не введен основной
    (() => {
      let phonePresent = false;
      const contactsPresent = target.getElementsByClassName('form__custom-selected');
      const selectedOptions = Array.prototype.map.call(contactsPresent, x => x.textContent);
      selectedOptions.splice(selectedOptions.length - 1, 1);
      for (const opt of selectedOptions) {
        if (opt === 'Телефон') {
          phonePresent = true;
          break;
        }
      }
      if (!phonePresent) {
        optAdditPhone.classList.add('non-display', 'disabled');
      }
      if (phonePresent && type === 'Телефон') {
        optAdditPhone.classList.add('selected');
      }
    })();

    optEmail.textContent = 'Email';
    setSelection(optEmail);
    optVk.textContent = 'Vk';
    setSelection(optVk);
    optFacebook.textContent = 'Facebook';
    setSelection(optFacebook);
    optOther.textContent = 'Другое';

    const contactInput = addContactTextInput(inputBlock, data);
    contactInput.name = 'contact-input';
    contactInput.addEventListener('click', () => {
      for (const customSelectList of customSelectLists) {
        closeCustomSelect(customSelectList);
      }
    });
    // "Раскрыть" или "закрыть" список по нажатию на окно списка, также закрыть другие списки, расчитать позицию у
    // каждого элемента в списке
    const customOptions = customBlock.getElementsByClassName('form__custom-option');
    for (const customOption of customOptions) {
      if (!customOption.classList.contains('disabled')) {
        customOption.tabIndex = 0;
      }
    }
    // функция-помошник
    function customSelectedEvent() {
      arrow.classList.toggle('down');
      arrow.classList.toggle('up');
      for (const customSelectList of customSelectLists) {
        if (customSelectList.id !== customBlock.id) {
          closeCustomSelect(customSelectList);
        }
      }
      let positionCount = 0;
      const starterPosition = 39;
      const nextPosition = 27;
      for (const customOption of customOptions) {
        if (!customOption.classList.contains('disabled') && customOption.textContent !== customSelected.textContent) {
          customOption.style.top = `${starterPosition + nextPosition * positionCount}px`;
          positionCount++;
          customOption.classList.toggle('non-display');
        }
      }
      for (let i = customOptions.length - 1; i >= 0; i--) {
        if (!customOptions[i].classList.contains('non-display')
          && !customOptions[i].classList.contains('disabled')) {
          customOptions[i].classList.add('form__custom-option--last');
          break;
        }
      }
    }
    customSelected.addEventListener('click', () => {
      customSelectedEvent();
    });
    customSelected.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        customSelectedEvent();
      }
    });
    // При нажатии на опцию выпадающего списка, установить новое значение и "закрыть" список
    for (let i = 0; i < customOptions.length; i++) {
      const customOptionListener = customOptions[i];
      function customOptionEvent() {
        arrow.classList.toggle('down');
        arrow.classList.toggle('up');
        customSelected.textContent = customOptionListener.textContent;
        closeCustomSelect(customBlock);
        removeError();
        const checkedInput = inputBlock.getElementsByClassName('form__contact-input')[0];
        checkedInput.classList.remove('form__contact-input--invalid');
        const valid = validateContactInput(customSelected.textContent, checkedInput);
        if (valid.validation !== true && checkedInput.value) {
          checkedInput.classList.add('form__contact-input--invalid');
          showError(valid.errText);
        }
      }

      customOptionListener.addEventListener('click', () => {
        customOptionEvent();
      });
      customOptionListener.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          customOptionEvent();
        }
        if (e.key === 'ArrowDown') {
          if (i + 1 < customOptions.length) {
            customOptions[i + 1].focus();
          } else {
            closeCustomSelect(customBlock);
            contactInput.focus();
          }
        }
        if (e.key === 'ArrowUp') {
          if (i - 1 >= 0) {
            customOptions[i - 1].focus();
          }
        }
      });
    }
    // При загрузке окна установить значение в списке и "закрыть" список
    let selected = false;
    for (const customOption of customOptions) {
      if (customOption.classList.contains('selected')) {
        customSelected.textContent = customOption.textContent;
        selected = true;
        break;
      }
      closeCustomSelect(customBlock);
    }
    // Проверить, является ли тип контакта одним из опций в списке
    if (!selected) {
      customSelected.textContent = type;
      optOther.classList.add('selected');
    }
  }

  function addContactTextInput(targetBlock, contactData) {
    const contactInput = document.createElement('input');
    contactInput.classList.add('form__contact-input');
    contactInput.setAttribute('placeholder', 'Введите данные контакта');
    contactInput.setAttribute('required', 'true');
    contactInput.type = 'text';
    contactInput.value = contactData;
    targetBlock.append(contactInput);

    // Добавить кнопку очистки инпута и ее тултип
    const deleteBlock = document.createElement('div');
    deleteBlock.classList.add('form__delete-block');
    const tooltipBlock = document.createElement('div');
    tooltipBlock.classList.add('form__tooltip-block');
    const tooltipText = document.createElement('span');
    tooltipText.classList.add('form__tooltip-value');
    tooltipText.textContent = 'Удалить контакт'
    const deleteContact = document.createElement('button');
    deleteContact.classList.add('form__delete-contact', 'btn-reset', 'non-display');
    deleteContact.setAttribute('type', 'button');
    deleteContact.innerHTML =
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="cancel" clip-path="url(#clip0_224_6681)">
    <path id="Vector" d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682
    11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8
    10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11
    10.154L8.846 8L11 5.846L10.154 5Z" fill="none"/>
    </g>
    <defs>
    <clipPath id="clip0_224_6681">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>`;
    tooltipBlock.append(tooltipText);
    deleteBlock.append(deleteContact);
    deleteBlock.append(tooltipBlock);
    targetBlock.append(deleteBlock);

    if (contactInput.value) {
      deleteContact.classList.remove('non-display');
    }
    // Добавить функциональность инпуту и кнопке очистки
    contactInput.addEventListener('input', () => {
      if (contactInput.value.trim() === '') {
        contactInput.value = '';
        deleteContact.classList.add('non-display');
        removeError();
        contactInput.classList.remove('form__contact-input--invalid');
      } else {
        deleteContact.classList.remove('non-display');
        contactInput.classList.remove('form__contact-input--invalid');
      }
    });
    // Провести валидацию инпута при изменении его значения
    contactInput.addEventListener('change', () => {
      removeError();
      const selectValue = targetBlock.getElementsByClassName('form__custom-selected')[0].textContent;
      const valid = validateContactInput(selectValue, contactInput);
      if (valid.validation !== true) {
        contactInput.classList.add('form__contact-input--invalid');
        showError(valid.errText);
      }
    });
    // Добавить функциональность для кнопки удаления контакта
    const otherLists = document.getElementsByClassName('form__custom-select');
    deleteContact.addEventListener('click', () => {
      for (const customSelectList of otherLists) {
        closeCustomSelect(customSelectList);
      }
      targetBlock.remove();
      removeError();
    });
    return contactInput;
  }

  // Добавить функциональность для кнопки добавления клиента
  const addButton = document.getElementById('add-client-btn');
  addButton.addEventListener('click', function addClient() {
    createModalForm('Новый клиент', saveToServer, 'Сохранить', closeModal, 'Отмена');
    document.getElementById('modal-close').focus();
  });

  // Раздел "Валидация инпутов"
  function validateNameInput(nameInput) {
    const regex = /^[а-я]*$/gi;
    return regex.test(nameInput.value);
  }

  function validateContactInput(type, input) {
    let regex = '';
    let validation = false;
    let errText = '';
    switch (type) {
      case 'Телефон':
        regex = /^\+[0-9]{1,3}\s?\(?[0-9]{0,2}\)?\s?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/g;
        errText = 'введите телефон в формате "+71234567890"';
        break;
      case 'Доп. телефон':
        regex = /^\+[0-9]{1,3}\s?\(?[0-9]{0,2}\)?\s?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/g;
        errText = 'введите телефон в формате "+71234567890"';
        break;
      case 'Email':
        regex = /^.*@[a-z]*\.[a-z]*$/gi;
        errText = 'введите email в формате "test-example@gmail.com"';
        break;
      case 'Vk':
        regex = /^(https:\/\/)?vk\.com\/.*$/g;
        errText = 'введите ссылку в формате "vk.com/clientLink"';
        break;
      case 'Facebook':
        regex = /^(https:\/\/)?facebook\.com\/.*$/g;
        errText = 'введите ссылку в формате "facebook.com/clientLink"';
        break;
      default: validation = true;
    }
    if (!validation) {
      validation = regex.test(input.value);
    }
    return { validation, errText };
  }

  function showError(errorText) {
    const form = document.getElementsByClassName('form')[0];
    form.getElementsByClassName('form__contacts-block')[0].style.marginBottom = '8px';
    const submitBtn = form.getElementsByClassName('form__button-submit')[0];
    const formError = document.createElement('p');
    formError.classList.add('form__error');
    formError.textContent = `Ошибка: ${errorText}`;
    submitBtn.before(formError);
  }

  function highlightInvalid(namesList, contactsList) {
    for (const invalidName of namesList) {
      invalidName.classList.add('form__text-input--invalid-submited');
    }
    setTimeout(() => {
      for (const invalidName of namesList) {
        invalidName.classList.remove('form__text-input--invalid-submited');
      }
    }, 800);
    for (const invalidContact of contactsList) {
      invalidContact.classList.add('form__contact-input--invalid-submited');
    }
    setTimeout(() => {
      for (const invalidContact of contactsList) {
        invalidContact.classList.remove('form__contact-input--invalid-submited');
      }
    }, 800);
  }

  function removeError() {
    if (document.getElementsByClassName('form__error').length) {
      document.getElementsByClassName('form__error')[0].remove();
    }
  }

  // Раздел "Сортировка таблицы"
  function ascendingSortNumbers() {
    return (a, b) => a - b;
  }

  function descendingSortNumbers() {
    return (a, b) => b - a;
  }

  function ascendingSortLetters() {
    return (a, b) => {
      const nameA = a.toUpperCase();
      const nameB = b.toUpperCase();
      if (nameA < nameB) {
        return 1;
      } else if (nameA > nameB) {
        return -1;
      }
      return 0;
    }
  }

  function descendingSortLetters() {
    return (a, b) => {
      const nameA = a.toUpperCase();
      const nameB = b.toUpperCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      }
      return 0;
    }
  }

  function sortById(sortData, sortType) {
    const sortedArr = sortData.map(x => getClientData(x).id).sort(sortType());
    return sortedArr.map(x => sortData.find(y => y.id === x));
  }

  function sortByFullName(sortData, sortType) {
    const sortedArr = sortData.map(x => getClientData(x).fullName).sort(sortType());
    return sortedArr.map(x => sortData.find(y => getClientData(y).fullName === x));
  }

  function sortByCreationDate(sortData, sortType) {
    const sortedArr = sortData.map(x => +x.createdAt.getTime()).sort(sortType());
    return sortedArr.map(x => sortData.find(y => +y.createdAt.getTime() === x));
  }

  function sortByChangeDate(sortData, sortType) {
    const sortedArr = sortData.map(x => +x.updatedAt.getTime()).sort(sortType());
    return sortedArr.map(x => sortData.find(y => +y.updatedAt.getTime() === x));
  }

  async function tableSort(action, type, searched) {
    if (document.getElementsByClassName('table__body').length) {
      document.getElementsByClassName('table__body')[0].remove();
    }
    loadingAction(CORE, 'table', `${CORE.clientWidth}px`, '337px');
    // Сортировать полную таблицу или результаты поиска по таблице
    if (!searched) {
      const response = await fetch(`http://localhost:3000/api/clients`);
      const data = await response.json();
      formatDates(data);
      const targetArr = action(data, type);
      renderClientsTable(targetArr);
    } else {
      const targetArr = action(searched, type);
      renderClientsTable(targetArr);
    }
  }

  function addSortingMechanic(btn, sortingBase,
    sortAscending, sortDescending, ariaText) {
    btn.addEventListener('click', () => {
      const previouslySorted = CORE.querySelector('.sorted');
      previouslySorted.classList.remove('sorted');
      const sortText = btn.querySelector('.table__header-text');
      sortText.classList.add('sorted');

      const sortArrow = btn.querySelector('.table__header-arrow');
      if (!sortArrow.classList.contains('table__header-arrow--down')) {
        btn.ariaLabel = `Нажмите для сортировки по колонке ${ariaText} по возрастанию`;

        if (!searchedArray.length) {
          tableSort(sortingBase, sortDescending);
        } else { tableSort(sortingBase, sortDescending, searchedArray); }

      } else {
        btn.ariaLabel = `Нажмите для сортировки по колонке ${ariaText} по убыванию`;

        if (!searchedArray.length) {
          tableSort(sortingBase, sortAscending,);
        } else { tableSort(sortingBase, sortAscending, searchedArray); }

      }
      sortArrow.classList.toggle('table__header-arrow--down');
    });
  }

  // Привязать механику сортировки к полям таблицы
  (() => {
    const idBtn = document.getElementById('table__header--id');
    addSortingMechanic(idBtn, sortById, ascendingSortNumbers, descendingSortNumbers, 'ID');
    const fullNameBtn = document.getElementById('table__header--fullname');
    addSortingMechanic(fullNameBtn, sortByFullName, ascendingSortLetters, descendingSortLetters, 'Фамилия Имя Отчество');
    const creationDateBtn = document.getElementById('table__header--creation-date');
    addSortingMechanic(creationDateBtn, sortByCreationDate, ascendingSortNumbers, descendingSortNumbers, 'Дата и время создания');
    const changeDateBtn = document.getElementById('table__header--change-date');
    addSortingMechanic(changeDateBtn, sortByChangeDate, ascendingSortNumbers, descendingSortNumbers, 'Последние изменения');
  })();

  // Раздел "Загрузка"
  function setDefaultChangeIcon(changeBtn) {
    changeBtn.innerHTML =
      `<svg class="table__change-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="edit" opacity="0.7" clip-path="url(#clip0_216_219)">
      <path id="Vector" d="M2 11.5002V14.0002H4.5L11.8733 6.62687L9.37333 4.12687L2 11.5002ZM13.8067 4.69354C14.0667 4.43354
      14.0667 4.01354 13.8067 3.75354L12.2467 2.19354C11.9867 1.93354 11.5667 1.93354 11.3067 2.19354L10.0867 3.41354L12.5867
      5.91354L13.8067 4.69354Z" fill="#9873FF"/>
      </g>
      <defs>
      <clipPath id="clip0_216_219">
      <rect width="16" height="16" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      Изменить`;
  }

  function modalBtnsloading() {
    const submitBtn = document.getElementsByClassName('form__button-submit')[0];
    submitBtn.disabled = true;
    const submitText = submitBtn.textContent;
    submitBtn.innerHTML = `<svg class="loading-icon-submit" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clip-path="url(#clip0_224_6321)">
      <path d="M3.00008 8.03996C3.00008 10.8234 5.2566 13.08 8.04008 13.08C10.8236 13.08 13.0801
      10.8234 13.0801 8.03996C13.0801 5.25648 10.8236 2.99996 8.04008 2.99996C7.38922
      2.99996 6.7672 3.1233 6.196 3.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </g>
      <defs>
      <clipPath id="clip0_224_6321">
      <rect width="16" height="16" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      ${submitText}`;
    const revertBtn = document.getElementsByClassName('form__button-revert')[0];
    revertBtn.disabled = true;
  }

  function modalBtnsDefault(submit, submitTxt, revert) {
    submit.innerHTML = `${submitTxt}`;
    submit.disabled = false;
    revert.disabled = false;
  }

  function loadingAction(overlaying, type, width, height) {
    // Два типа, так как одна функция используется для загрузки в таблице и модальном окне
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.classList.add('loading-overlay');

    if (type === 'table') {
      const addClient = document.getElementsByClassName('add-client')[0];
      addClient.classList.add('add-client--loading');
      const addClientBtn = document.getElementById('add-client-btn');
      addClientBtn.disabled = true;
      loadingOverlay.style.width = width;
      loadingOverlay.style.height = height;
      loadingOverlay.style.top = `0`;
      overlaying.after(loadingOverlay);
    }

    if (type === 'modal') {
      loadingOverlay.style.width = width;
      loadingOverlay.style.height = height;
      loadingOverlay.style.top = `50px`;
      overlaying.before(loadingOverlay);
      modalBtnsloading();
    }
    const loadingOverlayContent = document.createElement('div');
    loadingOverlayContent.classList.add('loading-overlay__content');
    loadingOverlay.append(loadingOverlayContent);

    const loader = document.createElement('div');
    loader.id = 'loader';
    loadingOverlayContent.append(loader);
    // Если страница загружена с мобильного разрешения экрана,
    // дополнительно оцентровать иконку загрузки
    if (mobileRes && type === 'table') {
      loader.style.left = `${VIEWPORT / 2 - 40}px`;
      const scrollBlock = document.getElementsByClassName('table-block')[0];
      scrollBlock.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      scrollBlock.style.overflowX = 'visible';
    }
  }

  // Раздел "Поиск по таблице"
  // Поиск проводится по полям "id" и "Фамилия Имя Отчество"
  async function searchTable(request) {
    const searchedArrCopy = [];
    const requestArr = request.split(' ');
    const numArr = requestArr.filter((str) => str.match(/\d+/g));
    const wordArr = requestArr.filter((str) => str.match(/[а-я]+/gi));

    const response = await fetch(`http://localhost:3000/api/clients`);
    const data = await response.json();
    formatDates(data);

    function searchData(searchRequest, type) {
      // Функция-помошник
      function checkIfAlreadySearched(filteredList) {
        for (const filtred of filteredList) {
          const searchedIds = searchedArrCopy.map(x => x.id);
          if (!searchedIds.includes(filtred.id)) {
            searchedArrCopy.push(filtred);
          }
        }
      }

      if (type === 'id') {
        const regex = new RegExp(`(${searchRequest})+?`, 'g');
        const filteredById = data.filter(x => (x.id.match(regex)));
        checkIfAlreadySearched(filteredById);
      }
      if (type === 'name') {
        if (wordArr.length) {
          const regex = new RegExp(`(${searchRequest})+?`, 'gi');
          const filteredByName = data.filter(x => (getClientData(x).fullName.match(regex)));
          checkIfAlreadySearched(filteredByName);
        }
      }
    }

    for (const numArrItem of numArr) {
      searchData(numArrItem, 'id');
    }
    searchData(wordArr.join(' '), 'name');
    return searchedArrCopy;
  }

  function nothingFound() {
    document.getElementsByClassName('table__body')[0].remove();
    const body = CORE.createTBody();
    body.classList.add('table__body');
    const tr = body.insertRow();
    tr.classList.add('table__row');

    const td = document.createElement('td');
    td.classList.add('table__column', `table__column--nothing-found`);
    td.setAttribute('colspan', 6);

    const noDataText = document.createElement('p');
    noDataText.classList.add('table__no-data-text');
    noDataText.textContent = 'Ничего не найдено';
    const noDataTip = document.createElement('p');
    noDataTip.classList.add('table__no-data-tip');
    noDataTip.textContent = 'Введите в запрос часть полного имени клиента и/или его id';

    td.append(noDataText);
    td.append(noDataTip);
    tr.append(td);
  }

  function autocomplete(entries) {
    const searchInputWidth = SEARCH_INPUT.clientWidth;
    const entriesLimited = entries.slice(0, AUTOCOMPLETE_LIMIT);
    for (let i = 0; i < entriesLimited.length; i++) {
      const autocompleteOption = document.createElement('div');
      autocompleteOption.classList.add('header__autocomplete-option', 'flex');
      autocompleteOption.id = `autocomplete-option-${i}`;
      autocompleteOption.tabIndex = 0;
      autocompleteOption.style.width = `${searchInputWidth}px`;
      const foundId = document.createElement('p');
      foundId.classList.add('header__autocomplete-id');
      const foundName = document.createElement('p');
      foundName.classList.add('header__autocomplete-name');
      autocompleteOption.append(foundId);
      autocompleteOption.append(foundName);

      const entry = entriesLimited[i];
      foundId.textContent = `id: ${entry.id}`;
      foundName.textContent = getClientData(entry).fullName;
      SEARCH_BLOCK.append(autocompleteOption);

      autocompleteOption.addEventListener('click', () => {
        const idColumns = CORE.getElementsByClassName('table__column--id');
        let targetColumn = null;
        for (const idColumn of idColumns) {
          if (idColumn.textContent === entry.id) {
            targetColumn = idColumn;
            break;
          }
        }
        const rowNumber = targetColumn.classList[1].match(/\d+/g);
        const targetRow = document.getElementById(`table-row-${rowNumber}`);
        targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
        targetRow.classList.add('table__searched-row');
        setTimeout(() => {
          targetRow.classList.remove('table__searched-row');
        }, 1000);
        SEARCH_BLOCK.innerHTML = '';
      });
      autocompleteOption.addEventListener('keydown', (e) => {
        const otherOptions = SEARCH_BLOCK.children;
        if (e.key === 'ArrowDown' && otherOptions.length > i + 1) {
          const nextOption = document.getElementById(`autocomplete-option-${i + 1}`);
          nextOption.focus();
        }
        if (e.key === 'ArrowUp' && i - 1 >= 0) {
          document.getElementById(`autocomplete-option-${i - 1}`).focus();
        }
      });
    }
    if (entries.length > AUTOCOMPLETE_LIMIT) {
      const showMoreOption = document.createElement('div');
      showMoreOption.classList.add('header__autocomplete-option',
        'header__autocomplete-show-more', 'flex');
      showMoreOption.tabIndex = 0;
      showMoreOption.id = `autocomplete-option-${AUTOCOMPLETE_LIMIT}`;
      showMoreOption.style.width = `${searchInputWidth}px`;
      showMoreOption.textContent = 'Нажмите сюда или на "Enter" в поле ввода, чтобы показать всех найденных клиентов';
      showMoreOption.addEventListener('click', () => {
        reRenderTable(entries);
        SEARCH_BLOCK.innerHTML = '';
        searchedArray = entries;
      });
      showMoreOption.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          reRenderTable(entries);
          SEARCH_BLOCK.innerHTML = '';
          searchedArray = entries;
        }
        if (e.key === 'ArrowUp') {
          document.getElementById(`autocomplete-option-${AUTOCOMPLETE_LIMIT - 1}`).focus();
        }
      });
      SEARCH_BLOCK.append(showMoreOption);
    }
  }

  let autocompleteTimeout = null;
  SEARCH_INPUT.addEventListener('input', () => {
    if (!SEARCH_INPUT.value.trim()) {
      SEARCH_INPUT.value = '';
      searchedArray = [];
      reRenderTable();
    } else {
      onkeydown = (e) => {
        if (e.key !== 'Tab' && e.key !== 'Shift'
          && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
          SEARCH_BLOCK.innerHTML = '';
        }
        clearTimeout(autocompleteTimeout);
      };
      autocompleteTimeout = setTimeout(async () => {
        const updateSearchArr = await searchTable(SEARCH_INPUT.value);
        autocomplete(updateSearchArr);
      }, 600);
    }
  });

  SEARCH_INPUT.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const updateSearchArr = await searchTable(SEARCH_INPUT.value);
      if (updateSearchArr.length) {
        reRenderTable(updateSearchArr);
        searchedArray = updateSearchArr;
      } else { nothingFound(); }
    }
    if (e.key === 'ArrowDown') {
      document.getElementsByClassName('header__autocomplete-option')[0].focus();
    }
  });
})();
