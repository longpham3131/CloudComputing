
let getEle = (ele) => document.getElementById(ele);

//Những file chạy tự động
getImages()
getContainers()
getListUsers();
// loadingContainer()
//--end 


function runContainer() {
  loadingContainer();
  const imageName = document.getElementById('selImageName').value;
  const volCPU = document.getElementById('selCpu').value;
  const volMemory = document.getElementById('selMem').value;

  fetch("http://localhost:3000/run", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({imageName,volCPU,volMemory}),

  })
    .then(response => response.json())
    .then(data => {
      $(".rowLoad").fadeOut("slow");
      getContainers()
    })

}
function stopContainer(containerName) {
  loadingContainer()
  fetch("http://localhost:3000/stop", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ containerName }),

  })
    .then(response => response.json())
    .then(data => {
      $(".rowLoad").fadeOut("slow");
      getContainers()
    })


}
function loadingContainer() {
  $(".rowLoad").fadeIn("slow");
  let content = `                        
            <tr class="rowLoad">
              <td colspan="3" style="text-align: center; font-size:20px"><i class="fa fa-redo loader"></i></td>
            </tr>
          `;
  getEle("tbodyContainer").innerHTML = content;
}
function loadingUserList() {
  $(".rowLoad").fadeIn("slow");
  let content = `                        
            <tr class="rowLoad">
              <td colspan="3" style="text-align: center; font-size:20px"><i class="fa fa-redo loader"></i></td>
            </tr>
          `;
  getEle("tbodyUsers").innerHTML = content;
}
function getContainers() {

  fetch("http://localhost:3000/containers")
    .then((res) => res.json())
    .then((data) => {
      let newData = data.split("\n");
      newData.pop();
      let content = "";
      let number = 0;
     
      newData.slice(1).map((item) => {
        let infoContainer = item.split(" ").filter((infoContainer) => infoContainer);
        console.log(infoContainer);
        content += `
            <tr>
              <th scope="col" >${++number}</th>
              <td>${infoContainer[0]}</td>
              <td>${infoContainer[infoContainer.length - 1]}</td>
              <td>${infoContainer[infoContainer.length - 2]}</td>
              <td>
              <button  class="btn btn-danger"  onclick="stopContainer('${infoContainer[infoContainer.length - 1]}')"><i class="fa fa-times"></i></button>
              </td>
            </tr>
          `
        
        
      })
      getEle("tbodyContainer").innerHTML = content;
    });
}
function getListUsers() {

  fetch("http://localhost:3000/users")
    .then((res) => res.json())
    .then((data) => {
      
      let listUser = data.split("\n");
      listUser.pop();

      let content = "";
      let number = 0;
      listUser.slice(1).map((item,index) => {
        let nameUser = item.split(" ").slice(-1);
        
        if(index > 38){
          content += `
          <tr>
            <th scope="col" >${++number}</th>
            <td>${nameUser}</td>
            <td>
            <button  class="btn btn-danger" onclick="deleteUser('${nameUser}')"><i class="fa fa-times"></i></button>
            </td>
          </tr>
        `;
        }
      
      })
      getEle("tbodyUsers").innerHTML = content;
    });
}
function getImages() {

  fetch("http://localhost:3000/images")
    .then((res) => res.json())
    .then((data) => {

      let newData = data.split("\n");
      // Xóa thằng undefied cuối cùng 
      newData.pop();

      let content = "";
      let number = 0;
      newData.slice(1).map((item) => {
        let oneRow = item.split(" ").filter((oneRow) => oneRow);

        content += `
            <tr>
              <th scope="col" >${++number}</th>
              <td>${oneRow[0]}</td>
              <td>${oneRow[1]}</td>
              <td>${oneRow[2]}</td>
              <td>${oneRow[3]} ${oneRow[4]} ${oneRow[5]}</td>
              <td>${oneRow[6]}</td>
            </tr>
          `

      })
      getEle("tbodyImages").innerHTML = content;

    });
}
function deleteUser(username) {
  loadingUserList();
  console.log("USer se xoa: ", username);
  fetch("http://localhost:3000/deleteuser", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username }),
		})
  .then(response => response.json())
    .then(data => {
      $(".rowLoad").fadeOut("slow");
      getListUsers()
    })

}
function createUser() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  // document.getElementById("test").innerHTML = "VUI LONG CHO TAO USER";

  fetch("http://localhost:3000/createuser", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("User da duoc tao");
      document.getElementById("closeModal").click();
      getListUsers()
    });
}