// Button status
if (!window.buttonsStatus) {
  window.buttonsStatus = document.querySelectorAll('[btn-status]');
  if (window.buttonsStatus.length > 0) {
    let url = new URL(window.location.href);

    window.buttonsStatus.forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.getAttribute('btn-status');
        
        if (status) {
          url.searchParams.set('status', status);
        } else {
          url.searchParams.delete('status');
        }

        window.location.href = url.href;
      });
    });
  }
}
// End button status

// Form search
if (!window.formSearch) {
  window.formSearch = document.querySelector('#form-search');
  if (window.formSearch) {
    let url = new URL(window.location.href);

    window.formSearch.addEventListener('submit', (e) => {
      e.preventDefault();

      const keyword = e.target.elements.keyword.value;
      if (keyword) {
        url.searchParams.set('keyword', keyword);
      } else {
        url.searchParams.delete('keyword');
      }

      window.location.href = url.href;
    });
  }
}

// Pagination
if (!window.buttonsPagination) {
  window.buttonsPagination = document.querySelectorAll('[button-pagination]');
  if (window.buttonsPagination.length > 0) {
    let url = new URL(window.location.href);

    window.buttonsPagination.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.getAttribute('button-pagination');

        url.searchParams.set('page', page);
        
        window.location.href = url.href;
      });
    });
  }
}
// End pagination

// Checkbox multi
if (!window.checkboxMulti) {
  window.checkboxMulti = document.querySelector('[checkbox-multi]');
  if (window.checkboxMulti) {
    const inputCheckAll = window.checkboxMulti.querySelector('input[name="checkall"]');
    const inputsId = window.checkboxMulti.querySelectorAll('input[name="id"]');

    inputCheckAll.addEventListener('click', () => {
      const check = inputCheckAll.checked;

      inputsId.forEach(item => {
        item.checked = check;
      });
    });

    inputsId.forEach(input => {
      input.addEventListener('click', () => {
        const countChecked = window.checkboxMulti.querySelectorAll(
          'input[name="id"]:checked'
        ).length;

        inputCheckAll.checked = countChecked === inputsId.length;
      });
    });
  }
}
// End checkbox multi

// Form change multi
if (!window.formChangeMulti) {
  window.formChangeMulti = document.querySelector('[form-change-multi]');
  if (window.formChangeMulti) {
    window.formChangeMulti.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkboxMulti = document.querySelector('[checkbox-multi]');
      const inputsChecked = checkboxMulti.querySelectorAll('input[name="id"]:checked');
      
      const typeChecked = e.target.type.value;
      if (typeChecked === 'delete-all') {
        const isConfirm = confirm('Bạn có chắc chắn muốn xoá?');
        if (!isConfirm) return;
      }

      if (inputsChecked.length > 0) {
        let ids = [];
        const inputIds = window.formChangeMulti.querySelector('input[name="ids"]');

        inputsChecked.forEach(input => {
          const id = input.value;

          if (typeChecked === 'change-position') {
            const position = input.closest('tr')
              .querySelector('input[name="position"]')
              .value;

            ids.push(`${id}-${position}`);
          } else {
            ids.push(id);
          }
        });

        inputIds.value = ids.join(', ');
        window.formChangeMulti.submit();
      } else {
        alert('Vui lòng chọn ít nhất một mặt hàng để thực hiện thao tác này.');
      }
    });
  }
}
// End form change multi

// Show alert
if (!window.showAlert) {
  window.showAlert = document.querySelector('[show-alert]');
  if (window.showAlert) {
    const time = parseInt(window.showAlert.getAttribute('data-time'));
    const closeAlert = window.showAlert.querySelector('[close-alert]');

    setTimeout(() => {
      window.showAlert.classList.add('alert-hidden');
    }, time);

    closeAlert.addEventListener('click', () => {
      window.showAlert.classList.add('alert-hidden');
    });
  }
}
// End show alert

// Image preview
if (!window.uploadImage) {
  window.uploadImage = document.querySelector('[upload-image]');
  if (window.uploadImage) {
    const uploadImageInput = window.uploadImage.querySelector('[upload-image-input]');
    const uploadImagePreview = window.uploadImage.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadImagePreview.src = URL.createObjectURL(file);
      }
    });
  }
}
// End image preview

// Sort
if (!window.sort) {
  window.sort = document.querySelector('[sort]');
  if (window.sort) {
    let url = new URL(window.location.href);

    const sortSelect = window.sort.querySelector('[sort-select]');
    const sortClear = window.sort.querySelector('[sort-clear]');

    sortSelect.onchange = (e) => {
      const [sortKey, sortValue] = e.target.value.split('-');
      
      url.searchParams.set('sortKey', sortKey);
      url.searchParams.set('sortValue', sortValue);

      window.location.href = url.href;
    };

    sortClear.onclick = (e) => {
      url.searchParams.delete('sortKey');
      url.searchParams.delete('sortValue');

      window.location.href = url.href;
    };

    const sortKey = url.searchParams.get('sortKey');
    const sortValue = url.searchParams.get('sortValue');

    if (sortKey && sortValue) {
      const stringSort = sortKey + '-' + sortValue;
      
      const optionSelected = window.sort.querySelector(`option[value='${stringSort}']`);
      optionSelected.selected = true;
    }
  }
}
// End sort
