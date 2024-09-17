// Permission
const tablePermissions = document.querySelector('[table-permissions]');
if(tablePermissions) {
  const buttonSubmit = document.querySelector('[button-submit-permissions]');

  buttonSubmit.onclick = () => {
    let permissions = [];

    const rows = tablePermissions.querySelectorAll('tr[data-name]');
    rows.forEach((row) => {
      const name = row.getAttribute('data-name');
      const inputs = row.querySelectorAll('input');
      
      if(name === 'id') {
        inputs.forEach((input) => {
          const id = input.value;

          permissions.push({
            id: id,
            permissions: []
          })
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;

          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });

    if(permissions.length > 0) {
      const formChangePermissions = document.querySelector('[form-change-permissions]');
      const inputPermissions = formChangePermissions.querySelector('input');

      inputPermissions.value = JSON.stringify(permissions);

      formChangePermissions.submit();
    }
  };
}
// End Permissions

// Permissions data default 
const dataDocuments = document.querySelector('[data-documents]');
if(dataDocuments) {
  const documents = JSON.parse(dataDocuments.getAttribute('data-documents'));
  const tablePermissions = document.querySelector('[table-permissions]');
  
  documents.forEach((document, index) => {
    const permissions = document.permissions;

    permissions.forEach((permission) => {
      const row = tablePermissions.querySelector(`[data-name=${permission}]`);

      const input = row.querySelectorAll('input')[index];
      input.setAttribute('checked', true);
    });
  })
}
// End Permissions data default

// Delete item
const buttonsDelete = document.querySelectorAll('[button-delete]');
if (buttonsDelete.length > 0) {
  const formDeleteCategory = document.querySelector('#form-delete-item');
  const path = formDeleteCategory.getAttribute('data-path');

  buttonsDelete.forEach(button => {
    button.addEventListener('click', (e) => {
      const isConfirm = confirm('Bạn có chắc chắn muốn xoá nhóm quyền này?');

      if (isConfirm) {
        const id = button.getAttribute('data-id');

        const action = path + `/${id}?_method=DELETE`;

        formDeleteCategory.action = action;

        formDeleteCategory.submit();
      }
    });
  })
}
// End delete item action