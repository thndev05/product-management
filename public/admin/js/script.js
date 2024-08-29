// Button status
const buttonsStatus = document.querySelectorAll('[btn-status]');
if(buttonsStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonsStatus.forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('btn-status');
        
      if(status) {
        url.searchParams.set('status', status);
      } else {
        url.searchParams.delete('status');
      }

      window.location.href = url.href;
    });

  });
}
// End button status

// Form search
const formSearch = document.querySelector('#form-search');
if(formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener('submit', (e) => {
    e.preventDefault();

    const keyword = e.target.elements.keyword.value;
    if(keyword) {
      url.searchParams.set('keyword', keyword);
    } else {
      url.searchParams.delete('keyword');
    }

    window.location.href = url.href;
    
  });
}

// Pagination
const buttonsPagination = document.querySelectorAll('[button-pagination]');
if(buttonsPagination) {
  let url = new URL(window.location.href);

  buttonsPagination.forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('button-pagination');

      url.searchParams.set('page', page);
      
      window.location.href = url.href;
    });
  });
}
// End pagination

// Checkbox multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if(checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector('input[name="checkall"]');
  const inputsId = checkboxMulti.querySelectorAll('input[name="id"]');

  inputCheckAll.addEventListener('click', () => {
    const check = inputCheckAll.checked;

    if(check) {
      inputsId.forEach(item => {
        item.checked = true;
      });
    } else {
        inputsId.forEach(item => {
        item.checked = false;
      });
    }
  });

  inputsId.forEach(input => {
    input.addEventListener('click', () => {
      const countChecked = checkboxMulti.querySelectorAll(
        'input[name="id"]:checked'
      ).length;

      if(countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// End checkbox multi

// Form change multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if(formChangeMulti) {
  formChangeMulti.addEventListener('submit', (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector('[checkbox-multi]');
    const inputsChecked = checkboxMulti.querySelectorAll('input[name="id"]:checked');
    
    const typeChecked = e.target.type.value;
    if(typeChecked == 'delete-all') {
      const isConfirm = confirm('Bạn có chắc chắn muốn xoá?');

      if(!isConfirm) {
        return;
      }
    }

    if(inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector('input[name="ids"]');

      inputsChecked.forEach(input => {
        const id = input.value;

        if(typeChecked == 'change-position') {
          const position = input.closest('tr')
            .querySelector('input[name="position"]')
            .value;

          ids.push(`${id}-${position}`);

        } else {
          ids.push(id);
        }

      });

      inputIds.value = ids.join(', ');
      formChangeMulti.submit();
    } else {
      alert('Vui lòng chọn ít nhất một mặt hàng để thực hiện thao tác này.');
    }
  });
}
// End change multi

// Show alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
  const time = parseInt(showAlert.getAttribute('data-time'));
  const closeAlert = showAlert.querySelector('[close-alert]');

  setTimeout(() => {
    showAlert.classList.add('alert-hidden');
  }, time);

  closeAlert.addEventListener('click', () => {
    showAlert.classList.add('alert-hidden');
  });
}
// End show alert

// Image preview
const uploadImage = document.querySelector('[upload-image]');
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector('[upload-image-input]');
  const uploadImagePreview = uploadImage.querySelector('[upload-image-preview]');

  uploadImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End image preview

// Sort
const sort = document.querySelector('[sort]');
if(sort) {
  let url = new URL(window.location.href);

  const sortSelect = sort.querySelector('[sort-select]');
  const sortClear = sort.querySelector('[sort-clear]');

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

  if(sortKey && sortValue) {
    const stringSort = sortKey + '-' + sortValue;
    
    const optionSelected = sort.querySelector(`option[value = '${stringSort}'`);
    optionSelected.selected = true;
  }
}
// End sort