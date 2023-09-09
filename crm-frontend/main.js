(() => {
  const CORE = document.getElementsByClassName('table')[0];
  const BODY = document.getElementsByTagName('body')[0];
  const CLIENTS_LIST = [
    {
      name: 'Денис',
      surname: 'Скворцов',
      lastName: 'Юрьевич',
      contacts: [
        {
          type: 'Телефон',
          value: '+71234567890'
        },
        {
          type: 'Email',
          value: 'abc@xyz.com'
        },
        {
          type: 'Facebook',
          value: 'https://facebook.com/vasiliy-pupkin-the-best'
        }
      ],
    },
    {
      name: 'Арсений',
      surname: 'Куприянов',
      lastName: 'Валерьевич',
      contacts: [
        {
          type: 'Телефон',
          value: '+80654567890'
        },
        {
          type: 'Email',
          value: 'ytujik@xyz.com'
        },
        {
          type: 'Twitter',
          value: '@cuprianov'
        },
        {
          type: 'Email',
          value: 'ytujik@xyz.com'
        },
        {
          type: 'Email',
          value: 'ytujik@xyz.com'
        },
        {
          type: 'Email',
          value: 'ytujik@xyz.com'
        },
      ],
    },
    {
      name: 'Олег',
      surname: 'Димитревский',
      lastName: 'Алексеевич',
      contacts: [
        {
          type: 'Телефон',
          value: '+23904567890'
        },
        {
          type: 'Vk',
          value: 'https://vk.com/dimitrevsky'
        }
      ],
    },
  ];
  const COLUMN_COUNT = 7;
  let searchedArray = [];

  async function deletePreviousList() {
    const response = await fetch(`http://localhost:3000/api/clients`);
    const data = await response.json();
    const data2 = data.map(x => x.id);
    for (let i = 0; i < data2.length; i++) {
      await fetch(`http://localhost:3000/api/clients/${data2[i]}`,
        {
          method: 'DELETE',
        });
    }
  }

  (async () => {
    const response = await fetch(`http://localhost:3000/api/clients`);
    const data = await response.json();
    if (data.length === 0) {
      for (let i = 0; i < CLIENTS_LIST.length; i++) {
        saveToServer(CLIENTS_LIST[i]);
      }
    }
    renderClientsTable(data);
  })();

  async function saveToServer(data) {
    await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async function changeOnServer(data, id) {
    await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  function getClientData(cliebntObj) {
    const id = cliebntObj.id;
    const fullName = `${cliebntObj.surname} ${cliebntObj.name} ${cliebntObj.lastName}`;

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

    return {
      id,
      fullName,
      created,
      updated
    };
  }

  function getContact(formattingContact) {
    const contactLink = document.createElement('a');
    contactLink.classList.add('table__contact');
    contactLink.setAttribute('target', '_blank');

    const tooltipBlock = document.createElement('div');
    tooltipBlock.classList.add('table__tooltip-block');
    const tooltipText = document.createElement('span');
    tooltipText.classList.add('table__tooltip-value');


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
        contactLink.href = `tel:${formattingContact.value}`;
        tooltipText.textContent = formattingContact.value;
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
        tooltipText.textContent = formattingContact.value;
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
        tooltipText.innerHTML = `Facebook:&nbsp;<span class="table__tooltip-link">${formattingContact.value}</span>`;
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
        tooltipText.innerHTML = `Vk:&nbsp;<span class="table__tooltip-link">${formattingContact.value}</span>`;
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
        tooltipText.innerHTML = `${formattingContact.type}:&nbsp;<span class="table__tooltip-link">${formattingContact.value}</span>`;
        break;
    }
    tooltipBlock.append(tooltipText);
    contactLink.append(tooltipBlock);
    return contactLink;
  }

  function renderClientsTable(clientsArray) {
    for (const client of clientsArray) {
      client.createdAt = new Date(client.createdAt);
      client.updatedAt = new Date(client.updatedAt);
    }

    const body = CORE.createTBody();
    body.classList.add('table__body');
    for (let i = 0; i < clientsArray.length; i++) {
      const clientData = getClientData(clientsArray[i]);
      const tr = body.insertRow();
      tr.classList.add('table__row');

      let j = 0;
      while (j < COLUMN_COUNT) {
        const td = document.createElement('td');
        td.classList.add('table__column', `table__column--${i + 1}`);
        tr.append(td);
        ++j;
      }

      const [td1, td2, td3, td4, td5, td6, td7] = body.getElementsByClassName(`table__column--${i + 1}`);
      // Столбец "ID"
      td1.textContent = clientData.id;
      td1.classList.add('table__column--id');

      // Столбец "Фамилия Имя Отчество"
      td2.textContent = clientData.fullName;
      td2.classList.add('table__column--name');

      // Столбец "Дата и время создания" и "Последние изменения"
      // Функция-помошник
      function addDateTimeColumns(column, data) {
        const spanDate = document.createElement('span');
        spanDate.classList.add('table__text', 'table__text--date');
        spanDate.textContent = clientData[data].date;

        const spanTime = document.createElement('span');
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
      const contactsFormBlock = document.createElement('div');
      contactsFormBlock.classList.add('table__contacts-block', 'flex');
      for (let k = 0; k < contactsData.length; k++) {
        const contactFormatted = getContact(contactsData[k]);
        if (k > 3) {
          contactFormatted.classList.add('non-display');
        }
        contactsFormBlock.append(contactFormatted);
      }
      td5.append(contactsFormBlock);

      const contacts = td5.getElementsByClassName('table__contact');
      if (contacts.length > 4) {
        const contactPlus = document.createElement('button');
        contactPlus.classList.add('btn', 'table__contacts-plus', 'btn-reset');
        contactPlus.textContent = `+${contacts.length - 4}`;
        contactsFormBlock.append(contactPlus);
        contactPlus.addEventListener('click', () => {
          const contactsHidden = contactsFormBlock.querySelectorAll('.non-display');
          for (const contact of contactsHidden) {
            contact.classList.remove('non-display');
          }
          calculateTooltipX();
          contactPlus.classList.add('non-display');
        });
      }
      // Функция-помошник
      function calculateTooltipX() {
        for (const tooltip of td5.getElementsByClassName('table__tooltip-block')) {
          const width = tooltip.clientWidth;
          tooltip.style.marginLeft = `-${width / 2}px`;
        }
      }
      calculateTooltipX();

      // Столбец "Действия" - изменить
      const changeButton = document.createElement('button');
      changeButton.classList.add('table__change', 'btn', 'btn-reset', 'flex');
      changeButton.innerHTML =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      changeButton.addEventListener('click', () => {
        const changeModal = createModalForm('Изменить данные', test, test, 'Удалить клиента', clientData.id,
          clientsArray[i].surname, clientsArray[i].name, clientsArray[i].lastName, clientsArray[i].contacts);
        BODY.append(changeModal);
      });
      td6.append(changeButton);

      // Столбец "Действия" - удалить
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
      deleteButton.addEventListener('click', () => {
        console.log('delete');
      });
      td7.append(deleteButton);
    }
  }

  async function reRenderTable() {
    document.getElementsByClassName('table__body')[0].remove();
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    renderClientsTable(data);
  }

  function test(obj) {
    console.log(obj);
  }

  function closeModal() {
    const overlay = document.getElementById('overlay');
    const modal = document.getElementsByClassName('modal')[0];
    overlay.style.display = 'none';
    modal.remove();
  }

  // Блок "Добавление, изменение и удаление клиентов"; Работа с модальными окнами
  function createModalForm(titleText, submitAction, revertAction, revertText,
    clientId = '', clientSurname = '', clientName = '', clientLastname = '', clientContacts = '') {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';

    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content');

    const modalClose = document.createElement('button');
    modalClose.classList.add('modal__close', 'btn-reset');
    modalClose.innerHTML = `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2332 7.73333L21.2665 6.76666L14.4998 13.5334L7.73318
    6.7667L6.76652 7.73336L13.5332 14.5L6.76654 21.2667L7.73321 22.2333L14.4998 15.4667L21.2665 22.2334L22.2332
    21.2667L15.4665 14.5L22.2332 7.73333Z" fill="#B0B0B0"/>
    </svg>`;
    modalClose.addEventListener('click', () => closeModal());
    modalContent.append(modalClose);

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
    // Объявлена на строке
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
      const otherInputs = contactsFormBlock.getElementsByClassName('form__contact-input');
      let emptyInput = false;
      for (const otherInput of otherInputs) {
        if (!otherInput.value) {
          emptyInput = true;
          break;
        }
      }
      if (otherLists.length >= 10) {
        console.log('error');
      } else if (emptyInput) {
        console.log('error');
      } else {
        addContactInput(contactsFormBlock, otherLists, contactsBtn);
      }
    });

    if (clientContacts) {
      for (const existingContact of clientContacts) {
        addContactInput(contactsFormBlock, otherLists, contactsBtn,
          existingContact.type, existingContact.value);
      }
    }
    form.append(contactsFormBlock);

    // Создать кнопки отправки формы и отмены(или удаления)
    const submitBlock = document.createElement('div');
    submitBlock.classList.add('form__submit-block', 'flex');
    const submitBtn = document.createElement('button');
    submitBtn.classList.add('btn', 'form__button-submit', 'btn-reset');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.textContent = 'Сохранить';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientNewObj = {
        name: textInputs.nameInput.value,
        surname: textInputs.surnameInput.value,
        lastName: textInputs.lastnameInput.value,
        contacts: getContactsData(contactsFormBlock)
      };
      submitAction(clientNewObj);
      closeModal();
      reRenderTable();
    });

    const revertBtn = document.createElement('button');
    revertBtn.classList.add('btn', 'form__button-revert', 'btn-reset');
    revertBtn.setAttribute('type', 'button');
    revertBtn.textContent = revertText;
    revertBtn.addEventListener('click', () => revertAction());

    submitBlock.append(submitBtn);
    submitBlock.append(revertBtn);
    form.append(submitBlock);

    modalContent.append(form);
    modal.append(modalContent);
    return modal;
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
      input.addEventListener('input', () => {
        if (input.value.trim() === '') {
          input.value = '';
          legend.classList.remove('form__legend--value');
        } else {
          legend.classList.add('form__legend--value');
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

    return {
      nameInput,
      surnameInput,
      lastnameInput
    };
  }

  function addContactInput(target, customSelectLists, addBtn,
    type = 'Телефон', data = '') {
    // Подблок 1: создать фактический select-список элементов и добавить к нему механики взаимодействия опций между собой
    // Создать блоки, включающие в себя контент и фактический select-списков
    target.style.padding = '17px 30px'
    const inputBlock = document.createElement('div');
    inputBlock.classList.add('form__contact', 'flex');
    inputBlock.id = `form__contact--${customSelectLists.length + 1}`;
    const customSelect = document.createElement('div');
    customSelect.classList.add('form__custom-select-block');
    const select = document.createElement('select');
    select.setAttribute('name', 'data-type');
    select.classList.add('non-display');
    customSelect.append(select);
    inputBlock.append(customSelect);
    addBtn.before(inputBlock);

    for (let i = 0; i < 6; i++) {
      const option = document.createElement('option');
      option.classList.add('form__contact-option');
      select.append(option);
    }
    // Добавить механики к опциям - их данные, взаимодействие между собой и авто-выбор, если это окно изменения данных о клиенте
    const [optPhone, optAdditPhone, optEmail, optVk, optFacebook, optOther] =
      inputBlock.getElementsByClassName('form__contact-option');
    // Функция-помошник
    function setSelection(contactType) {
      if (type === contactType.value) {
        contactType.setAttribute('selected', 'true');
      }
    }
    optPhone.value = 'Телефон';
    optPhone.textContent = 'Телефон';
    setSelection(optPhone);

    optAdditPhone.value = 'Доп. телефон';
    optAdditPhone.textContent = 'Доп. телефон';
    // Не показывать опцию дополнительного телефона, если у клиента еще не введен основной
    (() => {
      let phonePresent = false;
      const contactsPresent = target.getElementsByClassName('form__contact-type');
      const selectedOptions = Array.prototype.map.call(contactsPresent, x => x.value);
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
        optAdditPhone.setAttribute('selected', 'true');
      }
    })();

    optEmail.value = 'Email';
    optEmail.textContent = 'Email';
    setSelection(optEmail);

    optVk.value = 'Vk';
    optVk.textContent = 'Vk';
    setSelection(optVk);

    optFacebook.value = 'Facebook';
    optFacebook.textContent = 'Facebook';
    setSelection(optFacebook);

    optOther.value = 'Другое';
    optOther.textContent = 'Другое';
    // Конец подблока 1

    // Подблок 2: создать кастомный select-список и связать его с фактическим(скрытым) select-списком
    const customBlock = document.createElement('div');
    customBlock.classList.add('form__custom-select');
    let selectInner = (`${select.innerHTML}`.replaceAll('option', 'div'))
      .replaceAll('form__contact-div', 'form__custom-option');
    selectInner = selectInner.replaceAll(/ value="\w*"/gi, '');
    selectInner = selectInner.replaceAll(/ value="[а-я]*"/gi, '');
    selectInner = selectInner.replaceAll(/ value="Доп. телефон"/gi, '');
    selectInner = selectInner.replaceAll(/ selected="true"/gi, '');
    customBlock.innerHTML = selectInner;
    customSelect.append(customBlock);

    const customSlectedBlock = document.createElement('div');
    const customSelected = document.createElement('div');
    customSelected.classList.add('form__custom-selected');
    // Создать стрелки на кастомном селекте
    customSlectedBlock.append(customSelected);
    customSlectedBlock.classList.add('form__custom-selected-arrow-block');
    const arrowDown = document.createElement('div');
    arrowDown.classList.add('form__custom-arrow-down');
    const arrowUp = document.createElement('div');
    arrowUp.classList.add('form__custom-arrow-up', 'non-display');
    customSlectedBlock.append(arrowDown);
    customSlectedBlock.append(arrowUp);
    customBlock.prepend(customSlectedBlock);

    // функция-помошник
    function closeCustomSelect(selectList) {
      const upArrow = selectList.getElementsByClassName('form__custom-arrow-up')[0];
      const downArrow = selectList.getElementsByClassName('form__custom-arrow-down')[0];
      downArrow.classList.remove('non-display');
      upArrow.classList.add('non-display');
      const customOptions = selectList.getElementsByClassName('form__custom-option');
      for (const customOption of customOptions) {
        customOption.classList.add('non-display');
      }
    }
    // "Раскрыть" или "закрыть" список по нажатию на окно списка, также закрыть другие списки, расчитать позицию у
    // каждого элемента в списке
    const customOptions = customBlock.getElementsByClassName('form__custom-option');
    customSelected.addEventListener('click', () => {
      arrowDown.classList.toggle('non-display');
      arrowUp.classList.toggle('non-display');
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
    });
    // При загрузке окна установить значение в списке и "закрыть" список
    const actualOptions = select.getElementsByClassName('form__contact-option');
    for (const actualOption of actualOptions) {
      if (actualOption.hasAttribute('selected')) {
        customSelected.textContent = actualOption.textContent;
      }
      closeCustomSelect(customBlock);
    }
    // При нажатии на опцию выпадающего списка, установить новое значение и закрыть список
    for (const customOptionListener of customOptions) {
      customOptionListener.addEventListener('click', () => {
        arrowDown.classList.toggle('non-display');
        arrowUp.classList.toggle('non-display');
        select.value = customOptionListener.textContent;
        customSelected.textContent = customOptionListener.textContent;
        closeCustomSelect(customBlock);
      });
    }

    // Проверить, является ли тип контакта одним из опций в списке
    let selected = false;
    for (const selection of inputBlock.getElementsByClassName('form__contact-option')) {
      if (selection.getAttributeNames().includes('selected')) {
        selected = true;
        break;
      }
    }
    if (!selected) {
      optOther.value = type;
      optOther.setAttribute('selected', 'true');
      customSelected.textContent = type;
    }
    // Конец подблока 2

    // Подблок 3: создать инпут и его механики
    // Добавить инпут
    const contactInput = document.createElement('input');
    contactInput.classList.add('form__contact-input');
    contactInput.setAttribute('placeholder', 'Введите данные контакта');
    contactInput.setAttribute('required', 'true');
    contactInput.value = data;
    inputBlock.append(contactInput);

    // Добавить кнопку очистки инпута
    const deleteBlock = document.createElement('div');
    deleteBlock. classList.add('form__delete-block');
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
    inputBlock.append(deleteBlock);

    if (contactInput.value) {
      deleteContact.classList.remove('non-display');
    }
    // Добавить функциональность инпуту и кнопке очистки
    contactInput.addEventListener('input', () => {
      if (contactInput.value.trim() === '') {
        contactInput.value = '';
        deleteContact.classList.add('non-display');
      } else { deleteContact.classList.remove('non-display'); }
    });
    deleteContact.addEventListener('click', () => {
      inputBlock.remove();
    });

    contactInput.addEventListener('click', () => {
      for (const customSelectList of customSelectLists) {
        closeCustomSelect(customSelectList);
      }
    });
  }

  const addButton = document.getElementsByClassName('add-client__btn')[0];
  addButton.addEventListener('click', function addClient() {
    // Функция объявлена на строке
    const addModal = createModalForm('Новый клиент', saveToServer, closeModal, 'Отмена');
    BODY.append(addModal);
  });

  function getContactsData(formattedBlock) {
    const formattedContacts = formattedBlock.getElementsByClassName('form__contact');
    const contactsArr = [];
    for (const formattedContact of formattedContacts) {
      const select = formattedContact.getElementsByTagName('select')[0];
      const input = formattedContact.getElementsByClassName('form__contact-input')[0];
      const contactObj = {
        type: select.value,
        value: input.value
      };
      contactsArr.push(contactObj);
    }
    return contactsArr;
  }
})();
