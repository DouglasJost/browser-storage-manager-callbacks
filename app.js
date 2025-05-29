
$(document).ready(function () {
  function showMessage(message, isError = false) {
    const $msg = $('#statusMessage');
    $msg
      .text(message)
      .removeClass('success error')
      .addClass(isError ? 'error' : 'success')
      .fadeIn(200)
      .delay(4000)
      .fadeOut(400);
  }

  function refreshKeyList() {
    AppStorageManager.getAllKeys(function (error, keys) {
      if (error) {
        console.error('Error fetching keys:', error);
        showMessage('Error fetching keys.', true);
        return;
      }

      const $keyList = $('#keyList');
      $keyList.empty();

      keys.forEach(function (key) {
        const $li = $('<li>').text(key).on('click', function () {
          $('#keyList li').removeClass('selected');
          $(this).addClass('selected');

          $('#keyInput').val(key);

          AppStorageManager.getItem(key, function (err, value) {
            if (err) {
              console.error('Error retrieving value:', err);
              showMessage('Error retrieving value.', true);
              return;
            }

            $('#valueInput').val(value || '');
          });
        });

        $keyList.append($li);
      });
    });
  }

  function updateStorageType() {
    const selected = $('#storageType').val();
    AppStorageManager.setStorageType(selected);
    $('#storageName').text(AppStorageManager.currentStorageTypeName);

    refreshKeyList();
    $('#keyInput').val('');
    $('#valueInput').val('');
  }

  $('#storageType').on('change', function () {
    updateStorageType();
  });

  $('#getBtn').on('click', function () {
    const key = $('#keyInput').val();
    if (!key) {
      showMessage('Key is required.', true);
      return;
    }

    AppStorageManager.getItem(key, function (error, value) {
      if (error) {
        console.error(`Get failed: ${error}.`);
        showMessage(`Failed to retrieve value.  ${error}.`, true);
        return;
      }

      $('#valueInput').val(value || '');
      showMessage('Retrieved value.');
    });
  });

  $('#setBtn').on('click', function () {
    const key = $('#keyInput').val();
    const value = $('#valueInput').val();

    if (!key) {
      showMessage('Key is required.', true);
      return;
    }

    AppStorageManager.setItem(key, value, function (error) {
      if (error) {
        console.error(`Set failed: ${error}.`);
        showMessage(`Failed to save item.  ${error}.`, true);
        return;
      }

      refreshKeyList();
      showMessage('Saved successfully.');
    });
  });

  $('#removeBtn').on('click', function () {
    const key = $('#keyInput').val();
    if (!key) {
      showMessage('Key is required.', true);
      return;
    }

    AppStorageManager.removeItem(key, function (error) {
      if (error) {
        console.error(`Delete failed: ${error}.`);
        showMessage(`Failed to delete item.  ${error}.`, true);
        return;
      }

      $('#valueInput').val('');
      refreshKeyList();
      showMessage('Deleted successfully.');
    });
  });

  $('#clearBtn').on('click', function () {
    AppStorageManager.clear(function (error) {
      if (error) {
        console.error(`Clear failed: ${error}.`);
        showMessage(`Failed to clear storage.  ${error}.`, true);
        return;
      }

      $('#keyInput').val('');
      $('#valueInput').val('');
      refreshKeyList();
      showMessage('Storage cleared.');
    });
  });

  updateStorageType();
});
