// Change status
const btnsChangeStatus = document.querySelectorAll('[button-change-status');
if (btnsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector('#form-change-status');
  const path = formChangeStatus.getAttribute('data-path');
  
  btnsChangeStatus.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStatus = btn.getAttribute('data-status');
      const id = btn.getAttribute('data-id');
      let changedStatus = currentStatus == 'active' ? 'inactive' : 'active';

      const action = path.concat(`/${changedStatus}/${id}?_method=PATCH`);
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}

// Delete item
const buttonsDelete = document.querySelectorAll('[button-delete]');
if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector('#form-delete-item');
  const path = formDeleteItem.getAttribute('data-path');

  buttonsDelete.forEach(button => {
    button.addEventListener('click', (e) => {
      const isConfirm = confirm('Bạn có chắc chắn muốn xoá sản phẩm này?');
      
      if (isConfirm) {
        const id = button.getAttribute('data-id');

        const action = path + `/${id}?_method=DELETE`;
        
        formDeleteItem.action = action;
        
        formDeleteItem.submit();
      }
    });
  })
}
// End delete item action
