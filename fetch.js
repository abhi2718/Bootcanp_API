const requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
    }),
  };
 const url=`http://localhost:5000/api/v1/bootcamps`;

  fetch(url,requestOptions)
  .then(res=>{
      let promise=res.json();
      if(res.status===200){
        console.log(`status code is ${res.status}`);
        promise.then(data=>console.log(data));
      }if(res.status === 434){
        console.log(`status code is ${res.status}`);
        promise.then(data=>console.log(data));
      }
      if(res.status === 436){
        console.log(`status code is ${res.status}`);
        promise.then(data=>console.log(data));
      }
      if(res.status === 438){
        console.log(`status code is ${res.status}`);
        promise.then(data=>console.log(data));
      }
  })
  .catch(err=>{
      console.log('error from catch block',err)
  })