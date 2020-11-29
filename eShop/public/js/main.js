function getDetail(productid) {
    console.log(productid);
    $.ajax({
        type: 'GET',
        url: '/product/getDetail',
        data: {
            productid
        },
        success: function(data) {
            // console.log(data);
            let productDetail =
                `<div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  ${data.product_name}
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="col-md-8">
                  <div class="card-body">
                    <h6 class="card-text">Price: <span style="color: green;"> ${data.price} <i class="fas fa-euro-sign"></i> </span></h6>
                    
                  </div>
                </div>
              </div>
              <div class="modal-footer d-flex justify-content-between">
                <p class="card-text"><small class="text-muted"><b >Last updated </b> ${data.created_at}</small></p>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            
              <div class="card mb-3 m-auto" style="max-width: 540px;">
                <div class="row no-gutters">
                </div>
              </div>
            </div>
          `;
            $('#resultId').html(productDetail);
        }
    })
}

// ajax function to update data
function getUpdate(productid) {
    // console.log(productid);
    $.ajax({
        type: 'GET',
        url: '/product/getDetail',
        data: {
            productid
        },
        success: function(data) {
            // console.log(data);
            let productDetail = `
            <div class="modal-content">
            <form action="/product/edit" method="POST">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                ${data.product_name}
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input type="hidden" name="productid" value="${data._id}">
              <label>Name: </label>
              <input class="form-control" type="text" name="product_name" value="${data.product_name}">
              <br>
              <label>Price: </label>
              <input class="form-control" type="text" name="price" value="${data.price}">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Update</button>
            </div>
            </form>
          </div>`;
            $('#updateFormId').html(productDetail);
        }
    })
}

// ajax function to check creat Options

function checkPassword() {
    $.ajax({
        type: 'Post',
        url: '/user/create',

        success: function(data) {
            console.log(data[0].msg)
            errorsList = `<div class="alert alert-danger">${data[0].msg} </div>`
            $('#passCheck').html(errorsList);
        }
    })
}

function getPicUpdate(pictid) {
    // console.log(productid);
    $.ajax({
        type: 'GET',
        url: '/user/getDetail',
        data: {
            pictid
        },
        success: function(data) {
            // console.log(data);
            let productDetail = `
          <div class="modal-content">
          <form action="/user/editPic" method="POST" enctype="multipart/form-data">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              ${data.filename}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img src="/image/${data.filename}"class="avatar">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Delete</button>
          </div>
          </div>
          </form>
        </div>`;
            $('#updateFormId').html(productDetail);
        }
    })
}


function getFild() {
    let searchBy = $('#searchBy').val();
    console.log(searchBy)
    switch (searchBy) {
        case 'email':
            html = '<input type="email" class="form-control" name="cSearch" placeholder="name@example.com">';
            break;
        case 'firstName':
            html = '<input type="text" class="form-control" name="cSearch" placeholder="Someone">';
            break;
        case 'age':
            html = '<input type="number" class="form-control" name="cSearch" placeholder="Age">';
            break;
        case 'ageGte':
            html = '<input type="number" class="form-control" name="cSearch" placeholder="Age">';
            break;
        case 'ageLt':
            html = '<input type="number" class="form-control" name="cSearch" placeholder="Age">';
            break;
        case 'country':
            html = '<input type="text" class="form-control" name="cSearch" placeholder="country">';
            break;
        case 'countryAGt':
            html = '<input type="text" class="form-control" name="cSearchC" placeholder="country"><input type="number" class="form-control" name="cSearchA" placeholder="Age">';
            break;
        case 'countryOGt':
            html = '<input type="text" class="form-control" name="cSearchC" placeholder="country"><input type="number" class="form-control" name="cSearchA" placeholder="Age">';
            break;

        default:
            html = ''
            break;
    }
    $('#searchId').html(html);
}