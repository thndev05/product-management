// Delete item
const buttonsDelete = document.querySelectorAll('[button-delete-category]');
if (buttonsDelete.length > 0) {
  const formDeleteCategory = document.querySelector('#form-delete-category');
  const path = formDeleteCategory.getAttribute('data-path');

  buttonsDelete.forEach(button => {
    button.addEventListener('click', (e) => {
      const isConfirm = confirm('Bạn có chắc chắn muốn xoá danh mục này?');

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