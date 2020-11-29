//alert(1)
function getProduct(productid) {

    $.ajax({
        type: 'GET',
        url: '/product/detail',
        data: {
            productid
        },
        success: function(data) {

            console.log(data);
            if (data) {
                // $('#resultid').removeClass('alert alert-danger')
                let productDetail = `
                {{#with data}}
<div class="card mb-3 m-auto" style="max-width: 540px;">
  <div class="row no-gutters">
    
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">{{ product_name }}</h5>
        <h6 class="card-text">ID: <b>{{ _id }}</b> </h6>
        <h6 class="card-text">Price: <span style="color: green;"> {{ price }} <i class="fas fa-euro-sign"></i> </span></h6>
        <p class="card-text"><small class="text-muted"><b >Last updated </b>  {{ created_at }}</small></p>
      </div>
    </div>
  </div>
</div>
{{/with}}
            `;
                // <h1>Id: ${info.id}</h1>
                // <h2>Name: ${info.name} </h2>
                // <h2>Email : ${info.email} </h2>
                $('#resultid').html(productDetail);

            } else {
                $('#resultid').addClass('alert alert-danger')
                $('#resultid').html(info);
            }

        }
    });
}