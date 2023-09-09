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
