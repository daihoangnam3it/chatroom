
var socket=io();

var btnAddUser=document.getElementById('addUserBtn');
var inputAddUser=document.getElementById('addUserInput')
var idGroup=document.getElementById('idGroup')

var inputMessUser=document.getElementById('messUser');

var btnSendMess=document.getElementById('sendMess');
var boxChat=document.querySelector('.box--chat');

const infoClick=document.querySelectorAll('.info');
var inputSendImg=document.getElementById('inputSendImg');
var imgDemo=document.getElementById('imgSend')

// Xem info nè
    infoClick.forEach(el=>{
        el.addEventListener('click',()=>{
            var idInfo=el.getAttribute('id');
            alert(idInfo);
        })
    })
socket.emit('signin',{
    id:idPublic.value,
    username:namePublic.innerHTML,
})



// Input Img and show
inputSendImg.addEventListener('change',()=>{
    const file =document.getElementById('inputSendImg').files;
    if(file.length>0){
        var reader=new FileReader(this);
        reader.onload=el=>{
            imgDemo.setAttribute('src',el.target.result);
        }
        reader.readAsDataURL(file[0]);
    }
})


// Base 64 

var b64;
imgDemo.onload=function(){
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    canvas.height=this.naturalHeight;
    canvas.width=this.naturalWidth;
    ctx.drawImage(this,0,0);
    b64=canvas.toDataURL('image/jpeg');
    // console.log(data);
    
}


// Thêm thành viên nè
btnAddUser.addEventListener('click',()=>{
    var newUser={
        name:inputAddUser.value
    }
console.log(inputAddUser.value)
console.log(newUser);

    fetch('/users/room/group/'+idGroup.innerHTML,{
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body:JSON.stringify(newUser)
    }).then(res=>res.json()).then(data=>{
        fetch('/users/room/group-user/'+idGroup.innerHTML).then(res=>res.json()).then(data=>console.log(data));
    });
})
fetch('/users/room/group-user/'+idGroup.innerHTML).then(res=>res.json()).then(data=>console.log(data));


// Chat nè
// Gửi tin nhắn lên nè

btnSendMess.addEventListener('click',()=>{
    if(inputMessUser.value=='' && inputSendImg.value==null){
        alert('Nhajap noi dung tin nhan');
    }else{
    var newMess={
        idGroup:idGroup.innerHTML,
        idUser:idPublic.value,
        name:namePublic.innerHTML,
        mess:inputMessUser.value,
        img:b64,
        createAt:Date.now()
    }
    socket.emit('user--send--mess-in--group',newMess)
    const s=document.createElement('div');
    s.classList.add('new--Mess');
    let inner=`${namePublic.innerHTML} : <span class="info me" id="${idPublic.value}">${inputMessUser.value}</span>
    ${b64!=null?`<img src="${b64}" id="me" alt="" style="max-width: 50px;height: 50px;" > <br>`:''}
    `
    s.innerHTML=inner;
    boxChat.appendChild(s);
    const infoClick=document.querySelectorAll('.info');
    inputMessUser.value=null;
    imgDemo.setAttribute('src','');
    inputSendImg.value=null;
    infoClick.forEach(el=>{
        el.addEventListener('click',()=>{
            var idInfo=el.getAttribute('id');
            alert(idInfo);
        })
    })
}
})
// Nhận tin nhắn nè
socket.on('sever--send--mess-to-group',data=>{
    console.log('da nhan duoc tin nhan tu sever')
    const s=document.createElement('div');
    s.classList.add('new--Mess');
    let inner=`${data.name} : <span class="info you" id="${data.idUser}">${data.mess}</span>
    ${data.img != null ? `<img src="${data.img}" id="you" alt="" style="max-width: 50px;height: 50px;"> <br>`:''}
    `
    s.innerHTML=inner;
    boxChat.appendChild(s);
    const infoClick=document.querySelectorAll('.info');

    infoClick.forEach(el=>{
        el.addEventListener('click',()=>{
            var idInfo=el.getAttribute('id');
            alert(idInfo);
        })
    })
})


socket.on('have--send--group',data=>{
    alert(data);
})